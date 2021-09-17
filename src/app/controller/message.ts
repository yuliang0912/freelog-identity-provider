import {controller, get, inject, post, provide} from 'midway';
import {
    ApplicationError,
    ArgumentError,
    AuthenticationError,
    CommonRegex,
    FreelogContext,
    LogicError
} from 'egg-freelog-base';
import {IMessageService, IUserService, UserInfo} from '../../interface';
import {AuthCodeTypeEnum} from '../../enum';

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
        const loginName = ctx.checkBody('loginName').exist().isEmailOrMobile86().trim().value;
        const authCodeType = ctx.checkBody('authCodeType').exist().is((value) => Object.values(AuthCodeTypeEnum).includes(value), '验证码类型错误').value;
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
        if (AuthCodeTypeEnum.Register === authCodeType && isExistLoginName) {
            throw new ApplicationError(ctx.gettext(isMobile86 ? 'mobile-register-validate-failed' : 'email-register-validate-failed'));
        } else if ([AuthCodeTypeEnum.Register, AuthCodeTypeEnum.ResetPassword].includes(authCodeType)) {
            await this.messageService.sendMessage(authCodeType, loginName);
            return ctx.success(true);
        }

        if (!ctx.isLoginUser()) {
            throw new AuthenticationError('user-authentication-failed');
        }
        const userInfo = await this.userService.findOne({userId: ctx.userId});
        if (![userInfo.mobile, userInfo.email].includes(loginName)) {
            throw new LogicError(ctx.gettext('user_email_or_mobile_invalid'));
        }
        if ([AuthCodeTypeEnum.AuditFail, AuthCodeTypeEnum.AuditPass].includes(authCodeType)) {
            throw new ArgumentError(ctx.gettext('params-validate-failed', 'authCodeType'));
        }

        await this.messageService.sendMessage(authCodeType, loginName).then(data => ctx.success(true));
    }

    /**
     * 核验验证码是否输入正确
     */
    @get('/verify')
    async verify() {

        const {ctx} = this;
        const authCodeType = ctx.checkBody('authCodeType').exist().is((value) => Object.values(AuthCodeTypeEnum).includes(value), '验证码类型错误').value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const address = ctx.checkQuery('address').exist().isEmailOrMobile86().value;
        ctx.validateParams();

        const isNeedLogin = [AuthCodeTypeEnum.UpdateMobileOrEmail, AuthCodeTypeEnum.UpdateTransactionAccountPwd, AuthCodeTypeEnum.ActivateTransactionAccount].includes(authCode);
        if (isNeedLogin && !ctx.isLoginUser()) {
            throw new AuthenticationError(ctx.gettext('user-authentication-failed'));
        } else if (isNeedLogin) {
            const userInfo = await this.userService.findOne({userId: ctx.userId});
            if (![userInfo.mobile, userInfo.email].includes(address)) {
                return ctx.success(false);
            }
        }
        // 后续要加上用户调用频率限制
        const isVerify = await this.messageService.verify(authCodeType, address, authCode);

        ctx.success(isVerify);
    }
}
