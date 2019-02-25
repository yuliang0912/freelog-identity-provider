'use strict'

const lodash = require('lodash')
const Service = require('egg').Service
const {register, resetPassword} = require('../enum/auth-code-type-enum')
const {ApplicationError} = require('egg-freelog-base/error')


module.exports = class MessageService extends Service {

    constructor({app}) {
        super(...arguments)
        this.messageProvider = app.dal.messageProvider
    }

    /**
     * 发送注册短信
     * @param targetType 1:手机号  2:邮件
     */
    async sendMessage(authCodeType, toAddress, targetType) {

        const expireDate = new Date()
        expireDate.setMinutes(expireDate.getMinutes() - 1)

        const count = await this.messageProvider.count({
            authCodeType, toAddress, createDate: {$gt: expireDate}
        })
        if (count) {
            throw new ApplicationError(this.ctx.gettext('auth-code-send-limit-failed'))
        }

        const templateCode = this.getTemplateCode(authCodeType)
        const templateParams = {code: lodash.random(100000, 999999)}
        expireDate.setMinutes(expireDate.getMinutes() + 6)

        await this.messageProvider.create({
            toAddress, authCodeType,
            templateCode, templateParams, expireDate
        })

        if (targetType === 1) {
            return this.sendSmsMessage(toAddress, templateCode, templateParams)
        } else {
            return this.sendEmailMessage(toAddress, templateCode, templateParams)
        }
    }

    /**
     * 校验验证码是否正确
     * @param type
     * @param verificationCode
     * @returns {Promise<void>}
     */
    async verify(authCodeType, address, authCode) {
        return this.messageProvider.count({
            authCodeType, toAddress: address,
            'templateParams.code': authCode,
            expireDate: {$gt: new Date()}
        }).then(count => count > 0)
    }

    /**
     * 发送短信
     * @param toAddress
     * @param templateCode
     * @param templateParam
     * @returns {*}
     */
    sendSmsMessage(toAddress, templateCode, templateParam) {
        const {ctx} = this
        return ctx.helper.sendSms(toAddress, templateCode, templateParam)
    }

    /**
     * 发送Email信息
     * @returns {*}
     */
    sendEmailMessage(toAddress, templateCode, templateParam) {
        const {ctx} = this
        return ctx.helper.sendEmail(toAddress, '【飞致网络】验证码', null, `<h3>${this.getTemplateContent(templateCode, templateParam)}</h3>`)
    }

    /**
     * 获取模板编号
     * @param smsType
     * @returns {string}
     */
    getTemplateCode(smsType) {
        return smsType === register ? 'SMS_157980466' : smsType === resetPassword ? 'SMS_157980465' : ''
    }

    /**
     * 获取模板内容
     * @param templateCode
     * @param templateParam
     * @returns {string}
     */
    getTemplateContent(templateCode, templateParam) {
        switch (templateCode) {
            case 'SMS_157980466':
                return `验证码${templateParam.code}，您正在注册成为新用户，感谢您的支持！`
            case 'SMS_157980465':
                return `验证码${templateParam.code}，您正在尝试修改登录密码，请妥善保管账户信息。`
            default:
                return 'null'
        }
    }
}