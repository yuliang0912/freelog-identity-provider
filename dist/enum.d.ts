/**
 * 用户角色.多重角色直接使用 | 运算
 */
export declare enum UserRoleEnum {
    /**
     * C端消费者
     */
    Customer = 1,
    /**
     * 节点运营商
     */
    NodeOperator = 2,
    /**
     * 资源提供者
     */
    ResourceProvider = 4
}
/**
 * 用户类型
 */
export declare enum UserTypeEnum {
    /**
     * 正式用户
     */
    NormalUser = 0,
    /**
     * 内测用户
     */
    BetaTestUser = 1
}
/**
 * 用户状态
 */
export declare enum UserStatusEnum {
    /**
     * 正常
     */
    Normal = 0,
    /**
     * 冻结
     */
    Freeze = 1,
    /**
     * 测试资格审核中
     */
    BetaTestToBeAudit = 2,
    /**
     * 申请测试资格未通过
     */
    BetaTestApplyNotPass = 3
}
/**
 * 授权码状态
 */
export declare enum ActivationCodeStatusEnum {
    /**
     * 禁用
     */
    disabled = 0,
    /**
     * 已启用
     */
    enabled = 1
}
/**
 * 消息记录状态
 */
export declare enum MessageRecordStatusEnum {
    /**
     * 发送成功
     */
    SendSuccessful = 1,
    /**
     * 发送失败
     */
    SendFailed = 2
}
/**
 * 审核状态
 */
export declare enum AuditStatusEnum {
    /**
     * 等待审核
     */
    WaitReview = 0,
    /**
     * 审核通过
     */
    AuditPass = 1,
    /**
     * 审核不通过
     */
    AuditNotPass = 2
}
/**
 * 验证码类型
 */
export declare enum AuthCodeTypeEnum {
    AuditPass = "auditPass",
    AuditFail = "auditFail",
    Register = "register",
    ResetPassword = "resetPassword",
    ActivateTransactionAccount = "activateTransactionAccount",
    UpdateTransactionAccountPwd = "updateTransactionAccountPwd",
    UpdateMobileOrEmail = "updateMobileOrEmail"
}
