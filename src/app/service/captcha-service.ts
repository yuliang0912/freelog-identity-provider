import {FreelogContext, CryptoHelper} from "egg-freelog-base";
import {inject, provide} from "midway";
import {ICaptchaService} from "../../interface";

const svgCaptcha = require('svg-captcha')

@provide()
export class CaptchaService implements ICaptchaService {

    @inject()
    ctx: FreelogContext;

    /**
     * 生成generateCaptcha
     * @param options
     * @returns {CaptchaObj}
     */
    generateCaptcha(captchaKey: string, options: object = {}) {

        const {ctx} = this;
        const captcha = svgCaptcha.create(options);

        const cookieOptions = {
            httpOnly: false,
            //domain: ctx.config.domain,
            overwrite: true, signed: false
        }
        const cookieKey = `captcha-${captchaKey}`;
        const signText = `${cookieKey}@${captcha.text.toLowerCase()}`;

        ctx.cookies.set(`captcha-${captchaKey}`, CryptoHelper.hmacSha1(CryptoHelper.base64Encode(signText), signText, 'base64'), cookieOptions);

        return captcha;
    }

    /**
     * 核验验证码是否输入正确
     */
    verify(captchaKey: string, captchaInput: string): boolean {

        const {ctx} = this;
        const cookieKey = `captcha-${captchaKey}`;
        const signText = `${cookieKey}@${captchaInput.toLowerCase()}`;
        const captchaSignText = ctx.cookies.get(cookieKey, {signed: false});

        return captchaSignText && captchaSignText == CryptoHelper.hmacSha1(CryptoHelper.base64Encode(signText), signText, 'base64');
    }
}
