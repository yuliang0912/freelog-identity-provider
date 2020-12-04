import {FreelogUserInfo, PageResult} from "egg-freelog-base";
import {
    ActivationCodeStatusEnum, AuditStatusEnum,
    MessageRecordStatusEnum, UserRoleEnum, UserStatusEnum, UserTypeEnum
} from "./enum";

export interface UserInfo extends FreelogUserInfo {

    /**
     * Email
     */
    email: string;

    /**
     * 手机号
     */
    mobile: string;

    /**
     * 头像
     */
    headImage: string;

    /**
     * 密码
     */
    password?: string;

    /**
     * 加密盐值
     */
    salt?: string;

    /**
     * JWT-签名
     */
    tokenSn: string;

    /**
     * 用户角色
     */
    userRole: UserRoleEnum;

    /**
     * 用户类型
     */
    userType: UserTypeEnum;

    /**
     * 最后登录时间
     */
    latestLoginDate: Date;

    /**
     * 标签
     */
    tags: string[]

    /**
     * 用户状态
     */
    status: UserStatusEnum;
}

export interface UserDetailInfo {
    userId: number;
    tagIds: number[];
}

export interface ActivationCodeInfo {

    /**
     * 授权码
     */
    code: string;

    /**
     * 授权码类型:目前固定为beta
     */
    codeType: string;

    /**
     * 激活码所属用户
     */
    userId: number;

    /**
     * 激活码所属用户名
     */
    username: string;

    /**
     * 已使用次数
     */
    usedCount: number;

    /**
     * 限制使用次数
     */
    limitCount: number;

    /**
     * 分发时间
     */
    distributeDate?: Date;

    /**
     * 核销时间
     */
    destroyDate?: Date;

    /**
     * 状态
     */
    status: ActivationCodeStatusEnum;

    /**
     * 开始生效日期
     */
    startEffectiveDate: Date;

    /**
     * 结束生效日期
     */
    endEffectiveDate: Date;
}

export interface MessageRecordInfo {
    /**
     * 收信地址.邮箱或者短信
     */
    toAddress: string;

    /**
     * 授权码类型,register
     */
    authCodeType: string;

    /**
     * 模板参数
     */
    templateParams: object;

    /**
     * 有效期
     */
    expireDate: Date;

    /**
     * 状态
     */
    status: MessageRecordStatusEnum;
}

export interface TestQualificationApplyAuditRecordInfo {

    /**
     * 申请人ID
     */
    userId: number;

    /**
     * 申请人用户名
     */
    username: string;

    /**
     * 申请人其他附属信息
     */
    otherInfo: {

        /**
         * 省份
         */
        province: string;

        /**
         * 城市
         */
        city: string;

        /**
         * 职业
         */
        occupation: string;

        /**
         * 描述
         */
        description: string;

    }

    /**
     * 审核操作人ID
     */
    operationUserId: number;

    /**
     * 审核操作人名称
     */
    operationUserName: string;

    /**
     * 呵呵消息
     */
    auditMsg?: string;

    /**
     * 审核状态
     */
    status: AuditStatusEnum;
}

export interface TagInfo {

    /**
     * 标签ID
     */
    tagId: number;

    /**
     * 标签名称
     */
    tag: string;

    /**
     * 标签类型 1:手动 2:自动
     */
    type: 1 | 2;

    /**
     * 总设置数量
     */
    totalSetCount: number;

    status: 0;
}

export interface findOptions<T> {
    sort?: {
        [P in keyof T]?: 1 | -1 | boolean;
    },
    limit?: number;
    skip?: number;
    projection?: string;
}

export interface IBaseService<T> {

    find(condition: object, options?: findOptions<T>): Promise<T[]>;

    findOne(condition: object, options?: findOptions<T>): Promise<T>;

    findIntervalList(condition: object, options?: findOptions<T>): Promise<PageResult<T>>;

    count(condition: object): Promise<number>;
}

export interface ITageService extends IBaseService<TagInfo> {

    create(tag: string, type: 1 | 2): Promise<TagInfo>;

    /**
     * 更新tag
     * @param tagInfo
     * @param model
     */
    updateOne(tagInfo: TagInfo, model: object): Promise<boolean>;

    /**
     * 设置标签自增(自减)数量.
     * @param tagInfo
     * @param number
     */
    setTagAutoIncrementCount(tagInfo: TagInfo, number: 1 | -1): Promise<boolean>;
}

export interface IUserService extends IBaseService<UserInfo> {

    create(userInfo: Partial<UserInfo>): Promise<UserInfo>;

    updateOne(condition: object, model: Partial<UserInfo>): Promise<boolean>;

    resetPassword(userInfo: UserInfo, newPassword: string): Promise<boolean>;

    updatePassword(userInfo: UserInfo, oldPassword: string, newPassword: string): Promise<boolean>;

    setTag(userId: number, tagInfo: TagInfo): Promise<boolean>;

    unsetTag(userId: number, tagInfo: TagInfo): Promise<boolean>;

    // searchIntervalList(condition: object, tagId?: number, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;

    searchIntervalListByTag(condition: object, tagId: number, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;
}

export interface IMessageService {
    /**
     * 发送消息
     * @param authCodeType
     * @param toAddress
     */
    sendMessage(authCodeType: 'register' | 'resetPassword', toAddress: string): Promise<void>;

    /**
     * 校验验证码是否有效
     * @param authCodeType
     * @param address
     * @param authCode
     */
    verify(authCodeType: 'register' | 'resetPassword', address: string, authCode: number): Promise<boolean>
}

export interface ICaptchaService {

    /**
     * 生成校验码
     * @param captchaKey
     * @param options
     */
    generateCaptcha(captchaKey: string, options?: object);

    /**
     * 验证校验码
     * @param captchaKey
     * @param captchaInput
     */
    verify(captchaKey: string, captchaInput: string): boolean;
}

export interface IActivationCodeService extends IBaseService<ActivationCodeInfo> {
    /**
     * 批量创建
     * @param createQuantity
     * @param options
     */
    batchCreate(createQuantity: number, options: Partial<ActivationCodeInfo>): Promise<ActivationCodeInfo[]>;

    /**
     * 批量修改状态
     * @param codes
     * @param status
     */
    batchUpdate(codes: string[], status: 0 | 1): Promise<boolean>
}