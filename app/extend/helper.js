/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')
const jwtHelper = require('./helper/jwt_helper')

module.exports = {

    /**
     * 生成加密密码
     */
    generatePassword(salt, password){

        const text = `identity@freelog.com#${password}`

        return crypto.hmacSha1(crypto.base64Encode(text), salt)
    },

    /**
     * 删除属性
     * @param target
     * @param args
     */
    deleteProperty(target, ...args){
        args.forEach(field => {
            Reflect.deleteProperty(target, field)
        })
        return target
    },

    /**
     * jwt帮助类
     */
    jwtHelper
}