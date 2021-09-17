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
    ctx;
    /**
     * 生成generateCaptcha
     * @param captchaKey
     * @param options
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
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], CaptchaService.prototype, "ctx", void 0);
CaptchaService = __decorate([
    (0, midway_1.provide)()
], CaptchaService);
exports.CaptchaService = CaptchaService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL2NhcHRjaGEtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1REFBOEQ7QUFDOUQsbUNBQXVDO0FBR3ZDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUcxQyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBR3ZCLEdBQUcsQ0FBaUI7SUFFcEI7Ozs7T0FJRztJQUNILGVBQWUsQ0FBQyxVQUFrQixFQUFFLFVBQWtCLEVBQUU7UUFFcEQsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNDLE1BQU0sYUFBYSxHQUFHO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsNEJBQTRCO1lBQzVCLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUs7U0FDakMsQ0FBQztRQUNGLE1BQU0sU0FBUyxHQUFHLFdBQVcsVUFBVSxFQUFFLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1FBRTlELEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsVUFBVSxFQUFFLEVBQUUsK0JBQVksQ0FBQyxRQUFRLENBQUMsK0JBQVksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXhJLE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxVQUFrQixFQUFFLFlBQW9CO1FBRTNDLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsV0FBVyxVQUFVLEVBQUUsQ0FBQztRQUMxQyxNQUFNLFFBQVEsR0FBRyxHQUFHLFNBQVMsSUFBSSxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztRQUM5RCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUVwRSxPQUFPLGVBQWUsSUFBSSxlQUFlLElBQUksK0JBQVksQ0FBQyxRQUFRLENBQUMsK0JBQVksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hJLENBQUM7Q0FDSixDQUFBO0FBckNHO0lBREMsSUFBQSxlQUFNLEdBQUU7OzJDQUNXO0FBSFgsY0FBYztJQUQxQixJQUFBLGdCQUFPLEdBQUU7R0FDRyxjQUFjLENBd0MxQjtBQXhDWSx3Q0FBYyJ9