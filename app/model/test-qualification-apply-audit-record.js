'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose;

    const toObjectOptions = {
        transform: function (doc, ret, options) {
            return Object.assign({recordId: doc.id}, lodash.omit(ret, ['_id']))
        }
    }

    const TestQualificationApplyAuditRecordSchema = new mongoose.Schema({
        userId: {type: Number, required: true},
        username: {type: String, required: true},
        province: {type: String, required: true},
        city: {type: String, required: true},
        occupation: {type: String, required: true}, //职业
        description: {type: String, required: true},
        auditMsg: {type: String, default: '', required: false}, //错误信息
        operationUserId: {type: Number, default: 0, required: true}, //审核人ID
        status: {type: Number, default: 0, required: true} // 0:待审核 1:审核通过 2:审核不通过
    }, {
        versionKey: false,
        toJSON: toObjectOptions,
        toObject: toObjectOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    return mongoose.model('test-qualification-apply-audit-records', TestQualificationApplyAuditRecordSchema)
}