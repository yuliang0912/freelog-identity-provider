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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyIdentityInfoModel = void 0;
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let ThirdPartyIdentityInfoModel = class ThirdPartyIdentityInfoModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const thirdPartyIdentityInfoSchema = new this.mongoose.Schema({
            thirdPartyType: { type: String, required: true, enum: ['weChat'] },
            thirdPartyIdentityInfo: {},
            openId: { type: String, required: true },
            name: { type: String, required: false, default: '' },
            headImage: { type: String, required: false, default: '' },
            unionId: { type: String, default: '', required: false },
            userId: { type: Number, default: 0, required: false },
            status: { type: Number, default: 0, required: true } // 0:未绑定用户 1:已绑定用户
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
        });
        thirdPartyIdentityInfoSchema.index({ openId: 1, userId: 1 });
        thirdPartyIdentityInfoSchema.virtual('id').get(function () {
            return this._id;
        });
        return this.mongoose.model('third-party-identity-infos', thirdPartyIdentityInfoSchema);
    }
};
ThirdPartyIdentityInfoModel = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.thirdPartyIdentityInfo'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], ThirdPartyIdentityInfoModel);
exports.ThirdPartyIdentityInfoModel = ThirdPartyIdentityInfoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHktbG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwvdGhpcmQtcGFydHktbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThDO0FBQzlDLHVGQUFnRjtBQUloRixJQUFhLDJCQUEyQixHQUF4QyxNQUFhLDJCQUE0QixTQUFRLHVDQUFpQjtJQUU5RCxZQUFnQyxRQUFRO1FBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzFELGNBQWMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBQztZQUNoRSxzQkFBc0IsRUFBRSxFQUFFO1lBQzFCLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN0QyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQztZQUNsRCxTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQztZQUN2RCxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUNyRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUNuRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLGtCQUFrQjtTQUN4RSxFQUFFO1lBQ0MsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFDO1NBQ2pFLENBQUMsQ0FBQztRQUVILDRCQUE0QixDQUFDLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFFM0QsNEJBQTRCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMzQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLDRCQUE0QixDQUFDLENBQUM7SUFDM0YsQ0FBQztDQUNKLENBQUE7QUE3QlksMkJBQTJCO0lBRnZDLElBQUEsY0FBSyxFQUFDLFdBQVcsQ0FBQztJQUNsQixJQUFBLGdCQUFPLEVBQUMsOEJBQThCLENBQUM7SUFHdkIsV0FBQSxJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQTs7R0FGdEIsMkJBQTJCLENBNkJ2QztBQTdCWSxrRUFBMkIifQ==