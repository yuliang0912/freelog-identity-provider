import {config, inject, provide} from 'midway';
import {FreelogContext} from 'egg-freelog-base';
import {base64Decode} from 'egg-freelog-base/lib/crypto-helper';
import {WeChatTokenInfo} from '../../interface';

@provide()
export class OutsideApiService {

    @config()
    thirdPartyInfo: any;

    @inject()
    ctx: FreelogContext;

    /**
     * 根据code获取accessToken, 注意微信一般有调用次数限制.
     * @param code
     */
    async getWeChatAccessToken(code: string): Promise<WeChatTokenInfo> {
        const {appid, secret} = this.thirdPartyInfo.weChat;
        const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${base64Decode(secret)}&code=${code}&grant_type=authorization_code`;
        return this.ctx.app.curl(url).then(response => {
            return JSON.parse(response.data.toString());
        });
    }

    /**
     * 获取微信个人信息
     * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html
     * @param token
     * @param openId
     */
    async getWeChatUserInfo(token: string, openId: string): Promise<any> {
        const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openId}`;
        return this.ctx.app.curl(url).then(response => {
            return JSON.parse(response.data.toString());
        });
    }

    /**
     * 发送运营活动事件
     * @param taskConfigCode
     * @param userId
     */
    async sendActivityEvent(taskConfigCode: string, userId: number) {
        return this.ctx.curlIntranetApi(`${this.ctx.webApi.baseUrl}/client/v2/activities/task/records/complete4TaskConfigCode`, {
            method: 'post', contentType: 'json', data: {
                taskConfigCode, userId
            }
        }).catch(error => {
            console.error(`运营活动调用失败,taskCode:${taskConfigCode}, userId:${userId}`);
            throw error;
        });
    }
}
