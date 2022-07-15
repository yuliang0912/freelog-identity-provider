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
const enum_1 = require("../enum");
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.Register, (code) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.AuditPass, (username) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.AuditFail, (username) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.ResetPassword, (code) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.UpdateMobileOrEmail, (code) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.ActivateTransactionAccount, (code) => `<!DOCTYPE html>
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
        htmlTemplateContentMap.set(enum_1.AuthCodeTypeEnum.UpdateTransactionAccountPwd, (code) => `<!DOCTYPE html>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1tYWlsLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlbmQvc2VuZC1tYWlsLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5QywyQ0FBMkM7QUFDM0Msa0NBQXlDO0FBSXpDLElBQXFCLGNBQWMsR0FBbkMsTUFBcUIsY0FBYztJQUcvQixtQkFBbUIsQ0FBQztJQUVwQixzQkFBc0IsQ0FBbUM7SUFFekQ7UUFDSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsUUFBUSxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsVUFBa0IsV0FBVztRQUNqRSw0QkFBNEI7UUFDNUIsTUFBTSxXQUFXLEdBQUcsSUFBQSw0QkFBZSxFQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlELE1BQU0sV0FBVyxHQUFHO1lBQ2hCLElBQUksRUFBRSxXQUFXLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSTtTQUNyRixDQUFDO1FBQ0YsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsV0FBVyxDQUFDLFlBQW9CLEVBQUUsSUFBcUI7UUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDaEQsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFHRDs7T0FFRztJQUNILHVCQUF1QjtRQUVuQixNQUFNLHNCQUFzQixHQUFHLElBQUksR0FBRyxFQUErQixDQUFDO1FBRXRFLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDOzs7Ozs7OzhFQU9GLElBQUk7Ozs7O3dCQUsxRCxDQUFDLENBQUM7UUFDbEIsc0JBQXNCLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUFDOzs7Ozs7O3NDQU8vQyxRQUFROzs7Ozs7d0JBTXRCLENBQUMsQ0FBQztRQUNsQixzQkFBc0IsQ0FBQyxHQUFHLENBQUMsdUJBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQUM7Ozs7O3NDQUsvQyxRQUFROzs7Ozt3QkFLdEIsQ0FBQyxDQUFDO1FBQ2xCLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyx1QkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDOzs7Ozs7OzhFQU9QLElBQUk7Ozs7O3dCQUsxRCxDQUFDLENBQUM7UUFDbEIsc0JBQXNCLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLG1CQUFtQixFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQzs7Ozs7OzhFQU1iLElBQUk7Ozs7O3dCQUsxRCxDQUFDLENBQUM7UUFDbEIsc0JBQXNCLENBQUMsR0FBRyxDQUFDLHVCQUFnQixDQUFDLDBCQUEwQixFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQzs7Ozs7Ozs4RUFPcEIsSUFBSTs7Ozs7d0JBSzFELENBQUMsQ0FBQztRQUNsQixzQkFBc0IsQ0FBQyxHQUFHLENBQUMsdUJBQWdCLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDOzs7Ozs7OzhFQU9yQixJQUFJOzs7Ozt3QkFLMUQsQ0FBQyxDQUFDO1FBRWxCLE9BQU8sc0JBQXNCLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUE7QUExSUc7SUFEQyxJQUFBLGVBQU0sR0FBRTs7MkRBQ1c7QUFISCxjQUFjO0lBRmxDLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsY0FBSyxFQUFDLFdBQVcsQ0FBQzs7R0FDRSxjQUFjLENBNklsQztrQkE3SW9CLGNBQWMifQ==