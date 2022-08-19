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
const head_image_generator_1 = require("../../extend/head-image-generator");
const url_1 = require("url");
let ThirdPartyController = class ThirdPartyController {
    ctx;
    thirdPartyIdentityService;
    headImageGenerator;
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
            userInfo = await this.userService.create({
                username: loginName,
                password,
                headImage: identityInfo.headImage
            });
            // const headImageUrl = await this.headImageGenerator.generateAndUploadHeadImage(userInfo.userId.toString());
            // await this.userService.updateOne({userId: userInfo.userId}, {headImage: headImageUrl});
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
        const returnUrlHasQueryParams = new url_1.URL(returnUrl).search;
        if ((0, common_helper_1.generateTempUserState)(ctx.userId) !== state) {
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + returnUrlHasQueryParams ? '&' : '?' + 'type=wechat&status=2&msg=参数state校验失败');
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        // 回调的状态值 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
        if (thirdPartyIdentityInfo.userId) {
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + returnUrlHasQueryParams ? '&' : '?' + 'type=wechat&status=3');
            return;
        }
        await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
        this.ctx.body = this.generateClientLocationRedirectScript(returnUrl + returnUrlHasQueryParams ? '&' : '?' + 'type=wechat&status=1');
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
        let userId = this.ctx.checkQuery('userId').exist().value;
        this.ctx.success(await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            userId: userId,
            thirdPartyType: 'weChat'
        }));
    }
    async getWechatInfoByUnionId() {
        let unionId = this.ctx.checkQuery('unionId').exist().value;
        this.ctx.success(await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            unionId: unionId,
            thirdPartyType: 'weChat'
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
    __metadata("design:type", head_image_generator_1.default)
], ThirdPartyController.prototype, "headImageGenerator", void 0);
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
    (0, midway_1.get)('/getWechatInfo'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getWechatInfo", null);
__decorate([
    (0, midway_1.get)('/getWechatInfoByUnionId'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThirdPartyController.prototype, "getWechatInfoByUnionId", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW1FO0FBQ25FLHVEQVEwQjtBQUMxQiwwRkFBa0Y7QUFFbEYsa0VBQTREO0FBQzVELDhEQUFtRjtBQUNuRixtQ0FBNEI7QUFDNUIsNEVBQW1FO0FBQ25FLDZCQUF3QjtBQUl4QixJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQUc3QixHQUFHLENBQWlCO0lBRXBCLHlCQUF5QixDQUE0QjtJQUVyRCxrQkFBa0IsQ0FBcUI7SUFFdkMsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsOFJBQThSO0lBQzlSLG1KQUFtSjtJQUNuSiwwTEFBMEw7SUFFMUwsS0FBSyxDQUFDLGNBQWM7UUFDaEIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM3RCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsaURBQWlEO1FBQ2pELDZDQUE2QztRQUM3QyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtZQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsb0NBQW9DLENBQUMsNkJBQTZCLElBQUksQ0FB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