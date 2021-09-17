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
    ctx;
    userService;
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
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "userService", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBUXZDLHVEQUErRztBQUMvRywrQkFBd0I7QUFDeEIscUNBQW9EO0FBQ3BELG1DQUE2QjtBQUc3QixJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQUc5QixHQUFHLENBQWlCO0lBRXBCLFdBQVcsQ0FBZTtJQUUxQixzQkFBc0IsQ0FBd0M7SUFFOUQsZ0NBQWdDLENBQThDO0lBRTlFLEtBQUssQ0FBQyxTQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksQ0FBQyxTQUFpQixFQUFFLE9BQXlDO1FBQzdELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUN6RSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUNoRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsY0FBc0IsRUFBRSxPQUFvQztRQUVwRSxNQUFN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