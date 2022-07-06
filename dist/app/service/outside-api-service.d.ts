import { FreelogContext } from 'egg-freelog-base';
import { WeChatTokenInfo } from '../../interface';
export declare class OutsideApiService {
    thirdPartyInfo: any;
    ctx: FreelogContext;
    /**
     * 根据code获取accessToken, 注意微信一般有调用次数限制.
     * @param code
     */
    getWeChatAccessToken(code: string): Promise<WeChatTokenInfo>;
    /**
     * 获取微信个人信息
     * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html
     * @param token
     * @param openId
     */
    getWeChatUserInfo(token: string, openId: string): Promise<any>;
}
