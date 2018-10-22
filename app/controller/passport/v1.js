/**
 * Created by yuliang on 2017/10/19.
 */

'use strict'

const moment = require('moment')
const Controller = require('egg').Controller;
const jwtHelper = require('egg-freelog-base/app/extend/helper/jwt_helper')

module.exports = class PassPortController extends Controller {

    /**
     * 登录接口
     * @returns {Promise.<void>}
     */
    async login(ctx) {

        const loginName = ctx.checkBody("loginName").exist().notEmpty().value
        const password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
        const isRemember = ctx.checkBody("isRememer").optional().toInt().in([0, 1]).default(0).value
        const returnUrl = ctx.checkBody("returnUrl").optional().value
        const jwtType = ctx.checkBody('jwtType').optional().in(['cookie', 'header']).default('cookie').value

        ctx.allowContentType({type: 'json'}).validate(false)

        const {app, helper, config, cookies} = ctx
        const condition = {}
        if (helper.commonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName
        } else if (helper.commonRegex.email.test(loginName)) {
            condition.email = loginName
        } else {
            ctx.error({msg: '登录名必须是手机号或者邮箱', data: {loginName}})
        }

        const userInfo = await ctx.dal.userProvider.getUserInfo(condition)
        if (!userInfo) {
            ctx.error({msg: '用户名或密码错误', errCode: ctx.app.errCodeEnum.passWordError})
        }
        if (helper.generatePassword(userInfo.salt, password) !== userInfo.password) {
            ctx.error({msg: '用户名或密码错误', errCode: ctx.app.errCodeEnum.passWordError})
        }

        app.deleteProperties(userInfo, 'salt', 'password')

        const {publicKey, privateKey, cookieName} = config.jwtAuth
        const payLoad = Object.assign({}, userInfo, generateJwtPayload(userInfo.userId, userInfo.tokenSn))
        const jwtStr = new jwtHelper(publicKey, privateKey).createJwt(payLoad, 1296000)

        if (jwtType === 'cookie') {
            cookies.set(cookieName, jwtStr, {
                httpOnly: false,
                domain: config.domain || 'freelog.com',
                overwrite: true,
                signed: false,
                expires: isRemember ? moment().add(7, 'days').toDate() : undefined
            })
        } else {
            ctx.set('Authorization', `Bearer ${jwtStr}`)
        }

        ctx.success(userInfo)

        if (returnUrl) {
            ctx.redirect(returnUrl)
        }
    }

    /**
     * 退出登陆(清理cookie)
     */
    async logout(ctx) {

        const returnUrl = ctx.checkQuery("returnUrl").optional().decodeURIComponent().isUrl().value

        ctx.validate(false)

        ctx.cookies.set(ctx.app.config.jwtAuth.cookieName, null, {
            domain: ctx.app.config.domain || 'freelog.com'
        });

        if (returnUrl) {
            ctx.redirect(returnUrl)
        } else {
            ctx.success(1)
        }
    }
}

const generateJwtPayload = (userId, token) => {

    const currTime = Math.round(new Date().getTime() / 1000)

    return {
        iss: "https://identity.freelog.com",
        sub: userId.toString(),
        aud: "freelog-website",
        exp: currTime + 1296000,
        iat: currTime,
        jti: token
    }
}
