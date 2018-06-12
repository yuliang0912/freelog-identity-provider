/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = {

    /**
     * 生成加密密码
     */
    generatePassword(salt, password) {

        const text = `identity@freelog.com#${password}`

        return crypto.hmacSha1(crypto.base64Encode(text), salt)
    },
}