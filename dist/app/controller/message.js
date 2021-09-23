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
exports.messageController = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const enum_1 = require("../../enum");
let messageController = class messageController {
    ctx;
    userService;
    messageService;
    /**
     * 发送验证码
     */
    async send() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().isEmailOrMobile86().trim().value;
        const authCodeType = ctx.checkBody('authCodeType').exist().is((value) => Object.values(enum_1.AuthCodeTypeEnum).includes(value), '验证码类型错误').value;
        ctx.validateParams();
        const isEmail = egg_freelog_base_1.CommonRegex.email.test(loginName);
        const condition = isEmail ? { email: loginName } : { mobile: loginName };
        if (enum_1.AuthCodeTypeEnum.Register === authCodeType && await this.userService.count(condition)) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext(isEmail ? 'email-register-validate-failed' : 'mobile-register-validate-failed'));
        }
        else if ([enum_1.AuthCodeTypeEnum.Register, enum_1.AuthCodeTypeEnum.ResetPassword].includes(authCodeType)) {
            await this.messageService.sendMessage(authCodeType, loginName);
            return ctx.success(true);
        }
        if (!ctx.isLoginUser()) {
            throw new egg_freelog_base_1.AuthenticationError('user-authentication-failed');
        }
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        if (![userInfo.mobile, userInfo.email].includes(loginName)) {
            throw new egg_freelog_base_1.LogicError(ctx.gettext('user_email_or_mobile_invalid'));
        }
        if ([enum_1.AuthCodeTypeEnum.AuditFail, enum_1.AuthCodeTypeEnum.AuditPass].includes(authCodeType)) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-validate-failed', 'authCodeType'));
        }
        await this.messageService.sendMessage(authCodeType, loginName).then(data => ctx.success(true));
    }
    /**
     * 核验验证码是否输入正确
     */
    async verify() {
        const { ctx } = this;
        const authCodeType = ctx.checkQuery('authCodeType').exist().is((value) => Object.values(enum_1.AuthCodeTypeEnum).includes(value), '验证码类型错误').value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const address = ctx.checkQuery('address').exist().isEmailOrMobile86().value;
        ctx.validateParams();
        const isNeedLogin = [enum_1.AuthCodeTypeEnum.UpdateMobileOrEmail, enum_1.AuthCodeTypeEnum.UpdateTransactionAccountPwd, enum_1.AuthCodeTypeEnum.ActivateTransactionAccount].includes(authCode);
        if (isNeedLogin && !ctx.isLoginUser()) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('user-authentication-failed'));
        }
        else if (isNeedLogin) {
            const userInfo = await this.userService.findOne({ userId: ctx.userId });
            if (![userInfo.mobile, userInfo.email].includes(address)) {
                return ctx.success(false);
            }
        }
        // 后续要加上用户调用频率限制
        const isVerify = await this.messageService.verify(authCodeType, address, authCode);
        ctx.success(isVerify);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], messageController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], messageController.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], messageController.prototype, "messageService", void 0);
__decorate([
    (0, midway_1.post)('/send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], messageController.prototype, "send", null);
__decorate([
    (0, midway_1.get)('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], messageController.prototype, "verify", null);
messageController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/messages')
], messageController);
exports.messageController = messageController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4RDtBQUM5RCx1REFPMEI7QUFFMUIscUNBQTRDO0FBSTVDLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBRzFCLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGNBQWMsQ0FBa0I7SUFFaEM7O09BRUc7SUFFSCxLQUFLLENBQUMsSUFBSTtRQUVOLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN0RixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDM0ksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sT0FBTyxHQUFHLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRCxNQUFNLFNBQVMsR0FBc0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUM7UUFFeEYsSUFBSSx1QkFBZ0IsQ0FBQyxRQUFRLEtBQUssWUFBWSxJQUFJLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdkYsTUFBTSxJQUFJLG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO1NBQzNIO2FBQU0sSUFBSSxDQUFDLHVCQUFnQixDQUFDLFFBQVEsRUFBRSx1QkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDM0YsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0QsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNwQixNQUFNLElBQUksc0NBQW1CLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUMvRDtRQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sSUFBSSw2QkFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLHVCQUFnQixDQUFDLFNBQVMsRUFBRSx1QkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDakYsTUFBTSxJQUFJLGdDQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ2xGO1FBRUQsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRDs7T0FFRztJQUVILEtBQUssQ0FBQyxNQUFNO1FBRVIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDNUksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEUsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM1RSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFckIsTUFBTSxXQUFXLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSx1QkFBZ0IsQ0FBQywyQkFBMkIsRUFBRSx1QkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6SyxJQUFJLFdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNuQyxNQUFNLElBQUksc0NBQW1CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7U0FDNUU7YUFBTSxJQUFJLFdBQVcsRUFBRTtZQUNwQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDdEQsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzdCO1NBQ0o7UUFDRCxnQkFBZ0I7UUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRW5GLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNKLENBQUE7QUFuRUc7SUFEQyxJQUFBLGVBQU0sR0FBRTs7OENBQ1c7QUFFcEI7SUFEQyxJQUFBLGVBQU0sR0FBRTs7c0RBQ2lCO0FBRTFCO0lBREMsSUFBQSxlQUFNLEdBQUU7O3lEQUN1QjtBQU1oQztJQURDLElBQUEsYUFBSSxFQUFDLE9BQU8sQ0FBQzs7Ozs2Q0E4QmI7QUFNRDtJQURDLElBQUEsWUFBRyxFQUFDLFNBQVMsQ0FBQzs7OzsrQ0FzQmQ7QUFyRVEsaUJBQWlCO0lBRjdCLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsbUJBQVUsRUFBQyxjQUFjLENBQUM7R0FDZCxpQkFBaUIsQ0FzRTdCO0FBdEVZLDhDQUFpQiJ9