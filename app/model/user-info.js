'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose;

    const toObjectOptions = {
        transform: function (doc, ret, options) {
            return lodash.omit(ret, ['_id', 'password', 'salt', 'updateDate', 'userRole'])
        }
    }

    const UserInfoSchema = new mongoose.Schema({
        userId: {type: Number, unique: true, required: true}, //用户ID
        username: {type: String, unique: true, required: true},
        email: {type: String, required: false, default: ''},
        mobile: {type: String, required: false, default: ''},
        userRole: {type: Number, required: true, default: 1, enum: [1, 2, 3, 4, 5, 7]},
        headImage: {type: String, required: false, default: ''},
        password: {type: String, required: true},
        salt: {type: String, required: true},
        tokenSn: {type: String, required: true},
        userType: {type: Number, required: true, default: 0, enum: [0, 1]}, // 0:初始账户 1:内测用户
        status: {type: Number, default: 0, required: true}
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
        toJSON: toObjectOptions,
        toObject: toObjectOptions
    })

    UserInfoSchema.index({userId: 1});

    return mongoose.model('user-infos', UserInfoSchema)
}