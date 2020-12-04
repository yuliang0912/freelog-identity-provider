import { FreelogContext } from "egg-freelog-base";
import { ICaptchaService } from "../../interface";
export declare class CaptchaService implements ICaptchaService {
    ctx: FreelogContext;
    /**
     * 生成generateCaptcha
     * @param options
     * @returns {CaptchaObj}
     */
    generateCaptcha(captchaKey: string, options?: object): any;
    /**
     * 核验验证码是否输入正确
     */
    verify(captchaKey: string, captchaInput: string): boolean;
}
