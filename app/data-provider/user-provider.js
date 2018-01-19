/**
 * Created by yuliang on 2017/11/1.
 */

'use strict'

const moment = require('moment')
const uuid = require('uuid')
const helper = require('../extend/helper')

module.exports = app => {

    const {type, knex} = app

    return {

        /**
         * 获取用户信息
         * @param condition
         * @returns {Promise.<*>}
         */
        getUserInfo(condition) {

            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return knex.user('user_info').where(condition).first()
        },

        /**
         * 创建用户
         * @param model
         * @returns {Promise.<*>}
         */
        createUser(model) {

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }

            model.status = 1
            model.userRole = 1
            model.createDate = moment().toDate()
            model.salt = uuid.v4().replace(/-/g, '')
            model.password = helper.generatePassword(model.salt, model.password)
            model.tokenSn = uuid.v4().replace(/-/g, '')

            return knex.user('user_info').insert(model)
        },

        /**
         * 更新用户信息
         */
        updateUserInfo(model, condition){

            if (!type.object(model)) {
                return Promise.reject(new Error("model must be object"))
            }
            if (!type.object(condition)) {
                return Promise.reject(new Error("condition must be object"))
            }

            return knex.user('user_info').update(model).where(condition)
        },

        getLoginUserInfo(loginName) {
            if (!loginName) {
                return Promise.reject(new Error("loginName must be mobile or email"))
            }
        }
    }
}