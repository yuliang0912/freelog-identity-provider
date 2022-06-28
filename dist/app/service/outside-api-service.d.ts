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
}
