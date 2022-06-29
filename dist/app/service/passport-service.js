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
exports.PassportService = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const lodash_1 = require("lodash");
const common_helper_1 = require("../../extend/common-helper");
let PassportService = class PassportService {
    jwtAuth;
    domain;
    ctx;
    userService;
    /**
     * 写登陆cookie并且保存登陆记录
     * @param userInfo
     * @param jwtType
     * @param isRemember
     */
    async setCookieAndLoginRecord(userInfo, jwtType, isRemember) {
        if (!userInfo) {
            throw new egg_freelog_base_1.ArgumentError('缺少参数userInfo');
        }
        const { ctx } = this;
        const { publicKey, privateKey, cookieName } = this.jwtAuth;
        const payLoad = Object.assign((0, lodash_1.pick)(userInfo, ['userId', 'username', 'userType', 'mobile', 'email']), this.generateJwtPayload(userInfo.userId, userInfo.tokenSn));
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
            console.log('写入cookie', JSON.stringify(cookieOptions));
        }
        else {
            ctx.set('Authorization', `Bearer ${jwtStr}`);
        }
        this.userService.updateOneUserDetail({ userId: userInfo.userId }, {
            userId: userInfo.userId, latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then().catch(console.error);
        console.log('登录成功');
        return true;
    }
    /**
     * 校验密码是否正确
     * @param userInfo
     * @param password
     */
    verifyUserPassword(userInfo, password) {
        if (!userInfo || !password) {
            return false;
        }
        return (0, common_helper_1.generatePassword)(userInfo.salt, password) === userInfo.password;
    }
    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    generateJwtPayload(userId, token) {
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
], PassportService.prototype, "jwtAuth", void 0);
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", String)
], PassportService.prototype, "domain", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], PassportService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], PassportService.prototype, "userService", void 0);
PassportService = __decorate([
    (0, midway_1.provide)()
], PassportService);
exports.PassportService = PassportService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvc2VydmljZS9wYXNzcG9ydC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUErQztBQUUvQyx1REFBMEU7QUFDMUUsbUNBQTRCO0FBQzVCLDhEQUE0RDtBQUc1RCxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBR3hCLE9BQU8sQ0FBQztJQUVSLE1BQU0sQ0FBUztJQUVmLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLHVCQUF1QixDQUFDLFFBQWtCLEVBQUUsT0FBNEIsRUFBRSxVQUFvQjtRQUNoRyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsTUFBTSxJQUFJLGdDQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDM0M7UUFFRCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDekQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFBLGFBQUksRUFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUVqSyxNQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFTLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFcEYsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxH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