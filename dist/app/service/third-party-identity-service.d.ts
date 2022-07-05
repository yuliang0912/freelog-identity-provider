import { OutsideApiService } from './outside-api-service';
import { MongodbOperation } from 'egg-freelog-base';
import { ThirdPartyIdentityInfo, UserInfo } from '../../interface';
export declare class ThirdPartyIdentityService {
    outsideApiService: OutsideApiService;
    thirdPartyIdentityProvider: MongodbOperation<ThirdPartyIdentityInfo>;
    /**
     * 保存微信token以及身份信息
     * @param code
     * @param userId
     */
    setWeChatToken(code: string): Promise<ThirdPartyIdentityInfo>;
    /**
     * 绑定第三方与freelog用户关系
     * @param thirdPartyIdentityInfo
     * @param userInfo
     */
    bindUserId(thirdPartyIdentityInfo: ThirdPartyIdentityInfo, userInfo: UserInfo): Promise<{
        n: number;
        nModified: number;
        ok: number;
    }>;
    /**
     * 获取第三方身份信息
     * @param id
     */
    getThirdPartyIdentityInfo(id: string): Promise<ThirdPartyIdentityInfo>;
}
