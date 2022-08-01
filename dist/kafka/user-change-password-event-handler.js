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
exports.UserChangePasswordEventHandler = void 0;
const midway_1 = require("midway");
const outside_api_service_1 = require("../app/service/outside-api-service");
const rsa_helper_1 = require("../extend/rsa-helper");
let UserChangePasswordEventHandler = class UserChangePasswordEventHandler {
    outsideApiService;
    rsaClient = undefined;
    consumerGroupId = 'freelog-identity-service#user-change-password-event-handle-group';
    subscribeTopicName = 'user-change-password-event-topic';
    constructor(jwtAuth) {
        this.rsaClient = new rsa_helper_1.RsaHelper().build(jwtAuth.publicKey);
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload) {
        const eventBody = JSON.parse(payload.message.value.toString());
        await this.outsideApiService.changeForumPassword({
            userId: eventBody.userId,
            username: eventBody.username,
            password: this.rsaClient.publicKeyDecrypt(eventBody.password)
        }).then(x => console.log(JSON.stringify(x)));
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], UserChangePasswordEventHandler.prototype, "outsideApiService", void 0);
UserChangePasswordEventHandler = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton),
    __param(0, (0, midway_1.config)('jwtAuth')),
    __metadata("design:paramtypes", [Object])
], UserChangePasswordEventHandler);
exports.UserChangePasswordEventHandler = UserChangePasswordEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jaGFuZ2UtcGFzc3dvcmQtZXZlbnQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS91c2VyLWNoYW5nZS1wYXNzd29yZC1ldmVudC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLG1DQUFpRTtBQUVqRSw0RUFBcUU7QUFDckUscURBQStDO0FBSS9DLElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO0lBR3ZDLGlCQUFpQixDQUFvQjtJQUVyQyxTQUFTLEdBQWMsU0FBUyxDQUFDO0lBQ2pDLGVBQWUsR0FBRyxrRUFBa0UsQ0FBQztJQUNyRixrQkFBa0IsR0FBRyxrQ0FBa0MsQ0FBQztJQUV4RCxZQUErQixPQUFPO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQTJCO1FBQzNDLE1BQU0sU0FBUyxHQUFpQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0YsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUM7WUFDN0MsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1lBQ3hCLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtZQUM1QixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1NBQ2hFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSixDQUFBO0FBdkJHO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ1UsdUNBQWlCO3lFQUFDO0FBSDVCLDhCQUE4QjtJQUYxQyxJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLGNBQUssRUFBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQztJQVVWLFdBQUEsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLENBQUE7O0dBVHJCLDhCQUE4QixDQTBCMUM7QUExQlksd0VBQThCIn0=