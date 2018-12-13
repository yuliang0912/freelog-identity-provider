'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose;

    const toObjectOptions = {
        transform: function (doc, ret, options) {
            return lodash.omit(ret, ['_id', 'password', 'salt', 'updateDate'])
        }
    }

    const UserInfoSchema = new mongoose.Schema({
        userId: {type: Number, unique: true, required: true}, //用户ID
        userName: {type: String, required: false, default: ''},
        nickname: {type: String, required: false, default: ''},
        email: {type: String, required: false, default: ''},
        mobile: {type: String, required: false, default: ''},
        userRole: {type: Number, required: true, default: 1, enum: [1, 2, 3, 4, 5, 7]},
        headImage: {type: String, required: false, default: ''},
        password: {type: String, required: true},
        salt: {type: String, required: true},
        tokenSn: {type: String, required: true},
        status: {type: Number, default: 1, required: true} //状态
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
        toJSON: toObjectOptions,
        toObject: toObjectOptions
    })

    UserInfoSchema.index({userId: 1, groupType: 1});

    return mongoose.model('user-info', UserInfoSchema)
}