import {config, controller, get, inject, post, provide} from "midway";
import {ArgumentError, AuthenticationError, CommonRegex, FreelogContext, JwtHelper} from "egg-freelog-base";
import {IUserService, UserInfo} from "../../interface";
import {generatePassword} from "../../extend/common-helper";
import {pick} from 'lodash';

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

    @post('/login')
    async login() {

        const {ctx} = this;
        const loginName = ctx.checkBody("loginName").exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value; // isLoginPassword
        const isRemember = ctx.checkBody("isRemember").optional().toInt().in([0, 1]).default(0).value;
        const jwtType = ctx.checkBody('jwtType').optional().in(['cookie', 'header']).default('cookie').value;
        const returnUrl = ctx.checkBody("returnUrl").optional().value;
        ctx.validateParams();

        const condition: Partial<UserInfo> = {};
        if (CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName;
        } else if (CommonRegex.email.test(loginName)) {
            condition.email = loginName;
        } else if (CommonRegex.username.test(loginName)) {
            condition.username = loginName;
        } else {
            throw new ArgumentError(ctx.gettext('login-name-format-validate-failed'), {loginName})
        }

        const userInfo = await this.userService.findOne(condition);
        if (!userInfo || generatePassword(userInfo.salt, password) !== userInfo.password) {
            throw new AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'))
        }

        this.userService.updateOneUserDetail({userId: userInfo.userId}, {
            latestLoginDate: new Date(), latestLoginIp: ctx.ip,
        }).then()

        const {publicKey, privateKey, cookieName} = this.jwtAuth
        const payLoad = Object.assign(pick(userInfo, ['userId', 'username', 'userType', 'mobile', 'email']), this._generateJwtPayload(userInfo.userId, userInfo.tokenSn))

        const jwtStr = new JwtHelper(publicKey, privateKey).generateToken(payLoad, 1296000);

        if (jwtType === 'cookie') {
            const now = new Date();
            now.setDate(now.getDate() + 7);
            const cookieOptions = {
                httpOnly: false,
                domain: this.domain,
                overwrite: true,
                signed: false,
                expires: isRemember ? now : undefined
            };
            ctx.cookies.set(cookieName, jwtStr, cookieOptions)
            ctx.cookies.set('uid', userInfo.userId.toString(), cookieOptions)
        } else {
            ctx.set('Authorization', `Bearer ${jwtStr}`)
        }

        returnUrl ? ctx.redirect(returnUrl) : ctx.success(userInfo);
    }

    @get('/logout')
    async logout(ctx) {

        const returnUrl = ctx.checkQuery("returnUrl").optional().decodeURIComponent().isUrl().value
        ctx.validateParams()

        ctx.cookies.set(this.jwtAuth.cookieName, null, {domain: this.domain});
        ctx.cookies.set('uid', null, {domain: this.domain});

        returnUrl ? ctx.redirect(returnUrl) : ctx.success(true)
    }

    /**
     * 生成jwt载体
     * @param userId
     * @param token
     */
    _generateJwtPayload(userId: number, token: string) {
        {
            const currTime = Math.round(new Date().getTime() / 1000)
            return {
                iss: "https://identity.freelog.com",
                sub: userId.toString(),
                aud: "freelog-website",
                exp: currTime + 1296000,
                iat: currTime,
                jti: token
            }
        }
    }
}
