import {CryptoHelper} from 'egg-freelog-base'

/**
 * 生成加密密码
 */
export const generatePassword = (salt: string, password: string) => {
    const text = `identity@freelog.com#${password}`;
    return CryptoHelper.hmacSha1(CryptoHelper.base64Encode(text), salt)
}
