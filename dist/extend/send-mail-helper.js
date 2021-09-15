"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const nodemailer_1 = require("nodemailer");
let SendMailHelper = class SendMailHelper {
    smtpTransportConfig;
    htmlTemplateContentMap;
    constructor() {
        this.htmlTemplateContentMap = this.getHtmlTemplateContents();
    }
    /**
     * 发送email
     * @param address
     * @param subject
     * @param html
     */
    sendMail(address, html, subject = '【飞致网络】验证码') {
        // 如果发送失败,请检查服务器IP地址是否在白名单内.
        const transporter = (0, nodemailer_1.createTransport)(this.smtpTransportConfig);
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
    getTemplate(authCodeType, code) {
        if (!this.htmlTemplateContentMap.has(authCodeType)) {
            return '';
        }
        return this.htmlTemplateContentMap.get(authCodeType).call(null, code);
    }
    /**
     * 获取模板内容
     */
    getHtmlTemplateContents() {
        const htmlTemplateContentMap = new Map();
        htmlTemplateContentMap.set('resetPassword', (code) => `验证码${code}，您正在尝试修改登录密码，请妥善保管账户信息。`);
        htmlTemplateContentMap.set('activateTransactionAccount', (code) => `验证码为：${code}，您正在进行账户激活操作，如非本人操作，请忽略本短信！`);
        htmlTemplateContentMap.set('updateTransactionAccountPwd', (code) => `验证码为：${code}，您正在进行修改账户交易密码操作，如非本人操作，请忽略本短信！`);
        htmlTemplateContentMap.set('register', (code) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set('auditPass', (username) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set('auditFail', (username) => `<!DOCTYPE html>
                <html lang="en">
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <div style="font-size: 14px;">
                            <div>Hi ${username}，</div><br>
                            <div>感谢您的支持！很遗憾，您的内测申请未通过。重新提交申请，请点击<a style="color: inherit;" href="https://console.freelog.com/alpha-test/apply">https://console.freelog.com/alpha-test/apply</a>。</div><br>
                            <div>您真诚的，<br>Freelog团队</div>
                        </div>
                    </body>
                </html>`);
        htmlTemplateContentMap.set('updateMobileOrEmail', (code) => `<!DOCTYPE html>
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
        return htmlTemplateContentMap;
    }
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], SendMailHelper.prototype, "smtpTransportConfig", void 0);
SendMailHelper = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __metadata("design:paramtypes", [])
], SendMailHelper);
exports.default = SendMailHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1tYWlsLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlbmQvc2VuZC1tYWlsLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5QywyQ0FBMkM7QUFJM0MsSUFBcUIsY0FBYyxHQUFuQyxNQUFxQixjQUFjO0lBRy9CLG1CQUFtQixDQUFDO0lBRXBCLHNCQUFzQixDQUFtQztJQUV6RDtRQUNJLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxRQUFRLENBQUMsT0FBZSxFQUFFLElBQVksRUFBRSxVQUFrQixXQUFXO1FBQ2pFLDRCQUE0QjtRQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFBLDRCQUFlLEVBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDOUQsTUFBTSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLFdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJO1NBQ3JGLENBQUM7UUFDRixPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsWUFBb0IsRUFBRSxJQUFxQjtRQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNoRCxPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUdEOztPQUVHO0lBQ0gsdUJBQXVCO1FBRW5CLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQStCLENBQUM7UUFFdEUsc0JBQXNCLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsTUFBTSxJQUFJLHlCQUF5QixDQUFDLENBQUM7UUFDbkcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxRQUFRLElBQUksNkJBQTZCLENBQUMsQ0FBQztRQUN0SCxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxpQ0FBaUMsQ0FBQyxDQUFDO1FBRTNILHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDOzs7Ozs7OzhFQU9hLElBQUk7Ozs7O3dCQUsxRCxDQUFDLENBQUM7UUFDbEIsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUFDOzs7Ozs7O3NDQU9oQyxRQUFROzs7Ozs7d0JBTXRCLENBQUMsQ0FBQztRQUNsQixzQkFBc0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQUM7Ozs7O3NDQUtoQyxRQUFROzs7Ozt3QkFLdEIsQ0FBQyxDQUFDO1FBQ2xCLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFLENBQUM7Ozs7Ozs4RUFNRSxJQUFJOzs7Ozt3QkFLMUQsQ0FBQyxDQUFDO1FBRWxCLE9BQU8sc0JBQXNCLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUE7QUF2R0c7SUFEQyxJQUFBLGVBQU0sR0FBRTs7MkRBQ1c7QUFISCxjQUFjO0lBRmxDLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsY0FBSyxFQUFDLFdBQVcsQ0FBQzs7R0FDRSxjQUFjLENBMEdsQztrQkExR29CLGNBQWMifQ==