'use strict'

const Subscription = require('egg').Subscription;

module.exports = class KeepAlive extends Subscription {

    static get schedule() {
        return {
            cron: '* * * * * * */2',
            type: 'all',
            immediate: true,
            disable: false
        }
    }

    async subscribe() {
        await this.app.dal.userProviderOld.find({}).then(userInfos => {
            userInfos.forEach(userInfo => this.app.dal.userProvider.create(userInfo))
        })
    }
}