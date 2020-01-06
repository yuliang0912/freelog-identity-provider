'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose;

    const toObjectOptions = {
        transform: function (doc, ret, options) {
            return Object.assign(lodash.omit(ret, ['_id']))
        }
    }

    const ActivationSchema = new mongoose.Schema({
        code: {type: String, required: true, unique: true},
        type: {type: String, required: true}, // 1:beta-code
        usedCount: {type: Number, default: 0, required: true},
        limitCount: {type: Number, default: 1, required: true, mixin: 1},
        usedUsers: {type: [Number], default: []},
        distributeDate: {type: Date, default: null, required: false}, // 分发时间
        destroyDate: {type: Date, default: null, required: false}, // 核销时间
        status: {type: Number, default: 0, required: true}, //0:未使用 1:已分发 2:已核销
    }, {
        versionKey: false,
        toJSON: toObjectOptions,
        toObject: toObjectOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    return mongoose.model('activation-code', ActivationSchema)
}