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
const common_helper_1 = require("../../extend/common-helper");
const lodash_1 = require("lodash");
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
        const returnUrl = ctx.checkQuery('returnUrl').exist().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            this.ctx.body = this.generateClientLocationRedirectScript(`http://api.testfreelog.com${this.ctx.url}`);
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转到指定URL
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({ userId: thirdPartyIdentityInfo.userId });
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl);
            return;
        }
        // 如果没绑定,则走绑定流程
        const query = `/bind?identityId=${thirdPartyIdentityInfo.id}&returnUrl=${encodeURIComponent(returnUrl)}`;
        this.ctx.body = this.generateClientLocationRedirectScript(this.generateFreelogUrl('user', query));
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
        if (!userInfo && !egg_freelog_base_1.CommonRegex.username.test(loginName)) {
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
            this.ctx.body = this.generateClientLocationRedirectScript(`http://api.testfreelog.com${this.ctx.url}`);
            return;
        }
        if (!ctx.isLoginUser()) {
            this.ctx.body = `<h1>未检测到登录用户,无法执行此操作,页面即将跳转</h1>
                          <script>setTimeout(function (){ location.href = "${this.generateFreelogUrl('user')}" },2000)</script>`;
            return;
        }
        if ((0, common_helper_1.generateTempUserState)(ctx.userId) !== state) {
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + '?type=wechat&status=2&msg=参数state校验失败');
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        // 回调的状态值 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
        if (thirdPartyIdentityInfo.userId) {
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + '?type=wechat&status=3');
            return;
        }
        await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
        this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + '?type=wechat&status=1');
    }
    /**
     * 解绑第三方登录
     */
    async unBind() {
        const { ctx } = this;
        const thirdPartyType = ctx.checkBody('thirdPartyType').exist().in(['weChat', 'weibo']).value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        if (!userInfo || (0, common_helper_1.generatePassword)(userInfo.salt, password) !== userInfo.password) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            thirdPartyType, userId: ctx.userId
        });
        if (!thirdPartyIdentityInfo) {
            return ctx.success(false);
        }
        await this.thirdPartyIdentityService.thirdPartyIdentityProvider.deleteOne({ _id: thirdPartyIdentityInfo.id }).then(x => ctx.success(true));
    }
    /**
     * 查询第三方绑定信息列表
     */
    async list() {
        const thirdPartyIdentityList = await this.thirdPartyIdentityService.thirdPartyIdentityProvider.find({
            userId: this.ctx.userId
        });
        this.ctx.success(thirdPartyIdentityList.map(x => {
            return (0, lodash_1.pick)(x, ['userId', 'name', 'thirdPartyType']);
        }));
    }
    async getWechatInfo() {
        let userId = this.ctx.checkQuery("userId").exist().value;
        this.ctx.success(await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            userId: userId,
            thirdPartyType: "weChat"
        }));
    }
    /**
     * 查询用户是否绑定第三方登录
     */
    async isBind() {
        const { ctx } = this;
        const username = ctx.checkQuery('username').exist().isUsername().value;
        const thirdPartyType = ctx.checkQuery('thirdPartyType').exist().in(['weChat', 'weibo']).value;
        ctx.validateParams();
        const userInfo = await this.userService.findUserByLoginName(username);
        if (!userInfo) {
            return ctx.success(false);
        }
        await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            userId: userInfo.userId, thirdPartyType, status: 1
        }, '_id').then(x => ctx.success(Boolean(x)));
    }
    /**
     * 根据环境生成不同域名url
     * @param domain
     * @param queryAndPath
     * @private
     */
    generateFreelogUrl(domain, queryAndPath) {
        const isProd = this.ctx.app.config.env === 'prod';
        return `http${isProd ? 's' : ''}://${domain}.${isProd ? 'freelog.com' : 'testfreelog.com'}${queryAndPath?.length ? queryAndPath : ''}`;
    }
    /**
     * 生成客户端浏览器跳转脚本
     * @param url
     * @private
     */
    generateClientLocationRedirectScript(url) {
        return `<script>location.href="${url}"</script>`;
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
__decorate([
    (0, midway_1.put)('/unbind'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "unBind", null);
__decorate([
    (0, midway_1.get)('/list'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "list", null);
__decorate([
    (0, midway_1.get)("/getWechatInfo"),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getWechatInfo", null);
__decorate([
    (0, midway_1.get)('/isBind'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "isBind", null);
ThirdPartyController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/thirdParty')
], ThirdPartyController);
exports.ThirdPartyController = ThirdPartyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW1FO0FBQ25FLHVEQVEwQjtBQUMxQiwwRkFBa0Y7QUFFbEYsa0VBQTREO0FBQzVELDhEQUFtRjtBQUNuRixtQ0FBNEI7QUFJNUIsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFHN0IsR0FBRyxDQUFpQjtJQUVwQix5QkFBeUIsQ0FBNEI7SUFFckQsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsOFJBQThSO0lBQzlSLG1KQUFtSjtJQUNuSiwwTEFBMEw7SUFFMUwsS0FBSyxDQUFDLGNBQWM7UUFDaEIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM3RCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsaURBQWlEO1FBQ2pELDZDQUE2QztRQUM3QyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtZQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsb0NBQW9DLENBQUMsNkJBQTZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2RyxPQUFPO1NB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