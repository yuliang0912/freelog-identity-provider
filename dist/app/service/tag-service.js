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
exports.TagService = void 0;
const midway_1 = require("midway");
const tag_provider_1 = require("../data-provider/tag-provider");
const auto_increment_record_provider_1 = require("../data-provider/auto-increment-record-provider");
let TagService = class TagService {
    tagInfoProvider;
    autoIncrementRecordProvider;
    /**
     * 创建tag
     * @param createTags
     * @param type
     * @param updateTagIds
     */
    async create(createTags, type, updateTagIds) {
        const tagLists = [];
        for (const tag of createTags) {
            tagLists.push({ tag, type, status: 0, _id: await this.autoIncrementRecordProvider.getNextTagId() });
        }
        if (updateTagIds?.length) {
            await this.tagInfoProvider.updateMany({ _id: { $in: updateTagIds } }, { status: 0 });
        }
        await this.tagInfoProvider.insertMany(tagLists);
        return this.tagInfoProvider.find({ _id: { $in: [...tagLists.map(x => x._id), ...updateTagIds] } });
    }
    /**
     * 查询多条
     * @param condition
     * @param options
     */
    async find(condition, options) {
        return this.tagInfoProvider.find(condition, options?.projection, options);
    }
    /**
     * 查询单条
     * @param condition
     * @param options
     */
    async findOne(condition, options) {
        return this.tagInfoProvider.findOne(condition, options?.projection, options);
    }
    /**
     * 更新tag
     * @param tagInfo
     * @param model
     */
    async updateOne(tagInfo, model) {
        return this.tagInfoProvider.updateOne({ _id: tagInfo.tagId }, model).then(t => Boolean(t.nModified));
    }
    /**
     * 批量更新
     * @param condition
     * @param model
     */
    async updateMany(condition, model) {
        return this.tagInfoProvider.updateMany(condition, model).then(t => Boolean(t.nModified));
    }
    /**
     * 查询区间列表
     * @param condition
     * @param options
     */
    async findIntervalList(condition, options) {
        return this.tagInfoProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    /**
     * 数量统计
     * @param condition
     */
    async count(condition) {
        return this.tagInfoProvider.count(condition);
    }
    /**
     * 设置标签自增(自减)数量.
     * @param tagInfo
     * @param number
     */
    async setTagAutoIncrementCount(tagInfo, number) {
        return this.tagInfoProvider.updateOne({ _id: tagInfo.tagId }, { $inc: { totalSetCount: number } }).then(x => Boolean(x.nModified));
    }
    /**
     * 设置标签自增(自减)数量.
     * @param tagIds
     * @param number
     */
    async setTagAutoIncrementCounts(tagIds, number) {
        return this.tagInfoProvider.updateMany({ _id: { $in: tagIds } }, { $inc: { totalSetCount: number } }).then(x => Boolean(x.nModified));
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", tag_provider_1.default)
], TagService.prototype, "tagInfoProvider", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", auto_increment_record_provider_1.default)
], TagService.prototype, "autoIncrementRecordProvider", void 0);
TagService = __decorate([
    (0, midway_1.provide)()
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvdGFnLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXVDO0FBQ3ZDLGdFQUE0RDtBQUU1RCxvR0FBMEY7QUFHMUYsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVTtJQUduQixlQUFlLENBQWtCO0lBRWpDLDJCQUEyQixDQUE4QjtJQUV6RDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBb0IsRUFBRSxJQUFXLEVBQUUsWUFBc0I7UUFFbEUsTUFBTSxRQUFRLEdBQVUsRUFBRSxDQUFDO1FBQzNCLEtBQUssTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksRUFBRSxFQUFDLENBQUMsQ0FBQztTQUNyRztRQUNELElBQUksWUFBWSxFQUFFLE1BQU0sRUFBRTtZQUN0QixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFFLFlBQVksRUFBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUNsRjtRQUVELE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxF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