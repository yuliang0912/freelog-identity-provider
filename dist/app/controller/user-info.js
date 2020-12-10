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
let UserInfoController = class UserInfoController {
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
        else if (lodash_1.isString(keywords) && egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = keywords;
        }
        else if (/^[0-9]{5,12}$/.test(keywords)) {
            condition.userId = parseInt(keywords);
        }
        else if (lodash_1.isString(keywords)) {
            return ctx.success({ skip, limit, totalItem: 0, dataList: [] });
        }
        if (lodash_1.isDate(startRegisteredDate) && lodash_1.isDate(endRegisteredDate)) {
            condition.createDate = { $gte: startRegisteredDate, $lte: endRegisteredDate };
        }
        else if (lodash_1.isDate(startRegisteredDate)) {
            condition.createDate = { $gte: startRegisteredDate };
        }
        else if (lodash_1.isDate(endRegisteredDate)) {
            condition.createDate = { $lte: endRegisteredDate };
        }
        const pageResult = await this.userService.searchIntervalListByTags(condition, tagIds?.map(x => parseInt(x)), {
            skip, limit, sort: sort ?? { userId: -1 }
        });
        const tagMap = await this.tagService.find({ status: 0 }).then(list => {
            return new Map(list.map(x => [x.tagId.toString(), lodash_1.pick(x, ['tagId', 'tag'])]));
        });
        const list = [];
        for (const user of pageResult.dataList) {
            if (lodash_1.isArray(user?.userDetails) && user.userDetails.length) {
                const userDetail = lodash_1.first(user.userDetails);
                user.tags = userDetail.tagIds.filter(x => tagMap.has(x.toString())).map(x => tagMap.get(x.toString()));
                user.latestLoginIp = userDetail.latestLoginIp ?? '';
                user.latestLoginDate = userDetail.latestLoginDate ?? null;
            }
            else {
                user.tags = [];
                user.latestLoginIp = '';
                user.latestLoginDate = null;
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
        const projection = ctx.checkQuery('projection').ignoreParamWhenEmpty().toSplitArray().default([]).value;
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
    // /**
    //  * 获取用户详情
    //  */
    // @get('/search')
    // @visitorIdentityValidator(IdentityTypeEnum.InternalClient | IdentityTypeEnum.LoginUser | IdentityTypeEnum.UnLoginUser)
    // async searchOne() {
    //     //手机号,邮箱
    //     const {ctx} = this;
    //     const keywords = ctx.checkQuery('keywords').exist().value
    //     ctx.validateParams();
    //
    //     const condition: any = {};
    //     if (ctx.helper.commonRegex.mobile86.test(keywords)) {
    //         condition.mobile = new RegExp(`^${keywords}$`, 'i')
    //     } else if (ctx.helper.commonRegex.email.test(keywords)) {
    //         condition.email = new RegExp(`^${keywords}$`, 'i')
    //     } else if (ctx.helper.commonRegex.username.test(keywords)) {
    //         condition.username = new RegExp(`^${keywords}$`, 'i')
    //     } else {
    //         throw new ArgumentError(ctx.gettext('params-format-validate-failed', 'keywords'))
    //     }
    //     await this.userService.findOne(condition).then(ctx.success)
    // }
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
        ctx.validateParams().validateOfficialAuditAccount();
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
        ctx.validateParams().validateOfficialAuditAccount();
        const tagInfo = await this.tagService.findOne({ _id: tagId, status: 0 });
        ctx.entityNullObjectCheck(tagInfo);
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        await this.userService.unsetTag(userId, tagInfo).then(ctx.success);
    }
    // 冻结或恢复用户
    async freeOrRecoverUserStatus() {
        const { ctx } = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const status = ctx.checkBody("status").exist().toInt().in([enum_1.UserStatusEnum.Freeze, enum_1.UserStatusEnum.Normal]).value;
        const remark = ctx.checkBody("remark").ignoreParamWhenEmpty().type('string').len(0, 500).default('').value;
        ctx.validateParams().validateOfficialAuditAccount();
        const userInfo = await this.userService.findOne({ userId });
        ctx.entityNullObjectCheck(userInfo);
        if (userInfo.status === status) {
            return ctx.success(true);
        }
        const task1 = this.userService.updateOne({ userId }, { status });
        const task2 = this.userService.updateOneUserDetail({ userId }, { statusChangeRemark: status === enum_1.UserStatusEnum.Normal ? '' : remark ?? '' });
        await Promise.all([task1, task2]).then(t => ctx.success(true));
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
__decorate([
    midway_1.put('/:userId/freeOrRecoverUserStatus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserInfoController.prototype, "freeOrRecoverUserStatus", null);
UserInfoController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/users')
], UserInfoController);
exports.UserInfoController = UserInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VzZXItaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBbUU7QUFFbkUsdURBRTBCO0FBQzFCLDRFQUFtRTtBQUNuRSxtQ0FBb0U7QUFDcEUscUNBQTBDO0FBSTFDLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBYTNCOztPQUVHO0lBR0gsS0FBSyxDQUFDLEtBQUs7UUFFUCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDekYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDckQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNwRyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2hGLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3hHLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3BHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1FBRXBELE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUMxQixJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQyxTQUFTLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUMvQjthQUFNLElBQUksOEJBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3pDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1NBQzlCO2FBQU0sSUFBSSxpQkFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNsRSxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQzthQUFNLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN2QyxTQUFTLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN6QzthQUFNLElBQUksaUJBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7U0FDakU7UUFFRCxJQUFJLGVBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLGVBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQzFELFNBQVMsQ0FBQyxVQUFVLEdBQUcsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFDLENBQUM7U0FDL0U7YUFBTSxJQUFJLGVBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1lBQ3BDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztTQUN0RDthQUFNLElBQUksZUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDbEMsU0FBUyxDQUFDLFVBQVUsR0FBRyxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBQyxDQUFDO1NBQ3BEO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDekcsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDO1NBQzFDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0QsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLGFBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLE1BQU0sSUFBSSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDcEMsSUFBSSxnQkFBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtnQkFDdkQsTUFBTSxVQUFVLEdBQW1CLGNBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2RyxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDO2dCQUNwRCxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDO2FBQzdEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNmLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzthQUMvQjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQzdGO1FBQ0QsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUdILEtBQUssQ0FBQyxJQUFJO1FBRU4sTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3BHLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQ3ZHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqSCxDQUFDO0lBRUQ7O09BRUc7SUFHSCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxNQUFNO0lBQ04sWUFBWTtJQUNaLE1BQU07SUFDTixrQkFBa0I7SUFDbEIseUhBQXlIO0lBQ3pILHNCQUFzQjtJQUN0QixlQUFlO0lBQ2YsMEJBQTBCO0lBQzFCLGdFQUFnRTtJQUNoRSw0QkFBNEI7SUFDNUIsRUFBRTtJQUNGLGlDQUFpQztJQUNqQyw0REFBNEQ7SUFDNUQsOERBQThEO0lBQzlELGdFQUFnRTtJQUNoRSw2REFBNkQ7SUFDN0QsbUVBQW1FO0lBQ25FLGdFQUFnRTtJQUNoRSxlQUFlO0lBQ2YsNEZBQTRGO0lBQzVGLFFBQVE7SUFDUixrRUFBa0U7SUFDbEUsSUFBSTtJQUVKOztPQUVHO0lBRUgsS0FBSyxDQUFDLE1BQU07UUFFUixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3RFLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDM0ksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDdEUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDakUsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sS0FBSyxHQUFzQixFQUFFLENBQUM7UUFDcEMsSUFBSSw4QkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDNUI7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztTQUMzQjthQUFNO1lBQ0gsTUFBTSxJQUFJLGdDQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQTtTQUN6RjtRQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsTUFBTSxJQUFJLG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsTUFBTSxTQUFTLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUMsQ0FBQyxFQUFDLENBQUE7UUFDOUYsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEQsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ25DLE1BQU0sSUFBSSxnQ0FBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFBO2FBQzFFO2lCQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUN6QyxNQUFNLElBQUksZ0NBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQTthQUN6RTtpQkFBTSxJQUFJLElBQUksRUFBRTtnQkFDYixNQUFNLElBQUksZ0NBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQTthQUM1RTtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMzRCxNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hFLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFN0IsSUFBSTtZQUNBLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7U0FDbEM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBRUgsS0FBSyxDQUFDLGFBQWE7UUFFZixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQy9FLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDM0ksTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDakUsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBRXBCLE1BQU0sU0FBUyxHQUFzQixFQUFFLENBQUM7UUFDeEMsSUFBSSw4QkFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDaEM7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztTQUMvQjthQUFNO1lBQ0gsTUFBTSxJQUFJLGdDQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7U0FDN0U7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNLElBQUksbUNBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7U0FDcEU7UUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUVELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOztPQUVHO0lBR0gsS0FBSyxDQUFDLGNBQWM7UUFFaEIsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQzNGLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFDaEosR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDMUQsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRWxHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWhHLENBQUM7SUFFRDs7T0FFRztJQUdILEtBQUssQ0FBQyxhQUFhO1FBRWYsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUM1QyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyQyxNQUFNLElBQUksbUNBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUMxRDtRQUNELEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUVwQixNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoRCxNQUFNLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekYsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsVUFBaUIsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUMsRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pJLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLDZCQUE2QixhQUFhLEVBQUUsQ0FBQTtRQUNqRSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDeEYsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFlBQVksaUNBQWlDLENBQUMsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRDs7T0FFRztJQUVILEtBQUssQ0FBQyxJQUFJO1FBRU4sTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLHdCQUF3QixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEcsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUMxQixJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQ3JELFNBQVMsQ0FBQyxNQUFNLEdBQUcsd0JBQXdCLENBQUM7U0FDL0M7YUFBTSxJQUFJLDhCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQzFELFNBQVMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDekQ7YUFBTSxJQUFJLDhCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQzVELFNBQVMsQ0FBQyxRQUFRLEdBQUcsd0JBQXdCLENBQUM7U0FDakQ7YUFBTSxJQUFJLDhCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO1lBQ3pELFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0JBQXdCLENBQUM7U0FDOUM7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtRQUVELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBSUQsS0FBSyxDQUFDLFVBQVU7UUFDWixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6RSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDakUsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFFcEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUE7UUFDdEUsR0FBRyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQzFELEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFJRCxLQUFLLENBQUMsWUFBWTtRQUNkLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3pFLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNqRSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUVwRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQTtRQUN0RSxHQUFHLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDMUQsR0FBRyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFVBQVU7SUFFVixLQUFLLENBQUMsdUJBQXVCO1FBRXpCLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3pFLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMscUJBQWMsQ0FBQyxNQUFNLEVBQUUscUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzRyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUVwRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUMxRCxHQUFHLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEMsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUM1QixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLEVBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxNQUFNLEtBQUsscUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFFekksTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxrQkFBa0I7UUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDaEcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Q0FDSixDQUFBO0FBdFZHO0lBREMsZUFBTSxFQUFFOzsrQ0FDVztBQUVwQjtJQURDLGVBQU0sRUFBRTs7dURBQ2lCO0FBRTFCO0lBREMsZUFBTSxFQUFFOzswREFDdUI7QUFFaEM7SUFEQyxlQUFNLEVBQUU7O3NEQUNnQjtBQUV6QjtJQURDLGVBQU0sRUFBRTs4QkFDVyw4QkFBa0I7OERBQUM7QUFPdkM7SUFGQyxZQUFHLENBQUMsR0FBRyxDQUFDO0lBQ1IsMkNBQXdCLENBQUMsbUNBQWdCLENBQUMsY0FBYyxHQUFHLG1DQUFnQixDQUFDLFNBQVMsQ0FBQzs7OzsrQ0EwRHRGO0FBT0Q7SUFGQyxZQUFHLENBQUMsT0FBTyxDQUFDO0lBQ1osMkNBQXdCLENBQUMsbUNBQWdCLENBQUMsU0FBUyxHQUFHLG1DQUFnQixDQUFDLGNBQWMsQ0FBQzs7Ozs4Q0FTdEY7QUFPRDtJQUZDLFlBQUcsQ0FBQyxVQUFVLENBQUM7SUFDZiwyQ0FBd0IsQ0FBQyxtQ0FBZ0IsQ0FBQyxTQUFTLENBQUM7Ozs7aURBSXBEO0FBOEJEO0lBREMsYUFBSSxDQUFDLEdBQUcsQ0FBQzs7OztnREE0Q1Q7QUFNRDtJQURDLFlBQUcsQ0FBQywyQkFBMkIsQ0FBQzs7Ozt1REE0QmhDO0FBT0Q7SUFGQyxZQUFHLENBQUMseUJBQXlCLENBQUM7SUFDOUIsMkNBQXdCLENBQUMsbUNBQWdCLENBQUMsU0FBUyxDQUFDOzs7O3dEQWNwRDtBQU9EO0lBRkMsYUFBSSxDQUFDLHdCQUF3QixDQUFDO0lBQzlCLDJDQUF3QixDQUFDLG1DQUFnQixDQUFDLFNBQVMsQ0FBQzs7Ozt1REFvQnBEO0FBTUQ7SUFEQyxZQUFHLENBQUMsNEJBQTRCLENBQUM7Ozs7OENBcUJqQztBQUlEO0lBRkMsWUFBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ3RCLDJDQUF3QixDQUFDLG1DQUFnQixDQUFDLFNBQVMsQ0FBQzs7OztvREFjcEQ7QUFJRDtJQUZDLFlBQUcsQ0FBQyxtQkFBbUIsQ0FBQztJQUN4QiwyQ0FBd0IsQ0FBQyxtQ0FBZ0IsQ0FBQyxTQUFTLENBQUM7Ozs7c0RBY3BEO0FBSUQ7SUFEQyxZQUFHLENBQUMsa0NBQWtDLENBQUM7Ozs7aUVBb0J2QztBQS9VUSxrQkFBa0I7SUFGOUIsZ0JBQU8sRUFBRTtJQUNULG1CQUFVLENBQUMsV0FBVyxDQUFDO0dBQ1gsa0JBQWtCLENBeVY5QjtBQXpWWSxnREFBa0IifQ==