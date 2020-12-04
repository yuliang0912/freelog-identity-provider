import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'
import {TagInfo} from '../../interface'

@provide()
@scope('Singleton')
export default class TagInfoProvider extends MongodbOperation<TagInfo> {

    constructor(@inject('model.tagInfo') model) {
        super(model);
    }
}
