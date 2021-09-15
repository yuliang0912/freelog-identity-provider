import {controller, get, inject, post, provide} from 'midway';
import {FreelogContext, CommonRegex, ApplicationError, ArgumentError} from 'egg-freelog-base';
import {IMessageService, IUserService, UserInfo} from '../../interface';

@provide()
@controller('/v2/messages')
export class messageController {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    messageService: IMessageService;

    /**
     * 发送验证码
     */
    @post('/send')
    async send() {

        const {ctx} = this;
        const loginName = ctx.checkBody('loginName').exist().trim().value;
        const authCodeType = ctx.checkBody('authCodeType').exist().in(['register', 'resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd']).value;
        ctx.validateParams();

        const condition: Partial<UserInfo> = {};

        let isMobile86 = false;
        if (CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName;
            isMobile86 = true;
        } else if (CommonRegex.email.test(loginName)) {
            condition.email = loginName;
        } else {
            throw new ArgumentError(ctx.gettext('login-name-format-validate-failed'));
        }

        const isExistLoginName = await this.userService.count(condition);
        if (authCodeType === 'register' && isExistLoginName) {
            throw new ApplicationError(ctx.gettext(isMobile86 ? 'mobile-register-validate-failed' : 'email-register-validate-failed'));
        }
        if (['resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd'].includes(authCodeType) && !isExistLoginName) {
            throw new ApplicationError(ctx.gettext('login-name-not-exist-error'));
        }

        await this.messageService.sendMessage(authCodeType, loginName).then(data => ctx.success(true));
    }

    /**
     * 核验验证码是否输入正确
     */
    @get('/verify')
    async verify() {

        const {ctx} = this;
        const authCodeType = ctx.checkQuery('authCodeType').exist().in(['register', 'resetPassword', 'activateTransactionAccount', 'updateTransactionAccountPwd']).value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const address = ctx.checkQuery('address').exist().isEmailOrMobile86().value;
        ctx.validateParams();

        // 后续要加上用户调用频率限制
        const isVerify = await this.messageService.verify(authCodeType, address, authCode);

        ctx.success(isVerify);
    }
}
