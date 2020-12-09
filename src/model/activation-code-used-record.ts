import {omit} from 'lodash';
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.activationCodeUsedRecord')
export class ActivationCodeUsedRecord extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const activationCodeSchema = new this.mongoose.Schema({
            code: {type: String, required: true},
            userId: {type: Number, required: true}, // 使用者ID
            username: {type: String, required: true}, // 邀请码所属人用户名
            status: {type: Number, default: 0, required: true}, // 0:正常
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: ActivationCodeUsedRecord.toObjectOptions,
            toObject: ActivationCodeUsedRecord.toObjectOptions
        });

        activationCodeSchema.index({code: 1});

        return this.mongoose.model('activation-code-used-record', activationCodeSchema);
    }

    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return omit(ret, ['_id']);
            }
        };
    }
}
