/**
 * 清理过期的上传临时资源文件
 */

'use strict'

const Subscription = require('egg').Subscription;

module.exports = class ClearExpiredMessage extends Subscription {

    static get schedule() {
        return {
            type: 'worker',
            cron: '0 0 4 */3 * *', //每3天凌晨4点执行一次
        }
    }

    /**
     * 定时清理掉已经过去30天的临时数据
     * @returns {Promise<void>}
     */
    async subscribe() {

        const {app} = this
        const expireDate = new Date()
        expireDate.setDate(-1)

        await app.dal.messageProvider.deleteMany({expireDate: {$lt: expireDate}})
    }

}