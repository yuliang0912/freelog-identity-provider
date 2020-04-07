'use strict'

const uuid = require('uuid')
const Controller = require('egg').Controller;

module.exports = class PassPortController extends Controller {

    /**
     * 生成随机验证码图片
     * @param ctx
     * @returns {Promise<void>}
     */
    async generateCaptcha(ctx) {

        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value
        const width = ctx.checkQuery('width').default(120).optional().toInt().value
        const height = ctx.checkQuery('height').default(50).optional().toInt().value
        const size = ctx.checkQuery('size').default(4).optional().toInt().value
        const noise = ctx.checkQuery('noise').default(1).optional().toInt().in([1, 2, 3]).value
        ctx.validateParams()

        const captcha = ctx.service.captchaService.generateCaptcha(captchaKey, {width, height, size, noise})

        ctx.type = 'svg'
        ctx.body = captcha.data
    }

    /**
     * 核验验证码是否输入正确
     * @param ctx
     * @returns {Promise<void>}
     */
    async verify(ctx) {

        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value
        const captchaInput = ctx.checkQuery('captchaInput').exist().value
        ctx.validateParams()

        const isVerify = ctx.service.captchaService.verify(captchaKey, captchaInput)

        ctx.success(isVerify)
    }
}