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

        await Promise.all([task1, task2]).then(() => {
            return this.sendAuditNoticeMessage(userInfo, handleInfo.status)
        })

        return true
    }

    /**
     * 发送审核通知消息
     * @returns {Promise<void>}
     */
    async sendAuditNoticeMessage(userInfo, auditStatus) {

        const {ctx} = this
        const {mobile, username, email} = userInfo
        const templateCode = auditStatus === 1 ? "SMS_182385369" : "SMS_181859961"

        if (mobile) {
            return ctx.helper.sendSms(mobile, templateCode, {
                username,
                phone: mobile.substr(mobile.length - 4),
                path: auditStatus === 1 ? '' : 'alpha-test/apply'
            })
        } else if (email) {
            return ctx.helper.sendEmail(email, '【飞致网络】审核通知', null, `<h3>${this.getEmailTemplateContent(templateCode, userInfo)}</h3>`)
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
            case 'SMS_182385369':
                return `<!DOCTYPE html>
                         <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                          </head>
                          <body>
                              <div>
                                  <p>Hi ${templateParam.username}，</p>
                                  <p>感谢您的支持！您的内测申请已通过。立即体验内测版本，请点击<a href="https://console.freelog.com/" target="_blank">https://console.freelog.com/</a>。</p>
                                  <p>使用中有任何问题或建议，欢迎您到我们的官方论坛<a href="https://forum.freelog.com/" target="_blank">https://forum.freelog.com/</a>留言！</p>
                                  <p>您真诚的，<br/>Freelog团队 </p>
                              </div>
                          </body>
                        </html>`
            case 'SMS_181859961':
                return `<!DOCTYPE html>
                         <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                          </head>
                          <body>
                             <div>
                                <p>Hi ${templateParam.username}，</p>
                                <p>感谢您的支持！很遗憾，您的内测申请未通过。重新提交申请，请点击<a target="_blank" href="https://console.freelog.com/alpha-test/apply">https://console.freelog.com/alpha-test/apply</a>。</p>
                                <p>您真诚的，<br/>Freelog团队 </p>
                            </div>
                          </body>
                        </html>`
        }
    }
}