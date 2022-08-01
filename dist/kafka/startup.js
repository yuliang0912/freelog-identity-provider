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
let KafkaStartup = class KafkaStartup {
    kafkaConfig;
    kafkaClient;
    userRegisterEventHandler;
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
        const topics = [this.userRegisterEventHandler];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9rYWZrYS9zdGFydHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF1RTtBQUN2RSxxQ0FBcUM7QUFFckMsK0VBQXVFO0FBSXZFLElBQWEsWUFBWSxHQUF6QixNQUFhLFlBQVk7SUFHckIsV0FBVyxDQUFDO0lBRVosV0FBVyxDQUFjO0lBRXpCLHdCQUF3QixDQUEyQjtJQUVuRDs7T0FFRztJQUVILEtBQUssQ0FBQyxPQUFPO1FBQ1QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDbEMsT0FBTztTQUNWO1FBQ0QsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsZUFBZTtRQUNqQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKLENBQUE7QUEvQkc7SUFEQyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUM7O2lEQUNKO0FBRVo7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDSSxvQkFBVztpREFBQztBQUV6QjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNpQixzREFBd0I7OERBQUM7QUFNbkQ7SUFEQyxJQUFBLGFBQUksR0FBRTs7OzsyQ0FhTjtBQXpCUSxZQUFZO0lBRnhCLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsY0FBSyxFQUFDLGtCQUFTLENBQUMsU0FBUyxDQUFDO0dBQ2QsWUFBWSxDQWtDeEI7QUFsQ1ksb0NBQVkifQ==