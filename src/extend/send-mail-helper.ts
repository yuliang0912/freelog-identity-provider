import {config, provide, scope} from 'midway';
import {createTransport} from 'nodemailer';
import {AuthCodeTypeEnum} from '../enum';

@provide()
@scope('Singleton')
export default class SendMailHelper {

    @config()
    smtpTransportConfig;

    htmlTemplateContentMap: Map<string, (...args) => string>;

    constructor() {
        this.htmlTemplateContentMap = this.getHtmlTemplateContents();
    }

    /**
     * 发送email
     * @param address
     * @param subject
     * @param html
     */
    sendMail(address: string, html: string, subject: string = '【飞致网络】验证码') {
        // 如果发送失败,请检查服务器IP地址是否在白名单内.
        const transporter = createTransport(this.smtpTransportConfig);
        const mailOptions = {
            from: `"飞致网络" <${this.smtpTransportConfig.auth.user}>`, to: address, subject, html
        };
        return transporter.sendMail(mailOptions);
    }


    /**
     * 获取模板
     * @param authCodeType
     * @param code
     */
    getTemplate(authCodeType: string, code: string | number) {

        if (!this.htmlTemplateContentMap.has(authCodeType)) {
            return '';
        }

        return this.htmlTemplateContentMap.get(authCodeType).call(null, code);
    }


    /**
     * 获取模板内容
     */
    getHtmlTemplateContents(): Map<string, (...args) => string> {

        const htmlTemplateContentMap = new Map<string, (...args) => string>();

        htmlTemplateContentMap.set(AuthCodeTypeEnum.Register, (code: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>您好！</div><br>
                            <div>感谢注册FreeLog平台，请回填如下验证码：</div><br>
                            <div style="font-size: 18px; font-weight: 600;">${code}</div><br>
                            <div>如果你有任何问题请联系：<a style="color: inherit;" href="mailto:support@freelog.com">support@freelog.com</a></div><br>
                            <div>FreeLog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.AuditPass, (username: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>Hi ${username}，</div><br>
                            <div>感谢您的支持！您的内测申请已通过。立即体验内测版本，请点击<a style="color: inherit;" href="https://console.freelog.com">https://console.freelog.com/</a>。</div><br>
                            <div>使用中有任何问题或建议，欢迎您到我们的官方论坛<a style="color: inherit;" href="https://forum.freelog.com">https://forum.freelog.com</a>留言！</div><br>
                            <div>您真诚的，<br>Freelog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.AuditFail, (username: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>Hi ${username}，</div><br>
                            <div>感谢您的支持！很遗憾，您的内测申请未通过。重新提交申请，请点击<a style="color: inherit;" href="https://console.freelog.com/invitation">https://console.freelog.com/invitation</a>。</div><br>
                            <div>您真诚的，<br>Freelog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.ResetPassword, (code: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>您好！</div><br>
                            <div>您正在尝试修改登录密码，请回填如下验证码：</div><br>
                            <div style="font-size: 18px; font-weight: 600;">${code}</div><br>
                            <div>如果你有任何问题请联系：<a style="color: inherit;" href="mailto:support@freelog.com">support@freelog.com</a></div><br>
                            <div>FreeLog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.UpdateMobileOrEmail, (code: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>【Freelog】您正在更改登录邮箱，请回填以下验证码: </div><br>
                            <div style="font-size: 18px; font-weight: 600;">${code}</div><br>
                            <div>如果你有任何问题请联系：<a style="color: inherit;" href="mailto:support@freelog.com">support@freelog.com</a></div><br>
                            <div>FreeLog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.ActivateTransactionAccount, (code: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>您好！</div><br>
                            <div>您正在进行账户激活操作，请回填如下验证码：</div><br>
                            <div style="font-size: 18px; font-weight: 600;">${code}</div><br>
                            <div>如果你有任何问题请联系：<a style="color: inherit;" href="mailto:support@freelog.com">support@freelog.com</a></div><br>
                            <div>FreeLog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set(AuthCodeTypeEnum.UpdateTransactionAccountPwd, (code: string) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>您好！</div><br>
                            <div>您正在尝试修改支付密码，请回填如下验证码：</div><br>
                            <div style="font-size: 18px; font-weight: 600;">${code}</div><br>
                            <div>如果你有任何问题请联系：<a style="color: inherit;" href="mailto:support@freelog.com">support@freelog.com</a></div><br>
                            <div>FreeLog团队</div>
                        </div>
                    </body>
                </html>`);

        return htmlTemplateContentMap;
    }
}
