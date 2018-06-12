/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const uuid = require('uuid')
const Controller = require('egg').Controller;

module.exports = class UserInfoController extends Controller {

    /**
     * 获取用户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const userIds = ctx.checkQuery('userIds').exist().match(/^[0-9]{5,12}(,[0-9]{5,12})*$/, 'userIds格式错误').toSplitArray().len(1, 200).value
        ctx.validate(false)

        userIds.forEach(x => parseInt(x))

        await ctx.dal.userProvider.getUserListByUserIds(userIds).then(ctx.success).catch(ctx.error)
    }

    /**
     * 获取用户信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    async show(ctx) {
        let userId = ctx.checkParams('id').exist().toInt().gt(10000).value

        ctx.validate()

        await ctx.dal.userProvider.getUserInfo({userId}).then(userInfo => {
            if (userInfo) {
                ctx.app.deleteProperties(userInfo, 'salt', 'password')
            }
            ctx.success(userInfo)
        })
    }

    /**
     * 获取当前登录用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async current(ctx) {

        ctx.validate()

        await ctx.dal.userProvider.getUserInfo({userId: ctx.request.userId}).then(userInfo => {
            if (userInfo) {
                ctx.app.deleteProperties(userInfo, 'salt', 'password')
            }
            ctx.success(userInfo)
        })
    }

    /**
     * 注册用户
     * @param ctx
     * @returns {Promise.<void>}
     */
    async register(ctx) {

        let loginName = ctx.checkBody('loginName').exist().notEmpty().value
        let password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
        let nickname = ctx.checkBody('nickname').exist().len(2, 20).notEmpty().value
        let userName = ctx.checkBody('userName').optional().len(2, 20).default('').value

        ctx.allowContentType({type: 'json'}).validate(false)

        let userInfo = {nickname, userName, password}

        if (ctx.helper.commonRegex.mobile86.test(loginName)) {
            userInfo.mobile = loginName
        } else if (ctx.helper.commonRegex.email.test(loginName)) {
            userInfo.email = loginName
        } else {
            ctx.errors.push({loginName: '登录名必须是手机号或者邮箱'})
            ctx.validate(false)
        }

        if (userInfo.mobile) {
            await ctx.dal.userProvider.getUserInfo({mobile: loginName}).then(user => {
                user && ctx.error({msg: '手机号已经被注册'})
            })
        }
        if (userInfo.email) {
            await ctx.dal.userProvider.getUserInfo({email: loginName}).then(user => {
                user && ctx.error({msg: '电子邮箱已经被注册'})
            })
        }

        await ctx.dal.userProvider.createUser(userInfo).then(data => {
            return data.length ? ctx.dal.userProvider.getUserInfo({userId: data[0]})
                : Promise.reject('用户创建失败')
        }).then(model => {
            ctx.app.deleteProperties(model, 'salt', 'tokenSn', 'password')
            ctx.success(model)
        }).catch(ctx.error)
    }

    /**
     * 重置
     * @param ctx
     * @returns {Promise.<void>}
     */
    async resetPassword(ctx) {
        let loginName = ctx.checkBody('loginName').exist().notEmpty().value
        let password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value

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

        let userInfo = await ctx.dal.userProvider.getUserInfo(condition).catch(ctx.error)
        if (!userInfo) {
            ctx.error({msg: '未找到有效用户'})
        }

        let newPassword = ctx.helper.generatePassword(userInfo.salt, password)

        await ctx.dal.userProvider.updateUserInfo({password: newPassword}, condition).then(() => {
            ctx.success(true)
        }).catch(ctx.error)
    }

    /**
     * 修改密码
     * @param ctx
     * @returns {Promise<void>}
     */
    async updatePassword(ctx) {

        let oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value
        let newPassword = ctx.checkBody('newPassword').exist().notBlank().trim().len(6, 50).value

        ctx.allowContentType({type: 'json'}).validate()

        const userInfo = await ctx.dal.userProvider.getUserInfo({userId: ctx.request.userId})

        if (!userInfo) {
            ctx.error({msg: '用户名或密码错误', errCode: ctx.app.errCodeEnum.passWordError})
        }

        if (ctx.helper.generatePassword(userInfo.salt, oldPassword) !== userInfo.password) {
            ctx.error({msg: '原始密码错误', errCode: ctx.app.errCodeEnum.passWordError})
        }

        let model = {}
        model.salt = uuid.v4().replace(/-/g, '')
        model.password = ctx.helper.generatePassword(model.salt, newPassword)
        model.tokenSn = uuid.v4().replace(/-/g, '')

        await ctx.dal.userProvider.updateUserInfo(model, {userId: ctx.request.userId}).then(() => {
            ctx.success(true)
        }).catch(ctx.error)
    }

}
