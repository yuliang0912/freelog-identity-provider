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
exports.captchaController = void 0;
const midway_1 = require("midway");
let captchaController = class captchaController {
    ctx;
    captchaService;
    /**
     * 生成随机验证码图片
     */
    async generateCaptcha() {
        const { ctx } = this;
        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value;
        const width = ctx.checkQuery('width').default(120).optional().toInt().value;
        const height = ctx.checkQuery('height').default(50).optional().toInt().value;
        const size = ctx.checkQuery('size').default(4).optional().toInt().value;
        const noise = ctx.checkQuery('noise').default(1).optional().toInt().in([1, 2, 3]).value;
        ctx.validateParams();
        const captcha = this.captchaService.generateCaptcha(captchaKey, { width, height, size, noise });
        ctx.type = 'svg';
        ctx.body = captcha.data;
    }
    /**
     * 核验验证码是否输入正确
     * @param ctx
     * @returns {Promise<void>}
     */
    async verify() {
        const { ctx } = this;
        const captchaKey = ctx.checkParams('captchaKey').exist().in(['register', 'resetPassword']).value;
        const captchaInput = ctx.checkQuery('captchaInput').exist().value;
        ctx.validateParams();
        const isVerify = this.captchaService.verify(captchaKey, captchaInput);
        ctx.success(isVerify);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], captchaController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], captchaController.prototype, "captchaService", void 0);
__decorate([
    (0, midway_1.get)('/:captchaKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], captchaController.prototype, "generateCaptcha", null);
__decorate([
    (0, midway_1.get)('/:captchaKey/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], captchaController.prototype, "verify", null);
captchaController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/captchas')
], captchaController);
exports.captchaController = captchaController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9jYXB0Y2hhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3RDtBQU14RCxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQUcxQixHQUFHLENBQWlCO0lBRXBCLGNBQWMsQ0FBa0I7SUFFaEM7O09BRUc7SUFFSCxLQUFLLENBQUMsZUFBZTtRQUVqQixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pHLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM1RSxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDN0UsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3hFLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDeEYsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDOUYsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7OztPQUlHO0lBRUgsS0FBSyxDQUFDLE1BQU07UUFFUixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pHLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2xFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDdEUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0osQ0FBQTtBQXZDRztJQURDLElBQUEsZUFBTSxHQUFFOzs4Q0FDVztBQUVwQjtJQURDLElBQUEsZUFBTSxHQUFFOzt5REFDdUI7QUFNaEM7SUFEQyxJQUFBLFlBQUcsRUFBQyxjQUFjLENBQUM7Ozs7d0RBY25CO0FBUUQ7SUFEQyxJQUFBLFlBQUcsRUFBQyxxQkFBcUIsQ0FBQzs7OzsrQ0FVMUI7QUF6Q1EsaUJBQWlCO0lBRjdCLElBQUEsZ0JBQU8sR0FBRTtJQUNULElBQUEsbUJBQVUsRUFBQyxjQUFjLENBQUM7R0FDZCxpQkFBaUIsQ0EwQzdCO0FBMUNZLDhDQUFpQiJ9