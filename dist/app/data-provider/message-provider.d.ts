import { MongodbOperation } from 'egg-freelog-base';
import { MessageRecordInfo } from '../../interface';
export default class MessageProvider extends MongodbOperation<MessageRecordInfo> {
    constructor(model: any);
}
