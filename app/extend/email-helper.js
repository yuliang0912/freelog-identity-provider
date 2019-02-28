'use strict'

const nodeMailer = require("nodemailer");

module.exports = class EmailHelper {

    constructor(app) {
        this.smtpTransportConfig = app.config.smtpTransportConfig
    }

    /**
     * 发送邮件
     * @returns {Promise<void>}
     */
    async sendEmail(address, subject, text, html) {

        const transporter = nodeMailer.createTransport(this.smtpTransportConfig)

        var mailOptions = {
            from: `"飞致网络" <${this.smtpTransportConfig.auth.user}>`,
            to: address, subject, html
        }

        return transporter.sendMail(mailOptions)
    }
}