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
    async setChatToken(code) {
        const tokenInfo = await this.outsideApiService.getWeChatAccessToken(code);
        if (tokenInfo.errcode) {
            throw new egg_freelog_base_1.ApplicationError(`微信接口调用失败,请重试,errcode:${tokenInfo.errcode}`);
        }
        const thirdPartyIdentityModel = {
            thirdPartyType: 'weChat',
            openId: tokenInfo.openid,
            thirdPartyIdentityInfo: tokenInfo
        };
        return this.thirdPartyIdentityProvider.findOneAndUpdate((0, lodash_1.pick)(thirdPartyIdentityModel, ['openId', 'thirdPartyType']), thirdPartyIdentityModel, { new: true }).then(model => {
            return model ?? this.thirdPartyIdentityProvider.create(thirdPartyIdentityModel);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHktaWRlbnRpdHktc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvc2VydmljZS90aGlyZC1wYXJ0eS1pZGVudGl0eS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF1QztBQUN2QywrREFBd0Q7QUFDeEQsdURBQW9FO0FBRXBFLG1DQUE0QjtBQUc1QixJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtJQUdsQyxpQkFBaUIsQ0FBb0I7SUFFckMsMEJBQTBCLENBQTJDO0lBRXJFLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBWTtRQUMzQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDbkIsTUFBTSxJQUFJLG1DQUFnQixDQUFDLHdCQUF3QixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUMzRTtRQUNELE1BQU0sdUJBQXVCLEdBQTJCO1lBQ3BELGNBQWMsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtZQUN4QixzQkFBc0IsRUFBRSxTQUFTO1NBQ3BDLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFBLGFBQUksRUFBQyx1QkFBdUIsRUFBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsdUJBQXVCLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEssT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKLENBQUE7QUFsQkc7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDVSx1Q0FBaUI7b0VBQUM7QUFFckM7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDbUIsbUNBQWdCOzZFQUF5QjtBQUw1RCx5QkFBeUI7SUFEckMsSUFBQSxnQkFBTyxHQUFFO0dBQ0cseUJBQXlCLENBcUJyQztBQXJCWSw4REFBeUIifQ==