'use strict'

const Service = require('egg').Service

module.exports = class GroupService extends Service {

    constructor({app}) {
        super(...arguments)
        this.groupProvider = app.dal.groupProvider
        this.userProvider = app.dal.userProvider
    }

    /**
     *  创建分组
     * @returns {Promise<void>}
     */
    async createGroup({groupId, groupName, groupType, members}) {

        let memberList = []
        const {ctx, config} = this

        await this.groupProvider.findOne({groupId}).then(group => {
            group && ctx.error({msg: ctx.gettext('group-create-duplicate-error')})
        })

        //用户分组
        if (groupType === 1) {
            memberList = await this.userProvider.find({userId: {$in: members}}).map(item => Object({
                memberId: item.userId,
                memberName: item.username
            }))
        }
        else if (groupType === 2) {
            memberList = await ctx.curlIntranetApi(`${config.gatewayUrl}/api/v1/nodes/list?nodeIds=${members.toString()}`).then(nodeInfos => nodeInfos.map(item => new ({
                memberId: item.nodeId,
                memberName: item.nodeName
            })))
        }

        if (!memberList.length) {
            ctx.error({msg: ctx.gettext('params-format-validate-failed', 'members')})
        }

        return this.groupProvider.create({
            groupId: `group_${groupType === 1 ? 'user' : 'node'}_${this.app.mongoose.getNewObjectId()}`,
            groupName, groupType,
            userId: ctx.request.userId,
            members: memberList,
            memberCount: memberList.length
        })
    }

    /**
     * 操作群组成员
     * @param groupInfo
     * @param members
     * @param operationType
     * @returns {Promise<void>}
     */
    async operationMembers({groupInfo, addMembers, removeMembers}) {

        let memberList = []
        const {ctx, app} = this

        if (groupInfo.memberCount + addMembers.length > 200) {
            ctx.error({msg: ctx.gettext('group-member-count-limit-validate-failed', '200')})
        }

        addMembers = addMembers.filter(memberId => {
            return !groupInfo.members.some(item => item.memberId === memberId)
        })

        if (addMembers.length && groupInfo.groupType === 1) {
            memberList = await this.userProvider.find({userId: {$in: addMembers}}).map(item => new Object({
                memberId: item.userId,
                memberName: item.username
            }))
        }
        else if (addMembers.length && groupInfo.groupType === 2) {
            memberList = await ctx.curlIntranetApi(`${app.webApi.nodeInfo}/list?nodeIds=${addMembers.toString()}`)
                .then(nodeIds => nodeIds.map(item => new Object({
                    memberId: item.nodeId,
                    memberName: item.nodeName
                })))
        }

        groupInfo.members = groupInfo.members.concat(memberList)
        groupInfo.members = groupInfo.members.filter(item => !removeMembers.some(x => x === item.memberId))

        return this.groupProvider.update({groupId: groupInfo.groupId}, {
            members: groupInfo.members,
            memberCount: groupInfo.members.length
        })
    }
}
