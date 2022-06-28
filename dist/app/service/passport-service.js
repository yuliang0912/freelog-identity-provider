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
        }
        else {
            ctx.set('Authorization', `Bearer ${jwtStr}`);
        }
        this.userService.updateOneUserDetail({ userId: userInfo.userId }, {
            userId: userInfo.userId, latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then().catch(console.error);
        return true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvc2VydmljZS9wYXNzcG9ydC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUErQztBQUUvQyx1REFBMEU7QUFDMUUsbUNBQTRCO0FBRzVCLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFHeEIsT0FBTyxDQUFDO0lBRVIsTUFBTSxDQUFTO0lBRWYsR0FBRyxDQUFpQjtJQUVwQixXQUFXLENBQWU7SUFFMUI7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsdUJBQXVCLENBQUMsUUFBa0IsRUFBRSxPQUE0QixFQUFFLFVBQW9CO1FBQ2hHLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNLElBQUksZ0NBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUMzQztRQUVELE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN6RCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUEsYUFBSSxFQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWpLLE1BQU0sTUFBTSxHQUFHLElBQUksNEJBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVwRixJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLGFBQWEsR0FBRztnQkFDbEIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDeEMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxHQUFHLGFBQWEsRUFBRSxHQUFHLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxFQUFDLENBQUMsQ0FBQztTQUNoRzthQUFNO1lBQ0gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsVUFBVSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFDLEVBQUU7WUFDNUQsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1NBQzlFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssa0JBQWtCLENBQUMsTUFBYyxFQUFFLEtBQWE7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3pELE9BQU87WUFDSCxHQUFHLEVBQUUsOEJBQThCO1lBQ25DLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3RCLEdBQUcsRUFBRSxpQkFBaUI7WUFDdEIsR0FBRyxFQUFFLFFBQVEsR0FBRyxPQUFPO1lBQ3ZCLEdBQUcsRUFBRSxRQUFRO1lBQ2IsR0FBRyxFQUFFLEtBQUs7U0FDYixDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUE7QUE5REc7SUFEQyxJQUFBLGVBQU0sR0FBRTs7Z0RBQ0Q7QUFFUjtJQURDLElBQUEsZUFBTSxHQUFFOzsrQ0FDTTtBQUVmO0lBREMsSUFBQSxlQUFNLEdBQUU7OzRDQUNXO0FBRXBCO0lBREMsSUFBQSxlQUFNLEdBQUU7O29EQUNpQjtBQVRqQixlQUFlO0lBRDNCLElBQUEsZ0JBQU8sR0FBRTtHQUNHLGVBQWUsQ0FpRTNCO0FBakVZLDBDQUFlIn0=