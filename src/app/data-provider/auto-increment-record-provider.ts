import {provide, inject, scope} from 'midway';
import {MongodbOperation} from 'egg-freelog-base'

@provide()
@scope('Singleton')
export default class AutoIncrementRecordProvider extends MongodbOperation<any> {

    constructor(@inject('model.autoIncrementRecord') model) {
        super(model);
    }

    /**
     * 获取下一个递增用户ID
     */
    async getNextUserId(): Promise<number> {
        const dataType = 'USER_ID';
        return super.findOneAndUpdate({dataType}, {$inc: {value: 1}}, {new: true}).then(model => {
            return model || super.create({dataType, value: 10001})
        }).then(data => data.value);
    }

    /**
     * 获取下一个tagId
     */
    async getNextTagId(): Promise<number> {
        const dataType = 'TAG_ID';
        return super.findOneAndUpdate({dataType}, {$inc: {value: 1}}, {new: true}).then(model => {
            return model || super.create({dataType, value: 1})
        }).then(data => data.value);
    }
}
