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
var UserInfoModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoModel = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let UserInfoModel = UserInfoModel_1 = class UserInfoModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const userInfoSchema = new this.mongoose.Schema({
            userId: { type: Number, unique: true, required: true },
            username: { type: String, unique: true, required: true },
            email: { type: String, required: false, default: '' },
            mobile: { type: String, required: false, default: '' },
            userRole: { type: Number, required: true, default: 1, enum: [1, 2, 3, 4, 5, 7] },
            headImage: { type: String, required: false, default: '' },
            password: { type: String, required: true },
            salt: { type: String, required: true },
            tokenSn: { type: String, required: true },
            userType: { type: Number, required: true, default: 0, enum: [0, 1] },
            status: { type: Number, default: 0, required: true }
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: UserInfoModel_1.toObjectOptions,
            toObject: UserInfoModel_1.toObjectOptions
        });
        userInfoSchema.index({ userId: 1 }, { unique: true });
        userInfoSchema.index({ username: 1 }, { unique: true });
        return this.mongoose.model('user-infos', userInfoSchema);
    }
    static get toObjectOptions() {
        return {
            transform: function (doc, ret, options) {
                return lodash_1.omit(ret, ['_id', 'password', 'salt', 'updateDate', 'userRole', 'userDetails']);
            }
        };
    }
};
UserInfoModel = UserInfoModel_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.userInfo'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], UserInfoModel);
exports.UserInfoModel = UserInfoModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZGVsL3VzZXItaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTRCO0FBQzVCLG1DQUE4QztBQUM5Qyx1RkFBZ0Y7QUFJaEYsSUFBYSxhQUFhLHFCQUExQixNQUFhLGFBQWMsU0FBUSx1Q0FBaUI7SUFFaEQsWUFBZ0MsUUFBUTtRQUNwQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELGtCQUFrQjtRQUVkLE1BQU0sY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDNUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDcEQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDdEQsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUM7WUFDbkQsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUM7WUFDcEQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUM5RSxTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQztZQUN2RCxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDeEMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3BDLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN2QyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7WUFDbEUsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7U0FDckQsRUFBRTtZQUNDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBQztZQUM5RCxNQUFNLEVBQUUsZUFBYSxDQUFDLGVBQWU7WUFDckMsUUFBUSxFQUFFLGVBQWEsQ0FBQyxlQUFlO1NBQzFDLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRCxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFFcEQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELE1BQU0sS0FBSyxlQUFlO1FBQ3RCLE9BQU87WUFDSCxTQUFTLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU87Z0JBQ2xDLE9BQU8sYUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtZQUMxRixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBeENZLGFBQWE7SUFGekIsY0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNsQixnQkFBTyxDQUFDLGdCQUFnQixDQUFDO0lBR1QsV0FBQSxlQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7O0dBRnRCLGFBQWEsQ0F3Q3pCO0FBeENZLHNDQUFhIn0=