import {controller, get, inject, post, del, provide} from 'midway';
import {IdentityTypeEnum, visitorIdentityValidator, FreelogContext} from 'egg-freelog-base';
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
        const tag = ctx.checkBody('tag').exist().type('string').trim().value;
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

        await this.tagService.updateOne(tagInfo, {status: 1}).then(ctx.success);
    }
}
