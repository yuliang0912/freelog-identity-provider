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
exports.KafkaClient = void 0;
const kafkajs_1 = require("kafkajs");
const midway_1 = require("midway");
const lodash_1 = require("lodash");
const egg_freelog_base_1 = require("egg-freelog-base");
/**
 * WIKI:https://kafka.js.org/docs/getting-started
 */
let KafkaClient = class KafkaClient {
    kafka;
    kafkaConfig;
    producer;
    consumers = [];
    producerIsReady = false;
    consumerTopicAsyncHandleFunc = new Map();
    async initial() {
        if (this.kafkaConfig.enable === false) {
            return;
        }
        this.kafka = new kafkajs_1.Kafka(this.kafkaConfig);
        this.producer = this.kafka.producer();
        this._instrumentationEvents();
    }
    /**
     * 订阅主题消息
     * @param topics
     */
    async subscribes(topics) {
        const buildTopicGroupKey = (topic, groupId) => {
            return `topic_${topic}#group_id_${groupId}`;
        };
        const topicGroup = (0, lodash_1.groupBy)(topics, x => x.consumerGroupId);
        for (const [groupId, topicGroups] of Object.entries(topicGroup)) {
            const consumer = this.kafka.consumer({ groupId });
            await consumer.connect().catch(() => {
                throw new egg_freelog_base_1.ApplicationError('kafka消费者连接失败');
            });
            for (const topicInfo of topicGroups) {
                await consumer.subscribe({ topic: topicInfo.subscribeTopicName, fromBeginning: false });
                this.consumerTopicAsyncHandleFunc.set(buildTopicGroupKey(topicInfo.subscribeTopicName, topicInfo.consumerGroupId), topicInfo.messageHandle);
            }
            await consumer.run({
                partitionsConsumedConcurrently: 3,
                eachMessage: async (...args) => {
                    const { topic } = (0, lodash_1.first)(args);
                    const asyncHandleFunc = this.consumerTopicAsyncHandleFunc.get(buildTopicGroupKey(topic, groupId));
                    await Reflect.apply(asyncHandleFunc, null, args);
                }
            });
            this.consumers.push(consumer);
        }
    }
    /**
     * 发送消息
     * @param record
     */
    async send(record) {
        return this.producer.send(record);
    }
    /**
     * 批量发送消息
     * @param batch
     */
    async sendBatch(batch) {
        return this.producer.sendBatch(batch);
    }
    /**
     * 释放连接
     */
    async disconnect() {
        this.producer.disconnect().then();
        this.consumers.forEach(consumer => consumer.disconnect());
    }
    _instrumentationEvents() {
        this.producer.on(this.producer.events.CONNECT, () => {
            this.producerIsReady = true;
            console.log('kafka producer connected');
        });
        this.producer.on(this.producer.events.DISCONNECT, () => {
            this.producerIsReady = false;
            console.log('kafka producer disconnect');
        });
    }
};
__decorate([
    (0, midway_1.config)('kafka'),
    __metadata("design:type", Object)
], KafkaClient.prototype, "kafkaConfig", void 0);
__decorate([
    (0, midway_1.init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KafkaClient.prototype, "initial", null);
KafkaClient = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)(midway_1.ScopeEnum.Singleton)
], KafkaClient);
exports.KafkaClient = KafkaClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2thZmthL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FLaUI7QUFDakIsbUNBQStEO0FBRS9ELG1DQUFzQztBQUN0Qyx1REFBa0Q7QUFFbEQ7O0dBRUc7QUFHSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBRXBCLEtBQUssQ0FBUTtJQUViLFdBQVcsQ0FBQztJQUNaLFFBQVEsQ0FBVztJQUNuQixTQUFTLEdBQWUsRUFBRSxDQUFDO0lBQzNCLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFFeEIsNEJBQTRCLEdBQUcsSUFBSSxHQUFHLEVBQTBELENBQUM7SUFHakcsS0FBSyxDQUFDLE9BQU87UUFDVCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTtZQUNuQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBc0M7UUFDbkQsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQWEsRUFBRSxPQUFlLEVBQUUsRUFBRTtZQUMxRCxPQUFPLFNBQVMsS0FBSyxhQUFhLE9BQU8sRUFBRSxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLElBQUEsZ0JBQU8sRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJ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