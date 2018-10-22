'use strict'

const lodash = require('lodash')

module.exports = app => {
    const mongoose = app.mongoose;

    const toObjectOptions = {
        transform: function (doc, ret, options) {
            return Object.assign({id: doc.id}, lodash.omit(ret, ['_id']))
        }
    }

    const FreelogGroupSchema = new mongoose.Schema({
        groupId: {type: String, unique: true, required: true},
        groupName: {type: String, required: true},
        groupType: {type: Number, required: true},//分组类型 1:用户 2:节点
        userId: {type: Number, required: true}, //创建者ID
        members: {type: Array, required: true},
        memberCount: {type: Number, required: true},
        status: {type: Number, default: 0, required: true} //状态
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
        toJSON: toObjectOptions,
        toObject: toObjectOptions
    })

    FreelogGroupSchema.index({userId: 1, groupType: 1});

    return mongoose.model('freelog-groups', FreelogGroupSchema)
}