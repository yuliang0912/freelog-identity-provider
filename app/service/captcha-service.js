'use strict'

const Service = require('egg').Service
const svgCaptcha = require('svg-captcha')
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = class CaptchaService extends Service {


    /**
     * 生成generateCaptcha
     * @param options
     * @returns {CaptchaObj}
     */
    generateCaptcha(captchaKey, options = {}) {

        const {ctx} = this
        const captcha = svgCaptcha.create(options)

        const cookieOptions = {
            httpOnly: false,
            domain: ctx.config.domain,
            overwrite: true, signed: false
        }
        const cookieKey = `captcha-${captchaKey}`
        const signText = `${cookieKey}@${captcha.text.toLowerCase()}`

        ctx.cookies.set(`captcha-${captchaKey}`, crypto.hmacSha1(crypto.base64Encode(signText), signText, 'base64'), cookieOptions)

        return captcha
    }

    /**
     * 核验验证码是否输入正确
     */
    verify(captchaKey, captchaInput) {

        const {ctx} = this
        const cookieKey = `captcha-${captchaKey}`
        const signText = `${cookieKey}@${captchaInput.toLowerCase()}`
        const captchaSignText = ctx.cookies.get(cookieKey, {signed: false})

        return captchaSignText && captchaSignText == crypto.hmacSha1(crypto.base64Encode(signText), signText, 'base64')
    }
}