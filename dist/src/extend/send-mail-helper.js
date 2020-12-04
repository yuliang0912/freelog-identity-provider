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
    /**
     * 发送email
     * @param address
     * @param subject
     * @param html
     */
    sendMail(address, html, subject = '【飞致网络】验证码') {
        const transporter = nodemailer_1.createTransport(this.smtpTransportConfig);
        const mailOptions = {
            from: `"飞致网络" <${this.smtpTransportConfig.auth.user}>`,
            to: address, subject, html
        };
        return transporter.sendMail(mailOptions);
    }
    /**
     * 获取模板
     * @param authCodeType
     */
    getTemplate(authCodeType, code) {
        return authCodeType === 'register' ? this.getRegisterHtml(code) : this.getResetPasswordHtml(code);
    }
    /**
     * 获取注册模板
     * @param code
     */
    getRegisterHtml(code) {
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
                </html>`;
    }
    /**
     * 获取更改密码html发送内容
     * @param code
     */
    getResetPasswordHtml(code) {
        return `验证码${code}，您正在尝试修改登录密码，请妥善保管账户信息。`;
    }
};
__decorate([
    midway_1.config(),
    __metadata("design:type", Object)
], SendMailHelper.prototype, "smtpTransportConfig", void 0);
SendMailHelper = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton')
], SendMailHelper);
exports.default = SendMailHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1tYWlsLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHRlbmQvc2VuZC1tYWlsLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5QywyQ0FBMEM7QUFJMUMsSUFBcUIsY0FBYyxHQUFuQyxNQUFxQixjQUFjO0lBSy9COzs7OztPQUtHO0lBQ0gsUUFBUSxDQUFDLE9BQWUsRUFBRSxJQUFZLEVBQUUsVUFBa0IsV0FBVztRQUNqRSxNQUFNLFdBQVcsR0FBRyw0QkFBZSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlELE1BQU0sV0FBVyxHQUFHO1lBQ2hCLElBQUksRUFBRSxXQUFXLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ3RELEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUk7U0FDN0IsQ0FBQztRQUNGLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLFlBQTBDLEVBQUUsSUFBcUI7UUFDekUsT0FBTyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEcsQ0FBQztJQUdEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxJQUFxQjtRQUNqQyxPQUFPOzs7Ozs7OzhFQU8rRCxJQUFJOzs7Ozt3QkFLMUQsQ0FBQTtJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsb0JBQW9CLENBQUMsSUFBcUI7UUFDdEMsT0FBTyxNQUFNLElBQUkseUJBQXlCLENBQUE7SUFDOUMsQ0FBQztDQUNKLENBQUE7QUF0REc7SUFEQyxlQUFNLEVBQUU7OzJEQUNXO0FBSEgsY0FBYztJQUZsQyxnQkFBTyxFQUFFO0lBQ1QsY0FBSyxDQUFDLFdBQVcsQ0FBQztHQUNFLGNBQWMsQ0F5RGxDO2tCQXpEb0IsY0FBYyJ9