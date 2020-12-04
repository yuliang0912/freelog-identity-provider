import { FreelogContext } from 'egg-freelog-base';
import { ICaptchaService } from "../../interface";
export declare class captchaController {
    ctx: FreelogContext;
    captchaService: ICaptchaService;
    /**
     * 生成随机验证码图片
     */
    generateCaptcha(): Promise<void>;
    /**
     * 核验验证码是否输入正确
     * @param ctx
     * @returns {Promise<void>}
     */
    verify(): Promise<void>;
}
