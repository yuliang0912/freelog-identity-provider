import {
    Consumer,
    EachMessagePayload,
    Kafka, Producer, ProducerBatch,
    ProducerRecord, RecordMetadata
} from 'kafkajs';
import {config, init, provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle} from '../interface';
import {groupBy, first} from 'lodash';
import {ApplicationError} from 'egg-freelog-base';

/**
 * WIKI:https://kafka.js.org/docs/getting-started
 */
@provide()
@scope(ScopeEnum.Singleton)
export class KafkaClient {

    kafka: Kafka;
    @config('kafka')
    kafkaConfig;
    producer: Producer;
    consumers: Consumer[] = [];
    producerIsReady = false;

    consumerTopicAsyncHandleFunc = new Map<string, (payload: EachMessagePayload) => Promise<void>>();

    @init()
    async initial() {
        if (this.kafkaConfig.enable === false) {
            return;
        }
        this.kafka = new Kafka(this.kafkaConfig);
        this.producer = this.kafka.producer();
        this._instrumentationEvents();
    }

    /**
     * 订阅主题消息
     * @param topics
     */
    async subscribes(topics: IKafkaSubscribeMessageHandle[]) {
        const buildTopicGroupKey = (topic: string, groupId: string) => {
            return `topic_${topic}#group_id_${groupId}`;
        };
        const topicGroup = groupBy(topics, x => x.consumerGroupId);
        for (const [groupId, topicGroups] of Object.entries(topicGroup)) {
            const consumer = this.kafka.consumer({groupId});
            await consumer.connect().catch(() => {
                throw new ApplicationError('kafka消费者连接失败');
            });
            for (const topicInfo of topicGroups) {
                await consumer.subscribe({topic: topicInfo.subscribeTopicName, fromBeginning: false});
                this.consumerTopicAsyncHandleFunc.set(buildTopicGroupKey(topicInfo.subscribeTopicName, topicInfo.consumerGroupId), topicInfo.messageHandle);
            }
            await consumer.run({
                partitionsConsumedConcurrently: 3,
                eachMessage: async (...args) => {
                    const {topic} = first(args);
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
    async send(record: ProducerRecord): Promise<RecordMetadata[]> {
        return this.producer.send(record);
    }

    /**
     * 批量发送消息
     * @param batch
     */
    async sendBatch(batch: ProducerBatch): Promise<RecordMetadata[]> {
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
}
