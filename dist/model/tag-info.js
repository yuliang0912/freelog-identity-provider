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
            totalSetCount: { type: Number, default: 0, required: false },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwvdGFnLWluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1RkFBZ0Y7QUFDaEYsbUNBQTRCO0FBSTVCLElBQWEsWUFBWSxvQkFBekIsTUFBYSxZQUFhLFNBQVEsdUNBQWlCO0lBRS9DLFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNuQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDbkMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNsRCxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUMxRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztTQUNyRCxFQUFFO1lBQ0MsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFDO1lBQzlELE1BQU0sRUFBRSxjQUFZLENBQUMsZUFBZTtZQUNwQyxRQUFRLEVBQUUsY0FBWSxDQUFDLGVBQWU7U0FDekMsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBRTdDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLEtBQUssZUFBZTtRQUN0QixPQUFPO1lBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHO2dCQUNkLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFDLEVBQUUsYUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBckNZLFlBQVk7SUFGeEIsY0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNsQixnQkFBTyxDQUFDLGVBQWUsQ0FBQztJQUdSLFdBQUEsZUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztHQUZ0QixZQUFZLENBcUN4QjtBQXJDWSxvQ0FBWSJ9