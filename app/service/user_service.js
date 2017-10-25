/**
 * Created by yuliang on 2017/10/19.
 */

'use strict'

const moment = require('moment')
const uuid = require('node-uuid')

module.exports = app => {
    return class UserInfoService extends app.Service {

        /**
         * 获取用户信息
         * @param condition
         * @returns {Promise.<*>}
         */
        getUserInfo(condition) {
            let {type, knex} = this.app

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return knex.user('user_info').where(condition).first()
        }

        /**
         * 创建用户
         * @param model
         * @returns {Promise.<*>}
         */
        createUser(model) {
            let {type, knex} = this.app

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            model.status = 1
            model.userRole = 1
            model.createDate = moment().toDate()
            model.salt = uuid.v4().replace(/-/g, '')
            model.password = this.ctx.helper.generatePassword(model.salt, model.password)
            model.tokenSn = uuid.v4().replace(/-/g, '')

            return knex.user('user_info').insert(model)
        }

        getLoginUserInfo(loginName) {
            if (!loginName) {
                return Promise.reject(new Error("loginName must be mobile or email"))
            }

        }
    }
}