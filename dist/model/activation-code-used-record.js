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
var ActivationCodeUsedRecord_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationCodeUsedRecord = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let ActivationCodeUsedRecord = ActivationCodeUsedRecord_1 = class ActivationCodeUsedRecord extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const activationCodeSchema = new this.mongoose.Schema({
            code: { type: String, required: true },
            userId: { type: Number, required: true },
            username: { type: String, required: true },
            loginIp: { type: String, required: true },
            status: { type: Number, default: 0, required: true },
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' },
            toJSON: ActivationCodeUsedRecord_1.toObjectOptions,
            toObject: ActivationCodeUsedRecord_1.toObjectOptions
        });
        activationCodeSchema.index({ code: 1 });
        return this.mongoose.model('activation-code-used-record', activationCodeSchema);
    }
    static get toObjectOptions() {
        return {
            transform(doc, ret) {
                return lodash_1.omit(ret, ['_id']);
            }
        };
    }
};
ActivationCodeUsedRecord = ActivationCodeUsedRecord_1 = __decorate([
    midway_1.scope('Singleton'),
    midway_1.provide('model.activationCodeUsedRecord'),
    __param(0, midway_1.plugin('mongoose')),
    __metadata("design:paramtypes", [Object])
], ActivationCodeUsedRecord);
exports.ActivationCodeUsedRecord = ActivationCodeUsedRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXVzZWQtcmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVsL2FjdGl2YXRpb24tY29kZS11c2VkLXJlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTRCO0FBQzVCLG1DQUE4QztBQUM5Qyx1RkFBZ0Y7QUFJaEYsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXlCLFNBQVEsdUNBQWlCO0lBRTNELFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLG9CQUFvQixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDbEQsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3BDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN0QyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDeEMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3ZDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1NBQ3JELEVBQUU7WUFDQyxVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUM7WUFDOUQsTUFBTSxFQUFFLDBCQUF3QixDQUFDLGVBQWU7WUFDaEQsUUFBUSxFQUFFLDBCQUF3QixDQUFDLGVBQWU7U0FDckQsQ0FBQyxDQUFDO1FBRUgsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFFdEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCxNQUFNLEtBQUssZUFBZTtRQUN0QixPQUFPO1lBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHO2dCQUNkLE9BQU8sYUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUIsQ0FBQztTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQTtBQWpDWSx3QkFBd0I7SUFGcEMsY0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNsQixnQkFBTyxDQUFDLGdDQUFnQyxDQUFDO0lBR3pCLFdBQUEsZUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztHQUZ0Qix3QkFBd0IsQ0FpQ3BDO0FBakNZLDREQUF3QiJ9