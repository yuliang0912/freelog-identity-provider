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
exports.AutoIncrementRecord = void 0;
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let AutoIncrementRecord = class AutoIncrementRecord extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const AutoIncrementRecordSchema = new this.mongoose.Schema({
            dataType: { type: String, unique: true, default: 'USER_ID', required: true },
            value: { type: Number, required: true, default: 1, mixin: 1 }
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
        });
        AutoIncrementRecordSchema.index({ dataType: 1 });
        return this.mongoose.model('auto-increment-record', AutoIncrementRecordSchema);
    }
};
AutoIncrementRecord = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.autoIncrementRecord'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], AutoIncrementRecord);
exports.AutoIncrementRecord = AutoIncrementRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1pbmNyZW1lbnQtcmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVsL2F1dG8taW5jcmVtZW50LXJlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBOEM7QUFDOUMsdUZBQWdGO0FBSWhGLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW9CLFNBQVEsdUNBQWlCO0lBRXRELFlBQWdDLFFBQVE7UUFDcEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLHlCQUF5QixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDdkQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUMxRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDO1NBQzlELEVBQUU7WUFDQyxVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUM7U0FDakUsQ0FBQyxDQUFBO1FBRUYseUJBQXlCLENBQUMsS0FBSyxDQUFDLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFFL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFBO0lBQ2xGLENBQUM7Q0FDSixDQUFBO0FBcEJZLG1CQUFtQjtJQUYvQixJQUFBLGNBQUssRUFBQyxXQUFXLENBQUM7SUFDbEIsSUFBQSxnQkFBTyxFQUFDLDJCQUEyQixDQUFDO0lBR3BCLFdBQUEsSUFBQSxlQUFNLEVBQUMsVUFBVSxDQUFDLENBQUE7O0dBRnRCLG1CQUFtQixDQW9CL0I7QUFwQlksa0RBQW1CIn0=