import {controller, get, inject, post, provide} from 'midway';
import {FreelogContext, CommonRegex, ApplicationError, ArgumentError} from 'egg-freelog-base';
import {IMessageService, IUserService, UserInfo} from "../../interface";

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
        const authCodeType = ctx.checkBody('authCodeType').exist().in(['register', 'resetPassword']).value;
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
        if (authCodeType === 'resetPassword' && !isExistLoginName) {
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
        const authCodeType = ctx.checkQuery('authCodeType').exist().in(['register', 'resetPassword']).value;
        const authCode = ctx.checkQuery('authCode').exist().toInt().value;
        const mobileOrEmailRegex = /^(1[34578]\d{9})|([A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4})$/;
        const address = ctx.checkQuery('address').exist().match(mobileOrEmailRegex, ctx.gettext('login-name-format-validate-failed')).value;
        ctx.validateParams()

        const isVerify = await this.messageService.verify(authCodeType, address, authCode);

        ctx.success(isVerify)
    }
}
