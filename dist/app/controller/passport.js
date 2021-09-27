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
const lodash_1 = require("lodash");
let passportController = class passportController {
    jwtAuth;
    domain;
    ctx;
    userService;
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
        this.userService.updateOneUserDetail({ userId: userInfo.userId }, {
            latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then();
        const { publicKey, privateKey, cookieName } = this.jwtAuth;
        const payLoad = Object.assign((0, lodash_1.pick)(userInfo, ['userId', 'username', 'userType', 'mobile', 'email']), this._generateJwtPayload(userInfo.userId, userInfo.tokenSn));
        const jwtStr = new egg_freelog_base_1.JwtHelper(publicKey, privateKey).generateToken(payLoad, 1296000);
        if (jwtType === 'cookie') {
            const now = new Date();
            now.setDate(now.getDate() + 7);
            const cookieOptions = {
                httpOnly: true,
                domain: this.domain,
                overwrite: true,
                signed: false,
                expires: isRemember ? now : undefined
            };
            ctx.cookies.set(cookieName, jwtStr, cookieOptions);
            ctx.cookies.set('uid', userInfo.userId.toString(), { ...cookieOptions, ...{ httpOnly: false } });
        }
        else {
            ctx.set('Authorization', `Bearer ${jwtStr}`);
        }
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(userInfo);
    }
    async logout(ctx) {
        const returnUrl = ctx.checkQuery('returnUrl').optional().decodeURIComponent().isUrl().value;
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
        const currTime = Math.round(new Date().getTime() / 1000);
        return {
            iss: 'https://identity.freelog.com',
            sub: userId.toString(),
            aud: 'freelog-website',
            exp: currTime + 1296000,
            iat: currTime,
            jti: token
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXNFO0FBQ3RFLHVEQUFnRjtBQUVoRiw4REFBNEQ7QUFDNUQsbUNBQTRCO0FBSTVCLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBRzNCLE9BQU8sQ0FBQztJQUVSLE1BQU0sQ0FBQztJQUVQLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRzFCLEtBQUssQ0FBQyxLQUFLO1FBRVAsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN0RSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLGtCQUFrQjtRQUN0RyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUYsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFD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