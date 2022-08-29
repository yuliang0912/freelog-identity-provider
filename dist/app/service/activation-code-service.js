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
     * 根据被邀请人查询邀请者信息
     * @param inviteeUserId
     */
    async getInviterInfo(inviteeUserId) {
        const activationCodeUsedRecord = await this.activationCodeUsedRecordProvider.findOne({ userId: inviteeUserId });
        if (!activationCodeUsedRecord) {
            return null;
        }
        const codeInfo = await this.activationCodeProvider.findOne({ code: activationCodeUsedRecord.code });
        if (!codeInfo.userId) {
            return null;
        }
        return (0, lodash_1.pick)(codeInfo, ['userId', 'username']);
    }
    /**
     * 根据邀请人ID获取被邀请人信息
     * @param inviterUserId
     */
    async getInvitees(inviterUserId) {
        const pipeline = [
            {
                $match: { userId: inviterUserId }
            },
            {
                $lookup: {
                    from: 'activation-code-used-records',
                    localField: 'code',
                    foreignField: 'code',
                    as: 'record'
                }
            },
            {
                $unwind: '$record'
            },
            {
                $project: {
                    userId: '$record.userId',
                    username: '$record.username',
                    createDate: '$record.createDate'
                }
            }
        ];
        return this.activationCodeProvider.aggregate(pipeline);
    }
    /**
     * 使用授权码激活测试资格
     * @param userInfo
     * @param code
     */
    async activateAuthorizationCode(userInfo, code) {
        const activationCodeInfo = await this.activationCodeProvider.findOne({ code, codeType: 'beta' });
        if (!activationCodeInfo || activationCodeInfo.status === 1
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
        const task3 = this.userService.updateOne({ userId: userInfo.userId }, {
            userType: userInfo.userType | 1,
            status: 0
        });
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
                userId: userInfo.userId,
                username: userInfo.username, limitCount: 3,
                status: 0,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBU3ZDLHVEQUErRztBQUMvRywrQkFBd0I7QUFDeEIscUNBQTBDO0FBQzFDLG1DQUEyQztBQUMzQyxrRkFBK0U7QUFDL0UsK0RBQXdEO0FBR3hELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBRzlCLEdBQUcsQ0FBaUI7SUFFcEIsV0FBVyxDQUFlO0lBRTFCLGlCQUFpQixDQUFvQjtJQUVyQyxzQkFBc0IsQ0FBd0M7SUFFOUQsZ0NBQWdDLENBQThDO0lBRTlFLEtBQUssQ0FBQyxTQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksQ0FBQyxTQUFpQixFQUFFLE9BQXlDO1FBQzdELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUN6RSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBaUIsRUFBRSxPQUF5QztRQUNoRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsY0FBc0IsRUFBRSxPQUFvQztRQUVwRSxNQUFNLEtBQUssR0FBa0MsRUFBRSxDQUFDO1FBQ2hELGNBQWMsR0FBRyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3BGLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEdBQUcsK0JBQVksQ0FBQyxZQUFZLENBQUMsSUFBQSxTQUFFLEdBQUUsR0FBRyxJQUFBLFNBQUUsR0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRSxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUNQLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTTtnQkFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDM0IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRTtnQkFDaEMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQztnQkFDbkMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixJQUFJLElBQUk7Z0JBQ25ELGtCQUFrQixFQUFFLE9BQU8sRUFBRSxrQkFBa0IsSUFBSSxJQUFJO2dCQUN2RCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFO2FBQy9CLENBQUMsQ0FBQztTQUNOO1FBQ0QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsV0FBVyxDQUFDLEtBQWUsRUFBRSxNQUFhLEVBQUUsTUFBZTtRQUN2RCxNQUFNLFdBQVcsR0FBRyxJQUFBLDJDQUFxQixFQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3JILENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQXFCO1FBQ3RDLE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7UUFDOUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsd0JBQXdCLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxJQUFBLGFBQUksRUFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFxQjtRQUNuQyxNQUFNLFFBQVEsR0FBRztZQUNiO2dCQUNJLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUM7YUFDbEM7WUFDRDtnQkFDSSxPQUFPLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLDhCQUE4QjtvQkFDcEMsVUFBVSxFQUFFLE1BQU07b0JBQ2xCLFlBQVksRUFBRSxNQUFNO29CQUNwQixFQUFFLEVBQUUsUUFBUTtpQkFDZjthQUNKO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLFNBQVM7YUFDckI7WUFDRDtnQkFDSSxRQUFRLEVBQUU7b0JBQ04sTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsVUFBVSxFQUFFLG9CQUFvQjtpQkFDbkM7YUFDSjtTQUNKLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMseUJBQXlCLENBQUMsUUFBa0IsRUFBRSxJQUFZO1FBRTVELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssQ0FBQztlQUNuRCxDQUFDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksa0JBQWtCLENBQUMsU0FBUyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pHLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7U0FDOUY7UUFDRCxJQUFJLElBQUEsZUFBTSxFQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLElBQUksa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFBRTtZQUNyRyxNQUFNLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDO1NBQzlGO1FBQ0QsSUFBSSxJQUFBLGVBQU0sRUFBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLElBQUksSUFBSSxFQUFFLEVBQUU7WUFDakcsTUFBTSxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztTQUM5RjtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDcEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQztZQUN2RCxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtTQUNuRixDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFDLEVBQUU7WUFDaEUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQztZQUMvQixNQUFNLEVBQUUsQ0FBQztTQUNaLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV6QyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUMzQixJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEc7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLDhCQUE4QixDQUFDLFFBQWtCO1FBQ25ELG9CQUFvQjtRQUNwQixJQUFJLFFBQVEsRUFBRSxNQUFNLEtBQUsscUJBQWMsQ0FBQyxNQUFNLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQy9ILElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDO2dCQUMxQyxNQUFNLEVBQUUsQ0FBQztnQkFDVCxrQkFBa0IsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDOUIsZ0JBQWdCLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7YUFDM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFLLENBQUMsQ0FBQztTQUNsQjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsMEJBQTBCLENBQUMsU0FBaUIsRUFBRSxPQUErQztRQUN6RixPQUFPLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hKLENBQUM7Q0FDSixDQUFBO0FBOUtHO0lBREMsSUFBQSxlQUFNLEdBQUU7O2tEQUNXO0FBRXBCO0lBREMsSUFBQSxlQUFNLEdBQUU7OzBEQUNpQjtBQUUxQjtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNVLHVDQUFpQjtnRUFBQztBQUVyQztJQURDLElBQUEsZUFBTSxHQUFFOztxRUFDcUQ7QUFFOUQ7SUFEQyxJQUFBLGVBQU0sR0FBRTs7K0VBQ3FFO0FBWHJFLHFCQUFxQjtJQURqQyxJQUFBLGdCQUFPLEdBQUU7R0FDRyxxQkFBcUIsQ0FpTGpDO0FBakxZLHNEQUFxQiJ9