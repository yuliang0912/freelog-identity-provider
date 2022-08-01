import { EachMessagePayload } from 'kafkajs';
import { IKafkaSubscribeMessageHandle } from '../interface';
import { OutsideApiService } from '../app/service/outside-api-service';
import { RsaHelper } from '../extend/rsa-helper';
export declare class UserChangePasswordEventHandler implements IKafkaSubscribeMessageHandle {
    outsideApiService: OutsideApiService;
    rsaClient: RsaHelper;
    consumerGroupId: string;
    subscribeTopicName: string;
    constructor(jwtAuth: any);
    /**
     * mq消息处理
     * @param payload
     */
    messageHandle(payload: EachMessagePayload): Promise<void>;
}
