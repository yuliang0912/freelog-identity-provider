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
exports.areaInfoController = void 0;
const midway_1 = require("midway");
let areaInfoController = class areaInfoController {
    ctx;
    areaList;
    // 获取全部的省
    getAllProvinces() {
        this.ctx.success(this.areaList);
    }
    // 根据省获取城市
    getCities() {
        const ctx = this.ctx;
        const provinceCode = ctx.checkParams('provinceCode').exist().toInt().ge(11).le(65).value.toString();
        ctx.validateParams();
        const provinceInfo = this.areaList.find(x => x.code === provinceCode);
        if (['11', '12', '31', '50'].includes(provinceInfo?.code)) {
            return ctx.success([{ code: provinceInfo.code, name: provinceInfo.name }]);
        }
        ctx.success(provinceInfo?.children ?? []);
    }
};
__decorate([
    (0, midway_1.inject)(),
    __metadata("design:type", Object)
], areaInfoController.prototype, "ctx", void 0);
__decorate([
    (0, midway_1.config)(),
    __metadata("design:type", Array)
], areaInfoController.prototype, "areaList", void 0);
__decorate([
    (0, midway_1.get)('/provinces'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], areaInfoController.prototype, "getAllProvinces", null);
__decorate([
    (0, midway_1.get)('/:provinceCode/cities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], areaInfoController.prototype, "getCities", null);
areaInfoController = __decorate([
    (0, midway_1.provide)(),
    (0, midway_1.controller)('/v2/areas')
], areaInfoController);
exports.areaInfoController = areaInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL2FyZWEtaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBZ0U7QUFLaEUsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFHM0IsR0FBRyxDQUFpQjtJQUVwQixRQUFRLENBQVE7SUFFaEIsU0FBUztJQUVULGVBQWU7UUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELFVBQVU7SUFFVixTQUFTO1FBQ0wsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdkQsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztTQUM1RTtRQUVELEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0osQ0FBQTtBQXhCRztJQURDLElBQUEsZUFBTSxHQUFFOzsrQ0FDVztBQUVwQjtJQURDLElBQUEsZUFBTSxHQUFFOztvREFDTztBQUloQjtJQURDLElBQUEsWUFBRyxFQUFDLFlBQVksQ0FBQzs7Ozt5REFHakI7QUFJRDtJQURDLElBQUEsWUFBRyxFQUFDLHVCQUF1QixDQUFDOzs7O21EQVk1QjtBQTFCUSxrQkFBa0I7SUFGOUIsSUFBQSxnQkFBTyxHQUFFO0lBQ1QsSUFBQSxtQkFBVSxFQUFDLFdBQVcsQ0FBQztHQUNYLGtCQUFrQixDQTJCOUI7QUEzQlksZ0RBQWtCIn0=