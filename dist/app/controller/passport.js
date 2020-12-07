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
const enum_1 = require("../../enum");
const lodash_1 = require("lodash");
let passportController = class passportController {
    async login() {
        const { ctx } = this;
        const loginName = ctx.checkBody("loginName").exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value; // isLoginPassword
        const isRemember = ctx.checkBody("isRemember").optional().toInt().in([0, 1]).default(0).value;
        const jwtType = ctx.checkBody('jwtType').optional().in(['cookie', 'header']).default('cookie').value;
        const returnUrl = ctx.checkBody("returnUrl").optional().value;
        ctx.validateParams();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(loginName)) {
            condition.email = loginName;
        }
        else if (egg_freelog_base_1.CommonRegex.username.test(loginName)) {
            condition.username = loginName;
        }
        else {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('login-name-format-validate-failed'), { loginName });
        }
        const userInfo = await this.userService.findOne(condition);
        if (!userInfo || common_helper_1.generatePassword(userInfo.salt, password) !== userInfo.password) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        if (userInfo.status === enum_1.UserStatusEnum.Freeze) {
            throw new egg_freelog_base_1.AuthenticationError(ctx.gettext('user_account_has_already_freeze'));
        }
        this.userService.updateOneUserDetail({ userId: userInfo.userId }, {
            latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then();
        const { publicKey, privateKey, cookieName } = this.jwtAuth;
        const payLoad = Object.assign(lodash_1.pick(userInfo, ['userId', 'username', 'userType', 'mobile', 'email']), this._generateJwtPayload(userInfo.userId, userInfo.tokenSn));
        const jwtStr = new egg_freelog_base_1.JwtHelper(publicKey, privateKey).generateToken(payLoad, 1296000);
        if (jwtType === 'cookie') {
            const now = new Date();
            now.setDate(now.getDate() + 7);
            const cookieOptions = {
                httpOnly: false,
                domain: this.domain,
                overwrite: true,
                signed: false,
                expires: isRemember ? now : undefined
            };
            ctx.cookies.set(cookieName, jwtStr, cookieOptions);
            ctx.cookies.set('uid', userInfo.userId.toString(), cookieOptions);
        }
        else {
            ctx.set('Authorization', `Bearer ${jwtStr}`);
        }
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(userInfo);
    }
    async logout(ctx) {
        const returnUrl = ctx.checkQuery("returnUrl").optional().decodeURIComponent().isUrl().value;
        ctx.validateParams();
        ctx.cookies.set(this.jwtAuth.cookieName, null, { domain: this.domain });
        ctx.cookies.set('uid', null, { domain: this.domain });
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(true);
    }
    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    _generateJwtPayload(userId, token) {
        {
            const currTime = Math.round(new Date().getTime() / 1000);
            return {
                iss: "https://identity.freelog.com",
                sub: userId.toString(),
                aud: "freelog-website",
                exp: currTime + 1296000,
                iat: currTime,
                jti: token
            };
        }
    }
};
__decorate([
    midway_1.config(),
    __metadata("design:type", Object)
], passportController.prototype, "jwtAuth", void 0);
__decorate([
    midway_1.config(),
    __metadata("design:type", Object)
], passportController.prototype, "domain", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], passportController.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], passportController.prototype, "userService", void 0);
__decorate([
    midway_1.post('/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], passportController.prototype, "login", null);
__decorate([
    midway_1.get('/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], passportController.prototype, "logout", null);
passportController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/passport')
], passportController);
exports.passportController = passportController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXNFO0FBQ3RFLHVEQUE0RztBQUU1Ryw4REFBNEQ7QUFDNUQscUNBQTBDO0FBQzFDLG1DQUE0QjtBQUk1QixJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQVkzQixLQUFLLENBQUMsS0FBSztRQUVQLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDdEUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0I7UUFDdEcsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzlGLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyRyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FB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