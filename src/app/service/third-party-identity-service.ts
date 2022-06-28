import {inject, provide} from 'midway';
import {OutsideApiService} from './outside-api-service';
import {ApplicationError, MongodbOperation} from 'egg-freelog-base';
import {ThirdPartyIdentityInfo} from '../../interface';
import {pick} from 'lodash';

@provide()
export class ThirdPartyIdentityService {

    @inject()
    outsideApiService: OutsideApiService;
    @inject()
    thirdPartyIdentityProvider: MongodbOperation<ThirdPartyIdentityInfo>;

    async setChatToken(code: string) {
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
}
