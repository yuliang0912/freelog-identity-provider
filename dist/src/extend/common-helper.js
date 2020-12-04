"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const egg_freelog_base_1 = require("egg-freelog-base");
/**
 * 生成加密密码
 */
exports.generatePassword = (salt, password) => {
    const text = `identity@freelog.com#${password}`;
    return egg_freelog_base_1.CryptoHelper.hmacSha1(egg_freelog_base_1.CryptoHelper.base64Encode(text), salt);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHRlbmQvY29tbW9uLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBNkM7QUFFN0M7O0dBRUc7QUFDVSxRQUFBLGdCQUFnQixHQUFHLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsRUFBRTtJQUMvRCxNQUFNLElBQUksR0FBRyx3QkFBd0IsUUFBUSxFQUFFLENBQUM7SUFDaEQsT0FBTywrQkFBWSxDQUFDLFFBQVEsQ0FBQywrQkFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN2RSxDQUFDLENBQUEifQ==