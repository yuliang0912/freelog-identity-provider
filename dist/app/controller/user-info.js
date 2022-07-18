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
const outside_api_service_1 = require("../service/outside-api-service");
let UserInfoController = class UserInfoController {
    ctx;
    userService;
    messageService;
    tagService;
    headImageGenerator;
    outsideApiService;
    /**
     * 获取用户列表
     */
    async indexForAdmin() {
        const { ctx } = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const userId = ctx.checkQuery('userId').ignoreParamWhenEmpty().isUserId().toInt().value;
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
            condition.email = new RegExp(`^${keywords}`, 'i');
        }
        else if ((0, lodash_1.isString)(keywords) && egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = new RegExp(`^${keywords}`, 'i');
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
        if (userId) {
            condition.userId = userId;
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
            list.push((0, lodash_1.omit)(user, ['_id', 'password', 'salt', 'updateDate', 'userDetails', 'tokenSn']));
        }
        pageResult.dataList = list;
        return ctx.success(pageResult);
    }
    async index() {
        const { ctx } = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const keywords = ctx.checkQuery('keywords').ignoreParamWhenEmpty().trim().value;
        ctx.validateParams();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(keywords)) {
            condition.email = new RegExp(`^${keywords}`, 'i');
        }
        else if ((0, lodash_1.isString)(keywords) && egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = new RegExp(`^${keywords}`, 'i');
        }
        else if (/^[0-9]{5,12}$/.test(keywords)) {
            condition.userId = parseInt(keywords);
        }
        else if ((0, lodash_1.isString)(keywords)) {
            return ctx.success({ skip, limit, totalItem: 0, dataList: [] });
        }
        await this.userService.findIntervalList(condition, {
            skip, limit, sort: sort ?? { userId: -1 }, projection: 'userId username headImage'
        }).then(ctx.success);
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
        ctx.success({
            userId: userInfo.userId,
            state: isVerifySuccessful ? (0, common_helper_1.generateTempUserState)(userInfo.userId) : '',
            isVerifySuccessful
        });
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
        const authCode = ctx.checkBody('authCode').exist().toInt('验证码必须是6位数字').value;
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
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], UserInfoController.prototype, "outsideApiService", void 0);
__decorate([
    (0, midway_1.get)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "indexForAdmin", null);
__decorate([
    (0, midway_1.get)('/search'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VzZXItaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBbUU7QUFFbkUsdURBRTBCO0FBQzFCLDRFQUFtRTtBQUNuRSxtQ0FBOEY7QUFDOUYscUNBQTREO0FBQzVELDhEQUFnRztBQUNoRyxrRkFBK0U7QUFDL0Usd0VBQWlFO0FBSWpFLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBRzNCLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGNBQWMsQ0FBa0I7SUFFaEMsVUFBVSxDQUFlO0lBRXpCLGtCQUFrQixDQUFxQjtJQUV2QyxpQkFBaUIsQ0FBb0I7SUFFckM7O09BRUc7SUFHSCxLQUFLLENBQUMsYUFBYTtRQUNmLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM5RSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6RixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEs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