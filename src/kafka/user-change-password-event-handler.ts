import {EachMessagePayload} from 'kafkajs';
import {provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle} from '../interface';

@provide()
@scope(ScopeEnum.Singleton)
export class UserChangePasswordEventHandler implements IKafkaSubscribeMessageHandle {

    consumerGroupId = 'freelog-identity-service#user-change-password-event-handle-group';
    subscribeTopicName = 'user-change-password-event-topic';

    constructor() {
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload: EachMessagePayload): Promise<void> {
        console.log(`user-change-password-event-topic` + payload.message.value.toString());
    }
}
