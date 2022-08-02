import {EachMessagePayload} from 'kafkajs';
import {config, inject, provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle, IUserRegisterEventBody} from '../interface';
import {RsaHelper} from '../extend/rsa-helper';
import {OutsideApiService} from '../app/service/outside-api-service';

@provide()
@scope(ScopeEnum.Singleton)
export class UserRegisterEventHandler implements IKafkaSubscribeMessageHandle {

    @inject()
    outsideApiService: OutsideApiService;

    rsaClient: RsaHelper = undefined;
    consumerGroupId = 'freelog-identity-service#user-register-event-handle-group';
    subscribeTopicName = 'user-register-event-topic';

    constructor(@config('jwtAuth') jwtAuth) {
        this.rsaClient = new RsaHelper().build(jwtAuth.publicKey);
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload: EachMessagePayload): Promise<void> {
        const eventBody: IUserRegisterEventBody = JSON.parse(payload.message.value.toString());
        await this.outsideApiService.changeForumPassword({
            userId: eventBody.userId,
            username: eventBody.username,
            email: eventBody.email,
            mobile: eventBody.mobile,
            password: this.rsaClient.publicKeyDecrypt(eventBody.password)
        });
    }
}
