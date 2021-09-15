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
let TagInfoProvider = class TagInfoProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
};
TagInfoProvider = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __param(0, (0, midway_1.inject)('model.tagInfo')),
    __metadata("design:paramtypes", [Object])
], TagInfoProvider);
exports.default = TagInfoProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9kYXRhLXByb3ZpZGVyL3RhZy1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1REFBaUQ7QUFLakQsSUFBcUIsZUFBZSxHQUFwQyxNQUFxQixlQUFnQixTQUFRLG1DQUF5QjtJQUVsRSxZQUFxQyxLQUFLO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBQ0osQ0FBQTtBQUxvQixlQUFlO0lBRm5DLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsY0FBSyxFQUFDLFdBQVcsQ0FBQztJQUdGLFdBQUEsSUFBQSxlQUFNLEVBQUMsZUFBZSxDQUFDLENBQUE7O0dBRm5CLGVBQWUsQ0FLbkM7a0JBTG9CLGVBQWUifQ==