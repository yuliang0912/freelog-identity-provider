import {EachMessagePayload} from 'kafkajs';
import {provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle} from '../interface';

@provide()
@scope(ScopeEnum.Singleton)
export class UserRegisterEventHandler implements IKafkaSubscribeMessageHandle {

    consumerGroupId = 'freelog-identity-service#user-register-event-handle-group';
    subscribeTopicName = 'user-register-event-topic';

    constructor() {
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload: EachMessagePayload): Promise<void> {
        console.log(`user-register-event-topic` + payload.message.value.toString());
    }
}
