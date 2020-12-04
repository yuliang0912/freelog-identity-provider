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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TagInfoModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagInfoModel = void 0;
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
const lodash_1 = require("lodash");
let TagInfoModel = TagInfoModel_1 = class TagInfoModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const tagInfoSchema = new this.mongoose.Schema({
            _id: { type: Number, required: true },
            tag: { type: String, required: true },
            type: { type: Number, enum: [1, 2], required: true },
            totalSetCount: { type: Number, required: true },
            status: { type: Number, default: 0, required: true }
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: TagInfoModel_1.toObjectOptions,
            toObject: TagInfoModel_1.toObjectOptions,
        });
        tagInfoSchema.index({ tag: 1 }, { unique: true });
        tagInfoSchema.virtual('tagId').get(function () {
            return this._id;
        });
        return this.mongoose.model('tags', tagInfoSchema);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return Object.assign({ tagId: ret._id }, lodash_1.omit(ret, ['_id']));
            }
        };
    }
};
TagInfoModel = TagInfoModel_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.tagInfo'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], TagInfoModel);
exports.TagInfoModel = TagInfoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kZWwvdGFnLWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1RkFBZ0Y7QUFDaEYsbUNBQTRCO0FBSTVCLElBQWEsWUFBWSxvQkFBekIsTUFBYSxZQUFhLFNBQVEsdUNBQWlCO0lBRS9DLFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNuQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDbkMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNsRCxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDN0MsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7U0FDckQsRUFBRTtZQUNDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBQztZQUM5RCxNQUFNLEVBQUUsY0FBWSxDQUFDLGVBQWU7WUFDcEMsUUFBUSxFQUFFLGNBQVksQ0FBQyxlQUFlO1NBQ3pDLENBQUMsQ0FBQztRQUVILGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUU3QyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsTUFBTSxLQUFLLGVBQWU7UUFDdEIsT0FBTztZQUNILFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRztnQkFDZCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBQyxFQUFFLGFBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsQ0FBQztTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQTtBQXJDWSxZQUFZO0lBRnhCLGNBQUssQ0FBQyxXQUFXLENBQUM7SUFDbEIsZ0JBQU8sQ0FBQyxlQUFlLENBQUM7SUFHUixXQUFBLGVBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7R0FGdEIsWUFBWSxDQXFDeEI7QUFyQ1ksb0NBQVkifQ==