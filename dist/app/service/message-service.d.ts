import SendMailHelper from '../../extend/send-mail-helper';
import SendSmsHelper from '../../extend/send-sms-helper';
import { IMessageService, MessageRecordInfo } from '../../interface';
import { FreelogContext, IMongodbOperation } from 'egg-freelog-base';
import { AuthCodeTypeEnum } from '../../enum';
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
    sendMessage(authCodeType: AuthCodeTypeEnum, toAddress: string): Promise<void>;
    /**
     * 校验验证码是否正确
     * @param authCodeType
     * @param address
     * @param authCode
     */
    verify(authCodeType: AuthCodeTypeEnum, address: string, authCode: number): Promise<boolean>;
}
