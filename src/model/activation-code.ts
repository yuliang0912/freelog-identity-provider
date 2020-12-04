import {omit} from 'lodash';
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.activationCode')
export class ActivationCodeModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const activationCodeSchema = new this.mongoose.Schema({
            code: {type: String, required: true},
            codeType: {type: String, required: true}, // 1:beta-code
            userId: {type: Number, default: 0, required: true}, // 邀请码所属人
            username: {type: String, default: '', required: false}, //  邀请码所属人用户名
            usedCount: {type: Number, default: 0, required: true}, // 已使用次数
            limitCount: {type: Number, default: 1, required: true, mixin: 1}, // 限制使用次数
            startEffectiveDate: {type: Date, default: null, required: false}, // 开始生效日期
            endEffectiveDate: {type: Date, default: null, required: false}, // 生效截止日期
            status: {type: Number, default: 0, required: true}, //0:未使用 1:已使用
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: ActivationCodeModel.toObjectOptions,
            toObject: ActivationCodeModel.toObjectOptions
        });

        activationCodeSchema.index({username: 1});
        activationCodeSchema.index({code: 1}, {unique: true});

        return this.mongoose.model('activation-code', activationCodeSchema);
    }

    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return omit(ret, ['_id']);
            }
        };
    }
}
