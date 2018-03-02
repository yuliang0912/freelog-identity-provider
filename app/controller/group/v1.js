'use strict'

const Controller = require('egg').Controller;

module.exports = class UserGroupController extends Controller {

    /**
     * 创建用户分组
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {
        let groupName = ctx.checkBody('groupName').exist().notBlank().len(4, 20).value
        let members = ctx.checkBody('members').exist().isArray().len(1, 200).value
        let groupType = ctx.checkBody('groupType').exist().toInt().in([1, 2]).value

        ctx.allowContentType({type: 'json'}).validate()

        members.forEach(parseInt)

        await ctx.service.groupService.createGroup({groupName, members, groupType})
            .then(data => ctx.success(data)).catch(err => ctx.error(err))
    }


    /**
     * 查看分组详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        let groupId = ctx.checkParams('id').isGroupId().value
        ctx.validate()

        await ctx.dal.groupProvider.findOne({groupId}).bind(ctx)
            .then(ctx.success).catch(ctx.error)
    }

    /**
     * 查询列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async list(ctx) {

        let groupIds = ctx.checkQuery('groupIds').isSplitGroupId().toSplitArray().len(1, 100).value

        ctx.validate()

        let condition = {groupId: {$in: groupIds}}

        await ctx.dal.groupProvider.find(condition).bind(ctx).then(ctx.success).catch(ctx.error)
    }

    /**
     * 操作分组成员
     * @param ctx
     * @returns {Promise<void>}
     */
    async operationMembers(ctx) {

        let groupId = ctx.checkParams('groupId').isGroupId().value
        let members = ctx.checkBody('members').exist().isArray().len(1, 200).value
        let operationType = ctx.checkBody('operationType').exist().toInt().in([1, 2]).value

        ctx.allowContentType({type: 'json'}).validate()

        let groupInfo = await ctx.dal.groupProvider.findOne({groupId})

        if (!groupInfo || groupInfo.userId !== ctx.request.userId) {
            ctx.error({msg: 'groupId错误或者没有操作权限'})
        }

        await  ctx.service.groupService.operationMembers({groupInfo, members, operationType})
            .then(data => ctx.success(true)).catch(err => ctx.error(err))
    }

    /**
     * 是否存在指定的成员
     * @param ctx
     * @returns {Promise<void>}
     */
    async isExistMember(ctx) {

        let groupIds = ctx.checkQuery('groupIds').exist().isSplitGroupId().toSplitArray().len(1, 100).value
        let memberId = ctx.checkQuery("memberId").exist().toInt().gt(0).value

        ctx.validate(false)

        let condition = {
            groupId: {$in: groupIds}, 'members.memberId': memberId
        }

        let groups = await ctx.dal.groupProvider.find(condition, 'groupId groupName')

        ctx.success(groups)
    }
}