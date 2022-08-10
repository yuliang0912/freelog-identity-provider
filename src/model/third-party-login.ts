import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.thirdPartyIdentityInfo')
export class ThirdPartyIdentityInfoModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {
        const thirdPartyIdentityInfoSchema = new this.mongoose.Schema({
            thirdPartyType: {type: String, required: true, enum: ['weChat']},
            thirdPartyIdentityInfo: {}, // 第三方官方响应的信息
            openId: {type: String, required: true}, // 唯一标识ID
            name: {type: String, required: false, default: ''}, // 第三方账号名称(非账号)
            headImage: {type: String, required: false, default: ''}, // 第三方身份头像
            unionId: {type: String, default: '', required: false}, // 微信标识ID(同一个账号下跨应用)
            userId: {type: Number, default: 0, required: false}, //用户ID
            status: {type: Number, default: 0, required: true} // 0:未绑定用户 1:已绑定用户
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
        });

        thirdPartyIdentityInfoSchema.index({openId: 1, userId: 1});

        thirdPartyIdentityInfoSchema.virtual('id').get(function (this: any) {
            return this._id;
        });

        return this.mongoose.model('third-party-identity-infos', thirdPartyIdentityInfoSchema);
    }
}
