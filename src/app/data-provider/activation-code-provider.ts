import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'
import {ActivationCodeInfo} from '../../interface'

@provide()
@scope('Singleton')
export default class ActivationCodeProvider extends MongodbOperation<ActivationCodeInfo> {

    constructor(@inject('model.activationCode') model) {
        super(model);
    }
}
