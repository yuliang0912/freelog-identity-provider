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
let UserInfoProvider = class UserInfoProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
};
UserInfoProvider = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __param(0, (0, midway_1.inject)('model.userInfo')),
    __metadata("design:paramtypes", [Object])
], UserInfoProvider);
exports.default = UserInfoProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvZGF0YS1wcm92aWRlci91c2VyLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQThDO0FBQzlDLHVEQUFpRDtBQUtqRCxJQUFxQixnQkFBZ0IsR0FBckMsTUFBcUIsZ0JBQWlCLFNBQVEsbUNBQTBCO0lBRXBFLFlBQXNDLEtBQUs7UUFDdkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7Q0FDSixDQUFBO0FBTG9CLGdCQUFnQjtJQUZwQyxJQUFBLGdCQUFPLEdBQUU7SUFDVCxJQUFBLGNBQUssRUFBQyxXQUFXLENBQUM7SUFHRixXQUFBLElBQUEsZUFBTSxFQUFDLGdCQUFnQixDQUFDLENBQUE7O0dBRnBCLGdCQUFnQixDQUtwQztrQkFMb0IsZ0JBQWdCIn0=