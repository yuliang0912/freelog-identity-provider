'use strict'

module.exports = app => {

    const mongoose = app.mongoose;

    const AutoIncrementRecordSchema = new mongoose.Schema({
        dataType: {type: String, unique: true, default: 'USER_ID', required: true},
        value: {type: Number, required: true, mixin: 1}
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    AutoIncrementRecordSchema.index({dataType: 1});

    return mongoose.model('auto-increment-record', AutoIncrementRecordSchema)
}