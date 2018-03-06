'use strict'

const MongoBaseOperation = require('egg-freelog-database/lib/database/mongo-base-operation')

module.exports = class GroupProvider extends MongoBaseOperation {
    constructor(app) {
        super(app.model.Group)
        this.app = app
    }

    /**
     * 获取分组分页列表
     * @param condition
     * @param page
     * @param pageSize
     * @returns {void|*}
     */
    async getGroupPageList(condition, page, pageSize) {

        let totalItemTask = super.count(condition)
        let dataListTask = await super.findPageList(condition, page, pageSize, 'groupId groupName groupType userId memberCount status createDate ', 'createDate')

        return Promise.all([totalItemTask, dataListTask]).then(([totalItem, dataList]) => {
            return {page, pageSize, totalItem, dataList}
        })
    }
}