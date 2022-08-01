import { KafkaClient } from './client';
import { UserRegisterEventHandler } from './user-register-event-handler';
import { UserChangePasswordEventHandler } from './user-change-password-event-handler';
export declare class KafkaStartup {
    kafkaConfig: any;
    kafkaClient: KafkaClient;
    userRegisterEventHandler: UserRegisterEventHandler;
    userChangePasswordEventHandler: UserChangePasswordEventHandler;
    /**
     * 启动,连接kafka-producer,订阅topic
     */
    startUp(): Promise<void>;
    /**
     * 订阅
     */
    subscribeTopics(): Promise<void>;
}
