'use strict'

module.exports = {

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
    }
}