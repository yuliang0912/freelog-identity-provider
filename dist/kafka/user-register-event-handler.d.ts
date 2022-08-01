import { EachMessagePayload } from 'kafkajs';
import { IKafkaSubscribeMessageHandle } from '../interface';
export declare class UserRegisterEventHandler implements IKafkaSubscribeMessageHandle {
    consumerGroupId: string;
    subscribeTopicName: string;
    constructor();
    /**
     * mq消息处理
     * @param payload
     */
    messageHandle(payload: EachMessagePayload): Promise<void>;
}
