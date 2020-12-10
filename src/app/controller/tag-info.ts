import {controller, get, inject, post, del, provide, put} from 'midway';
import {
    IdentityTypeEnum,
    visitorIdentityValidator,
    FreelogContext,
    ApplicationRouterMatchError
} from 'egg-freelog-base';
import {ITageService} from "../../interface";

@provide()
@controller('/v2/users/tags')
export class TagInfoController {

    @inject()
    ctx: FreelogContext;
    @inject()
    tagService: ITageService;

    @post('/')
    async create() {

        const {ctx} = this;
        const tag = ctx.checkBody('tag').exist().type('string').trim().len(1, 80).value;
        const type = ctx.checkBody('type').exist().toInt().in([1, 2]).value;
        ctx.validateOfficialAuditAccount().validateParams();

        await this.tagService.create(tag, type).then(ctx.success);
    }

    @get('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async index() {
        const {ctx} = this;
        ctx.validateOfficialAuditAccount();
        await this.tagService.find({status: 0}).then(ctx.success);
    }

    @del('/:tagId')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async destroy() {

        const {ctx} = this;
        const tagId = this.ctx.checkParams("tagId").exist().toInt().gt(0).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const tagInfo = await this.tagService.findOne({_id: tagId});
        ctx.entityNullObjectCheck(tagInfo);

        if (tagInfo.type === 2) {
            throw new ApplicationRouterMatchError('没有操作权限')
        }

        await this.tagService.updateOne(tagInfo, {status: 1}).then(ctx.success);
    }

    @put('/:tagId')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async update() {

        const {ctx} = this;
        const tagId = this.ctx.checkParams("tagId").exist().toInt().gt(0).value;
        const tag = ctx.checkBody('tag').exist().type('string').trim().len(1, 80).value;
        ctx.validateVisitorIdentity().validateOfficialAuditAccount();
        
        const tagInfo = await this.tagService.findOne({_id: tagId});
        ctx.entityNullObjectCheck(tagInfo);

        await this.tagService.updateOne(tagInfo, {tag}).then(ctx.success);
    }
}
