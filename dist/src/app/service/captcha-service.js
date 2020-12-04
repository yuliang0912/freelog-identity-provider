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
exports.CaptchaService = void 0;
const egg_freelog_base_1 = require("egg-freelog-base");
const midway_1 = require("midway");
const svgCaptcha = require('svg-captcha');
let CaptchaService = class CaptchaService {
    /**
     * 生成generateCaptcha
     * @param options
     * @returns {CaptchaObj}
     */
    generateCaptcha(captchaKey, options = {}) {
        const { ctx } = this;
        const captcha = svgCaptcha.create(options);
        const cookieOptions = {
            httpOnly: false,
            //domain: ctx.config.domain,
            overwrite: true, signed: false
        };
        const cookieKey = `captcha-${captchaKey}`;
        const signText = `${cookieKey}@${captcha.text.toLowerCase()}`;
        ctx.cookies.set(`captcha-${captchaKey}`, egg_freelog_base_1.CryptoHelper.hmacSha1(egg_freelog_base_1.CryptoHelper.base64Encode(signText), signText, 'base64'), cookieOptions);
        return captcha;
    }
    /**
     * 核验验证码是否输入正确
     */
    verify(captchaKey, captchaInput) {
        const { ctx } = this;
        const cookieKey = `captcha-${captchaKey}`;
        const signText = `${cookieKey}@${captchaInput.toLowerCase()}`;
        const captchaSignText = ctx.cookies.get(cookieKey, { signed: false });
        return captchaSignText && captchaSignText == egg_freelog_base_1.CryptoHelper.hmacSha1(egg_freelog_base_1.CryptoHelper.base64Encode(signText), signText, 'base64');
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], CaptchaService.prototype, "ctx", void 0);
CaptchaService = __decorate([
    midway_1.provide()
], CaptchaService);
exports.CaptchaService = CaptchaService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL2NhcHRjaGEtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1REFBOEQ7QUFDOUQsbUNBQXVDO0FBR3ZDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUd6QyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBS3ZCOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsVUFBa0IsRUFBRSxVQUFrQixFQUFFO1FBRXBELE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxNQUFNLGFBQWEsR0FBRztZQUNsQixRQUFRLEVBQUUsS0FBSztZQUNmLDRCQUE0QjtZQUM1QixTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLO1NBQ2pDLENBQUE7UUFDRCxNQUFNLFNBQVMsR0FBRyxXQUFXLFVBQVUsRUFBRSxDQUFDO1FBQzFDLE1BQU0sUUFBUSxHQUFHLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztRQUU5RCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLFVBQVUsRUFBRSxFQUFFLCtCQUFZLENBQUMsUUFBUSxDQUFDLCtCQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUV4SSxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsVUFBa0IsRUFBRSxZQUFvQjtRQUUzQyxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLFdBQVcsVUFBVSxFQUFFLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxTQUFTLElBQUksWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7UUFDOUQsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFcEUsT0FBTyxlQUFlLElBQUksZUFBZSxJQUFJLCtCQUFZLENBQUMsUUFBUSxDQUFDLCtCQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoSSxDQUFDO0NBQ0osQ0FBQTtBQXJDRztJQURDLGVBQU0sRUFBRTs7MkNBQ1c7QUFIWCxjQUFjO0lBRDFCLGdCQUFPLEVBQUU7R0FDRyxjQUFjLENBd0MxQjtBQXhDWSx3Q0FBYyJ9