/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const headImageFileCheck = new (require('./head-image-check'))
const generateHeadImage = new (require('./generate-head-image'))
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = {

    /**
     * 生成加密密码
     */
    generatePassword(salt, password) {

        const text = `identity@freelog.com#${password}`

        return crypto.hmacSha1(crypto.base64Encode(text), salt)
    },

    /**
     * 生成头像
     */
    generateHeadImage(key, schemeId) {
        return generateHeadImage.generateHeadImage(key, schemeId)
    },

    /**
     * 检查头像文件
     */
    checkHeadImage(fileStream) {
        return headImageFileCheck.check(fileStream)
    }
}