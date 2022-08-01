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
let UserChangePasswordEventHandler = class UserChangePasswordEventHandler {
    consumerGroupId = 'freelog-identity-service#user-change-password-event-handle-group';
    subscribeTopicName = 'user-change-password-event-topic';
    constructor() {
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload) {
        console.log(`user-change-password-event-topic` + payload.message.value.toString());
    }
};
UserChangePasswordEventHandler = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], UserChangePasswordEventHandler);
exports.UserChangePasswordEventHandler = UserChangePasswordEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jaGFuZ2UtcGFzc3dvcmQtZXZlbnQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS91c2VyLWNoYW5nZS1wYXNzd29yZC1ldmVudC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1DQUFpRDtBQUtqRCxJQUFhLDhCQUE4QixHQUEzQyxNQUFhLDhCQUE4QjtJQUV2QyxlQUFlLEdBQUcsa0VBQWtFLENBQUM7SUFDckYsa0JBQWtCLEdBQUcsa0NBQWtDLENBQUM7SUFFeEQ7UUFDSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQTJCO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUN2RixDQUFDO0NBQ0osQ0FBQTtBQWhCWSw4QkFBOEI7SUFGMUMsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxjQUFLLEVBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUM7O0dBQ2QsOEJBQThCLENBZ0IxQztBQWhCWSx3RUFBOEIifQ==