import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.autoIncrementRecord')
export class AutoIncrementRecord extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const AutoIncrementRecordSchema = new this.mongoose.Schema({
            dataType: {type: String, unique: true, default: 'USER_ID', required: true},
            value: {type: Number, required: true, default: 1, mixin: 1}
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
        })

        AutoIncrementRecordSchema.index({dataType: 1});

        return this.mongoose.model('auto-increment-record', AutoIncrementRecordSchema)
    }
}
