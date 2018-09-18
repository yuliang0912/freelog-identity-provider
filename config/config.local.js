'use strict'

/**
 * 本地开发配置.会与config.default进行合并
 * @param appInfo
 * @returns {{middleware: [string]}}
 */

module.exports = appInfo => {

    return {

        middleware: ['errorHandler', 'localUserIdentity'],

        /**
         * 本地开发环境身份信息
         */
        localIdentity: {
            userId: 10022,
            userName: "余亮",
            tokenType: "local"
        }
    }
}