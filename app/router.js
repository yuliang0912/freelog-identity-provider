/**
 * Created by yuliang on 2017/10/19.
 */

'use strict';

module.exports = app => {

    const {router, controller} = app;

    router.post('/v1/passport/login', controller.passport.v1.login)

    router.get('/v1/passport/logout', controller.passport.v1.logout)

    router.post('/v1/userinfos/resetPassword', controller.userinfo.v1.resetPassword)

    router.post('/v1/userinfos/register', controller.userinfo.v1.register)

    router.post('/v1/userinfos/updatePassword', controller.userinfo.v1.updatePassword)

    router.get('/v1/userinfos/current', controller.userinfo.v1.current)

    /**
     * restful wiki: http://eggjs.org/zh-cn/basics/router.html
     */
    router.resources('/v1/userinfos', '/v1/userinfos', controller.userinfo.v1)
}