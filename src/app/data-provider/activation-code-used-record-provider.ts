import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'
import {ActivationCodeUsedRecord} from '../../interface'

@provide()
@scope('Singleton')
export default class ActivationCodeUsedRecordProvider extends MongodbOperation<ActivationCodeUsedRecord> {

    constructor(@inject('model.activationCodeUsedRecord') model) {
        super(model);
    }
}
