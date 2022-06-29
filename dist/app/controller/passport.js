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
        if (!this.passportService.verifyUserPassword(userInfo, password)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXNFO0FBQ3RFLHVEQUFxRTtBQUVyRSxrRUFBNEQ7QUFJNUQsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFHM0IsT0FBTyxDQUFDO0lBRVIsTUFBTSxDQUFDO0lBRVAsR0FBRyxDQUFpQjtJQUVwQixXQUFXLENBQWU7SUFFMUIsZUFBZSxDQUFrQjtJQUdqQyxLQUFLLENBQUMsS0FBSztRQUVQLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDdEUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0I7UUFDdEcsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzlGLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyRyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3pGLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1lBQzlELE1BQU0sSUFBSSxzQ0FBbUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztTQUN4RjtRQUNELE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xGLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBR0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHO1FBRVosTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM1RixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFckIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFcEQsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDSixDQUFBO0FBeENHO0lBREMsSUFBQSxlQUFNLEdBQUU7O21EQUNEO0FBRVI7SUFEQyxJQUFBLGVBQU0sR0FBRTs7a0RBQ0Y7QUFFUDtJQURDLElBQUEsZUFBTSxHQUFFOzsrQ0FDVztBQUVwQjtJQURDLElBQUEsZUFBTSxHQUFFOzt1REFDaUI7QUFFMUI7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDUSxrQ0FBZTsyREFBQztBQUdqQztJQURDLElBQUEsYUFBSSxFQUFDLFFBQVEsQ0FBQzs7OzsrQ0FpQmQ7QUFHRDtJQURDLElBQUEsWUFBRyxFQUFDLFNBQVMsQ0FBQzs7OztnREFVZDtBQTFDUSxrQkFBa0I7SUFGOUIsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxtQkFBVSxFQUFDLGNBQWMsQ0FBQztHQUNkLGtCQUFrQixDQTJDOUI7QUEzQ1ksZ0RBQWtCIn0=