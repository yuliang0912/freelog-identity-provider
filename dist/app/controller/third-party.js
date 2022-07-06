"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyController = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const third_party_identity_service_1 = require("../service/third-party-identity-service");
const passport_service_1 = require("../service/passport-service");
const egg_freelog_base_2 = require("egg-freelog-base");
const common_helper_1 = require("../../extend/common-helper");
let ThirdPartyController = class ThirdPartyController {
    ctx;
    thirdPartyIdentityService;
    userService;
    passportService;
    // 测试扫码地址:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2Ftest%2Fv2%2FthirdParty%2FweChat%2FcodeHandle%3FreturnUrl%3Dhttp%3A%2F%2Fconsole.testfreelog.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/codeHandle?returnUrl=http://console.testfreelog.com');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    async getWeChatToken() {
        const { ctx } = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        let returnUrl = ctx.checkQuery('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            this.ctx.body = `<script>location.href="http://api.testfreelog.com${this.ctx.url}"</script>`;
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转到指定URL
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({ userId: thirdPartyIdentityInfo.userId });
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = this.generateFreelogUrl('user');
            }
            this.ctx.body = '<script>location.href="' + returnUrl + '"</script>';
            return;
        }
        // 如果没绑定,则走绑定流程
        const query = `/bind?identityId=${thirdPartyIdentityInfo.id}&returnUrl=${encodeURIComponent(returnUrl)}`;
        this.ctx.body = `<script>location.href="${this.generateFreelogUrl('user', query)}"</script>`;
    }
    // 微信注册或绑定账号(非登录)
    async registerOrBindUser() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value;
        const identityId = ctx.checkBody('identityId').exist().isMongoObjectId().value;
        ctx.validateParams();
        const identityInfo = await this.thirdPartyIdentityService.getThirdPartyIdentityInfo(identityId);
        if (!identityInfo) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-validate-failed', 'identityId'));
        }
        if (identityInfo.userId) {
            throw new egg_freelog_base_1.LogicError('账号已被绑定');
        }
        let userInfo = await this.userService.findUserByLoginName(loginName);
        if (userInfo && !this.passportService.verifyUserPassword(userInfo, password)) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        if (!userInfo && !egg_freelog_base_2.CommonRegex.username.test(loginName)) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-validate-failed', 'loginName'));
        }
        if (!userInfo) {
            userInfo = await this.userService.create({ username: loginName, password });
        }
        await this.thirdPartyIdentityService.bindUserId(identityInfo, userInfo.userId);
        await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
        ctx.success(true);
    }
    // 测试扫码地址:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2Ftest%2Fv2%2FthirdParty%2FweChat%2FcodeHandle%3FreturnUrl%3Dhttp%3A%2F%2Fconsole.testfreelog.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/bindHandle?returnUrl=http://user.testfreelog.com/logged/setting');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${verifyLoginPassword_state}#wechat_redirect`;
    // 已登录用户绑定微信
    async bindWeChat() {
        const { ctx } = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        const state = ctx.checkQuery('state').exist().notBlank().value; // 此处是校验密码接口返回的
        const returnUrl = ctx.checkQuery('returnUrl').exist().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            this.ctx.body = `<script>location.href="http://api.testfreelog.com${this.ctx.url}"</script>`;
            return;
        }
        if (!ctx.isLoginUser()) {
            const html = `<h1>未检测到登录用户,无法执行此操作,页面即将跳转</h1>
                          <script>setTimeout(function (){ location.href = "${this.generateFreelogUrl('user')}" },2000)</script>`;
            this.ctx.body = html;
            return;
        }
        if ((0, common_helper_1.generateTempUserState)(ctx.userId) !== state) {
            this.ctx.body = `<script>location.href="${returnUrl}?type=wechat&status=2&msg=参数state校验失败"</script>`;
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        // 回调的状态值 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
        if (thirdPartyIdentityInfo.userId) {
            this.ctx.body = `<script>location.href="${returnUrl}?type=wechat&status=3"</script>`;
            return;
        }
        await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
        this.ctx.body = `<script>location.href="${returnUrl}?type=wechat&status=1"</script>`;
        return;
    }
    /**
     * 根据环境生成不同域名url
     * @param domain
     * @param queryAndPath
     * @private
     */
    generateFreelogUrl(domain, queryAndPath) {
        const isProd = this.ctx.app.config.env === 'prod';
        return `http${isProd ? 's' : ''}://${domain}.${isProd ? 'freelog.com' : 'testfreelog.com'}${queryAndPath}`;
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ThirdPartyController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", third_party_identity_service_1.ThirdPartyIdentityService)
], ThirdPartyController.prototype, "thirdPartyIdentityService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ThirdPartyController.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", passport_service_1.PassportService)
], ThirdPartyController.prototype, "passportService", void 0);
__decorate([
    (0, midway_1.get)('/weChat/codeHandle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getWeChatToken", null);
__decorate([
    (0, midway_1.post)('/registerOrBind'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "registerOrBindUser", null);
__decorate([
    (0, midway_1.get)('/weChat/bindHandle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "bindWeChat", null);
ThirdPartyController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/thirdParty')
], ThirdPartyController);
exports.ThirdPartyController = ThirdPartyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThEO0FBQzlELHVEQUswQjtBQUMxQiwwRkFBa0Y7QUFFbEYsa0VBQTREO0FBQzVELHVEQUE2QztBQUM3Qyw4REFBaUU7QUFJakUsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFHN0IsR0FBRyxDQUFpQjtJQUVwQix5QkFBeUIsQ0FBNEI7SUFFckQsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsOFJBQThSO0lBQzlSLG1KQUFtSjtJQUNuSiwwTEFBMEw7SUFFMUwsS0FBSyxDQUFDLGNBQWM7UUFDaEIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM3RCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsaURBQWlEO1FBQ2pELDZDQUE2QztRQUM3QyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtZQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxvREFBb0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQztZQUM3RixPQUFPO1NBQ1Y7UUFDRCxNQUFNLHNCQUFzQixHQUFHLE1B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