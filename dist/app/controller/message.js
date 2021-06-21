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
    /**
     * 发送验证码
     */
    async send() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().trim().value;
        const authCodeType = ctx.checkBody('authCodeType').exist().in(['register', 'resetPassword', 'activateTransactionAccount']).value;
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
        if (authCodeType === 'resetPassword' && !isExistLoginName) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('login-name-not-exist-error'));
        }
        await this.messageService.sendMessage(authCodeType, loginName).then(data => ctx.success(true));
    }
    /**
     * 核验验证码是否输入正确
     */
    async verify() {
        const { ctx } = this;
        const authCodeType = ctx.checkQuery('authCodeType').exist().in(['register', 'resetPassword']).value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const mobileOrEmailRegex = /^(1[34578]\d{9})|([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4})$/;
        const address = ctx.checkQuery('address').exist().match(mobileOrEmailRegex, ctx.gettext('login-name-format-validate-failed')).value;
        ctx.validateParams();
        const isVerify = await this.messageService.verify(authCodeType, address, authCode);
        ctx.success(isVerify);
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], messageController.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], messageController.prototype, "userService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], messageController.prototype, "messageService", void 0);
__decorate([
    midway_1.post('/send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], messageController.prototype, "send", null);
__decorate([
    midway_1.get('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], messageController.prototype, "verify", null);
messageController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/messages')
], messageController);
exports.messageController = messageController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4RDtBQUM5RCx1REFBOEY7QUFLOUYsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFTMUI7O09BRUc7SUFFSCxLQUFLLENBQUMsSUFBSTtRQUVOLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEUsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxFQUFFLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDakksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFzQixFQUFFLENBQUM7UUFFeEMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksOEJBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQzdCLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDckI7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztTQUMvQjthQUFNO1lBQ0gsTUFBTSxJQUFJLGdDQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7U0FDN0U7UUFFRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakUsSUFBSSxZQUFZLEtBQUssVUFBVSxJQUFJLGdCQUFnQixFQUFFO1lBQ2pELE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQztTQUM5SDtRQUNELElBQUksWUFBWSxLQUFLLGVBQWUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZELE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztTQUN6RTtRQUVELE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUQ7O09BRUc7SUFFSCxLQUFLLENBQUMsTUFBTTtRQUVSLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEcsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBRyxzRkFBc0YsQ0FBQztRQUNsSCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDcEksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVuRixHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDSixDQUFBO0FBekRHO0lBREMsZUFBTSxFQUFFOzs4Q0FDVztBQUVwQjtJQURDLGVBQU0sRUFBRTs7c0RBQ2lCO0FBRTFCO0lBREMsZUFBTSxFQUFFOzt5REFDdUI7QUFNaEM7SUFEQyxhQUFJLENBQUMsT0FBTyxDQUFDOzs7OzZDQTZCYjtBQU1EO0lBREMsWUFBRyxDQUFDLFNBQVMsQ0FBQzs7OzsrQ0FhZDtBQTNEUSxpQkFBaUI7SUFGN0IsZ0JBQU8sRUFBRTtJQUNULG1CQUFVLENBQUMsY0FBYyxDQUFDO0dBQ2QsaUJBQWlCLENBNEQ3QjtBQTVEWSw4Q0FBaUIifQ==