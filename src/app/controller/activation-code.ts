import {controller, get, put, inject, post, provide} from 'midway';
import {FreelogContext, visitorIdentityValidator, IdentityTypeEnum, ApplicationError} from 'egg-freelog-base';
import {IActivationCodeService, IUserService} from "../../interface";
import {isString} from 'lodash';

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
        const status = ctx.checkQuery("status").optional().toInt().value;
        const keywords = ctx.checkQuery("keywords").optional().emptyStringAsNothingness().trim().value;
        ctx.validateParams().validateOfficialAuditAccount();

        const condition: any = {};
        if ([0, 1, 2].includes(status)) {
            condition.status = status;
        }
        if (isString(keywords) && keywords.length) {
            condition.$or = [{username: keywords}, {code: keywords}];
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
        const limitCount = ctx.checkBody('limitCount').exist().toInt().gt(0).value;
        const startEffectiveDate = ctx.checkBody('startEffectiveDate').optional().toDate().value;
        const endEffectiveDate = ctx.checkBody('endEffectiveDate').optional().toDate().value;
        ctx.validateParams().validateOfficialAuditAccount();

        await this.activationCodeService.batchCreate(createQuantity, {
            limitCount, startEffectiveDate, endEffectiveDate
        }).then(ctx.success);
    }

    @put('/batchUpdate')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async batchUpdate() {

        const {ctx} = this;
        const codes = ctx.checkBody('codes').exist().isArray().len(1, 100).value;
        const status = ctx.checkBody('status').exist().in([0, 1]).value;
        ctx.validateParams().validateOfficialAuditAccount();

        await this.activationCodeService.batchUpdate(codes, status).then(ctx.success);
    }

    // 使用授权码激活测试资格
    @post('/activate')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async activateTestQualification() {
        const {ctx} = this;
        const code = ctx.checkBody("code").exist().type('string').len(8, 8).value;
        ctx.validateParams();

        const userInfo = await this.userService.findOne({userId: ctx.userId});
        if ((userInfo.userType & 1) === 1) {
            throw new ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'))
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
        const keywords = ctx.checkQuery("keywords").optional().emptyStringAsNothingness().trim().value;
        ctx.validateParams();

        const condition: any = {};
        if (isString(keywords) && keywords.length) {
            condition.username = keywords.toString();
        }
        if (isString(code)) {
            condition.code = code;
        }

        await this.activationCodeService.findUsedRecordIntervalList(condition, {
            skip, limit,
            sort: sort ?? {createDate: -1}
        }).then(ctx.success)
    }

    @get('/:code')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async show() {

        const {ctx} = this;
        const code = ctx.checkParams("code").type('string').len(8, 8).value;
        ctx.validateParams();

        await this.activationCodeService.findOne({code}).then(ctx.success);
    }
}
