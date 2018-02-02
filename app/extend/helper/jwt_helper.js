/**
 * Created by yuliang on 2017-06-24.
 */

'use strict'

const uuid = require('uuid')
const crypto = require('egg-freelog-base/app/extend/helper/crypto_helper')

const expireSpan = 1296000  //过期时间设置为14天
const jwtBaseInfo = Object.freeze({
    iss: "FREE-LOG-IDENTITY-PROVIDER",
    sub: "user",
    aud: "freeLogWebSite",
})

module.exports = {
    /**
     * 创建json web token 身份标示信息
     */
    createJwt(identityInfo, privateKey, token) {
        let header = {
            alg: "RSA-SHA256",  //目前固定位RSA-SHA256算法签名
            typ: "JWT"
        }

        let payLoad = Object.assign({}, identityInfo, this._generateJwtPayload(token))
        let headerBase64Str = crypto.base64Encode(JSON.stringify(header))
        let payLoadBase64Str = crypto.base64Encode(JSON.stringify(payLoad))
        let signature = crypto.rsaSha256Sign(`${headerBase64Str}.${payLoadBase64Str}`, privateKey)

        return `${headerBase64Str}.${payLoadBase64Str}.${signature}`
    },

    /**
     * 校验jwt是否合法
     * @param jwtStr jwt字符串
     * @param publicKey 公key
     * @returns {{isVerify: true, payLoad: object-payLoad}}
     */
    verifyJwt(jwtStr, publicKey) {
        let jwtPartArray = jwtStr.split('.')
        if (jwtPartArray.length !== 3) {
            throw new Error('jwtStr格式错误')
        }

        let isVerify = crypto.rsaSha256Verify(`${jwtPartArray[0]}.${jwtPartArray[1]}`, jwtPartArray[2], publicKey)

        return {
            isVerify: isVerify,
            payLoad: isVerify ? JSON.parse(crypto.base64Decode(jwtPartArray[1])) : null
        }
    },

    /**
     * 生成jtw payLoad
     * @param token
     * @returns {*}
     * @private
     */
    _generateJwtPayload  (token)  {
        let currTime = Math.round(new Date().getTime() / 1000)
        return Object.assign({
            exp: currTime + expireSpan,
            iat: currTime,
            jti: token || uuid.v4()
        }, jwtBaseInfo)
    }
}
