import {config, provide, scope} from 'midway';
import {CryptoHelper} from 'egg-freelog-base';
import {AuthCodeTypeEnum} from '../enum';

const SMSClient = require('@alicloud/sms-sdk');

@provide()
@scope('Singleton')
export default class SendSmsHelper {

    @config()
    aliYunSecret;
    _smsClient: any;

    templateCodeMap = new Map<string, string>();

    constructor() {
        this.templateCodeMap = new Map<string, string>([
            [AuthCodeTypeEnum.Register, 'SMS_157980466'],
            [AuthCodeTypeEnum.ResetPassword, 'SMS_157980465'],
            [AuthCodeTypeEnum.AuditPass, 'SMS_182385369'],
            [AuthCodeTypeEnum.AuditFail, 'SMS_181859961'],
            [AuthCodeTypeEnum.ActivateTransactionAccount, 'SMS_217427807'],
            [AuthCodeTypeEnum.UpdateTransactionAccountPwd, 'SMS_218547345'],
            [AuthCodeTypeEnum.UpdateMobileOrEmail, 'SMS_224340686']
        ]);
    }

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
        });
    }

    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType: AuthCodeTypeEnum) {
        if (!this.templateCodeMap.has(authCodeType)) {
            return '';
        }
        return this.templateCodeMap.get(authCodeType);
    }
}
