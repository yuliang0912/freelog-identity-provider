'use strict'

const SMSClient = require('@alicloud/sms-sdk')

module.exports = class SmsHelper {

    constructor(app) {
        const {accessKeyId, accessKeySecret} = app.config.uploadConfig.aliOss
        this.smsClient = new SMSClient({accessKeyId, secretAccessKey: accessKeySecret})
    }

    /**
     * 发送短信
     * @param phoneNumbers
     * @param templateCode
     * @param templateParam
     * @param signName
     * @returns {Promise<*>}
     */
    async sendSMS(phoneNumbers, templateCode, templateParam, signName = '飞致网络') {
        return this.smsClient.sendSMS({
            SignName: signName,
            PhoneNumbers: phoneNumbers,
            TemplateCode: templateCode,
            TemplateParam: JSON.stringify(templateParam)
        })
    }
}