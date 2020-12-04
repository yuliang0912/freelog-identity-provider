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
let UserDetailProvider = class UserDetailProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
};
UserDetailProvider = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton'),
    __param(0, midway_1.inject('model.userDetailInfo')),
    __metadata("design:paramtypes", [Object])
], UserDetailProvider);
exports.default = UserDetailProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kZXRhaWwtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2RhdGEtcHJvdmlkZXIvdXNlci1kZXRhaWwtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxtQ0FBOEM7QUFDOUMsdURBQWlEO0FBSWpELElBQXFCLGtCQUFrQixHQUF2QyxNQUFxQixrQkFBbUIsU0FBUSxtQ0FBZ0M7SUFFNUUsWUFBNEMsS0FBSztRQUM3QyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakIsQ0FBQztDQUNKLENBQUE7QUFMb0Isa0JBQWtCO0lBRnRDLGdCQUFPLEVBQUU7SUFDVCxjQUFLLENBQUMsV0FBVyxDQUFDO0lBR0YsV0FBQSxlQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQTs7R0FGMUIsa0JBQWtCLENBS3RDO2tCQUxvQixrQkFBa0IifQ==