"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreaName = exports.generateTempUserState = exports.generatePassword = void 0;
const egg_freelog_base_1 = require("egg-freelog-base");
const areaCodeInfos = require('../../pcas-code.json');
/**
 * 生成加密密码
 */
const generatePassword = (salt, password) => {
    const text = `identity@freelog.com#${password}`;
    return egg_freelog_base_1.CryptoHelper.hmacSha1(egg_freelog_base_1.CryptoHelper.base64Encode(text), salt);
};
exports.generatePassword = generatePassword;
/**
 * 生成临时的userState
 * @param userId
 */
const generateTempUserState = (userId) => {
    const text = `identity@freelog.com#state#$${userId}`;
    return egg_freelog_base_1.CryptoHelper.md5(egg_freelog_base_1.CryptoHelper.base64Encode(text));
};
exports.generateTempUserState = generateTempUserState;
/**
 * 获取区域名称
 * @param areaCode
 */
function getAreaName(areaCode) {
    const provinceCode = areaCode.length >= 2 ? areaCode.substr(0, 2) : '';
    const cityCode = ['11', '12', '31', '50'].includes(provinceCode) || areaCode.length < 4 ? '' : areaCode.substr(0, 4);
    const countyCode = areaCode.length >= 6 ? areaCode.substr(0, 6) : '';
    return [provinceCode, cityCode, countyCode].reduce((previousValue, currentValue) => {
        if (!currentValue) {
            return previousValue;
        }
        const areaInfo = previousValue.list.find(x => x.code === currentValue);
        if (!areaInfo) {
            return { name: '' };
        }
        if (areaInfo) {
            previousValue.name += areaInfo.name === '市辖区' ? '' : areaInfo.name;
            previousValue.list = areaInfo.children;
        }
        return previousValue;
    }, { list: areaCodeInfos, name: '' }).name;
}
exports.getAreaName = getAreaName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHRlbmQvY29tbW9uLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBOEM7QUFFOUMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFdEQ7O0dBRUc7QUFDSSxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUMvRCxNQUFNLElBQUksR0FBRyx3QkFBd0IsUUFBUSxFQUFFLENBQUM7SUFDaEQsT0FBTywrQkFBWSxDQUFDLFFBQVEsQ0FBQywrQkFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RSxDQUFDLENBQUM7QUFIVyxRQUFBLGdCQUFnQixvQkFHM0I7QUFFRjs7O0dBR0c7QUFDSSxNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7SUFDcEQsTUFBTSxJQUFJLEdBQUcsK0JBQStCLE1BQU0sRUFBRSxDQUFDO0lBQ3JELE9BQU8sK0JBQVksQ0FBQyxHQUFHLENBQUMsK0JBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUM7QUFIVyxRQUFBLHFCQUFxQix5QkFHaEM7QUFFRjs7O0dBR0c7QUFDSCxTQUFnQixXQUFXLENBQUMsUUFBZ0I7SUFFeEMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckgsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFckUsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBa0IsRUFBRSxZQUFvQixFQUFFLEVBQUU7UUFDNUYsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNmLE9BQU8sYUFBYSxDQUFDO1NBQ3hCO1FBQ0QsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxPQUFPLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxRQUFRLEVBQUU7WUFDVixhQUFhLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDbkUsYUFBYSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDN0MsQ0FBQztBQXBCRCxrQ0FvQkMifQ==