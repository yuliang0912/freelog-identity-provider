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
exports.ThirdPartyIdentityService = void 0;
const midway_1 = require("midway");
const outside_api_service_1 = require("./outside-api-service");
const egg_freelog_base_1 = require("egg-freelog-base");
const lodash_1 = require("lodash");
let ThirdPartyIdentityService = class ThirdPartyIdentityService {
    outsideApiService;
    thirdPartyIdentityProvider;
    /**
     * 保存微信token以及身份信息
     * @param code
     */
    async setWeChatToken(code) {
        const tokenInfo = await this.outsideApiService.getWeChatAccessToken(code);
        if (tokenInfo.errcode) {
            throw new egg_freelog_base_1.ApplicationError(`微信接口调用失败,请重试,errcode:${tokenInfo.errcode}`);
        }
        const thirdPartyIdentityModel = {
            thirdPartyType: 'weChat',
            openId: tokenInfo.openid,
            thirdPartyIdentityInfo: tokenInfo
        };
        if (tokenInfo.unionid) {
            thirdPartyIdentityModel.unionId = tokenInfo.unionid;
        }
        return this.thirdPartyIdentityProvider.findOneAndUpdate((0, lodash_1.pick)(thirdPartyIdentityModel, ['openId', 'thirdPartyType']), thirdPartyIdentityModel, { new: true }).then(model => {
            return model ?? this.thirdPartyIdentityProvider.create(thirdPartyIdentityModel);
        });
    }
    /**
     * 绑定第三方与freelog用户关系
     * @param thirdPartyIdentityInfo
     * @param userInfo
     */
    async bindUserId(thirdPartyIdentityInfo, userInfo) {
        return this.thirdPartyIdentityProvider.updateOne({ _id: thirdPartyIdentityInfo.id }, {
            userId: userInfo.userId,
            status: 1
        });
    }
    /**
     * 获取第三方身份信息
     * @param id
     */
    async getThirdPartyIdentityInfo(id) {
        return this.thirdPartyIdentityProvider.findById(id);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], ThirdPartyIdentityService.prototype, "outsideApiService", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], ThirdPartyIdentityService.prototype, "thirdPartyIdentityProvider", void 0);
ThirdPartyIdentityService = __decorate([
    (0, midway_1.provide)()
], ThirdPartyIdentityService);
exports.ThirdPartyIdentityService = ThirdPartyIdentityService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHktaWRlbnRpdHktc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvc2VydmljZS90aGlyZC1wYXJ0eS1pZGVudGl0eS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF1QztBQUN2QywrREFBd0Q7QUFDeEQsdURBQW9FO0FBRXBFLG1DQUE0QjtBQUc1QixJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtJQUdsQyxpQkFBaUIsQ0FBb0I7SUFFckMsMEJBQTBCLENBQTJDO0lBRXJFOzs7T0FHRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBWTtRQUM3QixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDbkIsTUFBTSxJQUFJLG1DQUFnQixDQUFDLHdCQUF3QixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUMzRTtRQUNELE1BQU0sdUJBQXVCLEdBQTJCO1lBQ3BELGNBQWMsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtZQUN4QixzQkFBc0IsRUFBRSxTQUFTO1NBQ3BDLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDbkIsdUJBQXVCLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDdkQ7UUFDRCxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFBLGFBQUksRUFBQyx1QkFBdUIsRUFBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsdUJBQXVCLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEssT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLHNCQUE4QyxFQUFFLFFBQWtCO1FBQy9FLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLEVBQUMsRUFBRTtZQUMvRSxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDdkIsTUFBTSxFQUFFLENBQUM7U0FDWixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLHlCQUF5QixDQUFDLEVBQVU7UUFDdEMsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDSixDQUFBO0FBN0NHO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ1UsdUNBQWlCO29FQUFDO0FBRXJDO0lBREMsSUFBQSxlQUFNLEdBQUU7OEJBQ21CLG1DQUFnQjs2RUFBeUI7QUFMNUQseUJBQXlCO0lBRHJDLElBQUEsZ0JBQU8sR0FBRTtHQUNHLHlCQUF5QixDQWdEckM7QUFoRFksOERBQXlCIn0=