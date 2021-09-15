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
exports.betaTestApplyAuditRecordController = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const lodash_1 = require("lodash");
const enum_1 = require("../../enum");
let betaTestApplyAuditRecordController = class betaTestApplyAuditRecordController {
    ctx;
    userService;
    testQualificationApplyAuditService;
    async index() {
        const { ctx } = this;
        const skip = ctx.checkQuery('skip').ignoreParamWhenEmpty().toInt().default(0).ge(0).value;
        const limit = ctx.checkQuery('limit').ignoreParamWhenEmpty().toInt().default(10).gt(0).lt(101).value;
        const sort = ctx.checkQuery('sort').optional().value;
        const status = ctx.checkQuery("status").ignoreParamWhenEmpty().toInt().value;
        const keywords = ctx.checkQuery("keywords").ignoreParamWhenEmpty().default('').trim().value;
        ctx.validateParams().validateOfficialAuditAccount();
        const condition = {};
        if (egg_freelog_base_1.CommonRegex.mobile86.test(keywords)) {
            condition.mobile = keywords;
        }
        else if (egg_freelog_base_1.CommonRegex.email.test(keywords)) {
            condition.email = keywords;
        }
        else if (egg_freelog_base_1.CommonRegex.username.test(keywords)) {
            condition.username = keywords;
        }
        else if (keywords.length) {
            return ctx.success({ skip, limit, totalItem: 0, dataList: [] });
        }
        const pageResult = await this.testQualificationApplyAuditService.findSearchIntervalList(condition, status, {
            skip, limit, sort: sort ?? { createDate: -1 }
        });
        if (!pageResult.dataList.length) {
            return ctx.success(pageResult);
        }
        const userDetailInfoMap = await this.userService.findUserDetails({ userId: { $in: pageResult.dataList.map(x => x.userId) } }).then(list => {
            return new Map(list.map(x => [x.userId, x]));
        });
        pageResult.dataList = pageResult.dataList.map(record => {
            const userInfo = (0, lodash_1.first)(record['userInfos']);
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
                createDate: record.createDate
            };
        });
        ctx.success(pageResult);
    }
    async create() {
        const { ctx } = this;
        const province = ctx.checkBody("province").exist().type('string').len(2, 10).value;
        const city = ctx.checkBody("city").exist().type('string').len(2, 10).value;
        const occupation = ctx.checkBody("occupation").exist().type('string').len(2, 15).value;
        const description = ctx.checkBody("description").exist().type('string').len(1, 500).value;
        ctx.validateParams();
        const userInfo = await this.userService.findOne({ userId: ctx.userId });
        if (userInfo.userType > 0) {
            throw new egg_freelog_base_1.ApplicationError(ctx.gettext('test-qualification-apply-refuse-error'));
        }
        const model = {
            userId: userInfo.userId,
            username: userInfo.username,
            otherInfo: {
                province, city, occupation, description
            }
        };
        await this.testQualificationApplyAuditService.testQualificationApply(model).then(ctx.success);
    }
    async show() {
        const { ctx } = this;
        const recordId = ctx.checkParams("recordId").exist().isMongoObjectId().value;
        ctx.validateParams();
        await this.testQualificationApplyAuditService.findOne({ _id: recordId }).then(ctx.success);
    }
    async batchUpdate() {
        const { ctx } = this;
        const recordIds = ctx.checkBody("recordIds").exist().isArray().len(1, 50).value;
        const status = ctx.checkBody('status').exist().toInt().value; //只有初始态才可以修改
        const auditMsg = ctx.checkBody('auditMsg').optional().type('string').default('').value; //只有初始态才可以修改
        ctx.validateParams();
        const applyRecordInfos = await this.testQualificationApplyAuditService.find({
            _id: { $in: recordIds }, status: enum_1.AuditStatusEnum.WaitReview
        });
        if (!applyRecordInfos.length) {
            return ctx.success(false);
        }
        await this.testQualificationApplyAuditService.batchAuditTestQualificationApply(applyRecordInfos, {
            status, auditMsg
        }).then(ctx.success);
    }
    async update() {
        const { ctx } = this;
        const recordId = ctx.checkParams("recordId").exist().isMongoObjectId().value;
        const status = ctx.checkBody('status').exist().toInt().value; //只有初始态才可以修改
        const auditMsg = ctx.checkBody('auditMsg').optional().type('string').default('').value; //只有初始态才可以修改
        ctx.validateParams();
        const applyRecordInfo = await this.testQualificationApplyAuditService.findOne({
            _id: recordId
        });
        ctx.entityNullObjectCheck(applyRecordInfo);
        if (applyRecordInfo.status !== enum_1.AuditStatusEnum.WaitReview) {
            throw new egg_freelog_base_1.ApplicationError('已审核过的申请,不允许修改');
        }
        await this.testQualificationApplyAuditService.auditTestQualificationApply(applyRecordInfo, {
            status, auditMsg
        }).then(ctx.success);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], betaTestApplyAuditRecordController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], betaTestApplyAuditRecordController.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], betaTestApplyAuditRecordController.prototype, "testQualificationApplyAuditService", void 0);
__decorate([
    (0, midway_1.get)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], betaTestApplyAuditRecordController.prototype, "index", null);
__decorate([
    (0, midway_1.post)('/'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], betaTestApplyAuditRecordController.prototype, "create", null);
__decorate([
    (0, midway_1.get)('/:recordId'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], betaTestApplyAuditRecordController.prototype, "show", null);
__decorate([
    (0, midway_1.put)('/batch'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], betaTestApplyAuditRecordController.prototype, "batchUpdate", null);
__decorate([
    (0, midway_1.put)('/:recordId'),
    (0, egg_freelog_base_1.visitorIdentityValidator)(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], betaTestApplyAuditRecordController.prototype, "update", null);
betaTestApplyAuditRecordController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/testQualifications/beta/apply')
], betaTestApplyAuditRecordController);
exports.betaTestApplyAuditRecordController = betaTestApplyAuditRecordController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmV0YS10ZXN0LWFwcGx5LWF1ZGl0LXJlY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9iZXRhLXRlc3QtYXBwbHktYXVkaXQtcmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFtRTtBQUNuRSx1REFNMEI7QUFPMUIsbUNBQTZCO0FBQzdCLHFDQUEyQztBQUkzQyxJQUFhLGtDQUFrQyxHQUEvQyxNQUFhLGtDQUFrQztJQUczQyxHQUFHLENBQWlCO0lBRXBCLFdBQVcsQ0FBZTtJQUUxQixrQ0FBa0MsQ0FBc0M7SUFJeEUsS0FBSyxDQUFDLEtBQUs7UUFDUCxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMxRixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3JHLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDN0UsTUFBTSxRQUFRLEdBQUcs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