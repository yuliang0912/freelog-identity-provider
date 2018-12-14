/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    cluster: {
        listen: {port: 5011}
    },

    mongoose: {
        url: "mongodb://172.18.215.231:27018/user",
    },


    /**
     * api网关内网地址
     */
    gatewayUrl: "http://172.18.215.224:8895/test",

    domain: "testfreelog.com"
}