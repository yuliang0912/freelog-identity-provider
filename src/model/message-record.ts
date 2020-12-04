import {scope, provide, plugin} from 'midway';
import {MongooseModelBase} from 'egg-freelog-base/database/mongoose-model-base';

@scope('Singleton')
@provide('model.messageRecord')
export class MessageRecordModel extends MongooseModelBase {

    constructor(@plugin('mongoose') mongoose) {
        super(mongoose);
    }

    buildMongooseModel() {

        const MessageRecordSchema = new this.mongoose.Schema({
            toAddress: {type: String, required: true}, //手机号 或者 邮箱
            authCodeType: {type: String, required: true}, //register or resetPassword
            templateParams: {},//发送参数
            expireDate: {type: Date, required: true},
            status: {type: Number, default: 1, required: true} //1:已发送任务  2:任务发送失败
        }, {
            versionKey: false,
            timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
        })

        MessageRecordSchema.index({toAddress: 1, expireDate: -1});

        return this.mongoose.model('message-record', MessageRecordSchema)
    }
}
