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
let messageController = class messageController {
    ctx;
    userService;
    messageService;
    /**
     * 发送验证码
     */
    async send() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().trim().value;
        const authCodeType = ctx.checkBody('authCodeType').exist().in(['register', 'resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd']).value;
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
        if (authCodeType === 'register' && isExistLoginName) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext(isMobile86 ? 'mobile-register-validate-failed' : 'email-register-validate-failed'));
        }
        if (['resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd'].includes(authCodeType) && !isExistLoginName) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('login-name-not-exist-error'));
        }
        await this.messageService.sendMessage(authCodeType, loginName).then(data => ctx.success(true));
    }
    /**
     * 核验验证码是否输入正确
     */
    async verify() {
        const { ctx } = this;
        const authCodeType = ctx.checkQuery('authCodeType').exist().in(['register', 'resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd']).value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const address = ctx.checkQuery('address').exist().isEmailOrMobile86().value;
        ctx.validateParams();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4RDtBQUM5RCx1REFBOEY7QUFLOUYsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFHMUIsR0FBRyxDQUFpQjtJQUVwQixXQUFXLENBQWU7SUFFMUIsY0FBYyxDQUFrQjtJQUVoQzs7T0FFRztJQUVILEtBQUssQ0FBQyxJQUFJO1FBRU4sTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNsRSxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsNEJBQTRCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoSyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFckIsTUFBTSxTQUFTLEdBQXNCLEVBQUUsQ0FBQztRQUV4QyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSw4QkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7WUFDN0IsVUFBVSxHQUFHLElBQUksQ0FBQztTQUNyQjthQUFNLElBQUksOEJBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1NBQy9CO2FBQU07WUFDSCxNQUFNLElB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