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
exports.KafkaStartup = void 0;
const midway_1 = require("midway");
const client_1 = require("./client");
const user_register_event_handler_1 = require("./user-register-event-handler");
const user_change_password_event_handler_1 = require("./user-change-password-event-handler");
let KafkaStartup = class KafkaStartup {
    kafkaConfig;
    kafkaClient;
    userRegisterEventHandler;
    userChangePasswordEventHandler;
    /**
     * 启动,连接kafka-producer,订阅topic
     */
    async startUp() {
        if (this.kafkaConfig.enable !== true) {
            return;
        }
        await this.subscribeTopics().then(() => {
            console.log('kafka topic 订阅成功!');
        }).catch(error => {
            console.log('kafka topic 订阅失败!', error.toString());
        });
        await this.kafkaClient.producer.connect().catch(error => {
            console.log('kafka producer connect failed,', error);
        });
    }
    /**
     * 订阅
     */
    async subscribeTopics() {
        const topics = [this.userRegisterEventHandler, this.userChangePasswordEventHandler];
        return this.kafkaClient.subscribes(topics);
    }
};
__decorate([
    (0, midway_1.config)('kafka'),
    __metadata("design:type", Object)
], KafkaStartup.prototype, "kafkaConfig", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", client_1.KafkaClient)
], KafkaStartup.prototype, "kafkaClient", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", user_register_event_handler_1.UserRegisterEventHandler)
], KafkaStartup.prototype, "userRegisterEventHandler", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", user_change_password_event_handler_1.UserChangePasswordEventHandler)
], KafkaStartup.prototype, "userChangePasswordEventHandler", void 0);
__decorate([
    (0, midway_1.init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KafkaStartup.prototype, "startUp", null);
KafkaStartup = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton)
], KafkaStartup);
exports.KafkaStartup = KafkaStartup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS9zdGFydHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF1RTtBQUN2RSxxQ0FBcUM7QUFFckMsK0VBQXVFO0FBQ3ZFLDZGQUFvRjtBQUlwRixJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFZO0lBR3JCLFdBQVcsQ0FBQztJQUVaLFdBQVcsQ0FBYztJQUV6Qix3QkFBd0IsQ0FBMkI7SUFFbkQsOEJBQThCLENBQWlDO0lBRS9EOztPQUVHO0lBRUgsS0FBSyxDQUFDLE9BQU87UUFDVCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtZQUNsQyxPQUFPO1NBQ1Y7UUFDRCxNQUFNLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxlQUFlO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3BGLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKLENBQUE7QUFqQ0c7SUFEQyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUM7O2lEQUNKO0FBRVo7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDSSxvQkFBVztpREFBQztBQUV6QjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNpQixzREFBd0I7OERBQUM7QUFFbkQ7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDdUIsbUVBQThCO29FQUFDO0FBTS9EO0lBREMsSUFBQSxhQUFJLEdBQUU7Ozs7MkNBYU47QUEzQlEsWUFBWTtJQUZ4QixJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLGNBQUssRUFBQyxrQkFBUyxDQUFDLFNBQVMsQ0FBQztHQUNkLFlBQVksQ0FvQ3hCO0FBcENZLG9DQUFZIn0=