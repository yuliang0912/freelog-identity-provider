export default class SendSmsHelper {
    aliYunSecret: any;
    _smsClient: any;
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
    getTemplate(authCodeType: 'register' | 'resetPassword'): string;
    /**
     * 获取注册用户模板编码
     */
    getRegisterTemplateCode(): string;
    /**
     * 重置密码模板编码
     */
    getResetPasswordTemplateCode(): string;
}
