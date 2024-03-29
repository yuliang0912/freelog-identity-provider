import {controller, get, put, inject, post, provide} from 'midway';
import {FreelogContext, visitorIdentityValidator, IdentityTypeEnum, ApplicationError} from 'egg-freelog-base';
import {IActivationCodeService, IUserService} from '../../interface';
import {isDate, isString} from 'lodash';
import {emailOrMobileDesensitization} from '../../extend/common-helper';

@provide()
@controller('/v2/testQualifications/beta/codes')
export class activationCodeController {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    activationCodeService: IActivationCodeService;

    @get('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async index() {

        const {ctx} = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().emptyStringAsNothingness().value;
        const status = ctx.checkQuery('status').optional().toInt().value;
        const beginCreateDate = ctx.checkQuery('beginCreateDate').ignoreParamWhenEmpty().toDate().value;
        const endCreateDate = ctx.checkQuery('endCreateDate').ignoreParamWhenEmpty().toDate().value;
        const keywords = ctx.checkQuery('keywords').optional().emptyStringAsNothingness().trim().value;
        ctx.validateParams().validateOfficialAuditAccount();

        const condition: any = {};
        if ([0, 1, 2].includes(status)) {
            condition.status = status;
        }
        if (isString(keywords) && keywords.length) {
            condition.$or = [{username: keywords}, {code: keywords}];
        }
        if (isDate(beginCreateDate) && isDate(endCreateDate)) {
            condition.createDate = {$gte: beginCreateDate, $lte: endCreateDate};
        } else if (isDate(beginCreateDate)) {
            condition.createDate = {$gte: beginCreateDate};
        } else if (isDate(endCreateDate)) {
            condition.createDate = {$lte: endCreateDate};
        }

        await this.activationCodeService.findIntervalList(condition, {
            skip, limit,
            sort: sort ?? {createDate: -1}
        }).then(ctx.success);
    }

    @post('/batchCreate')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async batchCreate() {

        const {ctx} = this;
        const createQuantity = ctx.checkBody('createQuantity').optional().toInt().gt(0).lt(51).default(10).value;
        const limitCount = ctx.checkBody('limitCount').exist().toInt().ge(0).value;
        const startEffectiveDate = ctx.checkBody('startEffectiveDate').optional().toDate().value;
        const endEffectiveDate = ctx.checkBody('endEffectiveDate').optional().toDate().value;
        const remark = ctx.checkBody('remark').optional().value;
        ctx.validateParams().validateOfficialAuditAccount();

        await this.activationCodeService.batchCreate(createQuantity, {
            limitCount, startEffectiveDate, endEffectiveDate, remark
        }).then(ctx.success);
    }

    @put('/batchUpdate')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async batchUpdate() {
        const {ctx} = this;
        const codes = ctx.checkBody('codes').exist().isArray().len(1, 100).value;
        const status = ctx.checkBody('status').exist().in([0, 1]).value;
        const remark = ctx.checkBody('remark').optional().value;
        ctx.validateParams().validateOfficialAuditAccount();

        await this.activationCodeService.batchUpdate(codes, status, remark).then(ctx.success);
    }

    // 使用授权码激活测试资格
    @post('/activate')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async activateTestQualification() {
        const {ctx} = this;
        const code = ctx.checkBody('code').exist().type('string').len(8, 8).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        if ((userInfo.userType & 1) === 1) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }

        await this.activationCodeService.activateAuthorizationCode(userInfo, code).then(ctx.success);
    }

    @get('/usedRecords')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async usedRecords() {
        const {ctx} = this;
        const skip = ctx.checkQuery('skip').optional().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').optional().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const code = ctx.checkQuery('code').optional().emptyStringAsNothingness().type('string').len(8, 8).value;
        const keywords = ctx.checkQuery('keywords').optional().emptyStringAsNothingness().trim().value;
        ctx.validateParams();

        const condition: any = {};
        if (isString(keywords) && keywords.length) {
            condition.username = keywords.toString();
        }
        if (isString(code)) {
            condition.code = code;
        }

        await this.activationCodeService.findUsedRecordIntervalList(condition, {
            skip, limit, sort: sort ?? {createDate: -1}
        }).then(ctx.success);
    }

    // 当前用户的邀请码
    @get('/userActivateCode')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async userCode() {
        const userInfo = await this.userService.findOne({userId: this.ctx.userId});
        await this.activationCodeService.findOrCreateUserActivationCode(userInfo).then(this.ctx.success);
    }

    @put('/limitCount')
    @visitorIdentityValidator(IdentityTypeEnum.InternalClient)
    async updateUserCodeLimit() {
        const {ctx} = this;
        // 此处允许负数来实现减法操作.
        const userId = ctx.checkBody('userId').isUserId().toInt().value;
        const incrNumber = ctx.checkBody('incrNumber').toInt().value;
        ctx.validateParams();
        const userInfo = await this.userService.findOne({userId});
        const userActivateCodeInfo = await this.activationCodeService.findOrCreateUserActivationCode(userInfo);
        if (!userActivateCodeInfo) {
            return ctx.success(false);
        }
        await this.activationCodeService.activationCodeProvider.updateOne({code: userActivateCodeInfo.code}, {
            $inc: {limitCount: incrNumber}
        }).then(x => ctx.success(Boolean(x.ok)));
    }

    // 根据被邀请人查询邀请者信息
    @get('/inviterInfo')
    async getInviterInfo() {
        const {ctx} = this;
        const userId = ctx.checkQuery('userId').exist().isUserId().toInt().value;
        ctx.validateParams();
        await this.activationCodeService.getInviterInfo(userId).then(ctx.success);
    }

    // 根据邀请人ID查询被邀请人.
    @get('/invitees')
    async getInvitees() {
        const {ctx} = this;
        const userId = ctx.checkQuery('userId').exist().isUserId().toInt().value;
        ctx.validateParams();
        const invitees = await this.activationCodeService.getInvitees(userId);
        if (!invitees.length) {
            return ctx.success([]);
        }
        const userMap = await this.userService.find({userId: {$in: invitees.map(x => x.userId)}}).then(list => {
            return new Map(list.map(x => [x.userId, x]));
        });
        ctx.success(invitees.map(inviteeInfo => {
            const userInfo = userMap.get(inviteeInfo.userId);
            return {
                userId: userInfo.userId,
                username: userInfo.username,
                email: emailOrMobileDesensitization(userInfo.email),
                mobile: emailOrMobileDesensitization(userInfo.mobile)
            };
        }));
    }

    @get('/:code')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async show() {
        const {ctx} = this;
        const code = ctx.checkParams('code').type('string').len(8, 8).value;
        ctx.validateParams();

        await this.activationCodeService.findOne({code}).then(ctx.success);
    }
}
