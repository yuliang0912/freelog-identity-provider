import {config, init, inject, provide, scope, ScopeEnum} from 'midway';
import {KafkaClient} from './client';

import {UserRegisterEventHandler} from './user-register-event-handler';
import {UserChangePasswordEventHandler} from './user-change-password-event-handler';

@provide()
@scope(ScopeEnum.Singleton)
export class KafkaStartup {

    @config('kafka')
    kafkaConfig;
    @inject()
    kafkaClient: KafkaClient;
    @inject()
    userRegisterEventHandler: UserRegisterEventHandler;
    @inject()
    userChangePasswordEventHandler: UserChangePasswordEventHandler;

    /**
     * 启动,连接kafka-producer,订阅topic
     */
    @init()
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
        const topics = [this.userRegisterEventHandler, this.userChangePasswordEventHandler];
        return this.kafkaClient.subscribes(topics);
    }
}
