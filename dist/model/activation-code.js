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
var ActivationCodeModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationCodeModel = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let ActivationCodeModel = ActivationCodeModel_1 = class ActivationCodeModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const activationCodeSchema = new this.mongoose.Schema({
            code: { type: String, required: true },
            codeType: { type: String, required: true },
            userId: { type: Number, default: 0, required: true },
            username: { type: String, default: '', required: false },
            usedCount: { type: Number, default: 0, required: true },
            limitCount: { type: Number, default: 1, required: true, mixin: 1 },
            startEffectiveDate: { type: Date, default: null, required: false },
            endEffectiveDate: { type: Date, default: null, required: false },
            status: { type: Number, default: 0, required: true }, //0:未使用 1:已使用
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: ActivationCodeModel_1.toObjectOptions,
            toObject: ActivationCodeModel_1.toObjectOptions
        });
        activationCodeSchema.index({ username: 1 });
        activationCodeSchema.index({ code: 1 }, { unique: true });
        return this.mongoose.model('activation-code', activationCodeSchema);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return (0, lodash_1.omit)(ret, ['_id']);
            }
        };
    }
};
ActivationCodeModel = ActivationCodeModel_1 = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.activationCode'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], ActivationCodeModel);
exports.ActivationCodeModel = ActivationCodeModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVsL2FjdGl2YXRpb24tY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTRCO0FBQzVCLG1DQUE4QztBQUM5Qyx1RkFBZ0Y7QUFJaEYsSUFBYSxtQkFBbUIsMkJBQWhDLE1BQWEsbUJBQW9CLFNBQVEsdUNBQWlCO0lBRXRELFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLG9CQUFvQixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDbEQsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3BDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN4QyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNsRCxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUN0RCxTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNyRCxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDO1lBQ2hFLGtCQUFrQixFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDaEUsZ0JBQWdCLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztZQUM5RCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFFLGFBQWE7U0FDcEUsRUFBRTtZQUNDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBQztZQUM5RCxNQUFNLEVBQUUscUJBQW1CLENBQUMsZUFBZTtZQUMzQyxRQUFRLEVBQUUscUJBQW1CLENBQUMsZUFBZTtTQUNoRCxDQUFDLENBQUM7UUFFSCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUMxQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELE1BQU0sS0FBSyxlQUFlO1FBQ3RCLE9BQU87WUFDSCxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUc7Z0JBQ2QsT0FBTyxJQUFBLGFBQUksRUFBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUE7QUF0Q1ksbUJBQW1CO0lBRi9CLElBQUEsY0FBSyxFQUFDLFdBQVcsQ0FBQztJQUNsQixJQUFBLGdCQUFPLEVBQUMsc0JBQXNCLENBQUM7SUFHZixXQUFBLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFBOztHQUZ0QixtQkFBbUIsQ0FzQy9CO0FBdENZLGtEQUFtQiJ9