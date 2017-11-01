/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

module.exports = app => {

    const dataProvider = app.dataProvider

    return class UserInfoController extends app.Controller {

        /**
         * 获取用户信息
         * @param ctx
         * @returns {Promise.<void>}
         */
        async show(ctx) {
            let userId = ctx.checkParams('id').exist().toInt().gt(10000).value

            ctx.validate()

            await dataProvider.userProvider.getUserInfo({userId}).then(userInfo => {
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

            if (ctx.helper.commonRegex.mobile86.test(loginName)) {
                userInfo.mobile = loginName
            } else if (ctx.helper.commonRegex.email.test(loginName)) {
                userInfo.email = loginName
            } else {
                ctx.errors.push({loginName: '登录名必须是手机号或者邮箱'})
                ctx.validate()
            }

            if (userInfo.mobile) {
                await dataProvider.userProvider.getUserInfo({mobile: loginName}).then(user => {
                    user && ctx.error({msg: '手机号已经被注册'})
                })
            }
            if (userInfo.email) {
                await dataProvider.userProvider.getUserInfo({email: loginName}).then(user => {
                    user && ctx.error({msg: '电子邮箱已经被注册'})
                })
            }

            await dataProvider.userProvider.createUser(userInfo).bind(ctx).then(data => {
                return data.length ? dataProvider.userProvider.getUserInfo({userId: data[0]})
                    : Promise.reject('用户创建失败')
            }).then(model => {
                ctx.helper.deleteProperty(model, 'salt', 'tokenSn', 'password')
                ctx.success(model)
            }).catch(ctx.error)
        }
    }
}