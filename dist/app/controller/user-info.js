"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoController = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const head_image_generator_1 = require("../../extend/head-image-generator");
const lodash_1 = require("lodash");
const enum_1 = require("../../enum");
const common_helper_1 = require("../../extend/common-helper");
const freelog_common_func_1 = require("egg-freelog-base/lib/freelog-common-func");
let UserInfoController = class UserInfoController {
    ctx;
    userService;
    messageService;
    tagService;
    headImageGenerator;
    /**
     * 获取用户列表
     */
    async index() {
        const { ctx } = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const tagIds = ctx.checkQuery('tagIds').ignoreParamWhenEmpty().isSplitNumber().toSplitArray().value;
        const keywords = ctx.checkQuery('keywords').ignoreParamWhenEmpty().trim().value;
        const startRegisteredDate = ctx.checkQuery('startRegisteredDate').ignoreParamWhenEmpty().toDate().value;
        const endRegisteredDate = ctx.checkQuery('endRegisteredDate').ignoreParamWhenEmpty().toDate().value;
        ctx.validateParams().validateOfficialAuditAccount();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(keywords)) {
            condition.email = keywords;
        }
        else if ((0, lodash_1.isString)(keywords) && egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = keywords;
        }
        else if (/^[0-9]{5,12}$/.test(keywords)) {
            condition.userId = parseInt(keywords);
        }
        else if ((0, lodash_1.isString)(keywords)) {
            return ctx.success({ skip, limit, totalItem: 0, dataList: [] });
        }
        if ((0, lodash_1.isDate)(startRegisteredDate) && (0, lodash_1.isDate)(endRegisteredDate)) {
            condition.createDate = { $gte: startRegisteredDate, $lte: endRegisteredDate };
        }
        else if ((0, lodash_1.isDate)(startRegisteredDate)) {
            condition.createDate = { $gte: startRegisteredDate };
        }
        else if ((0, lodash_1.isDate)(endRegisteredDate)) {
            condition.createDate = { $lte: endRegisteredDate };
        }
        const pageResult = await this.userService.searchIntervalListByTags(condition, tagIds?.map(x => parseInt(x)), {
            skip, limit, sort: sort ?? { userId: -1 }
        });
        const tagMap = await this.tagService.find({ status: 0 }).then(list => {
            return new Map(list.map(x => [x.tagId.toString(), (0, lodash_1.pick)(x, ['tagId', 'tag'])]));
        });
        const list = [];
        for (const user of pageResult.dataList) {
            if ((0, lodash_1.isArray)(user?.userDetails) && user.userDetails.length) {
                const userDetail = (0, lodash_1.first)(user.userDetails);
                user.tags = userDetail.tagIds.filter(x => tagMap.has(x.toString())).map(x => tagMap.get(x.toString()));
                user.birthday = userDetail.birthday ?? '';
                user.occupation = userDetail.occupation ?? '';
                user.areaCode = userDetail.areaCode ?? '';
                user.intro = userDetail.intro ?? '';
                user.sex = userDetail.sex;
                user.areaName = userDetail.areaName ?? '';
                user.latestLoginIp = userDetail.latestLoginIp ?? '';
                user.latestLoginDate = userDetail.latestLoginDate ?? null;
                user.reason = userDetail.reason ?? '';
                user.remark = userDetail.remark ?? '';
            }
            else {
                user.tags = [];
                user.latestLoginIp = '';
                user.latestLoginDate = null;
                user.reason = '';
                user.remark = '';
            }
            list.push((0, lodash_1.omit)(user, ['_id', 'password', 'salt', 'updateDate', 'userDetails', 'tokenSn']));
        }
        pageResult.dataList = list;
        return ctx.success(pageResult);
    }
    /**
     * 批量获取用户
     */
    async list() {
        const { ctx } = this;
        const userIds = ctx.checkQuery('userIds').exist().isSplitUserIds().toSplitArray().len(1, 200).value;
        const projection = ctx.checkQuery('projection').ignoreParamWhenEmpty().toSplitArray().default([]).value;
        ctx.validateParams();
        await this.userService.find({ userId: { $in: userIds } }, { projection: projection?.join(' ') }).then(ctx.success);
    }
    /**
     * 获取当前登录用户信息
     */
    async current() {
        const { ctx } = this;
        const userInfo = await this.userService.findOne({ userId: ctx.userId }).then(x => x.toObject());
        userInfo.userDetail = await this.userService.findUserDetails({ userId: userInfo.userId }).then(lodash_1.first);
        ctx.success(userInfo);
    }
    /**
     * 验证登录密码
     */
    async verifyLoginPassword() {
        const { ctx } = this;
        const password = ctx.checkQuery('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        const isVerifySuccessful = (0, common_helper_1.generatePassword)(userInfo.salt, password) === userInfo.password;
        ctx.success({ userId: userInfo.userId, isVerifySuccessful });
    }
    /**
     * 注册用户
     */
    async create() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().isEmailOrMobile86().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const username = ctx.checkBody('username').exist().isUsername().is(function (vale) {
            return !egg_freelog_base_1.CommonRegex.mobile86.test(vale);
        }).value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();
        const isVerify = await this.messageService.verify(enum_1.AuthCodeTypeEnum.Register, loginName, authCode);
        if (!isVerify) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('auth-code-validate-failed'));
        }
        await this.userService.findUserByLoginName(loginName).then(data => {
            if (data?.mobile === loginName) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('mobile-register-validate-failed'));
            }
            else if (data?.email.toLowerCase() === loginName.toLowerCase) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('email-register-validate-failed'));
            }
            else if (data) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('username-register-validate-failed'));
            }
        });
        const model = { username, password };
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            model.mobile = loginName;
        }
        else {
            model.email = loginName;
        }
        const createdUserInfo = await this.userService.create(model);
        await this.userService.updateOneUserDetail({ userId: createdUserInfo.userId }, {});
        ctx.success(createdUserInfo);
        try {
            await this._generateHeadImage(createdUserInfo.userId);
        }
        catch (e) {
            console.log('用户头像创建失败', e.toString());
        }
    }
    /**
     * 重置密码
     */
    async resetPassword() {
        const { ctx } = this;
        const loginName = ctx.checkParams('loginName').exist().isEmailOrMobile86().trim().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();
        const isEmail = egg_freelog_base_1.CommonRegex.email.test(loginName);
        const condition = isEmail ? { email: loginName } : { mobile: loginName };
        const userInfo = await this.userService.findOne(condition);
        if (!userInfo) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('user-entity-not-found'));
        }
        const isVerify = await this.messageService.verify(enum_1.AuthCodeTypeEnum.ResetPassword, loginName, authCode);
        if (!isVerify) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('auth-code-validate-failed'));
        }
        await this.userService.resetPassword(userInfo, password).then(ctx.success);
    }
    /**
     * 修改密码
     */
    async updatePassword() {
        const { ctx } = this;
        const oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value;
        const newPassword = ctx.checkBody('newPassword').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        ctx.entityNullObjectCheck(userInfo, { msg: ctx.gettext('login-name-or-password-validate-failed') });
        await this.userService.updatePassword(userInfo, oldPassword, newPassword).then(ctx.success);
    }
    /**
     * 更新基础信息
     */
    async updateUserInfo() {
        const { ctx } = this;
        const areaCode = ctx.checkBody('areaCode').optional().isNumeric().len(4, 6).value;
        const occupation = ctx.checkBody('occupation').optional().type('string').len(0, 20).value;
        const birthday = ctx.checkBody('birthday').optional().toDate().value;
        const sex = ctx.checkBody('sex').optional().toInt().in([0, 1, 2]).value;
        const intro = ctx.checkBody('intro').optional().type('string').len(0, 200).value;
        ctx.validateParams();
        const model = (0, freelog_common_func_1.deleteUndefinedFields)({
            areaCode, occupation, birthday, sex, intro
        });
        if (model.areaCode) {
            model.areaName = (0, common_helper_1.getAreaName)(model.areaCode);
            if (!model.areaName) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-validate-failed', 'areaCode'));
            }
        }
        if (!Object.keys(model).length) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-required-validate-failed'));
        }
        await this.userService.updateOneUserDetail({ userId: ctx.userId }, model).then(ctx.success);
    }
    /**
     * 上传头像
     */
    async uploadHeadImg() {
        const { ctx } = this;
        const fileStream = await ctx.getFileStream();
        if (!fileStream || !fileStream.filename) {
            throw new egg_freelog_base_1.ApplicationError('Can\'t found upload file');
        }
        ctx.validateParams();
        const fileObjectKey = `headImage/${ctx.userId}`;
        const { mime, fileBuffer } = await this.headImageGenerator.checkHeadImage(ctx, fileStream);
        await this.headImageGenerator.ossClient.putBuffer(fileObjectKey, fileBuffer, { headers: { 'Content-Type': mime } }).catch(error => {
            throw new egg_freelog_base_1.ApplicationError('头像上传错误');
        });
        const headImageUrl = `https://image.freelog.com/${fileObjectKey}`;
        await this.userService.updateOne({ userId: ctx.userId }, { headImage: headImageUrl }).then(() => {
            ctx.success(`${headImageUrl}?x-oss-process=style/head-image`);
        });
    }
    /**
     * 绑定(换绑)手机号或邮箱
     */
    async updateMobileOrEmail() {
        const { ctx } = this;
        const oldAuthCode = ctx.checkBody('oldAuthCode').ignoreParamWhenEmpty().toInt().value;
        const newAuthCode = ctx.checkBody('newAuthCode').exist().toInt().value;
        const newLoginName = ctx.checkBody('newLoginName').exist().isEmailOrMobile86().value;
        ctx.validateParams();
        const isEmail = egg_freelog_base_1.CommonRegex.email.test(newLoginName);
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        const oldMessageAddress = isEmail ? userInfo.email : userInfo.mobile;
        if ([userInfo.email, userInfo.mobile].includes(newLoginName)) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext(`新的${isEmail ? '邮箱' : '手机号'}不能与原${isEmail ? '邮箱' : '手机号'}相同`));
        }
        // 如果不输入旧的验证码,代表直接绑定操作,否则代表换绑操作
        if (!oldAuthCode && ((isEmail && Boolean(userInfo.email)) || (!isEmail && Boolean(userInfo.mobile)))) {
            throw new egg_freelog_base_1.ArgumentError('换绑操作必须输入原始验证码');
        }
        if (oldAuthCode && !await this.messageService.verify(enum_1.AuthCodeTypeEnum.UpdateMobileOrEmail, oldMessageAddress, oldAuthCode)) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('原始验证码校验失败'));
        }
        if (!await this.messageService.verify(enum_1.AuthCodeTypeEnum.UpdateMobileOrEmail, newLoginName, newAuthCode)) {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('新验证码校验失败'));
        }
        const model = isEmail ? { email: newLoginName } : { mobile: newLoginName };
        await this.userService.findUserByLoginName(newLoginName).then(data => {
            if (data && isEmail) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('email-register-validate-failed'));
            }
            else if (data) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('mobile-register-validate-failed'));
            }
        });
        await this.userService.updateOne({ userId: userInfo.userId }, model).then(() => ctx.success(true));
    }
    /**
     * 查询用户详情
     */
    async detail() {
        const { ctx } = this;
        const userId = ctx.checkQuery('userId').optional().isUserId().toInt().value;
        const username = ctx.checkQuery('username').optional().isUsername().value;
        const mobile = ctx.checkQuery('mobile').optional().match(egg_freelog_base_1.CommonRegex.mobile86).value;
        const email = ctx.checkQuery('email').optional().isEmail().value;
        ctx.validateParams();
        const condition = {};
        if (mobile) {
            condition.mobile = mobile;
        }
        if (userId) {
            condition.userId = userId;
        }
        if (username) {
            condition.username = username;
        }
        if (email) {
            condition.email = email;
        }
        if (!Object.keys(condition).length) {
            return ctx.success(null);
        }
        await this.userService.findOne(condition).then(ctx.success);
    }
    /**
     * 获取用户信息
     */
    async show() {
        const { ctx } = this;
        const userIdOrMobileOrUsername = ctx.checkParams('userIdOrMobileOrUsername').exist().trim().value;
        ctx.validateParams();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(userIdOrMobileOrUsername)) {
            condition.mobile = userIdOrMobileOrUsername;
        }
        else if (egg_freelog_base_1.CommonRegex.userId.test(userIdOrMobileOrUsername)) {
            condition.userId = parseInt(userIdOrMobileOrUsername);
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(userIdOrMobileOrUsername)) {
            condition.email = userIdOrMobileOrUsername;
        }
        else {
            return ctx.success(null);
        }
        await this.userService.findOne(condition).then(ctx.success);
    }
    /**
     * 批量设置标签(多用户设置一个标签)
     */
    async batchSetUsersTag() {
        const { ctx } = this;
        const userIds = ctx.checkBody('userIds').exist().isArray().len(1, 100).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const tagList = await this.tagService.find({ _id: { $in: tagIds }, status: 0 });
        const invalidTagIds = (0, lodash_1.differenceWith)(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), { invalidTagIds });
        }
        await this.userService.batchSetTag(userIds, tagList).then(ctx.success);
    }
    // 设置用户标签
    async setUserTag() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();
        if (tagIds.some(x => !(0, lodash_1.isNumber)(x) || x < 1)) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'));
        }
        const tagList = await this.tagService.find({ _id: { $in: tagIds }, status: 0 });
        const invalidTagIds = (0, lodash_1.differenceWith)(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), { invalidTagIds });
        }
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        await this.userService.setTag(userId, tagList).then(ctx.success);
    }
    // 取消设置用户标签
    async unsetUserTag() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const tagList = await this.tagService.find({ _id: { $in: tagIds }, status: 0 });
        const invalidTagIds = (0, lodash_1.differenceWith)(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), { invalidTagIds });
        }
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        await this.userService.unsetTag(userId, tagList).then(ctx.success);
    }
    // 冻结或恢复用户
    async freeOrRecoverUserStatus() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const status = ctx.checkBody('status').exist().toInt().in([enum_1.UserStatusEnum.Freeze, enum_1.UserStatusEnum.Normal]).value;
        const reason = ctx.checkBody('reason').ignoreParamWhenEmpty().type('string').len(0, 500).value;
        const remark = ctx.checkBody('remark').ignoreParamWhenEmpty().type('string').len(0, 500).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        if (userInfo.status === status) {
            return ctx.success(true);
        }
        const userDetailModel = (0, freelog_common_func_1.deleteUndefinedFields)({ reason, remark });
        const task1 = this.userService.updateOne({ userId }, { status });
        const task2 = this.userService.updateOneUserDetail({ userId }, userDetailModel);
        await Promise.all([task1, task2]).then(t => ctx.success(true));
    }
    // 检查用户头像.
    async checkHeadImage() {
        const userList = await this.userService.find({ headImage: '' });
        const tasks = userList.map(x => this._generateHeadImage(x.userId));
        await Promise.all(tasks).then(this.ctx.success);
    }
    /**
     * 生成头像并保存
     */
    async _generateHeadImage(userId) {
        const headImageUrl = await this.headImageGenerator.generateAndUploadHeadImage(userId.toString());
        await this.userService.updateOne({ userId: userId }, { headImage: headImageUrl });
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "messageService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "tagService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", head_image_generator_1.default)
], UserInfoController.prototype, "headImageGenerator", void 0);
__decorate([
    (0, midway_1.get)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "index", null);
__decorate([
    (0, midway_1.get)('/list'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser | egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "list", null);
__decorate([
    (0, midway_1.get)('/current'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "current", null);
__decorate([
    (0, midway_1.get)('/verifyLoginPassword'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "verifyLoginPassword", null);
__decorate([
    (0, midway_1.post)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "create", null);
__decorate([
    (0, midway_1.put)('/:loginName/resetPassword'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "resetPassword", null);
__decorate([
    (0, midway_1.put)('/current/updatePassword'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "updatePassword", null);
__decorate([
    (0, midway_1.put)('/current/detailInfo'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "updateUserInfo", null);
__decorate([
    (0, midway_1.post)('/current/uploadHeadImg'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "uploadHeadImg", null);
__decorate([
    (0, midway_1.put)('/current/mobileOrEmail'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "updateMobileOrEmail", null);
__decorate([
    (0, midway_1.get)('/detail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "detail", null);
__decorate([
    (0, midway_1.get)('/:userIdOrMobileOrUsername'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "show", null);
__decorate([
    (0, midway_1.put)('/batchSetTag'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "batchSetUsersTag", null);
__decorate([
    (0, midway_1.put)('/:userId/setTag'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "setUserTag", null);
__decorate([
    (0, midway_1.put)('/:userId/unsetTag'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "unsetUserTag", null);
__decorate([
    (0, midway_1.put)('/:userId/freeOrRecoverUserStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "freeOrRecoverUserStatus", null);
__decorate([
    (0, midway_1.get)('/allUsers/checkHeadImage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "checkHeadImage", null);
UserInfoController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/users')
], UserInfoController);
exports.UserInfoController = UserInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VzZXItaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBbUU7QUFFbkUsdURBRTBCO0FBQzFCLDRFQUFtRTtBQUNuRSxtQ0FBOEY7QUFDOUYscUNBQTREO0FBQzVELDhEQUF5RTtBQUN6RSxrRkFBK0U7QUFJL0UsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFHM0IsR0FBRyxDQUFpQjtJQUVwQixXQUFXLENBQWU7SUFFMUIsY0FBYyxDQUFrQjtJQUVoQyxVQUFVLENBQWU7SUFFekIsa0JBQWtCLENBQXFCO0lBRXZDOztPQUVHO0lBR0gsS0FBSyxDQUFDLEtBQUs7UUFFUCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDekYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDckQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLGFBQWEs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