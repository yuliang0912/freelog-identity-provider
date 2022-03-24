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
exports.TagInfoController = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
let TagInfoController = class TagInfoController {
    ctx;
    tagService;
    async create() {
        const { ctx } = this;
        let tags = ctx.checkBody('tags').exist().isArray().len(1, 100).value;
        const type = ctx.checkBody('type').ignoreParamWhenEmpty().toInt().default(1).in([1, 2]).value;
        ctx.validateOfficialAuditAccount().validateParams();
        if (tags.some(x => !(0, lodash_1.isString)(x) || !x.trim().length)) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('params-validate-failed', 'tags'));
        }
        tags = (0, lodash_1.uniqBy)(tags, x => x.trim());
        const existingTags = await this.tagService.find({ tag: { $in: tags } });
        if (existingTags.some(x => x.status !== 1)) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('tag_name_be_taken'), { existingTags });
        }
        const createTags = (0, lodash_1.differenceWith)(tags, existingTags, (x, y) => x === y.tag && y.status === 1);
        const updateTagIds = existingTags.filter(x => x.status === 1).map(x => x.tagId);
        await this.tagService.create(createTags, type, updateTagIds).then(ctx.success);
    }
    async index() {
        const { ctx } = this;
        ctx.validateOfficialAuditAccount();
        await this.tagService.find({ status: 0 }).then(ctx.success);
    }
    async destroy() {
        const { ctx } = this;
        const tagIds = this.ctx.checkBody('tagIds').exist().isArray().len(1, 100).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const tagList = await this.tagService.find({ _id: { $in: tagIds } });
        if (tagList.some(x => x.type === 2)) {
            throw new egg_freelog_base_1.LogicError('自动产生的标签无法删除');
        }
        if (!tagList.length) {
            ctx.success(false);
        }
        await this.tagService.updateMany({ _id: { $in: tagIds } }, { status: 1 }).then(ctx.success);
    }
    async update() {
        const { ctx } = this;
        const tagId = this.ctx.checkParams('tagId').exist().toInt().gt(0).value;
        const tag = ctx.checkBody('tag').exist().type('string').trim().len(1, 80).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const tagInfo = await this.tagService.findOne({ _id: tagId });
        ctx.entityNullObjectCheck(tagInfo);
        await this.tagService.updateOne(tagInfo, { tag }).then(ctx.success);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], TagInfoController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], TagInfoController.prototype, "tagService", void 0);
__decorate([
    (0, midway_1.post)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "create", null);
__decorate([
    (0, midway_1.get)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "index", null);
__decorate([
    (0, midway_1.put)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "destroy", null);
__decorate([
    (0, midway_1.put)('/:tagId'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "update", null);
TagInfoController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.priority)(1),
    (0, midway_1.controller)('/v2/users/tags')
], TagInfoController);
exports.TagInfoController = TagInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGFnLWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXdEO0FBRXhELG1DQUE2RTtBQUM3RSx1REFNMEI7QUFLMUIsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFHMUIsR0FBRyxDQUFpQjtJQUVwQixVQUFVLENBQWU7SUFHekIsS0FBSyxDQUFDLE1BQU07UUFFUixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDckUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUYsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFcEQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFBLGlCQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEQsTUFBTSxJQUFJLGdDQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRTtRQUNELElBQUksR0FBRyxJQUFB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