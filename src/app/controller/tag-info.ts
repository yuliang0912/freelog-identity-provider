import {isString, uniqBy} from "lodash";
import {ITageService} from "../../interface";
import {controller, get, inject, post, del, provide, put, priority} from 'midway';
import {
    IdentityTypeEnum, visitorIdentityValidator, FreelogContext, ApplicationRouterMatchError, ArgumentError
} from 'egg-freelog-base';

@provide()
@priority(1)
@controller('/v2/users/tags')
export class TagInfoController {

    @inject()
    ctx: FreelogContext;
    @inject()
    tagService: ITageService;

    @post('/')
    async create() {

        const {ctx} = this;
        let tags = ctx.checkBody('tags').exist().isArray().len(1, 100).value;
        const type = ctx.checkBody('type').ignoreParamWhenEmpty().toInt().default(1).in([1, 2]).value;
        ctx.validateOfficialAuditAccount().validateParams();

        if (tags.some(x => !isString(x) || !x.trim().length)) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tags'))
        }
        tags = uniqBy<string>(tags, x => x.trim());
        const existingTags = await this.tagService.find({tag: {$in: tags}});
        if (existingTags.length) {
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tags'), {existingTags})
        }
        await this.tagService.create(tags, type).then(ctx.success);
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
        ctx.validateOfficialAuditAccount();

        const tagInfo = await this.tagService.findOne({_id: tagId});
        ctx.entityNullObjectCheck(tagInfo);

        await this.tagService.updateOne(tagInfo, {tag}).then(ctx.success);
    }
}
