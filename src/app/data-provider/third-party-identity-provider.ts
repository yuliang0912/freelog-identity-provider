import {inject, provide, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base';
import {ThirdPartyIdentityInfo} from '../../interface';

@provide()
@scope('Singleton')
export default class ThirdPartyIdentityProvider extends MongodbOperation<ThirdPartyIdentityInfo> {
    constructor(@inject('model.thirdPartyIdentityInfo') model) {
        super(model);
    }
}
