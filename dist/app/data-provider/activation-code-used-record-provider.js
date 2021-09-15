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
let ActivationCodeUsedRecordProvider = class ActivationCodeUsedRecordProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
};
ActivationCodeUsedRecordProvider = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.scope)('Singleton'),
    __param(0, (0, midway_1.inject)('model.activationCodeUsedRecord')),
    __metadata("design:paramtypes", [Object])
], ActivationCodeUsedRecordProvider);
exports.default = ActivationCodeUsedRecordProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbi1jb2RlLXVzZWQtcmVjb3JkLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9kYXRhLXByb3ZpZGVyL2FjdGl2YXRpb24tY29kZS11c2VkLXJlY29yZC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1REFBaUQ7QUFLakQsSUFBcUIsZ0NBQWdDLEdBQXJELE1BQXFCLGdDQUFpQyxTQUFRLG1DQUEwQztJQUVwRyxZQUFzRCxLQUFLO1FBQ3ZELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBQ0osQ0FBQTtBQUxvQixnQ0FBZ0M7SUFGcEQsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxjQUFLLEVBQUMsV0FBVyxDQUFDO0lBR0YsV0FBQSxJQUFBLGVBQU0sRUFBQyxnQ0FBZ0MsQ0FBQyxDQUFBOztHQUZwQyxnQ0FBZ0MsQ0FLcEQ7a0JBTG9CLGdDQUFnQyJ9