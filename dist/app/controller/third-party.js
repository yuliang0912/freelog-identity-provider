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
const third_party_identity_service_1 = require("../service/third-party-identity-service");
const passport_service_1 = require("../service/passport-service");
let ThirdPartyController = class ThirdPartyController {
    ctx;
    thirdPartyIdentityService;
    userService;
    passportService;
    // testUrl:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2ftest&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    async getWeChatToken() {
        const { ctx } = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        let returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 测试扫码地址
        // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/codeHandle?returnUrl=http://console.testfreelog.com');
        // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({ userId: thirdPartyIdentityInfo.userId });
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = ctx.app.env === 'prod' ? 'https://user.freelog.com' : 'http://user.testfreelog.com';
            }
            return ctx.redirect(returnUrl);
        }
        // 如果未绑定用户ID,则需要走绑定或者注册流程.
        ctx.success(`等待前端做好第三方用户绑定或注册流程之后,会跳转,param:{id:${thirdPartyIdentityInfo.id},openId${thirdPartyIdentityInfo.openId}}`);
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
ThirdPartyController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/thirdParty')
], ThirdPartyController);
exports.ThirdPartyController = ThirdPartyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGhpcmQtcGFydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXdEO0FBRXhELDBGQUFrRjtBQUVsRixrRUFBNEQ7QUFJNUQsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUFHN0IsR0FBRyxDQUFpQjtJQUVwQix5QkFBeUIsQ0FBNEI7SUFFckQsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFFakMsb01BQW9NO0lBRXBNLEtBQUssQ0FBQyxjQUFjO1FBQ2hCLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDN0QsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN2RixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTFCLFNBQVM7UUFDVCxtSkFBbUo7UUFDbkosMExBQTBMO1FBRTFMLE1BQU0sc0JBQXNCLEdBQUcsTUFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZGLHNCQUFzQjtRQUN0QixJQUFJLHNCQUFzQixDQUFDLE1BQU0sRUFBRTtZQUMvQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDekYsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDWixTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsNkJBQTZCLENBQUM7YUFDbkc7WUFDRCxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEM7UUFDRCwwQkFBMEI7UUFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0Msc0JBQXNCLENBQUMsRUFBRSxVQUFVLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0gsQ0FBQztDQUNKLENBQUE7QUFqQ0c7SUFEQyxJQUFBLGVBQU0sR0FBRTs7aURBQ1c7QUFFcEI7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDa0Isd0RBQXlCO3VFQUFDO0FBRXJEO0lBREMsSUFBQSxlQUFNLEdBQUU7O3lEQUNpQjtBQUUxQjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNRLGtDQUFlOzZEQUFDO0FBSWpDO0lBREMsSUFBQSxZQUFHLEVBQUMsb0JBQW9CLENBQUM7Ozs7MERBdUJ6QjtBQW5DUSxvQkFBb0I7SUFGaEMsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxtQkFBVSxFQUFDLGdCQUFnQixDQUFDO0dBQ2hCLG9CQUFvQixDQW9DaEM7QUFwQ1ksb0RBQW9CIn0=