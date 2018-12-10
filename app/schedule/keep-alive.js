'use strict'

const Subscription = require('egg').Subscription;

module.exports = class KeepAlive extends Subscription {

    static get schedule() {
        return {
            cron: '*/30 * * * * * *',
            type: 'all',
            immediate: false,
            disable: false
        }
    }

    async subscribe() {
        await this.app.dal.userProvider.findOne({}).catch(console.error)
    }
}