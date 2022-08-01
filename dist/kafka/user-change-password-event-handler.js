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
exports.UserChangePasswordEventHandler = void 0;
const midway_1 = require("midway");
const outside_api_service_1 = require("../app/service/outside-api-service");
const rsa_helper_1 = require("../extend/rsa-helper");
let UserChangePasswordEventHandler = class UserChangePasswordEventHandler {
    jwtAuth;
    outsideApiService;
    rsaClient = undefined;
    consumerGroupId = 'freelog-identity-service#user-change-password-event-handle-group';
    subscribeTopicName = 'user-change-password-event-topic';
    constructor() {
        this.rsaClient = new rsa_helper_1.RsaHelper().build(this.jwtAuth.publicKey);
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
    (0, midway_1.config)(),
    __metadata("design:type", Object)
], UserChangePasswordEventHandler.prototype, "jwtAuth", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], UserChangePasswordEventHandler.prototype, "outsideApiService", void 0);
UserChangePasswordEventHandler = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], UserChangePasswordEventHandler);
exports.UserChangePasswordEventHandler = UserChangePasswordEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jaGFuZ2UtcGFzc3dvcmQtZXZlbnQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS91c2VyLWNoYW5nZS1wYXNzd29yZC1ldmVudC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1DQUFpRTtBQUVqRSw0RUFBcUU7QUFDckUscURBQStDO0FBSS9DLElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO0lBR3ZDLE9BQU8sQ0FBQztJQUVSLGlCQUFpQixDQUFvQjtJQUVyQyxTQUFTLEdBQWMsU0FBUyxDQUFDO0lBQ2pDLGVBQWUsR0FBRyxrRUFBa0UsQ0FBQztJQUNyRixrQkFBa0IsR0FBRyxrQ0FBa0MsQ0FBQztJQUV4RDtRQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUEyQjtRQUMzQyxNQUFNLFNBQVMsR0FBaUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDO1lBQzdDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtZQUN4QixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7WUFDNUIsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUNoRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0osQ0FBQTtBQXpCRztJQURDLElBQUEsZUFBTSxHQUFFOzsrREFDRDtBQUVSO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ1UsdUNBQWlCO3lFQUFDO0FBTDVCLDhCQUE4QjtJQUYxQyxJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLGNBQUssRUFBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQzs7R0FDZCw4QkFBOEIsQ0E0QjFDO0FBNUJZLHdFQUE4QiJ9