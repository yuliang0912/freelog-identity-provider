/**
 * Created by yuliang on 2017/11/1.
 */

'use strict'

const uuid = require('uuid')
const moment = require('moment')
const helper = require('../extend/helper')
const KnexBaseOperation = require('egg-freelog-database/lib/database/knex-base-operation')

module.exports = class UserProvider extends KnexBaseOperation {

    constructor(app) {
        super(app.knex.user("user_info"), 'userId')
        this.app = app
    }

    /**
     * 获取用户信息
     * @param condition
     * @returns {Promise.<*>}
     */
    getUserInfo(condition) {
        return super.findOne(condition)
    }

    /**
     * 创建用户
     * @param model
     * @returns {Promise.<*>}
     */
    createUser(model) {

        if (!super.type.object(model)) {
            return Promise.reject(new Error("model must be object"))
        }
        model.status = 1
        model.userRole = 1
        model.createDate = moment().toDate()
        model.salt = uuid.v4().replace(/-/g, '')
        model.password = helper.generatePassword(model.salt, model.password)
        model.tokenSn = uuid.v4().replace(/-/g, '')

        return super.create(model)
    }

    /**
     * 更新用户信息
     */
    updateUserInfo(model, condition) {
        return super.update(model, condition)
    }
}