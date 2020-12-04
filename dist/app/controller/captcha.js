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
    midway_1.inject(),
    __metadata("design:type", Object)
], captchaController.prototype, "ctx", void 0);
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], captchaController.prototype, "captchaService", void 0);
__decorate([
    midway_1.get('/:captchaKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], captchaController.prototype, "generateCaptcha", null);
__decorate([
    midway_1.get('/:captchaKey/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], captchaController.prototype, "verify", null);
captchaController = __decorate([
    midway_1.provide(),
    midway_1.controller('/v2/captchas')
], captchaController);
exports.captchaController = captchaController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9jYXB0Y2hhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUF3RDtBQU14RCxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQU8xQjs7T0FFRztJQUVILEtBQUssQ0FBQyxlQUFlO1FBRWpCLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDakcsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzVFLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM3RSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDeEUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4RixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUM5RixHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFFSCxLQUFLLENBQUMsTUFBTTtRQUVSLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDakcsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEUsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDSixDQUFBO0FBdkNHO0lBREMsZUFBTSxFQUFFOzs4Q0FDVztBQUVwQjtJQURDLGVBQU0sRUFBRTs7eURBQ3VCO0FBTWhDO0lBREMsWUFBRyxDQUFDLGNBQWMsQ0FBQzs7Ozt3REFjbkI7QUFRRDtJQURDLFlBQUcsQ0FBQyxxQkFBcUIsQ0FBQzs7OzsrQ0FVMUI7QUF6Q1EsaUJBQWlCO0lBRjdCLGdCQUFPLEVBQUU7SUFDVCxtQkFBVSxDQUFDLGNBQWMsQ0FBQztHQUNkLGlCQUFpQixDQTBDN0I7QUExQ1ksOENBQWlCIn0=