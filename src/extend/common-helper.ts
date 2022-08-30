import {CommonRegex, CryptoHelper} from 'egg-freelog-base';

const areaCodeInfos = require('../../pcas-code.json');

/**
 * 生成加密密码
 */
export const generatePassword = (salt: string, password: string) => {
    const text = `identity@freelog.com#${password}`;
    return CryptoHelper.hmacSha1(CryptoHelper.base64Encode(text), salt);
};

/**
 * 生成临时的userState
 * @param userId
 */
export const generateTempUserState = (userId: number) => {
    const text = `identity@freelog.com#state#$${userId}`;
    return CryptoHelper.md5(CryptoHelper.base64Encode(text));
};

/**
 * 获取区域名称
 * @param areaCode
 */
export function getAreaName(areaCode: string) {

    const provinceCode = areaCode.length >= 2 ? areaCode.substr(0, 2) : '';
    const cityCode = ['11', '12', '31', '50'].includes(provinceCode) || areaCode.length < 4 ? '' : areaCode.substr(0, 4);
    const countyCode = areaCode.length >= 6 ? areaCode.substr(0, 6) : '';

    return [provinceCode, cityCode, countyCode].reduce((previousValue: any, currentValue: string) => {
        if (!currentValue) {
            return previousValue;
        }
        const areaInfo = previousValue.list.find(x => x.code === currentValue);
        if (!areaInfo) {
            return {name: ''};
        }
        if (areaInfo) {
            previousValue.name += areaInfo.name === '市辖区' ? '' : areaInfo.name;
            previousValue.list = areaInfo.children;
        }
        return previousValue;
    }, {list: areaCodeInfos, name: ''}).name;
}

/**
 * 手机号或邮箱脱敏
 * @param emailOrMobile
 */
export function emailOrMobileDesensitization(emailOrMobile: string) {
    let result = '';
    if (CommonRegex.mobile86.test(emailOrMobile)) {
        for (let i = 0; i < emailOrMobile.length; i++) {
            result += [0, 1, 2, emailOrMobile.length - 1, emailOrMobile.length - 2, emailOrMobile.length - 3, emailOrMobile.length - 4].includes(i) ? emailOrMobile.charAt(i) : '*';
        }
    } else if (CommonRegex.email.test(emailOrMobile)) {
        const address = emailOrMobile.substring(0, emailOrMobile.lastIndexOf('@'));
        for (let i = 0; i < address.length; i++) {
            result += [0, address.length - 1].includes(i) ? emailOrMobile.charAt(i) : '*';
        }
        result += emailOrMobile.substring(emailOrMobile.lastIndexOf('@'));
    } else {
        return emailOrMobile;
    }
    return result;
}
