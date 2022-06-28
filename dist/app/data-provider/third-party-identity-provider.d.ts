import { MongodbOperation } from 'egg-freelog-base';
import { ThirdPartyIdentityInfo } from '../../interface';
export default class ThirdPartyIdentityProvider extends MongodbOperation<ThirdPartyIdentityInfo> {
    constructor(model: any);
}
