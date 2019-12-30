'use strict'

const {AuthorizationError, AuthenticationError} = require('egg-freelog-base/app/error/index')

module.exports = {

    /**
     * 是否官方审核账户
     */
    validateOfficialAuditAccount() {

        if (!this.request.userId) {
            throw new AuthenticationError(this.gettext('user-authentication-failed'))
        }

        const {userInfo} = this.request.identityInfo

        if (userInfo.email !== "support@freelog.com") {
            throw new AuthorizationError(this.gettext('user-authorization-failed'))
        }

    }

}