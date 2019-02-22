'use strict'

const Controller = require('egg').Controller;

module.exports = class MessageController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.userProvider = app.dal.userProvider
    }

    /**
     * 注册短信或邮件
     * @param ctx
     */
    async register(ctx) {

        const mobileOrEmailRegex = /^(1[34578]\d{9})|([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4})$/
        const loginName = ctx.checkBody('loginName').exist().match(mobileOrEmailRegex, ctx.gettext('login-name-format-validate-failed')).value
        const captchaInput = ctx.checkBody('captchaInput').exist().notEmpty().value
        ctx.validate(false)

        const isVerify = ctx.service.captchaService.verify('register', captchaInput)
        if (!isVerify) {
            ctx.error({msg: ctx.gettext('auth-code-validate-failed')})
        }

        const loginNameType = ctx.helper.commonRegex.mobile86.test(loginName) ? 1 : 2
        if (loginNameType === 1) {
            await this.userProvider.count({mobile: loginName}).then(count => {
                count && ctx.error({msg: ctx.gettext('mobile-register-validate-failed')})
            })
        }
        if (loginNameType === 2) {
            await this.userProvider.count({email: loginName}).then(count => {
                count && ctx.error({msg: ctx.gettext('email-register-validate-failed')})
            })
        }

        await ctx.service.messageService.sendRegisterMessage(loginName, loginNameType).then(data => ctx.success(true))
    }

    /**
     * 核验验证码是否输入正确
     * @param ctx
     * @returns {Promise<void>}
     */
    async verify(ctx) {

        const authCodeType = ctx.checkQuery('authCodeType').exist().in(['register']).value
        const authCode = ctx.checkQuery('authCode').exist().toInt().value
        const mobileOrEmailRegex = /^(1[34578]\d{9})|([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4})$/
        const address = ctx.checkQuery('address').exist().match(mobileOrEmailRegex, ctx.gettext('login-name-format-validate-failed')).value

        ctx.validate(false)

        const isVerify = await ctx.service.messageService.verify(authCodeType, address, authCode)

        ctx.success(isVerify)
    }
}