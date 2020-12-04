import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'
import {MessageRecordInfo} from '../../interface'

@provide()
@scope('Singleton')
export default class MessageProvider extends MongodbOperation<MessageRecordInfo> {

    constructor(@inject('model.messageRecord') model) {
        super(model);
    }
}
