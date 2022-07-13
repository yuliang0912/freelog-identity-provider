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
exports.ActivationCodeService = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const uuid_1 = require("uuid");
const enum_1 = require("../../enum");
const lodash_1 = require("lodash");
const freelog_common_func_1 = require("egg-freelog-base/lib/freelog-common-func");
const outside_api_service_1 = require("./outside-api-service");
let ActivationCodeService = class ActivationCodeService {
    ctx;
    userService;
    outsideApiService;
    activationCodeProvider;
    activationCodeUsedRecordProvider;
    count(condition) {
        return this.activationCodeProvider.count(condition);
    }
    find(condition, options) {
        return this.activationCodeProvider.find(condition, options?.projection, options);
    }
    findIntervalList(condition, options) {
        return this.activationCodeProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    findOne(condition, options) {
        return this.activationCodeProvider.findOne(condition);
    }
    /**
     * 批量创建
     * @param createQuantity
     * @param options
     */
    batchCreate(createQuantity, options) {
        const codes = [];
        createQuantity = createQuantity < 1 ? 1 : createQuantity > 50 ? 50 : createQuantity;
        while (codes.length < createQuantity) {
            const code = egg_freelog_base_1.CryptoHelper.base64Encode((0, uuid_1.v4)() + (0, uuid_1.v4)()).substr(0, 8);
            codes.push({
                code, codeType: 'beta',
                userId: options.userId ?? 0,
                username: options.username ?? '',
                limitCount: options.limitCount ?? 0,
                endEffectiveDate: options?.endEffectiveDate ?? null,
                startEffectiveDate: options?.startEffectiveDate ?? null,
                remark: options.remark ?? ''
            });
        }
        return this.activationCodeProvider.insertMany(codes);
    }
    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes, status, remark) {
        const updateModel = (0, freelog_common_func_1.deleteUndefinedFields)({ status, remark });
        return this.activationCodeProvider.updateMany({ code: { $in: codes } }, updateModel).then(t => Boolean(t.nModified));
    }
    /**
     * 使用授权码激活测试资格
     * @param userInfo
     * @param code
     */
    async activateAuthorizationCode(userInfo, code) {
        const activationCodeInfo = await this.activationCodeProvider.findOne({ code, codeType: 'beta' });
        if (!activationCodeInfo || activationCodeInfo.status === enum_1.ActivationCodeStatusEnum.disabled
            || (activationCodeInfo.limitCount > 0 && activationCodeInfo.usedCount >= activationCodeInfo.limitCount)) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if ((0, lodash_1.isDate)(activationCodeInfo.startEffectiveDate) && activationCodeInfo.startEffectiveDate > new Date()) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if ((0, lodash_1.isDate)(activationCodeInfo.endEffectiveDate) && activationCodeInfo.endEffectiveDate < new Date()) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        const task1 = this.activationCodeProvider.updateOne({ code }, { $inc: { usedCount: 1 } });
        const task2 = this.activationCodeUsedRecordProvider.create({
            code, userId: userInfo.userId, username: userInfo.username, loginIp: this.ctx.ip
        });
        const task3 = this.userService.updateOne({ userId: userInfo.userId }, { userType: userInfo.userType | 1 });
        await Promise.all([task1, task2, task3]);
        if (activationCodeInfo.userId) {
            this.outsideApiService.sendActivityEvent('TS000015', activationCodeInfo.userId).catch(console.error);
        }
        return true;
    }
    /**
     * 获取用户的邀请码(如果是已激活用户,且没有激活码,则自动生成一个3次有效机会的邀请码)
     * @param userInfo
     */
    async findOrCreateUserActivationCode(userInfo) {
        // 未激活或被冻结的用户无法获得激活码
        if (userInfo?.status !== enum_1.UserStatusEnum.Normal) {
            return null;
        }
        const userCodeInfo = await this.activationCodeProvider.findOne({ userId: userInfo.userId }, undefined, { sort: { createDate: -1 } });
        if (!userCodeInfo) {
            return this.batchCreate(1, {
                userId: userInfo.userId, username: userInfo.username, limitCount: 3,
                startEffectiveDate: new Date(),
                endEffectiveDate: new Date(2022, 12, 31)
            }).then(lodash_1.first);
        }
        return userCodeInfo;
    }
    /**
     * 查询激活码使用记录
     * @param condition
     * @param options
     */
    findUsedRecordIntervalList(condition, options) {
        return this.activationCodeUsedRecordProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "userService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], ActivationCodeService.prototype, "outsideApiService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "activationCodeProvider", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "activationCodeUsedRecordProvider", void 0);
ActivationCodeService = __decorate([
    (0, midway_1.provide)()
], ActivationCodeService);
exports.ActivationCodeService = ActivationCodeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBU3ZDLHVEQUErRztBQUMvRywrQkFBd0I7QUFDeEIscUNBQW9FO0FBQ3BFLG1DQUFxQztBQUNyQyxrRkFBK0U7QUFDL0UsK0RBQXdEO0FBR3hELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBRzlCLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGlCQUFpQixDQUFvQjtJQUVyQyxzQkFBc0IsQ0FBd0M7SUFFOUQsZ0NBQWdDLENBQThDO0lBRTlFLEtBQUssQ0FBQyxTQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksQ0FBQyxTQUFpQixFQUFFLE9BQXlDO1FBQzdELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUN6RSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUNoRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7O09B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