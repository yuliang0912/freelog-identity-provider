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
exports.UserService = void 0;
const uuid_1 = require("uuid");
const midway_1 = require("midway");
const common_helper_1 = require("../../extend/common-helper");
const auto_increment_record_provider_1 = require("../data-provider/auto-increment-record-provider");
const egg_freelog_base_1 = require("egg-freelog-base");
const enum_1 = require("../../enum");
let UserService = class UserService {
    async count(condition) {
        return this.userInfoProvider.count(condition);
    }
    async find(condition, options) {
        return this.userInfoProvider.find(condition, options?.projection, options);
    }
    async findIntervalList(condition, options) {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    async findOne(condition, options) {
        return this.userInfoProvider.findOne(condition, options?.projection, options);
    }
    async create(userInfo) {
        userInfo.userId = await this.autoIncrementRecordProvider.getNextUserId();
        userInfo.salt = uuid_1.v4().replace(/-/g, '');
        userInfo.password = common_helper_1.generatePassword(userInfo.salt, userInfo.password);
        userInfo.tokenSn = uuid_1.v4().replace(/-/g, '');
        userInfo.status = enum_1.UserStatusEnum.Normal;
        userInfo.userRole = enum_1.UserRoleEnum.Customer;
        return this.userInfoProvider.create(userInfo);
    }
    async updateOne(condition, model) {
        return this.userInfoProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }
    async updateMany(condition, model) {
        return this.userInfoProvider.updateMany(condition, model).then(t => Boolean(t.ok));
    }
    /**
     * 重置密码
     * @param userInfo
     * @param newPassword
     */
    async resetPassword(userInfo, newPassword) {
        const salt = uuid_1.v4().replace(/-/g, '');
        const tokenSn = uuid_1.v4().replace(/-/g, '');
        const password = common_helper_1.generatePassword(salt, newPassword);
        return this.updateOne({ userId: userInfo.userId }, { salt, password, tokenSn });
    }
    /**
     * 更新密码
     * @param userInfo
     * @param oldPassword
     * @param newPassword
     */
    async updatePassword(userInfo, oldPassword, newPassword) {
        if (common_helper_1.generatePassword(userInfo.salt, oldPassword) !== userInfo.password) {
            throw new egg_freelog_base_1.ArgumentError(this.ctx.gettext('login-password-validate-failed'));
        }
        if (oldPassword === newPassword) {
            return true;
        }
        return this.resetPassword(userInfo, newPassword);
    }
    /**
     * 搜索
     * @param condition
     * @param tagId
     * @param options
     */
    async searchIntervalListByTag(condition, tagId, options) {
        const pipeline = [
            {
                $lookup: {
                    from: 'user-detail-infos',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'userDetails'
                }
            }
        ];
        if (tagId) {
            pipeline.push({ $match: { 'userDetails.tagIds': tagId } });
        }
        if (Object.keys(condition).length) {
            pipeline.unshift({ $match: condition });
        }
        const [totalItemInfo] = await this.userInfoProvider.aggregate([...pipeline, ...[{ $count: 'totalItem' }]]);
        const { totalItem = 0 } = totalItemInfo ?? {};
        pipeline.push({ $sort: options?.sort ?? { userId: -1 } }, { $skip: options?.skip ?? 0 }, { $limit: options?.limit ?? 10 });
        const dataList = await this.userInfoProvider.aggregate(pipeline);
        return {
            skip: options?.skip ?? 0, limit: options?.limit ?? 10, totalItem, dataList
        };
    }
    async searchIntervalList(condition, options) {
        return this.userInfoProvider.findIntervalList(condition, options?.skip, options?.limit, null, options?.sort ?? { userId: -1 });
    }
    /**
     * 设置标签
     * @param userId
     * @param tagInfo
     */
    async setTag(userId, tagInfo) {
        const userDetail = await this.userDetailProvider.findOne({ userId });
        if (userDetail?.tagIds?.includes(tagInfo.tagId)) {
            return true;
        }
        if (!userDetail) {
            await this.userDetailProvider.create({ userId, tagIds: [tagInfo.tagId] });
        }
        else {
            await this.userDetailProvider.updateOne({ userId }, {
                $addToSet: { tagIds: [tagInfo.tagId] }
            });
        }
        return this.tagService.setTagAutoIncrementCount(tagInfo, 1);
    }
    /**
     * 取消设置Tag
     * @param userId
     * @param tagInfo
     */
    async unsetTag(userId, tagInfo) {
        const userDetail = await this.userDetailProvider.findOne({ userId });
        if (!userDetail || !userDetail.tagIds.includes(tagInfo.tagId)) {
            return true;
        }
        await this.userDetailProvider.updateOne({ userId }, {
            tagIds: userDetail.tagIds.filter(x => x !== tagInfo.tagId)
        });
        return this.tagService.setTagAutoIncrementCount(tagInfo, -1);
    }
    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    async updateOneUserDetail(condition, model) {
        return this.userDetailProvider.updateOne(condition, model).then(t => Boolean(t.ok));
    }
    async findUserDetails(condition) {
        return this.userDetailProvider.find(condition);
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserService.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserService.prototype, "tagService", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userInfoProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], UserService.prototype, "userDetailProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", auto_increment_record_provider_1.default)
], UserService.prototype, "autoIncrementRecordProvider", void 0);
UserService = __decorate([
    midway_1.provide()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL3VzZXItc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBd0I7QUFDeEIsbUNBQXVDO0FBQ3ZDLDhEQUE0RDtBQUM1RCxvR0FBMEY7QUFDMUYsdURBQTZGO0FBRTdGLHFDQUF3RDtBQUd4RCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBYXBCLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBaUI7UUFDekIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQWlCLEVBQUUsT0FBK0I7UUFDekQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBaUIsRUFBRSxPQUErQjtRQUNyRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hJLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQWlCLEVBQUUsT0FBK0I7UUFDNUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ2pGLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQTJCO1FBRXBDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLENB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