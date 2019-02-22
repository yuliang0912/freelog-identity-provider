/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const headImageFileCheck = new (require('./head-image-check'))
const generateHeadImage = new (require('./generate-head-image'))
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')
const SmsHelper = require('./sms-helper')
const EmailHelper = require('./email-helper')
let smsHelper = null, emailHelper = null

module.exports = {

    /**
     * 生成加密密码
     */
    generatePassword(salt, password) {

        const text = `identity@freelog.com#${password}`

        return crypto.hmacSha1(crypto.base64Encode(text), salt)
    },

    /**
     * 生成头像
     */
    generateHeadImage(key, schemeId) {
        return generateHeadImage.generateHeadImage(key, schemeId)
    },

    /**
     * 检查头像文件
     */
    checkHeadImage(fileStream) {
        const {ctx} = this
        return headImageFileCheck.check(ctx, fileStream)
    },

    /**
     * 发送短信
     * @returns {Promise<*>|*}
     */
    sendSms(phoneNumbers, templateCode, templateParam) {
        if (!smsHelper) {
            smsHelper = new SmsHelper(this.app)
        }
        return smsHelper.sendSMS(...arguments)
    },

    /**
     * 发送邮件
     * @returns {*|Promise<void>}
     */
    sendEmail(address, subject, text, html) {
        if (!emailHelper) {
            emailHelper = new EmailHelper(this.app)
        }
        return emailHelper.sendEmail(address, subject, text, html)
    }
}