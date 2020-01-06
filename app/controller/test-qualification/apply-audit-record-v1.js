/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const Controller = require('egg').Controller
const {ArgumentError, ApplicationError} = require('egg-freelog-base/error')
const {LoginUser, InternalClient} = require('egg-freelog-base/app/enum/identity-type')

module.exports = class BetaTestController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.userProvider = app.dal.userProvider
        this.activationCodeProvider = app.dal.activationCodeProvider
        this.testQualificationApplyAuditRecordProvider = app.dal.testQualificationApplyAuditRecordProvider
    }

    /**
     * 获取用户申请列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const page = ctx.checkQuery("page").default(1).gt(0).toInt().value
        const pageSize = ctx.checkQuery("pageSize").default(10).gt(0).lt(101).toInt().value
        const status = ctx.checkQuery("status").optional().toInt().value
        const username = ctx.checkQuery("username").optional().isUsername().value
        const userId = ctx.checkQuery("userId").optional().toInt().value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        const condition = {}
        if ([0, 1, 2].includes(status)) {
            condition.status = status
        }
        if (userId) {
            condition.userId = userId
        }
        if (username !== undefined) {
            condition.username = username
        }

        const totalItem = await this.testQualificationApplyAuditRecordProvider.count(condition)
        const result = {page, pageSize, totalItem, dataList: []}
        if (totalItem <= (page - 1) * pageSize) {
            return ctx.success(result)
        }

        result.dataList = await this.testQualificationApplyAuditRecordProvider.findPageList(condition, page, pageSize, null, {createDate: -1})

        ctx.success(result)
    }

    /**
     * 查看申请记录详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const recordId = ctx.checkParams("recordId").exist().isMongoObjectId().value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        await this.testQualificationApplyAuditRecordProvider.findById(recordId).then(ctx.success)
    }

    /**
     * 申请内测资格
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const province = ctx.checkBody("province").exist().type('string').len(2, 10).value
        const city = ctx.checkBody("city").exist().type('string').len(2, 10).value
        const occupation = ctx.checkBody("occupation").exist().type('string').len(2, 15).value
        const description = ctx.checkBody("description").exist().type('string').len(1, 500).value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        const {userInfo} = ctx.request.identityInfo

        if (userInfo.userType > 0) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'))
        }

        const userApplyRecord = await this.testQualificationApplyAuditRecordProvider.findOne({
            userId: userInfo.userId,
            status: 0
        })
        if (userApplyRecord) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-existing-error'))
        }

        const model = {
            userId: userInfo.userId,
            username: userInfo.username,
            province, city, occupation, description
        }

        await this.testQualificationApplyAuditRecordProvider.create(model).then(ctx.success)
    }

    /**
     * 使用授权码激活测试资格
     * @returns {Promise<void>}
     */
    async activateTestQualification(ctx) {

        const code = ctx.checkBody("code").type('string').len(30, 30).value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        const userInfo = await this.userProvider.findOne({userId: ctx.request.userId}).tap(model => ctx.entityNullObjectCheck(model))
        if ((userInfo.userType & 1) === 1) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'))
        }

        const activationCodeInfo = await this.activationCodeProvider.findOne({code, type: 'beta'})
        if (activationCodeInfo.status === 2 || activationCodeInfo.usedCount >= activationCodeInfo.limitCount) {
            throw new ApplicationError(ctx.gettext('test-qualification-activation-code-invalid'))
        }

        const task1 = activationCodeInfo.updateOne({
            $inc: {usedCount: 1}, status: 2, destroyDate: new Date(),
            $push: {usedUsers: ctx.request.userId}
        })

        const task2 = userInfo.updateOne({userType: userInfo.userType | 1})

        await Promise.all([task1, task2]).then(() => ctx.success(true))
    }

    /**
     * 修改审核信息(理论上在审核之前可以一直修改,目前界面不实现此操作)
     * @param ctx
     * @returns {Promise<void>}
     */
    async update(ctx) {

        const recordIds = ctx.checkBody("recordIds").exist().isArray().len(1, 50).value
        const status = ctx.checkBody('status').exist().toInt().value //只有初始态才可以修改
        const auditMsg = ctx.checkBody('auditMsg').optional().type('string').default('').value //只有初始态才可以修改
        ctx.validateParams().validateOfficialAuditAccount()

        const applyRecordInfos = await this.testQualificationApplyAuditRecordProvider.find({_id: {$in: recordIds}})

        const tasks = []
        applyRecordInfos.forEach(applyRecordInfo => {
            if (applyRecordInfo.status === 0) {
                let task = ctx.service.testQualificationApplyAuditService.auditTestQualificationApply(applyRecordInfo, {
                    status, auditMsg
                })
                tasks.push(task)
            }
        })

        await Promise.all(tasks).then(x => ctx.success(true))
    }


    /**
     * 删除申请记录
     * @param ctx
     * @returns {Promise<void>}
     */
    async destroy(ctx) {
        ctx.validateParams().validateVisitorIdentity(LoginUser)
        await this.testQualificationApplyAuditRecordProvider.deleteMany({userId: ctx.request.userId}).then(ctx.success)
    }
}
