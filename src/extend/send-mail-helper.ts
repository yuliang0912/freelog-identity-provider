import {config, provide, scope} from "midway";
import {createTransport} from 'nodemailer'

@provide()
@scope('Singleton')
export default class SendMailHelper {

    @config()
    smtpTransportConfig;

    /**
     * 发送email
     * @param address
     * @param subject
     * @param html
     */
    sendMail(address: string, html: string, subject: string = '【飞致网络】验证码') {
        const transporter = createTransport(this.smtpTransportConfig);
        const mailOptions = {
            from: `"飞致网络" <${this.smtpTransportConfig.auth.user}>`,
            to: address, subject, html
        };
        return transporter.sendMail(mailOptions)
    }


    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType: 'register' | 'resetPassword' | 'auditPass' | 'auditFail', code: string | number) {

        switch (authCodeType) {
            case "register":
                return this.getRegisterHtml(code);
            case "resetPassword":
                return this.getResetPasswordHtml(code)
            case "auditPass":
                return this.getBetaTestAuditPassNoticeHtml(code.toString());
            case "auditFail":
                return this.getBetaTestAuditFailedNoticeHtml(code.toString());
            default:
                return '';
        }
    }


    /**
     * 获取注册模板
     * @param code
     */
    getRegisterHtml(code: string | number): string {
        return `<!DOCTYPE html>
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
                </html>`
    }

    /**
     * 获取更改密码html发送内容
     * @param code
     */
    getResetPasswordHtml(code: string | number): string {
        return `验证码${code}，您正在尝试修改登录密码，请妥善保管账户信息。`
    }

    /**
     * 内测资格审核通过
     * @param username
     */
    getBetaTestAuditPassNoticeHtml(username: string) {
        return `<!DOCTYPE html>
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
                </html>`
    }

    /**
     * 内测资格审核失败
     * @param username
     */
    getBetaTestAuditFailedNoticeHtml(username: string) {
        return `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>Hi ${username}，</div><br>
                            <div>感谢您的支持！很遗憾，您的内测申请未通过。重新提交申请，请点击<a style="color: inherit;" href="https://console.freelog.com/alpha-test/apply">https://console.freelog.com/alpha-test/apply</a>。</div><br>
                            <div>您真诚的，<br>Freelog团队</div>
                        </div>
                    </body>
                </html>`
    }
}
