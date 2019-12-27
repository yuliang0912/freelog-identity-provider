'use strict'

const Service = require('egg').Service

module.exports = class TestQualificationApplyAuditService extends Service {

    constructor({app}) {
        super(...arguments)
        this.userProvider = app.dal.userProvider
        this.messageProvider = app.dal.messageProvider
        this.testQualificationApplyAuditRecordProvider = app.dal.testQualificationApplyAuditRecordProvider
    }

    /**
     * 申请信息
     * @param ApplyRecordInfo
     * @param handleInfo
     * @returns {Promise<Boolean>}
     */
    async auditTestQualificationApply(applyRecordInfo, handleInfo) {

        const {ctx} = this
        const userInfo = await this.userProvider.findOne({userId: applyRecordInfo.userId}).tap(model => ctx.entityNullObjectCheck(model))

        const task1 = this.testQualificationApplyAuditRecordProvider.updateOne({
            _id: applyRecordInfo.id
        }, {
            operationUserId: ctx.request.userId,
            status: handleInfo.status,
            auditMsg: handleInfo.auditMsg
        })

        const task2 = handleInfo.status === 1 ? userInfo.updateOne({userType: userInfo.userType | 1}) : undefined

        return Promise.all([task1, task2]).then(() => {
            this.sendAuditNoticeMessage(userInfo, handleInfo.status).then()
            return true
        })
    }

    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo, auditStatus) {

        const {ctx} = this
        const toAddress = userInfo.mobile || userInfo.email

        if (userInfo.mobile) {
            //ctx.helper.sendSms(toAddress, auditStatus === 1 ? "success" : "failed", templateParam)
        } else if (userInfo.email) {
            ctx.helper.sendEmail(toAddress, '【飞致网络】审核通知', null, `<h3>${this.getEmailTemplateContent(auditStatus === 1 ? "success" : "failed", userInfo)}</h3>`)
        }
    }

    /**
     * 获取模板内容
     * @param templateCode
     * @param templateParam
     * @returns {string}
     */
    getEmailTemplateContent(templateCode, templateParam) {
        switch (templateCode) {
            case 'success':
                return `Hi [${templateParam.username}]，
                感谢您的支持！您的内测申请已通过。立即体验内测版本，请点击https://console.freelog.com/。
                使用中有任何问题或建议，欢迎您到我们的官方论坛https://forum.freelog.com留言！
                您真诚的，
                Freelog团队`
            case 'failed':
                return `Hi [${templateParam.username}]，
                感谢您的支持！很遗憾，您的内测申请未通过。重新提交申请，请点击[内测申请提交页面网址]。
                您真诚的，
                Freelog团队`
        }
    }
}