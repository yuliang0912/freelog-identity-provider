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
exports.UserRegisterEventHandler = void 0;
const midway_1 = require("midway");
let UserRegisterEventHandler = class UserRegisterEventHandler {
    consumerGroupId = 'freelog-identity-service#user-register-event-handle-group';
    subscribeTopicName = 'user-register-event-topic';
    constructor() {
        this.messageHandle = this.messageHandle.bind(this);
    }
    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload) {
        console.log(`user-register-event-topic` + payload.message.value.toString());
    }
};
UserRegisterEventHandler = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], UserRegisterEventHandler);
exports.UserRegisterEventHandler = UserRegisterEventHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1yZWdpc3Rlci1ldmVudC1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2thZmthL3VzZXItcmVnaXN0ZXItZXZlbnQtaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxtQ0FBaUQ7QUFLakQsSUFBYSx3QkFBd0IsR0FBckMsTUFBYSx3QkFBd0I7SUFFakMsZUFBZSxHQUFHLDJEQUEyRCxDQUFDO0lBQzlFLGtCQUFrQixHQUFHLDJCQUEyQixDQUFDO0lBRWpEO1FBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUEyQjtRQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDaEYsQ0FBQztDQUNKLENBQUE7QUFoQlksd0JBQXdCO0lBRnBDLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsY0FBSyxFQUFDLGtCQUFTLENBQUMsU0FBUyxDQUFDOztHQUNkLHdCQUF3QixDQWdCcEM7QUFoQlksNERBQXdCIn0=