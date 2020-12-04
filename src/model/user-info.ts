import {omit} from 'lodash';
import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.userInfo')
export class UserInfoModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const userInfoSchema = new this.mongoose.Schema({
            userId: {type: Number, unique: true, required: true}, //用户ID
            username: {type: String, unique: true, required: true},
            email: {type: String, required: false, default: ''},
            mobile: {type: String, required: false, default: ''},
            userRole: {type: Number, required: true, default: 1, enum: [1, 2, 3, 4, 5, 7]},
            headImage: {type: String, required: false, default: ''},
            password: {type: String, required: true},
            salt: {type: String, required: true},
            tokenSn: {type: String, required: true}, // 用户后期修改密码等操作,强制作废掉已保存的JWT信息
            userType: {type: Number, required: true, default: 0, enum: [0, 1]}, // 0:初始账户 1:内测用户
            status: {type: Number, default: 0, required: true}
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
            toJSON: UserInfoModel.toObjectOptions,
            toObject: UserInfoModel.toObjectOptions
        });

        userInfoSchema.index({userId: 1}, {unique: true});
        userInfoSchema.index({username: 1}, {unique: true});

        return this.mongoose.model('user-infos', userInfoSchema);
    }

    static get toObjectOptions() {
        return {
            transform: function (doc, ret, options) {
                return omit(ret, ['_id', 'password', 'salt', 'updateDate', 'userRole', 'userDetails'])
            }
        };
    }
}
