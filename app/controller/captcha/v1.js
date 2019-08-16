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

        /** 测试代码
         const params = {
            Format: 'JSON',
            Version: "2017-06-22",
            AccessKeyId: "LTAIy8TOsSnNFfPb",
            SignatureMethod: 'HMAC-SHA1',
            Timestamp: new Date().toISOString(),
            SignatureVersion: "1.0",
            SignatureNonce: uuid.v4() + uuid.v1(),
            Action: 'SingleSendMail',
            AccountName: "webmaster@service.freelog.com",
            ReplyToAddress: true,
            AddressType: 1,
            ToAddress: '4896819@qq.com',
            Subject: '1',
            HtmlBody: '2'
        }
         const paramString = Object.keys(params).sort().map(key => {
            return fixedEncodeURIComponent(key) + '=' + fixedEncodeURIComponent(params[key])
        }).join('&')

         function fixedEncodeURIComponent(str) {
            return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }

         const stringToSign = 'GET&' + encodeURIComponent('/') + '&' + encodeURIComponent(paramString)

         params.Signature = crypto.hmacSha1(stringToSign, 'Bt5yMbW89O7wMTVQsNUfvYfou5GPsL&', 'base64')
         const urlParams = Object.keys(params).map(item => {
            return item + '=' + params[item]
        }).join('&')

         const emailSendUrl = `http://dm.aliyuncs.com/?` + urlParams

         ctx.curl(emailSendUrl).then(res => {
            console.log(res.data.toString())
        })
         **/

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