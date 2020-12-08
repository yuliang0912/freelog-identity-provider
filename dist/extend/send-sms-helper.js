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
const egg_freelog_base_1 = require("egg-freelog-base");
const SMSClient = require('@alicloud/sms-sdk');
let SendSmsHelper = class SendSmsHelper {
    get smsClient() {
        if (!this._smsClient) {
            const { accessKeyId, accessKeySecret } = this.aliYunSecret;
            this._smsClient = new SMSClient({
                accessKeyId: egg_freelog_base_1.CryptoHelper.base64Decode(accessKeyId),
                secretAccessKey: egg_freelog_base_1.CryptoHelper.base64Decode(accessKeySecret)
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
    sendSMS(phoneNumbers, templateCode, templateParam, signName = '飞致网络') {
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
    getTemplate(authCodeType) {
        switch (authCodeType) {
            case "register":
                return this.getRegisterTemplateCode();
            case "resetPassword":
                return this.getResetPasswordTemplateCode();
            case "auditPass":
                return this.getBetaTestAuditPassNoticeTemplateCode();
            case "auditFail":
                return this.getBetaTestAuditFailedNoticeTemplateCode();
            default:
                return '';
        }
    }
    /**
     * 获取注册用户模板编码
     */
    getRegisterTemplateCode() {
        return 'SMS_157980466';
    }
    /**
     * 重置密码模板编码
     */
    getResetPasswordTemplateCode() {
        return 'SMS_157980465';
    }
    getBetaTestAuditPassNoticeTemplateCode() {
        return 'SMS_182385369';
    }
    getBetaTestAuditFailedNoticeTemplateCode() {
        return 'SMS_181859961';
    }
};
__decorate([
    midway_1.config(),
    __metadata("design:type", Object)
], SendSmsHelper.prototype, "aliYunSecret", void 0);
SendSmsHelper = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton')
], SendSmsHelper);
exports.default = SendSmsHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1zbXMtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVuZC9zZW5kLXNtcy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEM7QUFDOUMsdURBQTZDO0FBRTdDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBSTlDLElBQXFCLGFBQWEsR0FBbEMsTUFBcUIsYUFBYTtJQU05QixJQUFJLFNBQVM7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQixNQUFNLEVBQUMsV0FBVyxFQUFFLGVBQWUsRUFBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFNBQVMsQ0FBQztnQkFDNUIsV0FBVyxFQUFFLCtCQUFZLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDbkQsZUFBZSxFQUFFLCtCQUFZLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQzthQUM5RCxDQUFDLENBQUM7U0FDTjtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsT0FBTyxDQUFDLFlBQW9CLEVBQUUsWUFBb0IsRUFBRSxhQUFxQixFQUFFLFFBQVEsR0FBRyxNQUFNO1FBQ3hGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1NBQy9DLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsWUFBc0U7UUFDOUUsUUFBUSxZQUFZLEVBQUU7WUFDbEIsS0FBSyxVQUFVO2dCQUNYLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDMUMsS0FBSyxlQUFlO2dCQUNoQixPQUFPLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFBO1lBQzlDLEtBQUssV0FBVztnQkFDWixPQUFPLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDO1lBQ3pELEtBQUssV0FBVztnQkFDWixPQUFPLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxDQUFDO1lBQzNEO2dCQUNJLE9BQU8sRUFBRSxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdUJBQXVCO1FBQ25CLE9BQU8sZUFBZSxDQUFBO0lBQzFCLENBQUM7SUFFRDs7T0FFRztJQUNILDRCQUE0QjtRQUN4QixPQUFPLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBRUQsc0NBQXNDO1FBQ2xDLE9BQU8sZUFBZSxDQUFBO0lBQzFCLENBQUM7SUFFRCx3Q0FBd0M7UUFDcEMsT0FBTyxlQUFlLENBQUE7SUFDMUIsQ0FBQztDQUNKLENBQUE7QUF0RUc7SUFEQyxlQUFNLEVBQUU7O21EQUNJO0FBSEksYUFBYTtJQUZqQyxnQkFBTyxFQUFFO0lBQ1QsY0FBSyxDQUFDLFdBQVcsQ0FBQztHQUNFLGFBQWEsQ0F5RWpDO2tCQXpFb0IsYUFBYSJ9