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
    aliYunSecret;
    _smsClient;
    templateCodeMap = new Map();
    constructor() {
        this.templateCodeMap = new Map([
            ['register', 'SMS_157980466'],
            ['resetPassword', 'SMS_157980465'],
            ['auditPass', 'SMS_182385369'],
            ['auditFail', 'SMS_181859961'],
            ['activateTransactionAccount', 'SMS_217427807'],
            ['updateTransactionAccountPwd', 'SMS_218547345']
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
    midway_1.config(),
    __metadata("design:type", Object)
], SendSmsHelper.prototype, "aliYunSecret", void 0);
SendSmsHelper = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton'),
    __metadata("design:paramtypes", [])
], SendSmsHelper);
exports.default = SendSmsHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1zbXMtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4dGVuZC9zZW5kLXNtcy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEM7QUFDOUMsdURBQThDO0FBRTlDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBSS9DLElBQXFCLGFBQWEsR0FBbEMsTUFBcUIsYUFBYTtJQUc5QixZQUFZLENBQUM7SUFDYixVQUFVLENBQU07SUFFaEIsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBRTVDO1FBQ0ksSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsQ0FBaUI7WUFDM0MsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDO1lBQzdCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQztZQUNsQyxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUM7WUFDOUIsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDO1lBQzlCLENBQUMsNEJBQTRCLEVBQUUsZUFBZSxDQUFDO1lBQy9DLENBQUMsNkJBQTZCLEVBQUUsZUFBZSxDQUFDO1NBQ25ELENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsQixNQUFNLEVBQUMsV0FBVyxFQUFFLGVBQWUsRUFBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFNBQVMsQ0FBQztnQkFDNUIsV0FBVyxFQUFFLCtCQUFZLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDbkQsZUFBZSxFQUFFLCtCQUFZLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQzthQUM5RCxDQUFDLENBQUM7U0FDTjtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsT0FBTyxDQUFDLFlBQW9CLEVBQUUsWUFBb0IsRUFBRSxhQUFxQixFQUFFLFFBQVEsR0FBRyxNQUFNO1FBQ3hGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1NBQy9DLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsWUFBb0I7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FDSixDQUFBO0FBckRHO0lBREMsZUFBTSxFQUFFOzttREFDSTtBQUhJLGFBQWE7SUFGakMsZ0JBQU8sRUFBRTtJQUNULGNBQUssQ0FBQyxXQUFXLENBQUM7O0dBQ0UsYUFBYSxDQXdEakM7a0JBeERvQixhQUFhIn0=