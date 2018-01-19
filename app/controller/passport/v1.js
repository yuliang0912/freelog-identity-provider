/**
 * Created by yuliang on 2017/10/19.
 */

'use strict'

const moment = require('moment')

module.exports = app => {

    const dataProvider = app.dataProvider

    return class PassPortController extends app.Controller {
        /**
         * 登录接口
         * @returns {Promise.<void>}
         */
        async login(ctx) {
            let loginName = ctx.checkBody("loginName").notEmpty().value
            let password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
            let isRememer = ctx.checkBody("isRememer").default(0).in([0, 1]).toInt().value
            let returnUrl = ctx.checkBody("returnUrl").default('').value
            let jwtType = ctx.checkBody('jwtType').default('cookie').in(['cookie', 'header']).value

            ctx.allowContentType({type: 'json'}).validate(false)

            let condition = {}
            if (ctx.helper.commonRegex.mobile86.test(loginName)) {
                condition.mobile = loginName
            } else if (ctx.helper.commonRegex.email.test(loginName)) {
                condition.email = loginName
            } else {
                ctx.errors.push({loginName: '登录名必须是手机号或者邮箱'})
                ctx.validate(false)
            }

            const userInfo = await dataProvider.userProvider.getUserInfo(condition)
            if (!userInfo) {
                ctx.error({msg: '用户名或密码错误', errCode: app.errCodeEnum.passWordError})
            }

            if (ctx.helper.generatePassword(userInfo.salt, password) !== userInfo.password) {
                ctx.error({msg: '用户名或密码错误', errCode: app.errCodeEnum.passWordError})
            }

            ctx.helper.deleteProperty(userInfo, 'salt', 'password')
            const jwtStr = ctx.helper.jwtHelper.createJwt(userInfo, app.config.jwtAuth.privateKey, userInfo.tokenSn)

            if (jwtType === 'cookie') {
                ctx.cookies.set(app.config.jwtAuth.cookieName, jwtStr, {
                    httpOnly: true,
                    domain: 'freelog.com',
                    overwrite: true,
                    expires: isRememer ? moment().add(7, 'days').toDate() : undefined
                })
            } else {
                ctx.set('Authorization', `Bearer ${jwtStr}`)
            }

            ctx.success(userInfo)

            if (returnUrl !== '') {
                ctx.redirect(returnUrl)
            }
        }

        /**
         * 退出登陆(清理cookie)
         */
        async logout(ctx) {

            let returnUrl = ctx.checkQuery("returnUrl").default('').value

            ctx.cookies.set('authInfo', null, {
                domain: 'freelog.com'
            });

            if (returnUrl) {
                ctx.redirect(returnUrl)
            } else {
                ctx.success(1)
            }
        }
    }
}