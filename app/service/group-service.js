'use strict'

const Service = require('egg').Service

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
                    memberName: item.userName
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
            groupId,
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
    async operationMembers({groupInfo, members, operationType}) {
        let {ctx} = this

        if (operationType === 2) {
            return this.removeGroupMembers({groupInfo, members})
        }

        if (groupInfo.memberCount + members.length > 200) {
            ctx.error({msg: '群组中成员数量超出最大限制(200)'})
        }

        let memberList = []
        if (groupInfo.groupType === 1) {
            memberList = await ctx.dal.userProvider.getUserListByUserIds(members).map(item => {
                return {
                    memberId: item.userId,
                    memberName: item.nickname || item.userName
                }
            })
        }
        else if (groupType === 2) {
            memberList = await ctx.curlIntranetApi(`${config.gatewayUrl}/api/v1/nodes/list?nodeIds=${members.toString()}`).then(nodeIds => {
                return nodeIds.map(item => {
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

        memberList.forEach(newMember => {
            if (groupInfo.members.some(item => item.memberId === newMember.memberId)) {
                return
            }
            groupInfo.members.push(newMember)
        })

        return ctx.dal.groupProvider.update({groupId: groupInfo.groupId}, {
            members: groupInfo.members,
            memberCount: groupInfo.members.length
        })
    }

    /**
     * 移除成员
     * @param groupInfo
     * @param members
     * @returns {Promise<void>}
     */
    async removeGroupMembers({groupInfo, members}) {

        groupInfo.members = groupInfo.members.filter(item => {
            return !members.some(id => item.memberId === id)
        })

        return this.ctx.dal.groupProvider.update({groupId: groupInfo.groupId}, {
            members: groupInfo.members,
            memberCount: groupInfo.members.length
        })
    }
}
