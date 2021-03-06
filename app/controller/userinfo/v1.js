/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'
const uuid = require('uuid')
const Controller = require('egg').Controller
const authCodeType = require('../../enum/auth-code-type-enum')
const {ArgumentError} = require('egg-freelog-base/error')
const {LoginUser, UnLoginUser, InternalClient} = require('egg-freelog-base/app/enum/identity-type')

module.exports = class UserInfoController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.userProvider = app.dal.userProvider
    }

    /**
     * 获取用户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const userIds = ctx.checkQuery('userIds').exist().match(/^[0-9]{5,12}(,[0-9]{5,12})*$/, ctx.gettext('params-validate-failed', 'userIds')).toSplitArray().len(1, 200).value
        const projection = ctx.checkQuery('projection').optional().toSplitArray().default([]).value
        ctx.validateParams().validateVisitorIdentity(InternalClient | LoginUser)

        await this.userProvider.find({userId: {$in: userIds}}, projection.join(' ')).then(ctx.success)
    }

    /**
     * 获取用户信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    async show(ctx) {

        const userId = ctx.checkParams('id').exist().toInt().gt(10000).value
        ctx.validateParams().validateVisitorIdentity(InternalClient | LoginUser)

        await this.userProvider.findOne({userId}).then(ctx.success)
    }

    /**
     * 获取用户详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async detail(ctx) {

        //手机号,邮箱
        const keywords = ctx.checkQuery('keywords').exist().value
        ctx.validateParams().validateVisitorIdentity(LoginUser | UnLoginUser | InternalClient)

        const condition = {}
        if (ctx.helper.commonRegex.mobile86.test(keywords)) {
            condition.mobile = new RegExp(`^${keywords}$`, 'i')
        } else if (ctx.helper.commonRegex.email.test(keywords)) {
            condition.email = new RegExp(`^${keywords}$`, 'i')
        } else if (ctx.helper.commonRegex.username.test(keywords)) {
            condition.username = new RegExp(`^${keywords}$`, 'i')
        } else {
            throw new ArgumentError(ctx.gettext('params-format-validate-failed', 'keywords'))
        }

        await this.userProvider.findOne(condition).then(ctx.success)
    }

    /**
     * 获取当前登录用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async current(ctx) {

        ctx.validateVisitorIdentity(LoginUser)

        await this.userProvider.findOne({userId: ctx.request.userId}).then(ctx.success)
    }

    /**
     * 注册用户
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const loginName = ctx.checkBody('loginName').exist().notEmpty().value
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value
        const username = ctx.checkBody('username').exist().isUsername().value
        const authCode = ctx.checkBody('authCode').exist().toInt().value
        ctx.validateParams()

        var model = {}
        if (ctx.helper.commonRegex.mobile86.test(loginName)) {
            model.mobile = loginName
        } else if (ctx.helper.commonRegex.email.test(loginName)) {
            model.email = loginName
        } else {
            throw new ArgumentError(ctx.gettext('login-name-format-validate-failed'), {loginName})
        }

        const isVerify = await ctx.service.messageService.verify(authCodeType.register, loginName, authCode)
        if (!isVerify) {
            ctx.error({msg: ctx.gettext('auth-code-validate-failed')})
        }

        const condition = {$or: [{username}, model.mobile ? {mobile: loginName} : {email: loginName}]}
        await this.userProvider.findOne(condition).then(data => {
            if (data && data.mobile === loginName) {
                throw new ArgumentError(ctx.gettext('mobile-register-validate-failed'))
            } else if (data && data.email === loginName) {
                throw new ArgumentError(ctx.gettext('email-register-validate-failed'))
            } else if (data) {
                throw new ArgumentError(ctx.gettext('username-register-validate-failed'))
            }
        })

        const userInfo = Object.assign({username, password}, model)
        await this.userProvider.createUser(userInfo).then(createdUserInfo => {
            ctx.success(createdUserInfo)
            return this._generateHeadImage(ctx, createdUserInfo.userId)
        })
    }

    /**
     * 重置
     * @param ctx
     * @returns {Promise.<void>}
     */
    async resetPassword(ctx) {

        const loginName = ctx.checkBody('loginName').exist().notEmpty().value
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value
        const authCode = ctx.checkBody('authCode').exist().toInt().value
        ctx.allowContentType({type: 'json'}).validateParams()

        const condition = {}
        if (ctx.helper.commonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName
        } else if (ctx.helper.commonRegex.email.test(loginName)) {
            condition.email = loginName
        } else {
            ctx.errors.push({loginName: ctx.gettext('login-name-format-validate-failed')})
            ctx.validate(false)
        }

        const userInfo = await this.userProvider.findOne(condition)
        if (!userInfo) {
            ctx.error({msg: ctx.gettext('user-entity-not-found')})
        }
        const isVerify = await ctx.service.messageService.verify(authCodeType.resetPassword, loginName, authCode)
        if (!isVerify) {
            ctx.error({msg: ctx.gettext('auth-code-validate-failed')})
        }

        const salt = uuid.v4().replace(/-/g, '')
        const newPassword = ctx.helper.generatePassword(salt, password)

        await userInfo.updateOne({password: newPassword, salt}).then(() => ctx.success(true)).catch(ctx.error)
    }

    /**
     * 修改密码
     * @param ctx
     * @returns {Promise<void>}
     */
    async updatePassword(ctx) {

        const oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value
        const newPassword = ctx.checkBody('newPassword').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value
        ctx.allowContentType({type: 'json'}).validateParams().validateVisitorIdentity(LoginUser)

        const userId = ctx.request.userId
        const userInfo = await this.userProvider.findOne({userId})
        if (!userInfo) {
            ctx.error({
                msg: ctx.gettext('login-name-or-password-validate-failed'),
                errCode: ctx.app.errCodeEnum.passwordError
            })
        }
        if (ctx.helper.generatePassword(userInfo.salt, oldPassword) !== userInfo.password) {
            ctx.error({msg: ctx.gettext('login-password-validate-failed'), errCode: ctx.app.errCodeEnum.passwordError})
        }
        if (oldPassword === newPassword) {
            return ctx.success(true)
        }

        const salt = uuid.v4().replace(/-/g, '')
        const password = ctx.helper.generatePassword(salt, newPassword)
        const tokenSn = uuid.v4().replace(/-/g, '')

        await userInfo.updateOne({password, salt, tokenSn}).then(() => ctx.success(true)).catch(ctx.error)
    }

    /**
     * 上传头像
     * @param ctx
     * @returns {Promise<void>}
     */
    async uploadHeadImg(ctx) {

        const fileStream = await ctx.getFileStream()
        if (!fileStream || !fileStream.filename) {
            ctx.error({msg: 'Can\'t found upload file'})
        }
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        const userId = ctx.request.userId
        const {mime, fileBuffer} = await ctx.helper.checkHeadImage(fileStream)
        const fileObjectKey = `headImage/${ctx.request.userId}`

        await ctx.app.ossClient.putBuffer(fileObjectKey, fileBuffer, {headers: {'Content-Type': mime}}).catch(ctx.error)

        const headImageUrl = `https://image.freelog.com/${fileObjectKey}`

        await this.userProvider.updateOne({userId}, {headImage: headImageUrl}).then(() => {
            ctx.success(`${headImageUrl}?x-oss-process=style/head-image`)
        })
    }

    /**
     * 自动修补头像数据
     * @param ctx
     * @returns {Promise<void>}
     */
    async autoRectifyHeadImage(ctx) {

        var userList = await this.userProvider.find({headImage: ''})

        for (let i = 0; i < userList.length; i++) {
            const {userId} = userList[i]
            this._generateHeadImage(ctx, userId).catch(console.error)
        }

        ctx.success(true)
    }

    /**
     * 生成头像并保存
     * @param ctx
     * @param userId
     * @returns {Promise<string>}
     * @private
     */
    async _generateHeadImage(ctx, userId) {

        const fileObjectKey = `headImage/${userId}`
        const fileBuffer = Buffer.from(ctx.helper.generateHeadImage(userId.toString()), 'base64')
        await ctx.app.ossClient.putBuffer(fileObjectKey, fileBuffer, {headers: {'Content-Type': 'image/png'}})
        const headImageUrl = `https://image.freelog.com/${fileObjectKey}`
        await this.userProvider.updateOne({userId: userId}, {headImage: headImageUrl})

        return headImageUrl
    }
}
