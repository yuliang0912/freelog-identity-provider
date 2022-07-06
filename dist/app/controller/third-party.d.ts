import { FreelogContext } from 'egg-freelog-base';
import { ThirdPartyIdentityService } from '../service/third-party-identity-service';
import { IUserService } from '../../interface';
import { PassportService } from '../service/passport-service';
export declare class ThirdPartyController {
    ctx: FreelogContext;
    thirdPartyIdentityService: ThirdPartyIdentityService;
    userService: IUserService;
    passportService: PassportService;
    getWeChatToken(): Promise<void>;
    registerOrBindUser(): Promise<void>;
    bindWeChat(): Promise<void>;
    /**
     * 解绑第三方登录
     */
    unBind(): Promise<FreelogContext>;
    list(): Promise<void>;
    /**
     * 根据环境生成不同域名url
     * @param domain
     * @param queryAndPath
     * @private
     */
    private generateFreelogUrl;
    /**
     * 生成客户端浏览器跳转脚本
     * @param url
     * @private
     */
    private generateClientLocationRedirectScript;
}
