import { Consumer, EachMessagePayload, Kafka, Producer, ProducerBatch, ProducerRecord, RecordMetadata } from 'kafkajs';
import { IKafkaSubscribeMessageHandle } from '../interface';
/**
 * WIKI:https://kafka.js.org/docs/getting-started
 */
export declare class KafkaClient {
    kafka: Kafka;
    kafkaConfig: any;
    producer: Producer;
    consumers: Consumer[];
    producerIsReady: boolean;
    consumerTopicAsyncHandleFunc: Map<string, (payload: EachMessagePayload) => Promise<void>>;
    initial(): Promise<void>;
    /**
     * 订阅主题消息
     * @param topics
     */
    subscribes(topics: IKafkaSubscribeMessageHandle[]): Promise<void>;
    /**
     * 发送消息
     * @param record
     */
    send(record: ProducerRecord): Promise<RecordMetadata[]>;
    /**
     * 批量发送消息
     * @param batch
     */
    sendBatch(batch: ProducerBatch): Promise<RecordMetadata[]>;
    /**
     * 释放连接
     */
    disconnect(): Promise<void>;
    _instrumentationEvents(): void;
}
