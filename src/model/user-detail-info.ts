import {omit} from 'lodash';
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';
import moment = require('moment');

@scope('Singleton')
@provide('model.userDetailInfo')
export class UserDetailInfoModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const userDetailInfoSchema = new this.mongoose.Schema({
            userId: {type: Number, required: true}, // 用户ID
            sex: {type: Number, enum: [0, 1, 2], default: 0, required: true}, // 性别
            birthday: {type: Date, default: null, required: false}, // 生日
            occupation: {type: String, default: '', required: false}, // 职业
            areaCode: {type: String, default: '', required: false}, // 区域编码
            areaName: {type: String, default: '', required: false}, // 区域名称
            latestLoginDate: {type: Date, default: null, required: false}, // 最新登录日期
            latestLoginIp: {type: String, default: '', required: false}, // 最新登录IP
            reason: {type: String, default: '', required: false}, // 冻结原因
            remark: {type: String, default: '', required: false}, // 备注
            tagIds: {type: [Number], default: [], required: false}, // tagId,有关联需求.
            intro: {type: String, required: false, default: ''}, // 简介
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
                if (ret.birthday) {
                    ret.birthday = moment(ret.birthday).format('YYYY-MM-DD');
                }
                return omit(ret, ['_id', 'tagIds', 'userId']);
            }
        };
    }
}
