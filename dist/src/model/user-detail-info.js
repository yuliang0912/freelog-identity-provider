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
var UserDetailInfoModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailInfoModel = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let UserDetailInfoModel = UserDetailInfoModel_1 = class UserDetailInfoModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const userDetailInfoSchema = new this.mongoose.Schema({
            userId: { type: Number, unique: true, required: true },
            tagIds: { type: [Number], default: [], required: false },
            status: { type: Number, default: 0, required: true }
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: UserDetailInfoModel_1.toObjectOptions,
            toObject: UserDetailInfoModel_1.toObjectOptions
        });
        userDetailInfoSchema.index({ tagIds: 1 });
        userDetailInfoSchema.index({ userId: 1 }, { unique: true });
        return this.mongoose.model('user-detail-infos', userDetailInfoSchema);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return lodash_1.omit(ret, ['_id']);
            }
        };
    }
};
UserDetailInfoModel = UserDetailInfoModel_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.userDetailInfo'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], UserDetailInfoModel);
exports.UserDetailInfoModel = UserDetailInfoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kZXRhaWwtaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbC91c2VyLWRldGFpbC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBNEI7QUFDNUIsbUNBQThDO0FBQzlDLHVGQUFnRjtBQUloRixJQUFhLG1CQUFtQiwyQkFBaEMsTUFBYSxtQkFBb0IsU0FBUSx1Q0FBaUI7SUFFdEQsWUFBZ0MsUUFBUTtRQUNwQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELGtCQUFrQjtRQUVkLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNsRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNwRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7U0FDckQsRUFBRTtZQUNDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBQztZQUM5RCxNQUFNLEVBQUUscUJBQW1CLENBQUMsZUFBZTtZQUMzQyxRQUFRLEVBQUUscUJBQW1CLENBQUMsZUFBZTtTQUNoRCxDQUFDLENBQUM7UUFFSCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUN4QyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUV4RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELE1BQU0sS0FBSyxlQUFlO1FBQ3RCLE9BQU87WUFDSCxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUc7Z0JBQ2QsT0FBTyxhQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBaENZLG1CQUFtQjtJQUYvQixjQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2xCLGdCQUFPLENBQUMsc0JBQXNCLENBQUM7SUFHZixXQUFBLGVBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7R0FGdEIsbUJBQW1CLENBZ0MvQjtBQWhDWSxrREFBbUIifQ==