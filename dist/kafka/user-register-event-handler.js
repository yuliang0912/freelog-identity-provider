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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterEventHandler = void 0;
const midway_1 = require("midway");
const rsa_helper_1 = require("../extend/rsa-helper");
const outside_api_service_1 = require("../app/service/outside-api-service");
let UserRegisterEventHandler = class UserRegisterEventHandler {
    outsideApiService;
    rsaClient = undefined;
    consumerGroupId = 'freelog-identity-service#user-register-event-handle-group';
    subscribeTopicName = 'user-register-event-topic';
    constructor(jwtAuth) {
        this.rsaClient = new rsa_helper_1.RsaHelper().build(jwtAuth.publicKey);
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload) {
        // const eventBody: IUserRegisterEventBody = JSON.parse(payload.message.value.toString());
        // await this.outsideApiService.changeForumPassword({
        //     userId: eventBody.userId,
        //     username: eventBody.username,
        //     email: eventBody.email,
        //     mobile: eventBody.mobile,
        //     password: this.rsaClient.publicKeyDecrypt(eventBody.password)
        // });
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], UserRegisterEventHandler.prototype, "outsideApiService", void 0);
UserRegisterEventHandler = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton),
    __param(0, (0, midway_1.config)('jwtAuth')),
    __metadata("design:paramtypes", [Object])
], UserRegisterEventHandler);
exports.UserRegisterEventHandler = UserRegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1yZWdpc3Rlci1ldmVudC1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2thZmthL3VzZXItcmVnaXN0ZXItZXZlbnQtaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxtQ0FBaUU7QUFFakUscURBQStDO0FBQy9DLDRFQUFxRTtBQUlyRSxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQUdqQyxpQkFBaUIsQ0FBb0I7SUFFckMsU0FBUyxHQUFjLFNBQVMsQ0FBQztJQUNqQyxlQUFlLEdBQUcsMkRBQTJELENBQUM7SUFDOUUsa0JBQWtCLEdBQUcsMkJBQTJCLENBQUM7SUFFakQsWUFBK0IsT0FBTztRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksc0JBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUEyQjtRQUMzQywwRkFBMEY7UUFDMUYscURBQXFEO1FBQ3JELGdDQUFnQztRQUNoQyxvQ0FBb0M7UUFDcEMsOEJBQThCO1FBQzlCLGdDQUFnQztRQUNoQyxvRUFBb0U7UUFDcEUsTUFBTTtJQUNWLENBQUM7Q0FDSixDQUFBO0FBekJHO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ1UsdUNBQWlCO21FQUFDO0FBSDVCLHdCQUF3QjtJQUZwQyxJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLGNBQUssRUFBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQztJQVVWLFdBQUEsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLENBQUE7O0dBVHJCLHdCQUF3QixDQTRCcEM7QUE1QlksNERBQXdCIn0=