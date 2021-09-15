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
exports.MessageService = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const send_mail_helper_1 = require("../../extend/send-mail-helper");
const send_sms_helper_1 = require("../../extend/send-sms-helper");
const egg_freelog_base_1 = require("egg-freelog-base");
let MessageService = class MessageService {
    ctx;
    sendSmsHelper;
    sendMailHelper;
    messageProvider;
    /**
     * 发送注册短信
     * @param authCodeType
     * @param toAddress 手机或email
     */
    async sendMessage(authCodeType, toAddress) {
        const expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() - 1);
        const count = await this.messageProvider.count({
            authCodeType, toAddress, createDate: { $gt: expireDate }
        });
        if (count) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('auth-code-send-limit-failed'));
        }
        const templateParams = { code: (0, lodash_1.random)(100000, 999999) };
        expireDate.setMinutes(expireDate.getMinutes() + 6);
        await this.messageProvider.create({
            toAddress, authCodeType, templateParams, expireDate
        });
        const isMobile = egg_freelog_base_1.CommonRegex.mobile86.test(toAddress);
        if (isMobile) {
            return this.sendSmsHelper.sendSMS(toAddress, this.sendSmsHelper.getTemplate(authCodeType), templateParams);
        }
        else {
            return this.sendMailHelper.sendMail(toAddress, this.sendMailHelper.getTemplate(authCodeType, templateParams.code));
        }
    }
    /**
     * 校验验证码是否正确
     * @param authCodeType
     * @param address
     * @param authCode
     */
    async verify(authCodeType, address, authCode) {
        return this.messageProvider.count({
            authCodeType, toAddress: address,
            'templateParams.code': authCode,
            expireDate: { $gt: new Date() }
        }).then(count => count > 0);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], MessageService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", send_sms_helper_1.default)
], MessageService.prototype, "sendSmsHelper", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", send_mail_helper_1.default)
], MessageService.prototype, "sendMailHelper", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], MessageService.prototype, "messageProvider", void 0);
MessageService = __decorate([
    (0, midway_1.provide)()
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL21lc3NhZ2Utc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEI7QUFDOUIsbUNBQXVDO0FBQ3ZDLG9FQUEyRDtBQUMzRCxrRUFBeUQ7QUFFekQsdURBQWtHO0FBR2xHLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWM7SUFHdkIsR0FBRyxDQUFpQjtJQUVwQixhQUFhLENBQWdCO0lBRTdCLGNBQWMsQ0FBaUI7SUFFL0IsZUFBZSxDQUF1QztJQUV0RDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUF5RyxFQUFFLFNBQWlCO1FBRTFJLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDOUIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbkQsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztZQUMzQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxFQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUM7U0FDekQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxLQUFLLEVBQUU7WUFDUCxNQUFNLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsTUFBTSxjQUFjLEdBQUcsRUFBQyxJQUFJLEVBQUUsSUFBQSxlQUFNLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFDLENBQUM7UUFDdEQsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFbkQsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztZQUM5QixTQUFTLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxVQUFVO1NBQ3RELENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxJQUFJLFFBQVEsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzlHO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdEg7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQXlHLEVBQUUsT0FBZSxFQUFFLFFBQWdCO1FBQ3JKLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7WUFDOUIsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPO1lBQ2hDLHFCQUFxQixFQUFFLFFBQVE7WUFDL0IsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUM7U0FDaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0osQ0FBQTtBQXJERztJQURDLElBQUEsZUFBTSxHQUFFOzsyQ0FDVztBQUVwQjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNNLHlCQUFhO3FEQUFDO0FBRTdCO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ08sMEJBQWM7c0RBQUM7QUFFL0I7SUFEQyxJQUFBLGVBQU0sR0FBRTs7dURBQzZDO0FBVDdDLGNBQWM7SUFEMUIsSUFBQSxnQkFBTyxHQUFFO0dBQ0csY0FBYyxDQXdEMUI7QUF4RFksd0NBQWMifQ==