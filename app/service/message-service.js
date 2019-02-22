'use strict'

const lodash = require('lodash')
const Service = require('egg').Service
const authCodeType = require('../enum/auth-code-type-enum')


module.exports = class MessageService extends Service {

    constructor({app}) {
        super(...arguments)
        this.messageProvider = app.dal.messageProvider
    }

    /**
     * 发送注册短信
     * @param targetType 1:手机号  2:邮件
     */
    async sendRegisterMessage(toAddress, targetType) {

        const templateCode = this.getTemplateCode('register')
        const templateParams = {code: lodash.random(100000, 999999)}
        const expireDate = new Date()
        expireDate.setMinutes(expireDate.getMinutes() + 5)

        await this.messageProvider.create({
            toAddress, authCodeType: authCodeType.register,
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
        return ctx.helper.sendEmail(toAddress, '【飞致网络】注册验证码', null, `<h3>${this.getTemplateContent(templateCode, templateParam)}</h3>`)
    }

    /**
     * 获取模板编号
     * @param smsType
     * @returns {string}
     */
    getTemplateCode(smsType) {
        return smsType === 'register' ? 'SMS_158050266' : ''
    }

    /**
     * 获取模板内容
     * @param templateCode
     * @param templateParam
     * @returns {string}
     */
    getTemplateContent(templateCode, templateParam) {
        switch (templateCode) {
            case 'SMS_158050266':
                return `您的验证码为：${templateParam.code}，您正在进行账号注册操作，如非本人操作，请忽略本邮件！`
            default:
                return 'null'
        }
    }
}