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
    // console.log(loginUri);
    async getWeChatToken() {
        const { ctx } = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        // const state = ctx.checkQuery('state').exist().notBlank().value;
        let returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        if (ctx.app.env !== 'prod' && ctx.host === 'api.freelog.com') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
            const secondJumpUrl = `http://api.testfreelog.com${this.ctx.url}`;
            this.ctx.body = '<script>location.href="' + secondJumpUrl + '"</script>';
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({ userId: thirdPartyIdentityInfo.userId });
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = ctx.app.env === 'prod' ? 'https://user.freelog.com' : 'http://user.testfreelog.com';
            }
            this.ctx.body = '<script>location.href="' + returnUrl + '"</script>';
            return;
        }
        // 如果没绑定,则走绑定流程
        let url = ctx.app.env === 'prod' ? 'https://user.freelog.com/bind' : 'http://user.testfreelog.com/bind';
        url += `?identityId=${thirdPartyIdentityInfo.id}&returnUrl=${encodeURIComponent(returnUrl)}`;
        this.ctx.body = '<script>location.href="' + url + '?"</script>';
    }
    // 注册或绑定账号
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
        await this.thirdPartyIdentityService.bindUserId(identityInfo, userInfo);
        await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
        ctx.success(true);
    }
    // 登录用户绑定微信
    async bindWeChat() {
        const { ctx } = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        const state = ctx.checkQuery('state').exist().notBlank().value;
        let returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        if (ctx.app.env !== 'prod' && ctx.host === 'api.freelog.com') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
            const secondJumpUrl = `http://api.testfreelog.com${this.ctx.url}`;
            this.ctx.body = '<script>location.href="' + secondJumpUrl + '"</script>';
            return;
        }
        if ((0, common_helper_1.generateTempUserState)(this.ctx.userId) !== state) {
            throw new egg_freelog_base_1.ArgumentError('参数state校验失败');
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({ userId: thirdPartyIdentityInfo.userId });
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = ctx.app.env === 'prod' ? 'https://user.freelog.com' : 'http://user.testfreelog.com';
            }
            this.ctx.body = '<script>location.href="' + returnUrl + '"</script>';
            return;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThEO0FBQzlELHVEQU0wQjtBQUMxQiwwRkFBa0Y7QUFFbEYsa0VBQTREO0FBQzVELHVEQUE2QztBQUM3Qyw4REFBaUU7QUFJakUsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFHN0IsR0FBRyxDQUFpQjtJQUVwQix5QkFBeUIsQ0FBNEI7SUFFckQsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsOFJBQThSO0lBQzlSLG1KQUFtSjtJQUNuSiwwTEFBMEw7SUFDMUwseUJBQXlCO0lBRXpCLEtBQUssQ0FBQyxjQUFjO1FBQ2hCLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDN0Qsa0VBQWtFO1FBQ2xFLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDdkYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUUxQixpREFBaUQ7UUFDakQsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtZQUMxRCw2Q0FBNkM7WUFDN0MsTUFBTSxhQUFhLEdBQUcsNkJBQTZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcseUJB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