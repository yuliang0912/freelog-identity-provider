'use strict'

const Service = require('egg').Service
const lodash = require('lodash')

module.exports = class GroupService extends Service {

    /**
     *  创建分组
     * @returns {Promise<void>}
     */
    async createGroup({groupId, groupName, groupType, members}) {

        let {ctx, config} = this
        let memberList = []

        await ctx.dal.groupProvider.findOne({groupId}).then(group => {
            group && ctx.error({msg: 'groupId已经存在,不能重复创建'})
        })

        //用户分组
        if (groupType === 1) {
            memberList = await ctx.dal.userProvider.getUserListByUserIds(members).map(item => {
                return {
                    memberId: item.userId,
                    memberName: item.nickname || item.userName
                }
            })
        }
        else if (groupType === 2) {
            memberList = await ctx.curlIntranetApi(`${config.gatewayUrl}/api/v1/nodes/list?nodeIds=${members.toString()}`).then(nodeInfos => {
                return nodeInfos.map(item => {
                    return {
                        memberId: item.nodeId,
                        memberName: item.nodeName
                    }
                })
            })
        }

        if (!memberList.length) {
            ctx.error({msg: '参数members中有效ID不能为空'})
        }

        return ctx.dal.groupProvider.create({
            groupId: `group_${groupType === 1 ? 'user' : 'node'}_${this.app.mongoose.getNewObjectId()}`,
            groupName,
            groupType,
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
        let {ctx} = this

        if (groupInfo.memberCount + addMembers.length > 200) {
            ctx.error({msg: '群组中成员数量超出最大限制(200)'})
        }

        addMembers = addMembers.filter(memberId => {
            return !groupInfo.members.some(item => item.memberId === memberId)
        })

        let memberList = []
        if (addMembers.length && groupInfo.groupType === 1) {
            memberList = await ctx.dal.userProvider.getUserListByUserIds(addMembers).map(item => {
                return {
                    memberId: item.userId,
                    memberName: item.nickname || item.userName
                }
            })
        }
        else if (addMembers.length && groupInfo.groupType === 2) {
            memberList = await ctx.curlIntranetApi(`${config.gatewayUrl}/api/v1/nodes/list?nodeIds=${addMembers.toString()}`).then(nodeIds => {
                return nodeIds.map(item => {
                    return {
                        memberId: item.nodeId,
                        memberName: item.nodeName
                    }
                })
            })
        }

        groupInfo.members = groupInfo.members.concat(memberList)
        groupInfo.members = groupInfo.members.filter(item => !removeMembers.some(x => x === item.memberId))

        return ctx.dal.groupProvider.update({groupId: groupInfo.groupId}, {
            members: groupInfo.members,
            memberCount: groupInfo.members.length
        })
    }
}
