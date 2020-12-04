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
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
let TagInfoController = class TagInfoController {
    async create() {
        const { ctx } = this;
        const tag = ctx.checkBody('tag').exist().type('string').trim().value;
        const type = ctx.checkBody('type').exist().toInt().in([1, 2]).value;
        ctx.validateParams().validateOfficialAuditAccount();
        await this.tagService.create(tag, type).then(ctx.success);
    }
    async index() {
        const { ctx } = this;
        ctx.validateOfficialAuditAccount();
        await this.tagService.find({ status: 0 }).then(ctx.success);
    }
    async destroy() {
        const { ctx } = this;
        const tagId = this.ctx.checkParams("tagId").exist().toInt().gt(0).value;
        ctx.validateParams().validateOfficialAuditAccount();
        const tagInfo = await this.tagService.findOne({ _id: tagId });
        ctx.entityNullObjectCheck(tagInfo);
        await this.tagService.updateOne(tagInfo, { status: 1 }).then(ctx.success);
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], TagInfoController.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], TagInfoController.prototype, "tagService", void 0);
__decorate([
    midway_1.post('/'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "create", null);
__decorate([
    midway_1.get('/'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "index", null);
__decorate([
    midway_1.del('/:tagId'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagInfoController.prototype, "destroy", null);
TagInfoController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/users/tags')
], TagInfoController);
exports.TagInfoController = TagInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGFnLWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW1FO0FBQ25FLHVEQUE0RjtBQUs1RixJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQVMxQixLQUFLLENBQUMsTUFBTTtRQUVSLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3JFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1FBRXBELE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUlELEtBQUssQ0FBQyxLQUFLO1FBQ1AsTUFBTSxFQUFDLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNuQixHQUFHLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUNuQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBSUQsS0FBSyxDQUFDLE9BQU87UUFFVCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDeEUsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFFcEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzVELEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVuQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUUsQ0FBQztDQUNKLENBQUE7QUFyQ0c7SUFEQyxlQUFNLEVBQUU7OzhDQUNXO0FBRXBCO0lBREMsZUFBTSxFQUFFOztxREFDZ0I7QUFJekI7SUFGQyxhQUFJLENBQUMsR0FBRyxDQUFDO0lBQ1QsMkNBQXdCLENBQUMsbUNBQWdCLENBQUMsU0FBUyxDQUFDOzs7OytDQVNwRDtBQUlEO0lBRkMsWUFBRyxDQUFDLEdBQUcsQ0FBQztJQUNSLDJDQUF3QixDQUFDLG1DQUFnQixDQUFDLFNBQVMsQ0FBQzs7Ozs4Q0FLcEQ7QUFJRDtJQUZDLFlBQUcsQ0FBQyxTQUFTLENBQUM7SUFDZCwyQ0FBd0IsQ0FBQyxtQ0FBZ0IsQ0FBQyxTQUFTLENBQUM7Ozs7Z0RBV3BEO0FBdkNRLGlCQUFpQjtJQUY3QixnQkFBTyxFQUFFO0lBQ1QsbUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztHQUNoQixpQkFBaUIsQ0F3QzdCO0FBeENZLDhDQUFpQiJ9