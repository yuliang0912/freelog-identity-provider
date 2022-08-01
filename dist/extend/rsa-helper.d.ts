export declare class RsaHelper {
    nodeRSA: any;
    /**
     * 构建秘钥
     * @param publicKey
     * @param privateKey
     */
    build(publicKey?: string, privateKey?: string): RsaHelper;
    /**
     * 验证签名
     * @param text
     * @param sign
     * @param sourceEncoding
     * @param signatureEncoding
     */
    verifySign(text: string, sign: string, sourceEncoding?: string, signatureEncoding?: string): boolean;
    /**
     * 公钥加密
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    publicKeyEncrypt(text: string, encoding?: string, sourceEncoding?: string): string;
    /**
     * 公钥解密(需要私钥加密)
     * @param text
     * @param encoding
     */
    publicKeyDecrypt(text: string, encoding?: string): string;
    /**
     * 私钥加密
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    privateKeyEncrypt(text: string, encoding?: string, sourceEncoding?: string): string;
    /**
     * 私钥解密(需要公钥加密)
     * @param text
     * @param encoding
     */
    privateKeyDecrypt(text: string, encoding?: string): string;
    /**
     * 私钥签名
     * @param text
     * @param encoding
     * @param sourceEncoding
     */
    sign(text: string, encoding?: string, sourceEncoding?: string): string;
    /**
     * 测试使用的nodeRSA实例
     */
    get testInstance(): RsaHelper;
}
