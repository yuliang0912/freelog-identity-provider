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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationCodeService = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const uuid_1 = require("uuid");
let ActivationCodeService = class ActivationCodeService {
    count(condition) {
        return this.activationCodeProvider.count(condition);
    }
    find(condition, options) {
        return this.activationCodeProvider.find(condition, options?.projection, options);
    }
    findIntervalList(condition, options) {
        return this.activationCodeProvider.findIntervalList(condition, options?.skip, options?.limit, options?.projection, options?.sort);
    }
    findOne(condition, options) {
        return this.activationCodeProvider.findOne(condition);
    }
    /**
     * 批量创建
     * @param createQuantity
     * @param options
     */
    batchCreate(createQuantity, options) {
        const codes = [];
        createQuantity = createQuantity < 1 ? 1 : createQuantity > 50 ? 50 : createQuantity;
        while (codes.length < createQuantity) {
            const code = egg_freelog_base_1.CryptoHelper.base64Encode(uuid_1.v4() + uuid_1.v4()).substr(0, 8);
            codes.push({
                code, codeType: 'beta',
                userId: options.userId ?? 0,
                limitCount: options.limitCount ?? 0,
                endEffectiveDate: options?.endEffectiveDate ?? null,
                startEffectiveDate: options?.startEffectiveDate ?? null
            });
        }
        return this.activationCodeProvider.insertMany(codes);
    }
    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes, status) {
        return this.activationCodeProvider.updateMany({ code: { $in: codes } }, { status }).then(t => Boolean(t.nModified));
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], ActivationCodeService.prototype, "activationCodeProvider", void 0);
ActivationCodeService = __decorate([
    midway_1.provide()
], ActivationCodeService);
exports.ActivationCodeService = ActivationCodeService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL3NlcnZpY2UvYWN0aXZhdGlvbi1jb2RlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQXVDO0FBRXZDLHVEQUE2RjtBQUM3RiwrQkFBd0I7QUFHeEIsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUFPOUIsS0FBSyxDQUFDLFNBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsSUFBSSxDQUFDLFNBQWlCLEVBQUUsT0FBeUM7UUFDN0QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxTQUFpQixFQUFFLE9BQXlDO1FBQ3pFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEksQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFpQixFQUFFLE9BQXlDO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxjQUFzQixFQUFFLE9BQW9DO1FBRXBFLE1BQU0sS0FBSyxHQUFrQyxFQUFFLENBQUM7UUFDaEQsY0FBYyxHQUFHLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDcEYsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLGNBQWMsRUFBRTtZQUNsQyxNQUFNLElBQUksR0FBRywrQkFBWSxDQUFDLFlBQVksQ0FBQyxTQUFFLEVBQUUsR0FBRyxTQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakUsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU07Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQzNCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVSxJQUFJLENBQUM7Z0JBQ25DLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsSUFBSSxJQUFJO2dCQUNuRCxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLElBQUksSUFBSTthQUMxRCxDQUFDLENBQUE7U0FDTDtRQUNELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxLQUFlLEVBQUUsTUFBYTtRQUN0QyxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsRUFBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7Q0FDSixDQUFBO0FBbERHO0lBREMsZUFBTSxFQUFFOztrREFDVztBQUVwQjtJQURDLGVBQU0sRUFBRTs7cUVBQ3FEO0FBTHJELHFCQUFxQjtJQURqQyxnQkFBTyxFQUFFO0dBQ0cscUJBQXFCLENBcURqQztBQXJEWSxzREFBcUIifQ==