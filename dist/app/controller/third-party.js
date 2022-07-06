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
        if (ctx.app.config.env !== 'prod') {
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
        if (ctx.app.config.env !== 'prod') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
            this.ctx.body = `<script>location.href="http://api.testfreelog.com${this.ctx.url}"</script>`;
            return;
        }
        if ((0, common_helper_1.generateTempUserState)(this.ctx.userId) !== state) {
            return ctx.redirect(`${returnUrl}?type=wechat&status=2&msg=参数state校验失败`);
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        // 回调的状态值 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
        if (thirdPartyIdentityInfo.userId) {
            return ctx.redirect(`${returnUrl}?type=wechat&status=3`);
        }
        await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
        return ctx.redirect(`${returnUrl}?type=wechat&status=1`);
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
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "bindWeChat", null);
ThirdPartyController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/thirdParty')
], ThirdPartyController);
exports.ThirdPartyController = ThirdPartyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThEO0FBQzlELHVEQU0wQjtBQUMxQiwwRkFBa0Y7QUFFbEYsa0VBQTREO0FBQzVELHVEQUE2QztBQUM3Qyw4REFBaUU7QUFJakUsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFHN0IsR0FBRyxDQUFpQjtJQUVwQix5QkFBeUIsQ0FBNEI7SUFFckQsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsOFJBQThSO0lBQzlSLG1KQUFtSjtJQUNuSiwwTEFBMEw7SUFFMUwsS0FBSyxDQUFDLGNBQWM7UUFDaEIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM3RCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsaURBQWlEO1FBQ2pELDZDQUE2QztRQUM3QyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLEVBQUU7WUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsb0RBQW9ELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUM7WUFDN0YsT0FBTztTQUNWO1FBQ0QsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxjQUFjLENB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