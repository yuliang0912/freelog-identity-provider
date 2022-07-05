import {controller, get, inject, provide} from 'midway';
import {FreelogContext} from 'egg-freelog-base';
import {ICaptchaService} from '../../interface';

@provide()
@controller('/v2/captchas')
export class captchaController {

    @inject()
    ctx: FreelogContext;
    @inject()
    captchaService: ICaptchaService;

    /**
     * 生成随机验证码图片
     */
    @get('/:captchaKey')
    async generateCaptcha() {

        const {ctx} = this;
        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value;
        const width = ctx.checkQuery('width').default(120).optional().toInt().value;
        const height = ctx.checkQuery('height').default(50).optional().toInt().value;
        const size = ctx.checkQuery('size').default(4).optional().toInt().value;
        const noise = ctx.checkQuery('noise').default(1).optional().toInt().in([1, 2, 3]).value;
        ctx.validateParams();

        const captcha = this.captchaService.generateCaptcha(captchaKey, {width, height, size, noise});
        ctx.type = 'svg';
        ctx.body = captcha.data;
    }

    /**
     * 核验验证码是否输入正确
     * @returns {Promise<void>}
     */
    @get('/:captchaKey/verify')
    async verify() {

        const {ctx} = this;
        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value;
        const captchaInput = ctx.checkQuery('captchaInput').exist().value;
        ctx.validateParams();

        const isVerify = this.captchaService.verify(captchaKey, captchaInput);
        ctx.success(isVerify);
    }
}
