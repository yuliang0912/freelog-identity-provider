/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

module.exports = app => {
    return class UserInfoController extends app.Controller {

        /**
         * 获取用户信息
         * @param ctx
         * @returns {Promise.<void>}
         */
        async show(ctx) {
            let userId = ctx.checkParams('id').exist().toInt().gt(10000).value

            await ctx.validate().service.userService.getUserInfo({userId}).then(userInfo => {
                ctx.helper.deleteProperty(userInfo, 'salt', 'password')
                ctx.success(userInfo)
            })
        }

        /**
         * 注册用户
         * @param ctx
         * @returns {Promise.<void>}
         */
        async create(ctx) {

            let loginName = ctx.checkBody('loginName').exist().notEmpty().value
            let password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
            let nickname = ctx.checkBody('nickname').exist().len(2, 20).notEmpty().value
            let userName = ctx.checkBody('userName').default('').value

            if (userName !== undefined && userName !== '' && (userName.length < 2 || userName.length > 20)) {
                ctx.errors.push({userName: '用户姓名必须在2到20个字符之间'})
            }

            ctx.allowContentType({type: 'json'}).validate()

            let userInfo = {nickname, userName, password}
            if (/^1[34578]\d{9}$/.test(loginName)) {
                userInfo.mobile = loginName
            } else if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(loginName)) {
                userInfo.email = loginName
            } else {
                ctx.errors.push({loginName: '登录名必须是手机号或者邮箱'})
                ctx.validate()
            }

            if (userInfo.mobile) {
                await ctx.service.userService.getUserInfo({mobile: loginName}).then(user => {
                    user && ctx.error({msg: '手机号已经被注册'})
                })
            }
            if (userInfo.email) {
                await ctx.service.userService.getUserInfo({email: loginName}).then(user => {
                    user && ctx.error({msg: '电子邮箱已经被注册'})
                })
            }

            await ctx.service.userService.createUser(userInfo).bind(ctx).then(data => {
                return data.length ? ctx.service.userService.getUserInfo({userId: data[0]})
                    : Promise.reject('用户创建失败')
            }).then(model => {
                ctx.helper.deleteProperty(model, 'salt', 'tokenSn', 'password')
                ctx.success(model)
            }).catch(ctx.error)
        }
    }
}