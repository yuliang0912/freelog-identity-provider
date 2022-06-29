import {config, controller, get, inject, post, provide} from 'midway';
import {AuthenticationError, FreelogContext} from 'egg-freelog-base';
import {IUserService} from '../../interface';
import {PassportService} from '../service/passport-service';

@provide()
@controller('/v2/passport')
export class passportController {

    @config()
    jwtAuth;
    @config()
    domain;
    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    passportService: PassportService;

    @post('/login')
    async login() {

        const {ctx} = this;
        const loginName = ctx.checkBody('loginName').exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value; // isLoginPassword
        const isRemember = ctx.checkBody('isRemember').optional().toInt().in([0, 1]).default(0).value;
        const jwtType = ctx.checkBody('jwtType').optional().in(['cookie', 'header']).default('cookie').value;
        const returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        ctx.validateParams();

        const userInfo = await this.userService.findUserByLoginName(loginName);
        if (!this.passportService.verifyUserPassword(userInfo, password)) {
            throw new AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        await this.passportService.setCookieAndLoginRecord(userInfo, jwtType, isRemember);
        returnUrl ? ctx.redirect(returnUrl) : ctx.success(userInfo);
    }

    @get('/logout')
    async logout(ctx) {

        const returnUrl = ctx.checkQuery('returnUrl').optional().decodeURIComponent().isUrl().value;
        ctx.validateParams();

        ctx.cookies.set(this.jwtAuth.cookieName, null, {domain: this.domain});
        ctx.cookies.set('uid', null, {domain: this.domain});

        returnUrl ? ctx.redirect(returnUrl) : ctx.success(true);
    }
}
