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
const moment = require("moment");
let UserDetailInfoModel = UserDetailInfoModel_1 = class UserDetailInfoModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const userDetailInfoSchema = new this.mongoose.Schema({
            userId: { type: Number, required: true },
            sex: { type: Number, enum: [0, 1, 2], default: 0, required: true },
            birthday: { type: Date, default: null, required: false },
            occupation: { type: String, default: '', required: false },
            areaCode: { type: String, default: '', required: false },
            areaName: { type: String, default: '', required: false },
            latestLoginDate: { type: Date, default: null, required: false },
            latestLoginIp: { type: String, default: '', required: false },
            statusChangeRemark: { type: String, default: '', required: false },
            tagIds: { type: [Number], default: [], required: false },
            intro: { type: String, required: false, default: '' }, // 简介
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
                if (ret.birthday) {
                    ret.birthday = moment(ret.birthday).format('YYYY-MM-DD');
                }
                return (0, lodash_1.omit)(ret, ['_id', 'tagIds', 'userId']);
            }
        };
    }
};
UserDetailInfoModel = UserDetailInfoModel_1 = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.userDetailInfo'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], UserDetailInfoModel);
exports.UserDetailInfoModel = UserDetailInfoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kZXRhaWwtaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC91c2VyLWRldGFpbC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBNEI7QUFDNUIsbUNBQThDO0FBQzlDLHVGQUFnRjtBQUNoRixpQ0FBa0M7QUFJbEMsSUFBYSxtQkFBbUIsMkJBQWhDLE1BQWEsbUJBQW9CLFNBQVEsdUNBQWlCO0lBRXRELFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLG9CQUFvQixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDbEQsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3RDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDaEUsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDeEQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsZUFBZSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDN0QsYUFBYSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDM0Qsa0JBQWtCLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUNoRSxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUMsRUFBRSxLQUFLO1NBQzdELEVBQUU7WUFDQyxVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUM7WUFDOUQsTUFBTSxFQUFFLHFCQUFtQixDQUFDLGVBQWU7WUFDM0MsUUFBUSxFQUFFLHFCQUFtQixDQUFDLGVBQWU7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDeEMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFFeEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxNQUFNLEtBQUssZUFBZTtRQUN0QixPQUFPO1lBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHO2dCQUNkLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtvQkFDZCxHQUFHLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUM1RDtnQkFDRCxPQUFPLElBQUEsYUFBSSxFQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBM0NZLG1CQUFtQjtJQUYvQixJQUFBLGNBQUssRUFBQyxXQUFXLENBQUM7SUFDbEIsSUFBQSxnQkFBTyxFQUFDLHNCQUFzQixDQUFDO0lBR2YsV0FBQSxJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQTs7R0FGdEIsbUJBQW1CLENBMkMvQjtBQTNDWSxrREFBbUIifQ==