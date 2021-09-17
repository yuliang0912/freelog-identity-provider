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
const enum_1 = require("../enum");
const SMSClient = require('@alicloud/sms-sdk');
let SendSmsHelper = class SendSmsHelper {
    aliYunSecret;
    _smsClient;
    templateCodeMap = new Map();
    constructor() {
        this.templateCodeMap = new Map([
            [enum_1.AuthCodeTypeEnum.Register, 'SMS_157980466'],
            [enum_1.AuthCodeTypeEnum.ResetPassword, 'SMS_157980465'],
            [enum_1.AuthCodeTypeEnum.AuditPass, 'SMS_182385369'],
            [enum_1.AuthCodeTypeEnum.AuditFail, 'SMS_181859961'],
            [enum_1.AuthCodeTypeEnum.ActivateTransactionAccount, 'SMS_217427807'],
            [enum_1.AuthCodeTypeEnum.UpdateTransactionAccountPwd, 'SMS_218547345'],
            [enum_1.AuthCodeTypeEnum.UpdateMobileOrEmail, 'SMS_224340686']
        ]);
    }
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
        if (!this.templateCodeMap.has(authCodeType)) {
            return '';
        }
        return this.templateCodeMap.get(authCodeType);
    }
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], SendSmsHelper.prototype, "aliYunSecret", void 0);
SendSmsHelper = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __metadata("design:paramtypes", [])
], SendSmsHelper);
exports.default = SendSmsHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1zbXMtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVuZC9zZW5kLXNtcy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEM7QUFDOUMsdURBQThDO0FBQzlDLGtDQUF5QztBQUV6QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUkvQyxJQUFxQixhQUFhLEdBQWxDLE1BQXFCLGFBQWE7SUFHOUIsWUFBWSxDQUFDO0lBQ2IsVUFBVSxDQUFNO0lBRWhCLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUU1QztRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLENBQWlCO1lBQzNDLENBQUMsdUJBQWdCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQztZQUM1QyxDQUFDLHVCQUFnQixDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUM7WUFDakQsQ0FBQyx1QkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO1lBQzdDLENBQUMsdUJBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztZQUM3QyxDQUFDLHVCQUFnQixDQUFDLDBCQUEwQixFQUFFLGVBQWUsQ0FBQztZQUM5RCxDQUFDLHVCQUFnQixDQUFDLDJCQUEyQixFQUFFLGVBQWUsQ0FBQztZQUMvRCxDQUFDLHVCQUFnQixDQUFDLG1CQUFtQixFQUFFLGVBQWUsQ0FBQztTQUMxRCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbEIsTUFBTSxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUM7Z0JBQzVCLFdBQVcsRUFBRSwrQkFBWSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7Z0JBQ25ELGVBQWUsRUFBRSwrQkFBWSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7YUFDOUQsQ0FBQyxDQUFDO1NBQ047UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE9BQU8sQ0FBQyxZQUFvQixFQUFFLFlBQW9CLEVBQUUsYUFBcUIsRUFBRSxRQUFRLEdBQUcsTUFBTTtRQUN4RixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQzFCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFlBQVksRUFBRSxZQUFZO1lBQzFCLFlBQVksRUFBRSxZQUFZO1lBQzFCLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztTQUMvQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLFlBQThCO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN6QyxPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0osQ0FBQTtBQXRERztJQURDLElBQUEsZUFBTSxHQUFFOzttREFDSTtBQUhJLGFBQWE7SUFGakMsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxjQUFLLEVBQUMsV0FBVyxDQUFDOztHQUNFLGFBQWEsQ0F5RGpDO2tCQXpEb0IsYUFBYSJ9