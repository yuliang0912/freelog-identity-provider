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
exports.ForumDataService = void 0;
const midway_1 = require("midway");
const egg_freelog_base_1 = require("egg-freelog-base");
const outside_api_service_1 = require("./outside-api-service");
let ForumDataService = class ForumDataService {
    forum;
    userInfoProvider;
    outsideApiService;
    /**
     * 同步所有的用户到论坛
     */
    async registerAllUserToForum() {
        const userList = await this.userInfoProvider.find({});
        for (const userInfo of userList) {
            this.outsideApiService.registerUserToForum({
                userId: userInfo.userId,
                username: userInfo.username,
                email: userInfo.email,
                mobile: userInfo.mobile,
                password: '123456' // 历史密码已不知晓,所以默认为123456,用户可以通过修改密码来实现同步
            }).then();
        }
    }
};
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", String)
], ForumDataService.prototype, "forum", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", egg_freelog_base_1.MongodbOperation)
], ForumDataService.prototype, "userInfoProvider", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], ForumDataService.prototype, "outsideApiService", void 0);
ForumDataService = __decorate([
    (0, midway_1.provide)()
], ForumDataService);
exports.ForumDataService = ForumDataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW0tZGF0YS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9zZXJ2aWNlL2ZvcnVtLWRhdGEtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBK0M7QUFDL0MsdURBQWtEO0FBRWxELCtEQUF3RDtBQUd4RCxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQUd6QixLQUFLLENBQVM7SUFFZCxnQkFBZ0IsQ0FBNkI7SUFFN0MsaUJBQWlCLENBQW9CO0lBRXJDOztPQUVHO0lBQ0gsS0FBSyxDQUFDLHNCQUFzQjtRQUN4QixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEQsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDO2dCQUN2QyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtnQkFDM0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO2dCQUNyQixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxRQUFRLENBQUMsdUNBQXVDO2FBQzdELENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUFyQkc7SUFEQyxJQUFBLGVBQU0sR0FBRTs7K0NBQ0s7QUFFZDtJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNTLG1DQUFnQjswREFBVztBQUU3QztJQURDLElBQUEsZUFBTSxHQUFFOzhCQUNVLHVDQUFpQjsyREFBQztBQVA1QixnQkFBZ0I7SUFENUIsSUFBQSxnQkFBTyxHQUFFO0dBQ0csZ0JBQWdCLENBd0I1QjtBQXhCWSw0Q0FBZ0IifQ==