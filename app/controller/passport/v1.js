/**
 * Created by yuliang on 2017/10/19.
 */

'use strict'

const moment = require('moment')

module.exports = app => {
    return class PassPortController extends app.Controller {

        async index(ctx) {
            ctx.success('hello')
        }

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

            ctx.allowContentType({type: 'json'}).validate()

            let condition = {}
            if (/^1[34578]\d{9}$/.test(loginName)) {
                condition.mobile = loginName
            } else if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(loginName)) {
                condition.email = loginName
            } else {
                ctx.errors.push({loginName: '登录名必须是手机号或者邮箱'})
                ctx.validate()
            }

            const userInfo = await ctx.service.userService.getUserInfo(condition)
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

            ctx.cookies.set(app.config.jwtAuth.cookieName, null, {
                expires: moment().add(-1, 'days').toDate()
            })

            if (returnUrl) {
                ctx.redirect(returnUrl)
            } else {
                ctx.success(1)
            }
        }
    }
}