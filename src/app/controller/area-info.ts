import {controller, provide, get, inject, config} from 'midway';
import {FreelogContext} from 'egg-freelog-base';

@provide()
@controller('/v2/areas')
export class areaInfoController {

    @inject()
    ctx: FreelogContext;
    @config()
    areaList: any[];

    // 获取全部的省
    @get('/provinces')
    getAllProvinces() {
        this.ctx.success(this.areaList);
    }

    // 根据省获取城市
    @get('/:provinceCode/cities')
    getCities() {
        const ctx = this.ctx;
        const provinceCode = ctx.checkParams('provinceCode').exist().toInt().ge(11).le(65).value.toString();
        ctx.validateParams();

        const provinceInfo = this.areaList.find(x => x.code === provinceCode);
        if (['11', '12', '31', '50'].includes(provinceInfo?.code)) {
            return ctx.success([{code: provinceInfo.code, name: provinceInfo.name}]);
        }

        ctx.success(provinceInfo?.children ?? []);
    }
}
