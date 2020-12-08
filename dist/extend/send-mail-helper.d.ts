export default class SendMailHelper {
    smtpTransportConfig: any;
    /**
     * 发送email
     * @param address
     * @param subject
     * @param html
     */
    sendMail(address: string, html: string, subject?: string): any;
    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType: 'register' | 'resetPassword' | 'auditPass' | 'auditFail', code: string | number): string;
    /**
     * 获取注册模板
     * @param code
     */
    getRegisterHtml(code: string | number): string;
    /**
     * 获取更改密码html发送内容
     * @param code
     */
    getResetPasswordHtml(code: string | number): string;
    /**
     * 内测资格审核通过
     * @param username
     */
    getBetaTestAuditPassNoticeHtml(username: string): string;
    /**
     * 内测资格审核失败
     * @param username
     */
    getBetaTestAuditFailedNoticeHtml(username: string): string;
}
