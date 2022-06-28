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
exports.passportController = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const common_helper_1 = require("../../extend/common-helper");
const passport_service_1 = require("../service/passport-service");
let passportController = class passportController {
    jwtAuth;
    domain;
    ctx;
    userService;
    passportService;
    async login() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value; // isLoginPassword
        const isRemember = ctx.checkBody('isRemember').optional().toInt().in([0, 1]).default(0).value;
        const jwtType = ctx.checkBody('jwtType').optional().in(['cookie', 'header']).default('cookie').value;
        const returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        ctx.validateParams();
        const userInfo = await this.userService.findUserByLoginName(loginName);
        if (!userInfo || (0, common_helper_1.generatePassword)(userInfo.salt, password) !== userInfo.password) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        await this.passportService.setCookieAndLoginRecord(userInfo, jwtType, isRemember);
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(userInfo);
    }
    async logout(ctx) {
        const returnUrl = ctx.checkQuery('returnUrl').optional().decodeURIComponent().isUrl().value;
        ctx.validateParams();
        ctx.cookies.set(this.jwtAuth.cookieName, null, { domain: this.domain });
        ctx.cookies.set('uid', null, { domain: this.domain });
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(true);
    }
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], passportController.prototype, "jwtAuth", void 0);
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], passportController.prototype, "domain", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], passportController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], passportController.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", passport_service_1.PassportService)
], passportController.prototype, "passportService", void 0);
__decorate([
    (0, midway_1.post)('/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], passportController.prototype, "login", null);
__decorate([
    (0, midway_1.get)('/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], passportController.prototype, "logout", null);
passportController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/passport')
], passportController);
exports.passportController = passportController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXNFO0FBQ3RFLHVEQUFxRTtBQUVyRSw4REFBNEQ7QUFDNUQsa0VBQTREO0FBSTVELElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBRzNCLE9BQU8sQ0FBQztJQUVSLE1BQU0sQ0FBQztJQUVQLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGVBQWUsQ0FBa0I7SUFHakMsS0FBSyxDQUFDLEtBQUs7UUFFUCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3RFLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCO1FBQ3RHLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM5RixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDckcsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN6RixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFckIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBQSxnQ0FBZ0IsRUFBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDOUUsTUFBTSxJQUFJLHNDQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO1NBQ3hGO1FBQ0QsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEYsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFHRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFFWixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzVGLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUVwRCxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNKLENBQUE7QUF4Q0c7SUFEQyxJQUFBLGVBQU0sR0FBRTs7bURBQ0Q7QUFFUjtJQURDLElBQUEsZUFBTSxHQUFFOztrREFDRjtBQUVQO0lBREMsSUFBQSxlQUFNLEdBQUU7OytDQUNXO0FBRXBCO0lBREMsSUFBQSxlQUFNLEdBQUU7O3VEQUNpQjtBQUUxQjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNRLGtDQUFlOzJEQUFDO0FBR2pDO0lBREMsSUFBQSxhQUFJLEVBQUMsUUFBUSxDQUFDOzs7OytDQWlCZDtBQUdEO0lBREMsSUFBQSxZQUFHLEVBQUMsU0FBUyxDQUFDOzs7O2dEQVVkO0FBMUNRLGtCQUFrQjtJQUY5QixJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLG1CQUFVLEVBQUMsY0FBYyxDQUFDO0dBQ2Qsa0JBQWtCLENBMkM5QjtBQTNDWSxnREFBa0IifQ==