import {controller, get, inject, provide} from 'midway';
import {FreelogContext} from 'egg-freelog-base';
import {ThirdPartyIdentityService} from '../service/third-party-identity-service';
import {IUserService} from '../../interface';
import {PassportService} from '../service/passport-service';

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

    // testUrl:https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=https%3A%2F%2Fapi.freelog.com%2ftest&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
    // 测试扫码地址
    // const redirectUri = encodeURIComponent('https://api.freelog.com/test/v2/thirdParty/weChat/codeHandle?returnUrl=http://console.testfreelog.com');
    // const loginUri = `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    // console.log(loginUri);
    @get('/weChat/codeHandle')
    async getWeChatToken() {

        const {ctx} = this;
        const code = ctx.checkQuery('code').exist().notBlank().value;
        let returnUrl = ctx.checkBody('returnUrl').optional().emptyStringAsNothingness().value;
        this.ctx.validateParams();

        if (ctx.host === 'api.freelog.com') {
            // 不能直接使用ctx.redirect,需要浏览器通过脚本做一次跳转,而非302跳转
            const secondJumpUrl = `http://api.testfreelog.com${this.ctx.url}`;
            this.ctx.body = '<script>location.href="' + secondJumpUrl + '"</script>';
            return;
        }
        const thirdPartyIdentityInfo = await this.thirdPartyIdentityService.setChatToken(code);
        // 如果已经绑定用户ID,则直接登陆,跳转
        if (thirdPartyIdentityInfo.userId) {
            const userInfo = await this.userService.findOne({userId: thirdPartyIdentityInfo.userId});
            await this.passportService.setCookieAndLoginRecord(userInfo, 'cookie', true);
            if (!returnUrl) {
                returnUrl = ctx.app.env === 'prod' ? 'https://user.freelog.com' : 'http://user.testfreelog.com';
            }
            this.ctx.body = '<script>location.href="' + returnUrl + '"</script>';
            return;
        }
        // 如果未绑定用户ID,则需要走绑定或者注册流程.
        ctx.success(`等待前端做好第三方用户绑定或注册流程之后,会跳转,param:{id:${thirdPartyIdentityInfo.id},openId${thirdPartyIdentityInfo.openId}}`);
    }
}
