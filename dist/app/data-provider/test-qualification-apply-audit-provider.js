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
let TestQualificationApplyAuditProvider = class TestQualificationApplyAuditProvider extends egg_freelog_base_1.MongodbOperation {
    constructor(model) {
        super(model);
    }
};
TestQualificationApplyAuditProvider = __decorate([
    midway_1.provide(),
    midway_1.scope('Singleton'),
    __param(0, midway_1.inject('model.testQualificationApplyAuditRecord')),
    __metadata("design:paramtypes", [Object])
], TestQualificationApplyAuditProvider);
exports.default = TestQualificationApplyAuditProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1xdWFsaWZpY2F0aW9uLWFwcGx5LWF1ZGl0LXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9kYXRhLXByb3ZpZGVyL3Rlc3QtcXVhbGlmaWNhdGlvbi1hcHBseS1hdWRpdC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE4QztBQUM5Qyx1REFBaUQ7QUFLakQsSUFBcUIsbUNBQW1DLEdBQXhELE1BQXFCLG1DQUFvQyxTQUFRLG1DQUF1RDtJQUVwSCxZQUErRCxLQUFLO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBQ0osQ0FBQTtBQUxvQixtQ0FBbUM7SUFGdkQsZ0JBQU8sRUFBRTtJQUNULGNBQUssQ0FBQyxXQUFXLENBQUM7SUFHRixXQUFBLGVBQU0sQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBOztHQUY3QyxtQ0FBbUMsQ0FLdkQ7a0JBTG9CLG1DQUFtQyJ9