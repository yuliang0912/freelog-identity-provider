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
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
let AutoIncrementRecordProvider = class AutoIncrementRecordProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
    /**
     * 获取下一个递增用户ID
     */
    async getNextUserId() {
        const dataType = 'USER_ID';
        return super.findOneAndUpdate({ dataType }, { $inc: { value: 1 } }, { new: true }).then(model => {
            return model || super.create({ dataType, value: 10001 });
        }).then(data => data.value);
    }
    /**
     * 获取下一个tagId
     */
    async getNextTagId() {
        const dataType = 'TAG_ID';
        return super.findOneAndUpdate({ dataType }, { $inc: { value: 1 } }, { new: true }).then(model => {
            return model || super.create({ dataType, value: 1 });
        }).then(data => data.value);
    }
};
AutoIncrementRecordProvider = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __param(0, (0, midway_1.inject)('model.autoIncrementRecord')),
    __metadata("design:paramtypes", [Object])
], AutoIncrementRecordProvider);
exports.default = AutoIncrementRecordProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1pbmNyZW1lbnQtcmVjb3JkLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9kYXRhLXByb3ZpZGVyL2F1dG8taW5jcmVtZW50LXJlY29yZC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1REFBaUQ7QUFJakQsSUFBcUIsMkJBQTJCLEdBQWhELE1BQXFCLDJCQUE0QixTQUFRLG1DQUFxQjtJQUUxRSxZQUFpRCxLQUFLO1FBQ2xELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsYUFBYTtRQUNmLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUMzQixPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEYsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQTtRQUMxRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFlBQVk7UUFDZCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BGLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUE7UUFDdEQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSixDQUFBO0FBekJvQiwyQkFBMkI7SUFGL0MsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxjQUFLLEVBQUMsV0FBVyxDQUFDO0lBR0YsV0FBQSxJQUFBLGVBQU0sRUFBQywyQkFBMkIsQ0FBQyxDQUFBOztHQUYvQiwyQkFBMkIsQ0F5Qi9DO2tCQXpCb0IsMkJBQTJCIn0=