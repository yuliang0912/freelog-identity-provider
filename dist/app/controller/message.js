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
        const condition = {};
        let isMobile86 = false;
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName;
            isMobile86 = true;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(loginName)) {
            condition.email = loginName;
        }
        else {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('login-name-format-validate-failed'));
        }
        const isExistLoginName = await this.userService.count(condition);
        if (enum_1.AuthCodeTypeEnum.Register === authCodeType && isExistLoginName) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext(isMobile86 ? 'mobile-register-validate-failed' : 'email-register-validate-failed'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4RDtBQUM5RCx1REFPMEI7QUFFMUIscUNBQTRDO0FBSTVDLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBRzFCLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGNBQWMsQ0FBa0I7SUFFaEM7O09BRUc7SUFFSCxLQUFLLENBQUMsSUFBSTtRQUVOLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN0RixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDM0ksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFzQixFQUFFLENBQUM7UUFFeEMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksOEJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQzdCLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDckI7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxT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