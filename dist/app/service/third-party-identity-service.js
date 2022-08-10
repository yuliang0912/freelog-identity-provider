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
     * @param userId
     */
    async setWeChatToken(code) {
        const tokenInfo = await this.outsideApiService.getWeChatAccessToken(code);
        if (tokenInfo.errcode) {
            throw new egg_freelog_base_1.ApplicationError(`微信接口调用失败,请重试,errcode:${tokenInfo.errcode}`);
        }
        const wechatUserInfo = await this.outsideApiService.getWeChatUserInfo(tokenInfo.access_token, tokenInfo.openid);
        if (wechatUserInfo.errcode) {
            throw new egg_freelog_base_1.ApplicationError(`微信接口调用失败,errcode:${wechatUserInfo.errcode}`);
        }
        const thirdPartyIdentityModel = {
            thirdPartyType: 'weChat',
            openId: tokenInfo.openid,
            name: wechatUserInfo.nickname,
            headImage: wechatUserInfo.headimgurl,
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
     * @param userId
     */
    async bindUserId(thirdPartyIdentityInfo, userId) {
        return this.thirdPartyIdentityProvider.updateOne({ _id: thirdPartyIdentityInfo.id }, {
            userId, status: 1
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpcmQtcGFydHktaWRlbnRpdHktc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvc2VydmljZS90aGlyZC1wYXJ0eS1pZGVudGl0eS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF1QztBQUN2QywrREFBd0Q7QUFDeEQsdURBQW9FO0FBRXBFLG1DQUE0QjtBQUc1QixJQUFhLHlCQUF5QixHQUF0QyxNQUFhLHlCQUF5QjtJQUdsQyxpQkFBaUIsQ0FBb0I7SUFFckMsMEJBQTBCLENBQTJDO0lBRXJFOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQVk7UUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUUsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyx3QkFBd0IsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDM0U7UUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoSCxJQUFJLGNBQWMsQ0FBQyxPQUFPLEVBQUU7WUFDeEIsTUFBTSxJQUFJLG1DQUFnQixDQUFDLG9CQUFvQixjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUM1RTtRQUNELE1BQU0sdUJBQXVCLEdBQTJCO1lBQ3BELGNBQWMsRUFBRSxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtZQUN4QixJQUFJLEVBQUUsY0FBYyxDQUFDLFFBQVE7WUFDN0IsU0FBUyxFQUFFLGNBQWMsQ0FBQyxVQUFVO1lBQ3BDLHNCQUFzQixFQUFFLFNBQVM7U0FDcEMsQ0FBQztRQUNGLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNuQix1QkFBdUIsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUN2RDtRQUNELE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDLGdCQUFnQixDQUFDLElBQUEsYUFBSSxFQUFDLHVCQUF1QixFQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUMsRUFBRSx1QkFBdUIsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwSyxPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDcEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsc0JBQThDLEVBQUUsTUFBYztRQUMzRSxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsRUFBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxFQUFDLEVBQUU7WUFDL0UsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3BCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMseUJBQXlCLENBQUMsRUFBVTtRQUN0QyxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNKLENBQUE7QUFuREc7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDVSx1Q0FBaUI7b0VBQUM7QUFFckM7SUFEQyxJQUFBLGVBQU0sR0FBRTs4QkFDbUIsbUNBQWdCOzZFQUF5QjtBQUw1RCx5QkFBeUI7SUFEckMsSUFBQSxnQkFBTyxHQUFFO0dBQ0cseUJBQXlCLENBc0RyQztBQXREWSw4REFBeUIifQ==