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
let ActivationCodeService = class ActivationCodeService {
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
            const code = egg_freelog_base_1.CryptoHelper.base64Encode(uuid_1.v4() + uuid_1.v4()).substr(0, 8);
            codes.push({
                code, codeType: 'beta',
                userId: options.userId ?? 0,
                limitCount: options.limitCount ?? 0,
                endEffectiveDate: options?.endEffectiveDate ?? null,
                startEffectiveDate: options?.startEffectiveDate ?? null
            });
        }
        return this.activationCodeProvider.insertMany(codes);
    }
    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes, status) {
        return this.activationCodeProvider.updateMany({ code: { $in: codes } }, { status }).then(t => Boolean(t.nModified));
    }
    /**
     * 使用授权码激活测试资格
     * @param userId
     * @param code
     */
    async activateAuthorizationCode(userInfo, code) {
        const activationCodeInfo = await this.activationCodeProvider.findOne({ code, codeType: 'beta' });
        if (!activationCodeInfo || activationCodeInfo.status === enum_1.ActivationCodeStatusEnum.disabled
            || (activationCodeInfo.limitCount > 0 && activationCodeInfo.usedCount >= activationCodeInfo.limitCount)) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if (lodash_1.isDate(activationCodeInfo.startEffectiveDate) && activationCodeInfo.startEffectiveDate > new Date()) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        if (lodash_1.isDate(activationCodeInfo.endEffectiveDate) && activationCodeInfo.endEffectiveDate < new Date()) {
            throw new egg_freelog_base_1.ApplicationError(this.ctx.gettext('test-qualification-activation-code-invalid'));
        }
        const task1 = this.activationCodeProvider.updateOne({ code }, { $inc: { usedCount: 1 } });
        const task2 = this.activationCodeUsedRecordProvider.create({
            code, userId: userInfo.userId, username: userInfo.username, loginIp: this.ctx.ip
        });
        const task3 = this.userService.updateOne({ userId: userInfo.userId }, { userType: userInfo.userType | 1 });
        return Promise.all([task1, task2, task3]).then(() => true);
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
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "userService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "activationCodeProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "activationCodeUsedRecordProvider", void 0);
ActivationCodeService = __decorate([
    midway_1.provide()
], ActivationCodeService);
exports.ActivationCodeService = ActivationCodeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBUXZDLHVEQUErRztBQUMvRywrQkFBd0I7QUFDeEIscUNBQW9EO0FBQ3BELG1DQUE2QjtBQUc3QixJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQVc5QixLQUFLLENBQUMsU0FBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUFJLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUM3RCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELGdCQUFnQixDQUFDLFNBQWlCLEVBQUUsT0FBeUM7UUFDekUsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0SSxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQWlCLEVBQUUsT0FBeUM7UUFDaEUsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsV0FBVyxDQUFDLGNBQXNCLEVBQUUsT0FBb0M7UUFFcEUsTUFBTSxLQUFLLEdBQWtDLEVBQUUsQ0FBQztRQUNoRCxjQUFjLEdBQUcsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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