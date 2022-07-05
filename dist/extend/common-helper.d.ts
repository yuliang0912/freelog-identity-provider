/**
 * 生成加密密码
 */
export declare const generatePassword: (salt: string, password: string) => string;
/**
 * 生成临时的userState
 * @param userId
 */
export declare const generateTempUserState: (userId: number) => string;
/**
 * 获取区域名称
 * @param areaCode
 */
export declare function getAreaName(areaCode: string): any;
