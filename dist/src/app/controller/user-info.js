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
let UserInfoController = class UserInfoController {
    /**
     * 获取用户列表
     */
    async index() {
        const { ctx } = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const tagId = ctx.checkQuery('tagId').optional().toInt().gt(0).value;
        const keywords = ctx.checkQuery('keywords').optional().value;
        ctx.validateParams().validateOfficialAuditAccount();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(keywords)) {
            condition.email = keywords;
        }
        else if (lodash_1.isString(keywords) && egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = keywords;
        }
        else if (/^[0-9]{5,12}$/.test(keywords)) {
            condition.userId = parseInt(keywords);
        }
        else if (lodash_1.isString(keywords)) {
            return ctx.success({ skip, limit, totalItem: 0, dataList: [] });
        }
        const pageResult = await this.userService.searchIntervalListByTag(condition, tagId, {
            skip, limit, sort: sort ?? { userId: -1 }
        });
        const tagMap = await this.tagService.find({ status: 0 }).then(list => {
            return new Map(list.map(x => [x.tagId.toString(), x.tag]));
        });
        const list = [];
        for (const user of pageResult.dataList) {
            user.tags = [];
            if (lodash_1.isArray(user?.userDetails) && user.userDetails.length) {
                const tagIds = lodash_1.first(user.userDetails).tagIds;
                user.tags = tagIds.filter(x => tagMap.has(x.toString())).map(x => tagMap.get(x.toString()));
            }
            list.push(lodash_1.omit(user, ['_id', 'password', 'salt', 'updateDate', 'userDetails', 'tokenSn']));
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
        const projection = ctx.checkQuery('projection').optional().toSplitArray().default([]).value;
        ctx.validateParams();
        await this.userService.find({ userId: { $in: userIds } }, { projection: projection?.join(' ') }).then(ctx.success);
    }
    /**
     * 获取当前登录用户信息
     */
    async current() {
        const { ctx } = this;
        await this.userService.findOne({ userId: ctx.userId }).then(ctx.success);
    }
    /**
     * 获取用户详情
     */
    async searchOne() {
        //手机号,邮箱
        const { ctx } = this;
        const keywords = ctx.checkQuery('keywords').exist().value;
        ctx.validateParams();
        const condition = {};
        if (ctx.helper.commonRegex.mobile86.test(keywords)) {
            condition.mobile = new RegExp(`^${keywords}$`, 'i');
        }
        else if (ctx.helper.commonRegex.email.test(keywords)) {
            condition.email = new RegExp(`^${keywords}$`, 'i');
        }
        else if (ctx.helper.commonRegex.username.test(keywords)) {
            condition.username = new RegExp(`^${keywords}$`, 'i');
        }
        else {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('params-format-validate-failed', 'keywords'));
        }
        await this.userService.findOne(condition).then(ctx.success);
    }
    /**
     * 注册用户
     */
    async create() {
        const { ctx } = this;
        const loginName = ctx.checkBody('loginName').exist().notEmpty().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const username = ctx.checkBody('username').exist().isUsername().value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();
        const model = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            model.mobile = loginName;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(loginName)) {
            model.email = loginName;
        }
        else {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('login-name-format-validate-failed'), { loginName });
        }
        const isVerify = await this.messageService.verify('register', loginName, authCode);
        if (!isVerify) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('auth-code-validate-failed'));
        }
        const condition = { $or: [{ username }, model.mobile ? { mobile: loginName } : { email: loginName }] };
        await this.userService.findOne(condition).then(data => {
            if (data && data.mobile === loginName) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('mobile-register-validate-failed'));
            }
            else if (data && data.email === loginName) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('email-register-validate-failed'));
            }
            else if (data) {
                throw new egg_freelog_base_1.ArgumentError(ctx.gettext('username-register-validate-failed'));
            }
        });
        const userInfo = Object.assign({ username, password }, model);
        const createdUserInfo = await this.userService.create(userInfo);
        ctx.success(createdUserInfo);
        try {
            await this._generateHeadImage();
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
        const loginName = ctx.checkParams('loginName').exist().notEmpty().trim().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(loginName)) {
            condition.mobile = loginName;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(loginName)) {
            condition.email = loginName;
        }
        else {
            throw new egg_freelog_base_1.ArgumentError(ctx.gettext('login-name-format-validate-failed'));
        }
        const userInfo = await this.userService.findOne(condition);
        if (!userInfo) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('user-entity-not-found'));
        }
        const isVerify = await this.messageService.verify('resetPassword', loginName, authCode);
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
        const userId = ctx.userId;
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo, { msg: ctx.gettext('login-name-or-password-validate-failed') });
        await this.userService.updatePassword(userInfo, oldPassword, newPassword).then(ctx.success);
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
        else if (egg_freelog_base_1.CommonRegex.username.test(userIdOrMobileOrUsername)) {
            condition.username = userIdOrMobileOrUsername;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(userIdOrMobileOrUsername)) {
            condition.email = userIdOrMobileOrUsername;
        }
        else {
            return ctx.success(null);
        }
        await this.userService.findOne(condition).then(ctx.success);
    }
    async setUserTag() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagId = ctx.checkBody("tagId").exist().toInt().gt(0).value;
        ctx.validateParams();
        const tagInfo = await this.tagService.findOne({ _id: tagId, status: 0 });
        ctx.entityNullObjectCheck(tagInfo);
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        await this.userService.setTag(userId, tagInfo).then(ctx.success);
    }
    async unsetUserTag() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagId = ctx.checkBody("tagId").exist().toInt().gt(0).value;
        ctx.validateParams();
        const tagInfo = await this.tagService.findOne({ _id: tagId, status: 0 });
        ctx.entityNullObjectCheck(tagInfo);
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        await this.userService.unsetTag(userId, tagInfo).then(ctx.success);
    }
    /**
     * 生成头像并保存
     */
    async _generateHeadImage() {
        const userId = this.ctx.userId;
        const headImageUrl = await this.headImageGenerator.generateAndUploadHeadImage(userId.toString());
        await this.userService.updateOne({ userId: userId }, { headImage: headImageUrl });
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "userService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "messageService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserInfoController.prototype, "tagService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", head_image_generator_1.default)
], UserInfoController.prototype, "headImageGenerator", void 0);
__decorate([
    midway_1.get('/'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "index", null);
__decorate([
    midway_1.get('/list'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser | egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "list", null);
__decorate([
    midway_1.get('/current'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "current", null);
__decorate([
    midway_1.get('/search'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser | egg_freelog_base_1.IdentityTypeEnum.UnLoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "searchOne", null);
__decorate([
    midway_1.post('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "create", null);
__decorate([
    midway_1.put('/:loginName/resetPassword'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "resetPassword", null);
__decorate([
    midway_1.put('/current/updatePassword'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "updatePassword", null);
__decorate([
    midway_1.post('/current/uploadHeadImg'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "uploadHeadImg", null);
__decorate([
    midway_1.get('/:userIdOrMobileOrUsername'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "show", null);
__decorate([
    midway_1.put('/:userId/setTag'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "setUserTag", null);
__decorate([
    midway_1.put('/:userId/unsetTag'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "unsetUserTag", null);
UserInfoController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/users')
], UserInfoController);
exports.UserInfoController = UserInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VzZXItaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBbUU7QUFFbkUsdURBRTBCO0FBQzFCLDRFQUFtRTtBQUNuRSxtQ0FBc0Q7QUFJdEQsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFhM0I7O09BRUc7SUFHSCxLQUFLLENBQUMsS0FBSztRQUVQLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM5RSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6RixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDckUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENB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