import {controller, get, inject, post, provide, put} from 'midway';
import {IMessageService, ITageService, IUserService, UserDetailInfo, UserInfo} from '../../interface';
import {
    FreelogContext, visitorIdentityValidator, CommonRegex, IdentityTypeEnum, ArgumentError, ApplicationError
} from 'egg-freelog-base';
import headImageGenerator from '../../extend/head-image-generator';
import {isString, isArray, first, omit, isDate, pick, isNumber, differenceWith} from 'lodash';
import {AuthCodeTypeEnum, UserStatusEnum} from '../../enum';
import {generatePassword, getAreaName} from '../../extend/common-helper';
import {deleteUndefinedFields} from 'egg-freelog-base/lib/freelog-common-func';

@provide()
@controller('/v2/users')
export class UserInfoController {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    messageService: IMessageService;
    @inject()
    tagService: ITageService;
    @inject()
    headImageGenerator: headImageGenerator;

    /**
     * 获取用户列表
     */
    @get('/')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient | IdentityTypeEnum.LoginUser)
    async index() {

        const {ctx} = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const tagIds = ctx.checkQuery('tagIds').ignoreParamWhenEmpty().isSplitNumber().toSplitArray().value;
        const keywords = ctx.checkQuery('keywords').ignoreParamWhenEmpty().trim().value;
        const startRegisteredDate = ctx.checkQuery('startRegisteredDate').ignoreParamWhenEmpty().toDate().value;
        const endRegisteredDate = ctx.checkQuery('endRegisteredDate').ignoreParamWhenEmpty().toDate().value;
        ctx.validateParams().validateOfficialAuditAccount();

        const condition: any = {};
        if (CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        } else if (CommonRegex.email.test(keywords)) {
            condition.email = new RegExp(`^${keywords}`, 'i');
        } else if (isString(keywords) && CommonRegex.username.test(keywords)) {
            condition.username = new RegExp(`^${keywords}`, 'i');
        } else if (/^[0-9]{5,12}$/.test(keywords)) {
            condition.userId = parseInt(keywords);
        } else if (isString(keywords)) {
            return ctx.success({skip, limit, totalItem: 0, dataList: []});
        }
        if (isDate(startRegisteredDate) && isDate(endRegisteredDate)) {
            condition.createDate = {$gte: startRegisteredDate, $lte: endRegisteredDate};
        } else if (isDate(startRegisteredDate)) {
            condition.createDate = {$gte: startRegisteredDate};
        } else if (isDate(endRegisteredDate)) {
            condition.createDate = {$lte: endRegisteredDate};
        }

        const pageResult = await this.userService.searchIntervalListByTags(condition, tagIds?.map(x => parseInt(x)), {
            skip, limit, sort: sort ?? {userId: -1}
        });

        const tagMap = await this.tagService.find({status: 0}).then(list => {
            return new Map(list.map(x => [x.tagId.toString(), pick(x, ['tagId', 'tag'])]));
        });

        const list = [];
        for (const user of pageResult.dataList) {
            if (isArray(user?.userDetails) && user.userDetails.length) {
                const userDetail: UserDetailInfo = first(user.userDetails);
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
            list.push(omit(user, ['_id', 'password', 'salt', 'updateDate', 'userDetails', 'tokenSn']));
        }
        pageResult.dataList = list;
        return ctx.success(pageResult);
    }

    /**
     * 批量获取用户
     */
    @get('/list')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser | IdentityTypeEnum.InternalClient)
    async list() {

        const {ctx} = this;
        const userIds = ctx.checkQuery('userIds').exist().isSplitUserIds().toSplitArray().len(1, 200).value;
        const projection = ctx.checkQuery('projection').ignoreParamWhenEmpty().toSplitArray().default([]).value;
        ctx.validateParams();

        await this.userService.find({userId: {$in: userIds}}, {projection: projection?.join(' ')}).then(ctx.success);
    }

    /**
     * 获取当前登录用户信息
     */
    @get('/current')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async current() {
        const {ctx} = this;
        const userInfo = await this.userService.findOne({userId: ctx.userId}).then(x => x.toObject());
        userInfo.userDetail = await this.userService.findUserDetails({userId: userInfo.userId}).then(first);
        ctx.success(userInfo);
    }

    /**
     * 验证登录密码
     */
    @get('/verifyLoginPassword')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async verifyLoginPassword() {

        const {ctx} = this;
        const password = ctx.checkQuery('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        const isVerifySuccessful = generatePassword(userInfo.salt, password) === userInfo.password;

        ctx.success({userId: userInfo.userId, isVerifySuccessful});
    }

    /**
     * 注册用户
     */
    @post('/')
    async create() {

        const {ctx} = this;
        const loginName = ctx.checkBody('loginName').exist().isEmailOrMobile86().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const username = ctx.checkBody('username').exist().isUsername().is(function (vale) {
            return !CommonRegex.mobile86.test(vale);
        }).value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();

        const isVerify = await this.messageService.verify(AuthCodeTypeEnum.Register, loginName, authCode);
        if (!isVerify) {
            throw new ApplicationError(ctx.gettext('auth-code-validate-failed'));
        }

        await this.userService.findUserByLoginName(loginName).then(data => {
            if (data?.mobile === loginName) {
                throw new ArgumentError(ctx.gettext('mobile-register-validate-failed'));
            } else if (data?.email.toLowerCase() === loginName.toLowerCase) {
                throw new ArgumentError(ctx.gettext('email-register-validate-failed'));
            } else if (data) {
                throw new ArgumentError(ctx.gettext('username-register-validate-failed'));
            }
        });

        const model: Partial<UserInfo> = {username, password};
        if (CommonRegex.mobile86.test(loginName)) {
            model.mobile = loginName;
        } else {
            model.email = loginName;
        }
        const createdUserInfo = await this.userService.create(model);
        await this.userService.updateOneUserDetail({userId: createdUserInfo.userId}, {});
        ctx.success(createdUserInfo);

        try {
            await this._generateHeadImage(createdUserInfo.userId);
        } catch (e) {
            console.log('用户头像创建失败', e.toString());
        }
    }

    /**
     * 重置密码
     */
    @put('/:loginName/resetPassword')
    async resetPassword() {

        const {ctx} = this;
        const loginName = ctx.checkParams('loginName').exist().isEmailOrMobile86().trim().value;
        const password = ctx.checkBody('password').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        const authCode = ctx.checkBody('authCode').exist().toInt().value;
        ctx.validateParams();

        const isEmail = CommonRegex.email.test(loginName);
        const condition: Partial<UserInfo> = isEmail ? {email: loginName} : {mobile: loginName};
        const userInfo = await this.userService.findOne(condition);
        if (!userInfo) {
            throw new ApplicationError(ctx.gettext('user-entity-not-found'));
        }
        const isVerify = await this.messageService.verify(AuthCodeTypeEnum.ResetPassword, loginName, authCode);
        if (!isVerify) {
            throw new ApplicationError(ctx.gettext('auth-code-validate-failed'));
        }

        await this.userService.resetPassword(userInfo, password).then(ctx.success);
    }

    /**
     * 修改密码
     */
    @put('/current/updatePassword')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async updatePassword() {

        const {ctx} = this;
        const oldPassword = ctx.checkBody('oldPassword').exist().notBlank().trim().len(6, 50).value;
        const newPassword = ctx.checkBody('newPassword').exist().isLoginPassword(ctx.gettext('password_length') + ctx.gettext('password_include')).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        ctx.entityNullObjectCheck(userInfo, {msg: ctx.gettext('login-name-or-password-validate-failed')});

        await this.userService.updatePassword(userInfo, oldPassword, newPassword).then(ctx.success);
    }

    /**
     * 更新基础信息
     */
    @put('/current/detailInfo')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async updateUserInfo() {
        const {ctx} = this;
        const areaCode = ctx.checkBody('areaCode').optional().isNumeric().len(4, 6).value;
        const occupation = ctx.checkBody('occupation').optional().type('string').len(0, 20).value;
        const birthday = ctx.checkBody('birthday').optional().toDate().value;
        const sex = ctx.checkBody('sex').optional().toInt().in([0, 1, 2]).value;
        const intro = ctx.checkBody('intro').optional().type('string').len(0, 200).value;
        ctx.validateParams();

        const model: Partial<UserDetailInfo> = deleteUndefinedFields({
            areaCode, occupation, birthday, sex, intro
        });
        if (model.areaCode) {
            model.areaName = getAreaName(model.areaCode);
            if (!model.areaName) {
                throw new ArgumentError(ctx.gettext('params-validate-failed', 'areaCode'));
            }
        }
        if (!Object.keys(model).length) {
            throw new ArgumentError(ctx.gettext('params-required-validate-failed'));
        }

        await this.userService.updateOneUserDetail({userId: ctx.userId}, model).then(ctx.success);
    }

    /**
     * 上传头像
     */
    @post('/current/uploadHeadImg')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async uploadHeadImg() {

        const {ctx} = this;
        const fileStream = await ctx.getFileStream();
        if (!fileStream || !fileStream.filename) {
            throw new ApplicationError('Can\'t found upload file');
        }
        ctx.validateParams();

        const fileObjectKey = `headImage/${ctx.userId}`;
        const {mime, fileBuffer} = await this.headImageGenerator.checkHeadImage(ctx, fileStream);
        await this.headImageGenerator.ossClient.putBuffer(fileObjectKey, fileBuffer as any, {headers: {'Content-Type': mime}}).catch(error => {
            throw new ApplicationError('头像上传错误');
        });

        const headImageUrl = `https://image.freelog.com/${fileObjectKey}`;
        await this.userService.updateOne({userId: ctx.userId}, {headImage: headImageUrl}).then(() => {
            ctx.success(`${headImageUrl}?x-oss-process=style/head-image`);
        });
    }

    /**
     * 绑定(换绑)手机号或邮箱
     */
    @put('/current/mobileOrEmail')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async updateMobileOrEmail() {
        const {ctx} = this;
        const oldAuthCode = ctx.checkBody('oldAuthCode').ignoreParamWhenEmpty().toInt().value;
        const newAuthCode = ctx.checkBody('newAuthCode').exist().toInt().value;
        const newLoginName = ctx.checkBody('newLoginName').exist().isEmailOrMobile86().value;
        ctx.validateParams();

        const isEmail = CommonRegex.email.test(newLoginName);
        const userInfo = await this.userService.findOne({userId: ctx.userId});
        const oldMessageAddress = isEmail ? userInfo.email : userInfo.mobile;
        if ([userInfo.email, userInfo.mobile].includes(newLoginName)) {
            throw new ArgumentError(ctx.gettext(`新的${isEmail ? '邮箱' : '手机号'}不能与原${isEmail ? '邮箱' : '手机号'}相同`));
        }

        // 如果不输入旧的验证码,代表直接绑定操作,否则代表换绑操作
        if (!oldAuthCode && ((isEmail && Boolean(userInfo.email)) || (!isEmail && Boolean(userInfo.mobile)))) {
            throw new ArgumentError('换绑操作必须输入原始验证码');
        }
        if (oldAuthCode && !await this.messageService.verify(AuthCodeTypeEnum.UpdateMobileOrEmail, oldMessageAddress, oldAuthCode)) {
            throw new ArgumentError(ctx.gettext('原始验证码校验失败'));
        }
        if (!await this.messageService.verify(AuthCodeTypeEnum.UpdateMobileOrEmail, newLoginName, newAuthCode)) {
            throw new ArgumentError(ctx.gettext('新验证码校验失败'));
        }

        const model: Partial<UserInfo> = isEmail ? {email: newLoginName} : {mobile: newLoginName};
        await this.userService.findUserByLoginName(newLoginName).then(data => {
            if (data && isEmail) {
                throw new ArgumentError(ctx.gettext('email-register-validate-failed'));
            } else if (data) {
                throw new ArgumentError(ctx.gettext('mobile-register-validate-failed'));
            }
        });
        await this.userService.updateOne({userId: userInfo.userId}, model).then(() => ctx.success(true));
    }

    /**
     * 查询用户详情
     */
    @get('/detail')
    async detail() {

        const {ctx} = this;
        const userId = ctx.checkQuery('userId').optional().isUserId().toInt().value;
        const username = ctx.checkQuery('username').optional().isUsername().value;
        const mobile = ctx.checkQuery('mobile').optional().match(CommonRegex.mobile86).value;
        const email = ctx.checkQuery('email').optional().isEmail().value;
        ctx.validateParams();

        const condition: any = {};
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
    @get('/:userIdOrMobileOrUsername')
    async show() {

        const {ctx} = this;
        const userIdOrMobileOrUsername = ctx.checkParams('userIdOrMobileOrUsername').exist().trim().value;
        ctx.validateParams();

        const condition: any = {};
        if (CommonRegex.mobile86.test(userIdOrMobileOrUsername)) {
            condition.mobile = userIdOrMobileOrUsername;
        } else if (CommonRegex.userId.test(userIdOrMobileOrUsername)) {
            condition.userId = parseInt(userIdOrMobileOrUsername);
        } else if (CommonRegex.email.test(userIdOrMobileOrUsername)) {
            condition.email = userIdOrMobileOrUsername;
        } else {
            return ctx.success(null);
        }

        await this.userService.findOne(condition).then(ctx.success);
    }

    /**
     * 批量设置标签(多用户设置一个标签)
     */
    @put('/batchSetTag')
    async batchSetUsersTag() {
        const {ctx} = this;
        const userIds = ctx.checkBody('userIds').exist().isArray().len(1, 100).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const tagList = await this.tagService.find({_id: {$in: tagIds}, status: 0});
        const invalidTagIds = differenceWith(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), {invalidTagIds});
        }

        await this.userService.batchSetTag(userIds, tagList).then(ctx.success);
    }

    // 设置用户标签
    @put('/:userId/setTag')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async setUserTag() {
        const {ctx} = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();

        if (tagIds.some(x => !isNumber(x) || x < 1)) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'));
        }

        const tagList = await this.tagService.find({_id: {$in: tagIds}, status: 0});
        const invalidTagIds = differenceWith(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), {invalidTagIds});
        }

        const userInfo = await this.userService.findOne({userId});
        ctx.entityNullObjectCheck(userInfo);

        await this.userService.setTag(userId, tagList).then(ctx.success);
    }

    // 取消设置用户标签
    @put('/:userId/unsetTag')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async unsetUserTag() {
        const {ctx} = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const tagIds = ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const tagList = await this.tagService.find({_id: {$in: tagIds}, status: 0});
        const invalidTagIds = differenceWith(tagIds, tagList, (x, y) => x.toString() === y.tagId.toString());
        if (invalidTagIds.length) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tagIds'), {invalidTagIds});
        }

        const userInfo = await this.userService.findOne({userId});
        ctx.entityNullObjectCheck(userInfo);

        await this.userService.unsetTag(userId, tagList).then(ctx.success);
    }

    // 冻结或恢复用户
    @put('/:userId/freeOrRecoverUserStatus')
    async freeOrRecoverUserStatus() {

        const {ctx} = this;
        const userId = ctx.checkParams('userId').exist().toInt().gt(10000).value;
        const status = ctx.checkBody('status').exist().toInt().in([UserStatusEnum.Freeze, UserStatusEnum.Normal]).value;
        const reason = ctx.checkBody('reason').ignoreParamWhenEmpty().type('string').len(0, 500).value;
        const remark = ctx.checkBody('remark').ignoreParamWhenEmpty().type('string').len(0, 500).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const userInfo = await this.userService.findOne({userId});
        ctx.entityNullObjectCheck(userInfo);

        if (userInfo.status === status) {
            return ctx.success(true);
        }

        const userDetailModel = deleteUndefinedFields({reason, remark});

        const task1 = this.userService.updateOne({userId}, {status});
        const task2 = this.userService.updateOneUserDetail({userId}, userDetailModel);

        await Promise.all([task1, task2]).then(t => ctx.success(true));
    }

    // 检查用户头像.
    @get('/allUsers/checkHeadImage')
    async checkHeadImage() {
        const userList = await this.userService.find({headImage: ''});

        const tasks = userList.map(x => this._generateHeadImage(x.userId));

        await Promise.all(tasks).then(this.ctx.success);
    }

    /**
     * 生成头像并保存
     */
    async _generateHeadImage(userId: number) {
        const headImageUrl = await this.headImageGenerator.generateAndUploadHeadImage(userId.toString());
        await this.userService.updateOne({userId: userId}, {headImage: headImageUrl});
    }
}
