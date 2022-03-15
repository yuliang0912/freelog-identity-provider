import {controller, get, inject, post, provide, put} from 'midway';
import {
    ApplicationError,
    CommonRegex,
    FreelogContext,
    IdentityTypeEnum,
    visitorIdentityValidator
} from 'egg-freelog-base';
import {
    ITestQualificationApplyAuditService,
    IUserService,
    TestQualificationApplyAuditRecordInfo,
    UserInfo
} from '../../interface';
import {first} from 'lodash';
import {AuditStatusEnum} from '../../enum';

@provide()
@controller('/v2/testQualifications/beta/apply')
export class betaTestApplyAuditRecordController {

    @inject()
    ctx: FreelogContext;
    @inject()
    userService: IUserService;
    @inject()
    testQualificationApplyAuditService: ITestQualificationApplyAuditService;

    @get('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async index() {
        const {ctx} = this;
        const skip = ctx.checkQuery('skip').ignoreParamWhenEmpty().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').ignoreParamWhenEmpty().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const status = ctx.checkQuery('status').ignoreParamWhenEmpty().toInt().value;
        const keywords = ctx.checkQuery('keywords').ignoreParamWhenEmpty().default('').trim().value;
        ctx.validateParams().validateOfficialAuditAccount();

        const condition: Partial<UserInfo> = {};
        if (CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        } else if (CommonRegex.email.test(keywords)) {
            condition.email = keywords;
        } else if (CommonRegex.username.test(keywords)) {
            condition.username = keywords;
        } else if (keywords.length) {
            return ctx.success({skip, limit, totalItem: 0, dataList: []});
        }

        const pageResult = await this.testQualificationApplyAuditService.findSearchIntervalList(condition, status, {
            skip, limit, sort: sort ?? {createDate: -1}
        });

        if (!pageResult.dataList.length) {
            return ctx.success(pageResult);
        }

        const userDetailInfoMap = await this.userService.findUserDetails({userId: {$in: pageResult.dataList.map(x => x.userId)}}).then(list => {
            return new Map(list.map(x => [x.userId, x]));
        });

        pageResult.dataList = pageResult.dataList.map(record => {
            const userInfo = first<UserInfo>(record['userInfos']);
            const userDetailInfo = userDetailInfoMap.get(record.userId);
            return {
                recordId: record['_id'],
                operationUserId: record.operationUserId,
                province: record.otherInfo.province,
                city: record.otherInfo.city,
                occupation: record.otherInfo.occupation,
                description: record.otherInfo.description,
                userId: record.userId,
                username: userInfo.username,
                email: userInfo.email,
                mobile: userInfo.mobile,
                latestLoginData: userDetailInfo?.latestLoginDate ?? null,
                latestLoginIp: userDetailInfo?.latestLoginIp ?? '',
                createDate: record.createDate,
                status: record.status
            } as any;
        });
        ctx.success(pageResult);
    }

    @post('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async create() {

        const {ctx} = this;
        const province = ctx.checkBody('province').exist().type('string').len(2, 10).value;
        const city = ctx.checkBody('city').exist().type('string').len(2, 10).value;
        const occupation = ctx.checkBody('occupation').exist().type('string').len(2, 15).value;
        const description = ctx.checkBody('description').exist().type('string').len(1, 500).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        if (userInfo.userType > 0) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }

        const model: Partial<TestQualificationApplyAuditRecordInfo> = {
            userId: userInfo.userId,
            username: userInfo.username,
            otherInfo: {
                province, city, occupation, description
            }
        };

        await this.testQualificationApplyAuditService.testQualificationApply(model).then(ctx.success);
    }

    @get('/:recordId')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async show() {

        const {ctx} = this;
        const recordId = ctx.checkParams('recordId').exist().isMongoObjectId().value;
        ctx.validateParams();

        await this.testQualificationApplyAuditService.findOne({_id: recordId}).then(ctx.success);
    }

    @put('/batch')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async batchUpdate() {

        const {ctx} = this;
        const recordIds = ctx.checkBody('recordIds').exist().isArray().len(1, 50).value;
        const status = ctx.checkBody('status').exist().toInt().value; //只有初始态才可以修改
        const auditMsg = ctx.checkBody('auditMsg').optional().type('string').default('').value; //只有初始态才可以修改
        ctx.validateParams();

        const applyRecordInfos = await this.testQualificationApplyAuditService.find({
            _id: {$in: recordIds}, status: AuditStatusEnum.WaitReview
        });

        if (!applyRecordInfos.length) {
            return ctx.success(false);
        }

        await this.testQualificationApplyAuditService.batchAuditTestQualificationApply(applyRecordInfos, {
            status, auditMsg
        }).then(ctx.success);
    }

    @put('/:recordId')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async update() {

        const {ctx} = this;
        const recordId = ctx.checkParams('recordId').exist().isMongoObjectId().value;
        const status = ctx.checkBody('status').exist().toInt().value; //只有初始态才可以修改
        const auditMsg = ctx.checkBody('auditMsg').optional().type('string').default('').value; //只有初始态才可以修改
        ctx.validateParams();

        const applyRecordInfo = await this.testQualificationApplyAuditService.findOne({
            _id: recordId
        });
        ctx.entityNullObjectCheck(applyRecordInfo);

        if (applyRecordInfo.status !== AuditStatusEnum.WaitReview) {
            throw new ApplicationError('已审核过的申请,不允许修改');
        }

        await this.testQualificationApplyAuditService.auditTestQualificationApply(applyRecordInfo, {
            status, auditMsg
        }).then(ctx.success);
    }
}
