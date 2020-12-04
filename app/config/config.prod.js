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
        url: "mongodb://mongo-prod.common:27017/user"
    }
}