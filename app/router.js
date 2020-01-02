/**
 * Created by yuliang on 2017/10/19.
 */

'use strict';

module.exports = app => {

    const {router, controller} = app;

    const {testQualification, passport, userinfo, group, captcha, message} = controller
    const {activationCodeV1, applyAuditRecordV1} = testQualification

    router.post('user-login', '/v1/passport/login', passport.v1.login)
    router.get('user-logout', '/v1/passport/logout', passport.v1.logout)

    router.put('repair-user-head-image', '/v1/userinfos/autoRectifyHeadImage', userinfo.v1.autoRectifyHeadImage)

    router.post('reset-password', '/v1/userinfos/resetPassword', userinfo.v1.resetPassword)
    router.post('update-password', '/v1/userinfos/updatePassword', userinfo.v1.updatePassword)
    router.post('upload-head-image', '/v1/userinfos/uploadHeadImg', userinfo.v1.uploadHeadImg)
    router.get('current-login-user-info', '/v1/userinfos/current', userinfo.v1.current)
    router.get('group-list', '/v1/groups/list', group.v1.list)

    router.post('/v1/groups/operationMembers/:groupId', group.v1.operationMembers)
    router.get('/v1/groups/isExistMember', group.v1.isExistMember)
    router.get('/v1/captcha/:captchaKey', captcha.v1.generateCaptcha)
    router.get('/v1/captcha/:captchaKey/verify', captcha.v1.verify)
    router.post('/v1/message/send', message.v1.send)
    router.get('/v1/message/verify', message.v1.verify)

    //激活码
    router.post('batch-create-activation-code', '/v1/testQualifications/beta/codes/batchCreate', activationCodeV1.batchCreate)
    router.put('batch-update-activation-code-status', '/v1/testQualifications/beta/codes/batchUpdate', activationCodeV1.batchUpdate)

    //测试资格申请
    router.post('beta-test-apply', '/v1/testQualifications/beta/apply', applyAuditRecordV1.create)
    //测试资格审核
    router.put('beta-test-audit', '/v1/testQualifications/beta/audit', applyAuditRecordV1.update)
    //测试申请记录
    router.get('beta-test-apply-records', '/v1/testQualifications/beta/applyRecords', applyAuditRecordV1.index)
    router.get('beta-test-apply-records', '/v1/testQualifications/beta/applyRecords/:recordId', applyAuditRecordV1.show)
    router.get('activation-code-status-statistics', '/v1/testQualifications/beta/codes/statusStatistics', activationCodeV1.codeStatusStatistics)

    //使用授权码激活测试资格
    router.post('activate-test-qualification', '/v1/testQualifications/beta/activate', applyAuditRecordV1.activateTestQualification)
    router.delete('delete-test-qualification-apply', '/v1/testQualifications/beta/applyRecords/currentUser', applyAuditRecordV1.destroy)

    router.resources('restful-activation-code', '/v1/testQualifications/beta/codes', activationCodeV1)
    router.resources('restful-user-info', '/v1/userinfos', controller.userinfo.v1)
    router.resources('restful-node-or-user-group', '/v1/groups', controller.group.v1)
}