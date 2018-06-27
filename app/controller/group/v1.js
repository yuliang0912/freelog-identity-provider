'use strict'

const Controller = require('egg').Controller;

module.exports = class UserGroupController extends Controller {


    /**
     * 分组列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async index(ctx) {

        const page = ctx.checkQuery("page").default(1).gt(0).toInt().value
        const pageSize = ctx.checkQuery("pageSize").default(10).gt(0).lt(101).toInt().value
        const groupType = ctx.checkQuery("groupType").optional().toInt().in([1, 2]).value

        ctx.validate()

        const condition = {
            userId: ctx.request.userId
        }
        if (groupType) {
            condition.groupType = groupType
        }

        await ctx.dal.groupProvider.getGroupPageList(condition, page, pageSize)
            .then(ctx.success).catch(ctx.error)
    }

    /**
     * 创建用户分组
     * @param ctx
     * @returns {Promise<void>}
     */
    async create(ctx) {

        const groupName = ctx.checkBody('groupName').exist().notBlank().len(4, 20).value
        const members = ctx.checkBody('members').exist().isArray().len(1, 200).value
        const groupType = ctx.checkBody('groupType').exist().toInt().in([1, 2]).value

        ctx.allowContentType({type: 'json'}).validate()

        members.forEach(x => parseInt(x))

        await ctx.service.groupService.createGroup({groupName, members, groupType})
            .then(ctx.success).catch(ctx.error)
    }


    /**
     * 查看分组详情
     * @param ctx
     * @returns {Promise<void>}
     */
    async show(ctx) {

        const groupId = ctx.checkParams('id').isGroupId().value
        ctx.validate()

        await ctx.dal.groupProvider.findOne({groupId}).then(ctx.success).catch(ctx.error)
    }

    /**
     * 查询列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async list(ctx) {

        const groupIds = ctx.checkQuery('groupIds').isSplitGroupId().toSplitArray().len(1, 100).value

        ctx.validate()

        const condition = {groupId: {$in: groupIds}}

        await ctx.dal.groupProvider.find(condition).then(ctx.success).catch(ctx.error)
    }

    /**
     * 操作分组成员
     * @param ctx
     * @returns {Promise<void>}
     */
    async operationMembers(ctx) {

        const groupId = ctx.checkParams('groupId').isGroupId().value
        const addMembers = ctx.checkBody('addMembers').optional().isArray().len(0, 200).value
        const removeMembers = ctx.checkBody('removeMembers').optional().isArray().len(0, 200).value

        ctx.allowContentType({type: 'json'}).validate()

        if (!addMembers && !removeMembers) {
            ctx.error({msg: '参数addMembers和removeMembers最少需要存在一个'})
        }
        if (!addMembers.length && !removeMembers.length) {
            ctx.error({msg: '参数addMembers和removeMembers最少需要存在一个有效参数'})
        }

        const groupInfo = await ctx.dal.groupProvider.findOne({groupId})
        if (!groupInfo || groupInfo.userId !== ctx.request.userId) {
            ctx.error({msg: 'groupId错误或者没有操作权限'})
        }

        await ctx.service.groupService.operationMembers({
            groupInfo,
            addMembers: addMembers || [],
            removeMembers: removeMembers || []
        }).then(data => ctx.success(true)).catch(ctx.error)
    }

    /**
     * 是否存在指定的成员
     * @param ctx
     * @returns {Promise<void>}
     */
    async isExistMember(ctx) {

        const groupIds = ctx.checkQuery('groupIds').exist().isSplitGroupId().toSplitArray().len(1, 100).value
        const memberId = ctx.checkQuery("memberId").exist().toInt().gt(0).value

        ctx.validate(false)

        const condition = {
            groupId: {$in: groupIds}, 'members.memberId': memberId
        }

        await ctx.dal.groupProvider.find(condition, 'groupId groupName').then(ctx.success)
    }
}