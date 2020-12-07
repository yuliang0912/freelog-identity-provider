import { MongodbOperation } from 'egg-freelog-base';
import { ActivationCodeUsedRecord } from '../../interface';
export default class ActivationCodeUsedRecordProvider extends MongodbOperation<ActivationCodeUsedRecord> {
    constructor(model: any);
}
