/**
 * Created by yuliang on 2017/10/19.
 */

'use strict';

module.exports = app => {

    app.post('/v1/passport/login', app.controller.passport.v1.login)

    app.get('/v1/passport/logout', app.controller.passport.v1.logout)

    app.post('/v1/userinfos/resetPassword', app.controller.userinfo.v1.resetPassword)

    app.post('/v1/userinfos/register', app.controller.userinfo.v1.register)

    app.post('/v1/userinfos/updatePassword', app.controller.userinfo.v1.updatePassword)
    
    app.get('/v1/userinfos/current', app.controller.userinfo.v1.current)

    /**
     * restful wiki: http://eggjs.org/zh-cn/basics/router.html
     */
    app.resources('/v1/userinfos', '/v1/userinfos', app.controller.userinfo.v1)
}