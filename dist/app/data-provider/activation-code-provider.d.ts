import { MongodbOperation } from 'egg-freelog-base';
import { ActivationCodeInfo } from '../../interface';
export default class ActivationCodeProvider extends MongodbOperation<ActivationCodeInfo> {
    constructor(model: any);
}
