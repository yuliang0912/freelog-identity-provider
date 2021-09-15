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
exports.MessageRecordModel = void 0;
const midway_1 = require("midway");
const mongoose_model_base_1 = require("egg-freelog-base/database/mongoose-model-base");
let MessageRecordModel = class MessageRecordModel extends mongoose_model_base_1.MongooseModelBase {
    constructor(mongoose) {
        super(mongoose);
    }
    buildMongooseModel() {
        const MessageRecordSchema = new this.mongoose.Schema({
            toAddress: { type: String, required: true },
            authCodeType: { type: String, required: true },
            templateParams: {},
            expireDate: { type: Date, required: true },
            status: { type: Number, default: 1, required: true } //1:已发送任务  2:任务发送失败
        }, {
            versionKey: false,
            timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
        });
        MessageRecordSchema.index({ toAddress: 1, expireDate: -1 });
        return this.mongoose.model('message-record', MessageRecordSchema);
    }
};
MessageRecordModel = __decorate([
    (0, midway_1.scope)('Singleton'),
    (0, midway_1.provide)('model.messageRecord'),
    __param(0, (0, midway_1.plugin)('mongoose')),
    __metadata("design:paramtypes", [Object])
], MessageRecordModel);
exports.MessageRecordModel = MessageRecordModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1yZWNvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwvbWVzc2FnZS1yZWNvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThDO0FBQzlDLHVGQUFnRjtBQUloRixJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFtQixTQUFRLHVDQUFpQjtJQUVyRCxZQUFnQyxRQUFRO1FBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsa0JBQWtCO1FBRWQsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ2pELFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUN6QyxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7WUFDNUMsY0FBYyxFQUFFLEVBQUU7WUFDbEIsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3hDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsbUJBQW1CO1NBQ3pFLEVBQUU7WUFDQyxVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUM7U0FDakUsQ0FBQyxDQUFBO1FBRUYsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRTFELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0NBQ0osQ0FBQTtBQXZCWSxrQkFBa0I7SUFGOUIsSUFBQSxjQUFLLEVBQUMsV0FBVyxDQUFDO0lBQ2xCLElBQUEsZ0JBQU8sRUFBQyxxQkFBcUIsQ0FBQztJQUdkLFdBQUEsSUFBQSxlQUFNLEVBQUMsVUFBVSxDQUFDLENBQUE7O0dBRnRCLGtCQUFrQixDQXVCOUI7QUF2QlksZ0RBQWtCIn0=