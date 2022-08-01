import { FreelogContext } from 'egg-freelog-base';
import { UserInfo, WeChatTokenInfo } from '../../interface';
export declare class OutsideApiService {
    thirdPartyInfo: any;
    ctx: FreelogContext;
    forum: string;
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
    /**
     * 发送运营活动事件
     * @param taskConfigCode
     * @param userId
     */
    sendActivityEvent(taskConfigCode: string, userId: number): Promise<void>;
    /**
     * 注册用户到论坛
     * @param userInfo
     */
    registerUserToForum(userInfo: Partial<UserInfo>): Promise<any>;
    changeForumPassword(userInfo: Partial<UserInfo>): Promise<any>;
}
