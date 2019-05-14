'use strict'

const uuid = require('uuid')
const helper = require('../extend/helper')
const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class UserInfoProvider extends MongoBaseOperation {

    constructor(app) {
        super(app.model.UserInfo)
        this.app = app
    }

    /**
     * 创建用户
     * @param model
     * @returns {Promise.<*>}
     */
    async createUser(model) {

        const userId = await this.app.dal.autoIncrementRecordProvider.getNextDateValue()

        model.userId = userId
        model.salt = uuid.v4().replace(/-/g, '')
        model.password = helper.generatePassword(model.salt, model.password)
        model.tokenSn = uuid.v4().replace(/-/g, '')

        return super.create(model)
    }
}