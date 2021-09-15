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
var TestQualificationApplyAuditRecordModel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestQualificationApplyAuditRecordModel = void 0;
const lodash_1 = require("lodash");
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let TestQualificationApplyAuditRecordModel = TestQualificationApplyAuditRecordModel_1 = class TestQualificationApplyAuditRecordModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const otherInfoSchema = new this.mongoose.Schema({
            province: { type: String, required: true },
            city: { type: String, required: true },
            occupation: { type: String, required: true },
            description: { type: String, required: true },
        }, { _id: false });
        const TestQualificationApplyAuditRecordSchema = new this.mongoose.Schema({
            userId: { type: Number, required: true },
            username: { type: String, required: true },
            otherInfo: { type: otherInfoSchema, required: true },
            auditMsg: { type: String, default: '', required: false },
            operationUserId: { type: Number, default: 0, required: true },
            status: { type: Number, default: 0, required: true } // 0:待审核 1:审核通过 2:审核不通过
        }, {
            versionKey: false,
            toJSON: TestQualificationApplyAuditRecordModel_1.toObjectOptions,
            toObject: TestQualificationApplyAuditRecordModel_1.toObjectOptions,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
        });
        TestQualificationApplyAuditRecordSchema.virtual('id').get(function () {
            return this._id;
        });
        return this.mongoose.model('test-qualification-apply-audit-records', TestQualificationApplyAuditRecordSchema);
    }
    static get toObjectOptions() {
        return {
            transform: function (doc, ret, options) {
                const otherInfo = ret.otherInfo;
                return Object.assign({ recordId: doc.id }, otherInfo, (0, lodash_1.omit)(ret, ['_id', 'otherInfo']));
            }
        };
    }
};
TestQualificationApplyAuditRecordModel = TestQualificationApplyAuditRecordModel_1 = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.testQualificationApplyAuditRecord'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], TestQualificationApplyAuditRecordModel);
exports.TestQualificationApplyAuditRecordModel = TestQualificationApplyAuditRecordModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXJlY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC90ZXN0LXF1YWxpZmljYXRpb24tYXBwbHktYXVkaXQtcmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBMkI7QUFDM0IsbUNBQThDO0FBQzlDLHVGQUFnRjtBQUloRixJQUFhLHNDQUFzQyw4Q0FBbkQsTUFBYSxzQ0FBdUMsU0FBUSx1Q0FBaUI7SUFFekUsWUFBZ0MsUUFBUTtRQUNwQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELGtCQUFrQjtRQUVkLE1BQU0sZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDN0MsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3hDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNwQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDMUMsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1NBQzlDLEVBQUUsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQTtRQUVoQixNQUFNLHVDQUF1QyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDckUsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3RDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN4QyxTQUFTLEVBQUUsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDbEQsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7WUFDdEQsZUFBZSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDM0QsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyx1QkFBdUI7U0FDN0UsRUFBRTtZQUNDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLE1BQU0sRUFBRSx3Q0FBc0MsQ0FBQyxlQUFlO1lBQzlELFFBQVEsRUFBRSx3Q0FBc0MsQ0FBQyxlQUFlO1lBQ2hFLFVBQVUsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBQztTQUNqRSxDQUFDLENBQUE7UUFFRix1Q0FBdUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEVBQUUsdUNBQXVDLENBQUMsQ0FBQTtJQUNqSCxDQUFDO0lBRUQsTUFBTSxLQUFLLGVBQWU7UUFDdEIsT0FBTztZQUNILFNBQVMsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTztnQkFDbEMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUMsRUFBRSxTQUFTLEVBQUUsSUFBQSxhQUFJLEVBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN4RixDQUFDO1NBQ0osQ0FBQTtJQUNMLENBQUM7Q0FDSixDQUFBO0FBNUNZLHNDQUFzQztJQUZsRCxJQUFBLGNBQUssRUFBQyxXQUFXLENBQUM7SUFDbEIsSUFBQSxnQkFBTyxFQUFDLHlDQUF5QyxDQUFDO0lBR2xDLFdBQUEsSUFBQSxlQUFNLEVBQUMsVUFBVSxDQUFDLENBQUE7O0dBRnRCLHNDQUFzQyxDQTRDbEQ7QUE1Q1ksd0ZBQXNDIn0=