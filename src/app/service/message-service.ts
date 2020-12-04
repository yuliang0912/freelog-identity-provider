import {random} from 'lodash';
import {inject, provide} from "midway";
import SendMailHelper from "../../extend/send-mail-helper";
import SendSmsHelper from "../../extend/send-sms-helper";
import {IMessageService, MessageRecordInfo} from "../../interface";
import {ApplicationError, CommonRegex, FreelogContext, IMongodbOperation} from 'egg-freelog-base';

@provide()
export class MessageService implements IMessageService {

    @inject()
    ctx: FreelogContext;
    @inject()
    sendSmsHelper: SendSmsHelper;
    @inject()
    sendMailHelper: SendMailHelper;
    @inject()
    messageProvider: IMongodbOperation<MessageRecordInfo>;

    /**
     * 发送注册短信
     * @param authCodeType
     * @param toAddress 手机或email
     */
    async sendMessage(authCodeType: 'register' | 'resetPassword', toAddress: string): Promise<void> {

        const expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() - 1);

        const count = await this.messageProvider.count({
            authCodeType, toAddress, createDate: {$gt: expireDate}
        });
        if (count) {
            throw new ApplicationError(this.ctx.gettext('auth-code-send-limit-failed'))
        }

        const templateParams = {code: random(100000, 999999)};
        expireDate.setMinutes(expireDate.getMinutes() + 6);

        await this.messageProvider.create({
            toAddress, authCodeType, templateParams, expireDate
        });

        const isMobile = CommonRegex.mobile86.test(toAddress);
        if (isMobile) {
            return this.sendSmsHelper.sendSMS(toAddress, this.sendSmsHelper.getTemplate(authCodeType), templateParams);
        } else {
            return this.sendMailHelper.sendMail(toAddress, this.sendMailHelper.getTemplate(authCodeType, templateParams.code));
        }
    }

    /**
     * 校验验证码是否正确
     * @param type
     * @param verificationCode
     * @returns {Promise<void>}
     */
    async verify(authCodeType: 'register' | 'resetPassword', address: string, authCode: number): Promise<boolean> {
        console.log({
            authCodeType, toAddress: address,
            'templateParams.code': authCode,
            expireDate: {$gt: new Date()}
        })
        return this.messageProvider.count({
            authCodeType, toAddress: address,
            'templateParams.code': authCode,
            expireDate: {$gt: new Date()}
        }).then(count => count > 0);
    }
}
