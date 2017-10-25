/**
 * Created by yuliang on 2017/10/19.
 */

'use strict';

module.exports = app => {

    /**
     * restful wiki: http://eggjs.org/zh-cn/basics/router.html
     */

    app.resources('/v1/passport', '/v1/passport', app.controller.passport.v1)

    app.resources('/v1/userinfos', '/v1/userinfos', app.controller.userinfo.v1)

    app.post('/v1/passport/login', app.controller.passport.v1.login)

    app.get('/v1/passport/logout', app.controller.passport.v1.logout)
}