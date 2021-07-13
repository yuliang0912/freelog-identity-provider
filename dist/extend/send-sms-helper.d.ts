export default class SendSmsHelper {
    aliYunSecret: any;
    _smsClient: any;
    templateCodeMap: Map<string, string>;
    constructor();
    get smsClient(): any;
    /**
     * 发送短信验证码
     * @param phoneNumbers
     * @param templateCode
     * @param templateParam
     * @param signName
     */
    sendSMS(phoneNumbers: string, templateCode: string, templateParam: object, signName?: string): any;
    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType: string): string;
}
