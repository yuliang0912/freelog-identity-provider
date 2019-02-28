/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'
const uuid = require('uuid')
const Controller = require('egg').Controller
const authCodeType = require('../../enum/auth-code-type-enum')

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

        ctx.validate(false)

        await this.userProvider.getUserListByUserIds(userIds).then(ctx.success).catch(ctx.error)
    }

    /**
     * 获取用户信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    async show(ctx) {

        const userId = ctx.checkParams('id').exist().toInt().gt(10000).value

        ctx.validate()

        await this.userProvider.findOne({userId}).then(ctx.success)
    }

    /**
     * 获取当前登录用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async current(ctx) {

        ctx.validate()

        await this.userProvider.findOne({userId: ctx.request.userId}).then(ctx.success)
    }

    /**
     * 注册用户
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const loginName = ctx.checkBody('loginName').exist().notEmpty().value
        const password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
        const nickname = ctx.checkBody('nickname').exist().len(2, 20).notEmpty().value
        const userName = ctx.checkBody('userName').optional().len(2, 20).default('').value
        const authCode = ctx.checkBody('authCode').exist().toInt().value

        ctx.allowContentType({type: 'json'}).validate(false)

        const userInfo = {nickname, userName, password}

        if (ctx.helper.commonRegex.mobile86.test(loginName)) {
            userInfo.mobile = loginName
        } else if (ctx.helper.commonRegex.email.test(loginName)) {
            userInfo.email = loginName
        } else {
            ctx.errors.push({loginName: ctx.gettext('login-name-format-validate-failed')})
            ctx.validate(false)
        }

        const isVerify = await ctx.service.messageService.verify(authCodeType.register, loginName, authCode)
        if (!isVerify) {
            ctx.error({msg: ctx.gettext('auth-code-validate-failed')})
        }
        if (userInfo.mobile) {
            await this.userProvider.count({mobile: loginName}).then(count => {
                count && ctx.error({msg: ctx.gettext('mobile-register-validate-failed')})
            })
        }
        if (userInfo.email) {
            await this.userProvider.count({email: loginName}).then(count => {
                count && ctx.error({msg: ctx.gettext('email-register-validate-failed')})
            })
        }

        var model = await this.userProvider.createUser(userInfo)

        this._generateHeadImage(ctx, model.userId).catch(console.error)

        ctx.success(model)
    }

    /**
     * 重置
     * @param ctx
     * @returns {Promise.<void>}
     */
    async resetPassword(ctx) {

        const loginName = ctx.checkBody('loginName').exist().notEmpty().value
        const password = ctx.checkBody('password').exist().len(6, 24).notEmpty().value
        const authCode = ctx.checkBody('authCode').exist().toInt().value

        ctx.allowContentType({type: 'json'}).validate(false)

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
        const newPassword = ctx.checkBody('newPassword').exist().notBlank().trim().len(6, 50).value

        ctx.allowContentType({type: 'json'}).validate()

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
        ctx.validate()

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
