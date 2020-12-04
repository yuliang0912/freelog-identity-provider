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
    /**
     * 创建tag
     * @param tag
     * @param type
     */
    async create(tag, type) {
        const tagInfo = {
            tag, type, status: 0, totalSetCount: 0
        };
        return this.tagInfoProvider.findOneAndUpdate({ tag: tagInfo.tag }, tagInfo).then(model => {
            return model ?? this.autoIncrementRecordProvider.getNextTagId().then(tagId => {
                tagInfo['_id'] = tagId;
                return this.tagInfoProvider.create(tagInfo);
            });
        });
    }
    /**
     * 查询多条
     * @param condition
     */
    async find(condition, options) {
        return this.tagInfoProvider.find(condition, options?.projection, options);
    }
    /**
     * 查询单条
     * @param condition
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
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", tag_provider_1.default)
], TagService.prototype, "tagInfoProvider", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", auto_increment_record_provider_1.default)
], TagService.prototype, "autoIncrementRecordProvider", void 0);
TagService = __decorate([
    midway_1.provide()
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvdGFnLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXVDO0FBQ3ZDLGdFQUE0RDtBQUU1RCxvR0FBMEY7QUFHMUYsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVTtJQU9uQjs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFXLEVBQUUsSUFBVztRQUVqQyxNQUFNLE9BQU8sR0FBcUI7WUFDOUIsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDO1NBQ3pDLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuRixPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6RSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFpQixFQUFFLE9BQThCO1FBQ3hELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBaUIsRUFBRSxPQUE4QjtRQUMzRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFnQixFQUFFLEtBQWE7UUFDM0MsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3ZHLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQWlCLEVBQUUsT0FBOEI7UUFDcEUsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBaUI7UUFDekIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxPQUFnQixFQUFFLE1BQWM7UUFDM0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxhQUFhLEVBQUUsTUFBTSxFQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqSSxDQUFDO0NBQ0osQ0FBQTtBQXhFRztJQURDLGVBQU0sRUFBRTs4QkFDUSxzQkFBZTttREFBQztBQUVqQztJQURDLGVBQU0sRUFBRTs4QkFDb0Isd0NBQTJCOytEQUFDO0FBTGhELFVBQVU7SUFEdEIsZ0JBQU8sRUFBRTtHQUNHLFVBQVUsQ0EyRXRCO0FBM0VZLGdDQUFVIn0=