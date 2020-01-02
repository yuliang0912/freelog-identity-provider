/**
 * Created by yuliang on 2017/10/20.
 */

'use strict'

const uuid = require('uuid')
const Controller = require('egg').Controller
const {LoginUser} = require('egg-freelog-base/app/enum/identity-type')
const cryptoHelper = require('egg-freelog-base/app/extend/helper/crypto_helper')

module.exports = class BetaTestController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.activationCodeProvider = app.dal.activationCodeProvider
    }

    /**
     * 获取用户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const page = ctx.checkQuery("page").default(1).gt(0).toInt().value
        const pageSize = ctx.checkQuery("pageSize").default(10).gt(0).lt(101).toInt().value
        const status = ctx.checkQuery("status").optional().toInt().value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        const condition = {}
        if ([0, 1, 2].includes(status)) {
            condition.status = status
        }
        const totalItem = await this.activationCodeProvider.count(condition)
        const result = {page, pageSize, totalItem, dataList: []}
        if (totalItem <= (page - 1) * pageSize) {
            return ctx.success(result)
        }

        result.dataList = await this.activationCodeProvider.findPageList(condition, page, pageSize, null, {createDate: -1})

        ctx.success(result)
    }

    /**
     * 查看详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const code = ctx.checkParams("id").type('string').len(30, 30).value
        ctx.validateParams().validateVisitorIdentity(LoginUser)

        await this.activationCodeProvider.findOne({code}).then(ctx.success)
    }

    /**
     * 批量创建
     * @param ctx
     * @returns {Promise<void>}
     */
    async batchCreate(ctx) {

        const createQuantity = ctx.checkBody('quantity').optional().toInt().gt(1).lt(51).default(10).value
        ctx.validateParams().validateOfficialAuditAccount()

        const codes = []
        while (codes.length < createQuantity) {
            let code = cryptoHelper.base64Encode(uuid.v4() + uuid.v4())
            codes.push(code.substr(0, 30))
        }

        const list = codes.map(x => Object({code: x, type: 'beta'}))

        await this.activationCodeProvider.insertMany(list).then(ctx.success)
    }

    /**
     * 批量修改,目前仅支持修改为分发状态
     * @param ctx
     * @returns {Promise<void>}
     */
    async batchUpdate(ctx) {

        const codes = ctx.checkBody('codes').exist().isArray().len(1, 100).value //目前只能设置为分发状态
        const status = ctx.checkBody('status').exist().in([1]).value //目前只能设置为分发状态
        ctx.validateParams().validateOfficialAuditAccount()

        await this.activationCodeProvider.updateMany({code: {$in: codes}, status: 0}, {
            status,
            distributeDate: new Date()
        }).then(() => ctx.success(true))
    }

    /**
     * 授权码状态统计
     * @param ctx
     * @returns {Promise<void>}
     */
    async codeStatusStatistics(ctx) {

        const statisticsInfos = await this.activationCodeProvider.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum: 1}
                }
            }
        ])

        const results = [{name: "未使用", status: 0}, {name: "已分发", status: 1}, {name: "已核销", status: 2}].map(item => {
            let info = statisticsInfos.find(x => x._id === item.status)
            item.count = info ? info.count : 0
            return item
        })

        ctx.success(results)
    }
}
