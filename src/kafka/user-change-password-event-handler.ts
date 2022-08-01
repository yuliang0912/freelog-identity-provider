import {EachMessagePayload} from 'kafkajs';
import {config, inject, provide, scope, ScopeEnum} from 'midway';
import {IKafkaSubscribeMessageHandle, IUserChangePasswordEventBody} from '../interface';
import {OutsideApiService} from '../app/service/outside-api-service';
import {RsaHelper} from '../extend/rsa-helper';

@provide()
@scope(ScopeEnum.Singleton)
export class UserChangePasswordEventHandler implements IKafkaSubscribeMessageHandle {

    @inject()
    outsideApiService: OutsideApiService;

    rsaClient: RsaHelper = undefined;
    consumerGroupId = 'freelog-identity-service#user-change-password-event-handle-group';
    subscribeTopicName = 'user-change-password-event-topic';

    constructor(@config('jwtAuth') jwtAuth) {
        this.rsaClient = new RsaHelper().build(jwtAuth.publicKey);
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * mq消息处理
     * @param payload
     */
    async messageHandle(payload: EachMessagePayload): Promise<void> {
        const eventBody: IUserChangePasswordEventBody = JSON.parse(payload.message.value.toString());
        await this.outsideApiService.changeForumPassword({
            userId: eventBody.userId,
            username: eventBody.username,
            password: this.rsaClient.publicKeyDecrypt(eventBody.password)
        }).then(x => console.log(x.data.data.toString()));
    }
}
