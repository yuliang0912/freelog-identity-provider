import {controller, get, inject, post, provide, put} from 'midway';
import {
    ArgumentError,
    AuthenticationError,
    CommonRegex,
    FreelogContext,
    IdentityTypeEnum,
    LogicError,
    visitorIdentityValidator,
} from 'egg-freelog-base';
import {ThirdPartyIdentityService} from '../service/third-party-identity-service';
import {IUserService} from '../../interface';
import {PassportService} from '../service/passport-service';
import {generatePassword, generateTempUserState} from '../../extend/common-helper';
import {pick} from 'lodash';
import headImageGenerator from '../../extend/head-image-generator';
import {URL} from 'url';

@provide()
@controller('/v2/thirdParty')
export class ThirdPartyController {

    @inject()
    ctx: FreelogContext;
    @inject()
    thirdPartyIdentityService: ThirdPartyIdentityService;
    @inject()
    headImageGenerator: headImageGenerator;
    @inject()
    userService: IUserService;
    @inject()
    passportService: PassportService;

    // 测试扫码地址:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2Ftest%2Fv2%2FthirdParty%2FweChat%2FcodeHandle%3FreturnUrl%3Dhttp%3A%2F%2Fconsole.testfreelog.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/codeHandle?returnUrl=http://console.testfreelog.com');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    @get('/weChat/codeHandle')
    async getWeChatToken() {
        const {ctx} = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        const returnUrl = ctx.checkQuery('returnUrl').exist().emptyStringAsNothingness().value;
        this.ctx.validateParams();
        // 微信开放平台只申请了一个网站应用,所以需要网关根据前缀区分不同的环境,然后跳转到不同的域名.
        // 不能直接使用ctx.redirect,需要浏览器通过脚本发起一次跳转,而非302跳转
        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            this.ctx.body = this.generateClientLocationRedirectScript(`http://api.testfreelog.com${this.ctx.url}`);
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转到指定URL
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({userId: thirdPartyIdentityInfo.userId});
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            this.ctx.body = this.generateClientLocationRedirectScript(returnUrl);
            return;
        }
        // 如果没绑定,则走绑定流程
        const query = `/bind?identityId=${thirdPartyIdentityInfo.id}&returnUrl=${encodeURIComponent(returnUrl)}`;
        this.ctx.body = this.generateClientLocationRedirectScript(this.generateFreelogUrl('user', query));
    }

    // 微信注册或绑定账号(非登录)
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
            userInfo = await this.userService.create({
                username: loginName,
                password,
                headImage: identityInfo.headImage
            });
            // const headImageUrl = await this.headImageGenerator.generateAndUploadHeadImage(userInfo.userId.toString());
            // await this.userService.updateOne({userId: userInfo.userId}, {headImage: headImageUrl});
        }
        await this.thirdPartyIdentityService.bindUserId(identityInfo, userInfo.userId);
        await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
        ctx.success(true);
    }

    // 测试扫码地址:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2Ftest%2Fv2%2FthirdParty%2FweChat%2FcodeHandle%3FreturnUrl%3Dhttp%3A%2F%2Fconsole.testfreelog.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/bindHandle?returnUrl=http://user.testfreelog.com/logged/setting');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${verifyLoginPassword_state}#wechat_redirect`;
    // 已登录用户绑定微信
    @get('/weChat/bindHandle')
    async bindWeChat() {
        const {ctx} = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        const state = ctx.checkQuery('state').exist().notBlank().value; // 此处是校验密码接口返回的
        const returnUrl = ctx.checkQuery('returnUrl').exist().emptyStringAsNothingness().value;
        this.ctx.validateParams();

        if (ctx.app.config.env !== 'prod' && ctx.host === 'api.freelog.com') {
            this.ctx.body = this.generateClientLocationRedirectScript(`http://api.testfreelog.com${this.ctx.url}`);
            return;
        }
        if (!ctx.isLoginUser()) {
            this.ctx.body = `<h1>未检测到登录用户,无法执行此操作,页面即将跳转</h1>
                          <script>setTimeout(function (){ location.href = "${this.generateFreelogUrl('user')}" },2000)</script>`;
            return;
        }
        const returnUrlHasQueryParams = new URL(returnUrl).search;
        if (generateTempUserState(ctx.userId) !== state) {
            this.ctx.body = this.generateClientLocationRedirectScript(`${returnUrl}${returnUrlHasQueryParams ? '&' : '?'}type=wechat&status=2&msg=参数state校验失败`);
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setWeChatToken(code);
        if (thirdPartyIdentityInfo.userId === this.ctx.userId) {
            this.ctx.body = this.generateClientLocationRedirectScript(`${returnUrl}${returnUrlHasQueryParams ? '&' : '?'}type=wechat&status=1`);
            return;
        }
        // 如果已经绑定用户ID,则报错提示已绑定,不能重复
        // 回调的状态值 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
        if (thirdPartyIdentityInfo.userId) {
            this.ctx.body = this.generateClientLocationRedirectScript(`${returnUrl}${returnUrlHasQueryParams ? '&' : '?'}type=wechat&status=3`);
        } else {
            await this.thirdPartyIdentityService.bindUserId(thirdPartyIdentityInfo, this.ctx.userId);
            this.ctx.body = this.generateClientLocationRedirectScript(`${returnUrl}${returnUrlHasQueryParams ? '&' : '?'}type=wechat&status=1`);
        }
    }

    /**
     * 解绑第三方登录
     */
    @put('/unbind')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async unBind() {
        const {ctx} = this;
        const thirdPartyType = ctx.checkBody('thirdPartyType').exist().in(['weChat', 'weibo']).value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        if (!userInfo || generatePassword(userInfo.salt, password) !== userInfo.password) {
            throw new AuthenticationError(ctx.gettext('login-name-or-password-validate-failed'));
        }

        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            thirdPartyType, userId: ctx.userId
        });
        if (!thirdPartyIdentityInfo) {
            return ctx.success(false);
        }
        await this.thirdPartyIdentityService.thirdPartyIdentityProvider.deleteOne({_id: thirdPartyIdentityInfo.id}).then(x => ctx.success(true));
    }

    /**
     * 查询第三方绑定信息列表
     */
    @get('/list')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async list() {
        const thirdPartyIdentityList = await this.thirdPartyIdentityService.thirdPartyIdentityProvider.find({
            userId: this.ctx.userId
        });
        this.ctx.success(thirdPartyIdentityList.map(x => {
            return pick(x, ['userId', 'name', 'thirdPartyType']);
        }));
    }

    @get('/getWechatInfo')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async getWechatInfo() {
        let userId = this.ctx.checkQuery('userId').exist().value;

        this.ctx.success(await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            userId: userId,
            thirdPartyType: 'weChat'
        }));
    }

    @get('/getWechatInfoByUnionId')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async getWechatInfoByUnionId() {
        let unionId = this.ctx.checkQuery('unionId').exist().value;

        this.ctx.success(await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            unionId: unionId,
            thirdPartyType: 'weChat'
        }));
    }

    /**
     * 查询用户是否绑定第三方登录
     */
    @get('/isBind')
    async isBind() {
        const {ctx} = this;
        const username = ctx.checkQuery('username').exist().isUsername().value;
        const thirdPartyType = ctx.checkQuery('thirdPartyType').exist().in(['weChat', 'weibo']).value;
        ctx.validateParams();
        const userInfo = await this.userService.findUserByLoginName(username);
        if (!userInfo) {
            return ctx.success(false);
        }
        await this.thirdPartyIdentityService.thirdPartyIdentityProvider.findOne({
            userId: userInfo.userId, thirdPartyType, status: 1
        }, '_id').then(x => ctx.success(Boolean(x)));
    }

    /**
     * 根据环境生成不同域名url
     * @param domain
     * @param queryAndPath
     * @private
     */
    private generateFreelogUrl(domain: string, queryAndPath?: string): string {
        const isProd = this.ctx.app.config.env === 'prod';
        return `http${isProd ? 's' : ''}://${domain}.${isProd ? 'freelog.com' : 'testfreelog.com'}${queryAndPath?.length ? queryAndPath : ''}`;
    }

    /**
     * 生成客户端浏览器跳转脚本
     * @param url
     * @private
     */
    private generateClientLocationRedirectScript(url: string) {
        return `<script>location.href="${url}"</script>`;
    }
}
