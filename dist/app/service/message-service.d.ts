import SendMailHelper from "../../extend/send-mail-helper";
import SendSmsHelper from "../../extend/send-sms-helper";
import { IMessageService, MessageRecordInfo } from "../../interface";
import { FreelogContext, IMongodbOperation } from 'egg-freelog-base';
export declare class MessageService implements IMessageService {
    ctx: FreelogContext;
    sendSmsHelper: SendSmsHelper;
    sendMailHelper: SendMailHelper;
    messageProvider: IMongodbOperation<MessageRecordInfo>;
    /**
     * 发送注册短信
     * @param authCodeType
     * @param toAddress 手机或email
     */
    sendMessage(authCodeType: 'register' | 'resetPassword', toAddress: string): Promise<void>;
    /**
     * 校验验证码是否正确
     * @param type
     * @param verificationCode
     * @returns {Promise<void>}
     */
    verify(authCodeType: 'register' | 'resetPassword', address: string, authCode: number): Promise<boolean>;
}
