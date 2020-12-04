import {omit} from 'lodash';
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.userDetailInfo')
export class UserDetailInfoModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const userDetailInfoSchema = new this.mongoose.Schema({
            userId: {type: Number, unique: true, required: true}, //用户ID
            tagIds: {type: [Number], default: [], required: false}, // tagId,有关联需求.
            status: {type: Number, default: 0, required: true}
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: UserDetailInfoModel.toObjectOptions,
            toObject: UserDetailInfoModel.toObjectOptions
        });

        userDetailInfoSchema.index({tagIds: 1});
        userDetailInfoSchema.index({userId: 1}, {unique: true});

        return this.mongoose.model('user-detail-infos', userDetailInfoSchema);
    }

    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return omit(ret, ['_id']);
            }
        };
    }
}
