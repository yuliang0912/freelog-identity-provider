import { MongodbOperation } from 'egg-freelog-base';
import { TagInfo } from '../../interface';
export default class TagInfoProvider extends MongodbOperation<TagInfo> {
    constructor(model: any);
}
