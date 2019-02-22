'use strict'

module.exports = app => {

    const mongoose = app.mongoose;

    const MessageRecordSchema = new mongoose.Schema({
        toAddress: {type: String, required: true}, //手机号 或者 邮箱
        authCodeType: {type: String, required: true}, //register
        templateCode: {},
        templateParams: {},//发送参数
        expireDate: {type: Date, required: true},
        responseMsg: {}, //阿里SMS响应
        status: {type: Number, default: 1, required: true} //1:已发送任务  2:任务发送失败
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    MessageRecordSchema.index({toAddress: 1, expireDate: -1});

    return mongoose.model('message-record', MessageRecordSchema)
}