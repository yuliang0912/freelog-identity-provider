import {config, provide, scope} from "midway";
import {CryptoHelper} from 'egg-freelog-base'

const SMSClient = require('@alicloud/sms-sdk')

@provide()
@scope('Singleton')
export default class SendSmsHelper {

    @config()
    aliYunSecret;
    _smsClient: any;

    get smsClient() {
        if (!this._smsClient) {
            const {accessKeyId, accessKeySecret} = this.aliYunSecret;
            this._smsClient = new SMSClient({
                accessKeyId: CryptoHelper.base64Decode(accessKeyId),
                secretAccessKey: CryptoHelper.base64Decode(accessKeySecret)
            });
        }
        return this._smsClient;
    }

    /**
     * 发送短信验证码
     * @param phoneNumbers
     * @param templateCode
     * @param templateParam
     * @param signName
     */
    sendSMS(phoneNumbers: string, templateCode: string, templateParam: object, signName = '飞致网络') {
        return this.smsClient.sendSMS({
            SignName: signName,
            PhoneNumbers: phoneNumbers,
            TemplateCode: templateCode,
            TemplateParam: JSON.stringify(templateParam)
        })
    }

    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType: 'register' | 'resetPassword') {
        return authCodeType === 'register' ? this.getRegisterTemplateCode() : this.getResetPasswordTemplateCode();
    }

    /**
     * 获取注册用户模板编码
     */
    getRegisterTemplateCode() {
        return 'SMS_157980466'
    }

    /**
     * 重置密码模板编码
     */
    getResetPasswordTemplateCode() {
        return 'SMS_157980465';
    }
}
