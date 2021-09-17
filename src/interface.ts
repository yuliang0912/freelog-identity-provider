import {FreelogUserInfo, PageResult} from 'egg-freelog-base';
import {
    ActivationCodeStatusEnum, AuditStatusEnum,
    AuthCodeTypeEnum,
    MessageRecordStatusEnum, UserRoleEnum, UserStatusEnum, UserTypeEnum
} from './enum';

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
    tags: Partial<TagInfo>[];

    /**
     * 用户状态
     */
    status: UserStatusEnum;

    userDetail?: UserDetailInfo;
}

export interface UserDetailInfo {
    userId: number;
    tagIds: number[];
    latestLoginDate: Date;
    latestLoginIp: string;
    statusChangeRemark: string;
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

export interface ActivationCodeUsedRecord {

    /**
     * 授权码
     */
    code: string;

    /**
     * 使用者用户ID
     */
    userId: number;

    /**
     * 使用者用户名
     */
    username: string;

    /**
     * 登录IP
     */
    loginIp: string;

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

export interface TestQualificationAuditHandleInfo {
    status: 0 | 1;
    auditMsg: number;
}

export interface TestQualificationApplyAuditRecordInfo {

    id: string;

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

    createDate: Date;
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

    create(tags: string[], type: 1 | 2): Promise<TagInfo[]>;

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

    /**
     * 设置标签自增(自减)数量.
     * @param tagIds
     * @param number
     */
    setTagAutoIncrementCounts(tagIds: number[], number: 1 | -1): Promise<boolean>;
}

export interface IUserService extends IBaseService<UserInfo> {

    create(userInfo: Partial<UserInfo>): Promise<UserInfo>;

    updateOne(condition: object, model: Partial<UserInfo>): Promise<boolean>;

    updateMany(condition: object, model: Partial<UserInfo>): Promise<boolean>;

    resetPassword(userInfo: UserInfo, newPassword: string): Promise<boolean>;

    updatePassword(userInfo: UserInfo, oldPassword: string, newPassword: string): Promise<boolean>;

    setTag(userId: number, tagInfos: TagInfo[]): Promise<boolean>

    unsetTag(userId: number, tagInfo: TagInfo): Promise<boolean>;

    // searchIntervalList(condition: object, tagId?: number, options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;

    searchIntervalListByTags(condition: object, tagIds: number[], options?: findOptions<UserInfo>): Promise<PageResult<UserInfo>>;

    /**
     * 更新用户详情信息
     * @param condition
     * @param model
     */
    updateOneUserDetail(condition: object, model: Partial<UserDetailInfo>): Promise<boolean>;

    findUserDetails(condition: object): Promise<UserDetailInfo[]>;
}

export interface IMessageService {
    /**
     * 发送消息
     * @param authCodeType
     * @param toAddress
     */
    sendMessage(authCodeType: AuthCodeTypeEnum, toAddress: string): Promise<void>;

    /**
     * 校验验证码是否有效
     * @param authCodeType
     * @param address
     * @param authCode
     */
    verify(authCodeType: AuthCodeTypeEnum, address: string, authCode: number): Promise<boolean>
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
    batchUpdate(codes: string[], status: 0 | 1): Promise<boolean>;

    /**
     * 使用授权码激活测试资格
     * @param userInfo
     * @param code
     */
    activateAuthorizationCode(userInfo: UserInfo, code: string): Promise<boolean>;

    /**
     * 查询激活码使用记录
     * @param condition
     * @param options
     */
    findUsedRecordIntervalList(condition: object, options?: findOptions<ActivationCodeUsedRecord>): Promise<PageResult<ActivationCodeUsedRecord>>;
}

export interface ITestQualificationApplyAuditService {

    findSearchIntervalList(condition: Partial<UserInfo>, status?: number, options?: findOptions<UserInfo>): Promise<PageResult<TestQualificationApplyAuditRecordInfo>>;

    findOne(condition: Partial<TestQualificationApplyAuditRecordInfo> | object): Promise<TestQualificationApplyAuditRecordInfo>;

    testQualificationApply(applyInfo: Partial<TestQualificationApplyAuditRecordInfo>): Promise<TestQualificationApplyAuditRecordInfo>;

    /**
     * 批量审核
     * @param applyRecordList
     * @param handleInfo
     */
    batchAuditTestQualificationApply(applyRecordList: TestQualificationApplyAuditRecordInfo[], handleInfo: TestQualificationAuditHandleInfo);

    auditTestQualificationApply(applyRecordInfo: TestQualificationApplyAuditRecordInfo, handleInfo: TestQualificationAuditHandleInfo);

    /**
     * 查找多条数据
     * @param condition
     */
    find(condition: Partial<TestQualificationApplyAuditRecordInfo> | object): Promise<TestQualificationApplyAuditRecordInfo[]>;
}
