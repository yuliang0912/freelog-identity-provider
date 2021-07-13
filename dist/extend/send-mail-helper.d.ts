export default class SendMailHelper {
    smtpTransportConfig: any;
    htmlTemplateContentMap: Map<string, (...args: any[]) => string>;
    constructor();
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
     * @param code
     */
    getTemplate(authCodeType: string, code: string | number): any;
    /**
     * 获取模板内容
     */
    getHtmlTemplateContents(): Map<string, (...args: any[]) => string>;
}
