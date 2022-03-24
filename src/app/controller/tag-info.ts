import {isString, uniqBy, differenceWith} from 'lodash';
import {ITageService} from '../../interface';
import {controller, get, inject, post, del, provide, put, priority} from 'midway';
import {
    IdentityTypeEnum,
    visitorIdentityValidator,
    FreelogContext,
    ArgumentError,
    LogicError
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
            throw new ArgumentError(this.ctx.gettext('params-validate-failed', 'tags'));
        }
        tags = uniqBy<string>(tags, x => x.trim());
        const existingTags = await this.tagService.find({tag: {$in: tags}});
        if (existingTags.some(x => x.status !== 1)) {
            throw new ArgumentError(this.ctx.gettext('tag_name_be_taken'), {existingTags});
        }
        const createTags = differenceWith(tags, existingTags, (x, y) => x === y.tag && y.status === 1) as string[];
        const updateTagIds = existingTags.filter(x => x.status === 1).map(x => x.tagId);
        await this.tagService.create(createTags, type, updateTagIds).then(ctx.success);
    }

    @get('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async index() {
        const {ctx} = this;
        ctx.validateOfficialAuditAccount();
        await this.tagService.find({status: 0}).then(ctx.success);
    }

    @del('/')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async destroy() {

        const {ctx} = this;
        const tagIds = this.ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const tagList = await this.tagService.find({_id: {$in: tagIds}});
        if (tagList.some(x => x.type === 2)) {
            throw new LogicError('自动产生的标签无法删除');
        }
        if (!tagList.length) {
            ctx.success(false);
        }
        await this.tagService.updateMany({_id: {$in: tagIds}}, {status: 1}).then(ctx.success);
    }

    @put('/:tagId')
    @visitorIdentityValidator(IdentityTypeEnum.LoginUser)
    async update() {

        const {ctx} = this;
        const tagId = this.ctx.checkParams('tagId').exist().toInt().gt(0).value;
        const tag = ctx.checkBody('tag').exist().type('string').trim().len(1, 80).value;
        ctx.validateParams().validateOfficialAuditAccount();

        const tagInfo = await this.tagService.findOne({_id: tagId});
        ctx.entityNullObjectCheck(tagInfo);

        await this.tagService.updateOne(tagInfo, {tag}).then(ctx.success);
    }
}
