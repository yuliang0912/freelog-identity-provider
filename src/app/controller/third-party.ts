import {controller, get, inject, post, provide} from 'midway';
import {
    ArgumentError,
    AuthenticationError,
    FreelogContext, IdentityTypeEnum,
    LogicError,
    visitorIdentityValidator
} from 'egg-freelog-base';
import {ThirdPartyIdentityService} from '../service/third-party-identity-service';
import {IUserService} from '../../interface';
import {PassportService} from '../service/passport-service';
import {CommonRegex} from 'egg-freelog-base';
import {generateTempUserState} from '../../extend/common-helper';

@provide()
@controller('/v2/thirdParty')
export class ThirdPartyController {

    @inject()
    ctx: FreelogContext;
    @inject()
    thirdPartyIdentityService: ThirdPartyIdentityService;
    @inject()
    userService: IUserService;
    @inject()
    passportService: PassportService;

    // 测试扫码地址:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2Ftest%2Fv2%2FthirdParty%2FweChat%2FcodeHandle%3FreturnUrl%3Dhttp%3A%2F%2Fconsole.testfreelog.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/codeHandle?returnUrl=http://console.testfreelog.com');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    // console.log(loginUri);
    @get('/weChat/codeHandle')
    async getWeChatToken() {
        const {ctx} = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        // const state = ctx.checkQuery('state').exist().notBlank().value;
        let returnUrl = ctx.checkQuery('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
            this.ctx.body = `<script>location.href="http://api.testfreelog.com${this.ctx.url}"</script>`;
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转到指定URL
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({userId: thirdPartyIdentityInfo.userId});
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = this.generateFreelogUrl('user');
            }
            this.ctx.body = '<script>location.href="' + returnUrl + '"</script>';
            return;
        }
        // 如果没绑定,则走绑定流程
        const query = `/bind?identityId=${thirdPartyIdentityInfo.id}&returnUrl=${encodeURIComponent(returnUrl)}`;
        const callbackUrl = this.generateFreelogUrl('user', query);
        this.ctx.body = '<script>location.href="' + callbackUrl + '?"</script>';
    }

    // 注册或绑定账号
    @post('/registerOrBind')
    async registerOrBindUser() {
        const {ctx} = this;
        const loginName = ctx.checkBody('loginName').exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().type('string').len(6, 24).value;
        const identityId = ctx.checkBody('identityId').exist().isMongoObjectId().value;
        ctx.validateParams();

        const identityInfo = await this.thirdPartyIdentityService.getThirdPartyIdentityInfo(identityId);
        if (!identityInfo) {
            throw new ArgumentError(ctx.gettext('params-validate-failed', 'identityId'));
        }
        if (identityInfo.userId) {
            throw new LogicError('账号已被绑定');
        }
        let userInfo = await this.userService.findUserByLoginName(loginName);
        if (userInfo && !this.passportService.verifyUserPassword(userInfo, password)) {
            throw new AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }
        if (!userInfo && !CommonRegex.username.test(loginName)) {
            throw new ArgumentError(ctx.gettext('params-validate-failed', 'loginName'));
        }
        if (!userInfo) {
            userInfo = await this.userService.create({username: loginName, password});
        }
        await this.thirdPartyIdentityService.bindUserId(identityInfo, userInfo.userId);
        await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
        ctx.success(true);
    }

    // 已登录用户绑定微信
    @get('/weChat/bindHandle')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async bindWeChat() {
        const {ctx} = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        const state = ctx.checkQuery('state').exist().notBlank().value; // 此处是校验密码接口返回的
        // let returnUrl = ctx.checkQuery('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();

        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
            this.ctx.body = `<script>location.href="http://api.testfreelog.com${this.ctx.url}"</script>`;
            return;
        }

        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        // if (ctx.app.env !== 'prod' && ctx.host === 'api.freelog.com') {
        //     // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
        //     const secondJumpUrl = `http://api.testfreelog.com${this.ctx.url}`;
        //     this.ctx.body = '<script>location.href="' + secondJumpUrl + '"</script>';
        //     return;
        // }
        if (generateTempUserState(this.ctx.userId) !== state) {
            throw new ArgumentError('参数state校验失败');
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        if (thirdPartyIdentityInfo.userId) {
            // 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
            return ctx.redirect('http://user.testfreelog.com/logged/setting?type=wechat&status=3');
        }
        await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
        return ctx.redirect('http://user.testfreelog.com/logged/setting?type=wechat&status=1');
    }

    /**
     * 根据环境生成不同域名url
     * @param domain
     * @param queryAndPath
     * @private
     */
    private generateFreelogUrl(domain: string, queryAndPath?: string): string {
        const isProd = this.ctx.app.config.env === 'prod';
        return `http${isProd ? 's' : ''}://${domain}.${isProd ? 'freelog.com' : 'testfreelog.com'}${queryAndPath}`;
    }
}
