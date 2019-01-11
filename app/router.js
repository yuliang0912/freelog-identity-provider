/**
 * Created by yuliang on 2017/10/19.
 */

'use strict';

module.exports = app => {

    const {router, controller} = app;

    router.post('/v1/passport/login', controller.passport.v1.login)

    router.get('/v1/passport/logout', controller.passport.v1.logout)

    router.get('/v1/userinfos/autoRectifyHeadImage', controller.userinfo.v1.autoRectifyHeadImage)

    router.post('/v1/userinfos/resetPassword', controller.userinfo.v1.resetPassword)
    router.post('/v1/userinfos/updatePassword', controller.userinfo.v1.updatePassword)
    router.post('/v1/userinfos/uploadHeadImg', controller.userinfo.v1.uploadHeadImg)

    router.get('/v1/userinfos/current', controller.userinfo.v1.current)

    router.get('/v1/groups/list', controller.group.v1.list)

    router.post('/v1/groups/operationMembers/:groupId', controller.group.v1.operationMembers)

    router.get('/v1/groups/isExistMember', controller.group.v1.isExistMember)

    /**
     * restful wiki: http://eggjs.org/zh-cn/basics/router.html
     */
    router.resources('/v1/userinfos', '/v1/userinfos', controller.userinfo.v1)

    router.resources('/v1/groups', '/v1/groups', controller.group.v1)
}