/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    cluster: {
        listen: {port: 5011}
    },

    /**
     * mongoDB配置
     */
    mongoose: {
        url: "mongodb://mongo-test.common:27017/user"
    },

    domain: "testfreelog.com"
}