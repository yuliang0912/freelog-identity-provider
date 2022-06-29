import {inject, provide} from 'midway';
import {OutsideApiService} from './outside-api-service';
import {ApplicationError, MongodbOperation} from 'egg-freelog-base';
import {ThirdPartyIdentityInfo, UserInfo} from '../../interface';
import {pick} from 'lodash';

@provide()
export class ThirdPartyIdentityService {

    @inject()
    outsideApiService: OutsideApiService;
    @inject()
    thirdPartyIdentityProvider: MongodbOperation<ThirdPartyIdentityInfo>;

    /**
     * 保存微信token以及身份信息
     * @param code
     */
    async setWeChatToken(code: string) {
        const tokenInfo = await this.outsideApiService.getWeChatAccessToken(code);
        if (tokenInfo.errcode) {
            throw new ApplicationError(`微信接口调用失败,请重试,errcode:${tokenInfo.errcode}`);
        }
        const thirdPartyIdentityModel: ThirdPartyIdentityInfo = {
            thirdPartyType: 'weChat',
            openId: tokenInfo.openid,
            thirdPartyIdentityInfo: tokenInfo
        };
        if (tokenInfo.unionid) {
            thirdPartyIdentityModel.unionId = tokenInfo.unionid;
        }
        return this.thirdPartyIdentityProvider.findOneAndUpdate(pick(thirdPartyIdentityModel, ['openId', 'thirdPartyType']), thirdPartyIdentityModel, {new: true}).then(model => {
            return model ?? this.thirdPartyIdentityProvider.create(thirdPartyIdentityModel);
        });
    }

    /**
     * 绑定第三方与freelog用户关系
     * @param thirdPartyIdentityInfo
     * @param userInfo
     */
    async bindUserId(thirdPartyIdentityInfo: ThirdPartyIdentityInfo, userInfo: UserInfo) {
        return this.thirdPartyIdentityProvider.updateOne({_id: thirdPartyIdentityInfo.id}, {
            userId: userInfo.userId,
            status: 1
        });
    }

    /**
     * 获取第三方身份信息
     * @param id
     */
    async getThirdPartyIdentityInfo(id: string) {
        return this.thirdPartyIdentityProvider.findById(id);
    }
}
