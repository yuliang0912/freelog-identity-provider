'use strict'

module.exports = appInfo => {

    return {

        uploadConfig: {
            aliOss: {
                internal: true
            },
            amzS3: {}
        },

        /**
         * mongoDB配置
         */
        mongoose: {
            url: "mongodb://172.18.215.231:27017/user",
        },

        /**
         * api网关内网地址
         */
        gatewayUrl: "http://172.18.215.224:8895",
    }
}