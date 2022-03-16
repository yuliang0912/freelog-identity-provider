"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCodeTypeEnum = exports.AuditStatusEnum = exports.MessageRecordStatusEnum = exports.ActivationCodeStatusEnum = exports.UserStatusEnum = exports.UserTypeEnum = exports.UserRoleEnum = void 0;
/**
 * 用户角色.多重角色直接使用 | 运算
 */
var UserRoleEnum;
(function (UserRoleEnum) {
    /**
     * C端消费者
     */
    UserRoleEnum[UserRoleEnum["Customer"] = 1] = "Customer";
    /**
     * 节点运营商
     */
    UserRoleEnum[UserRoleEnum["NodeOperator"] = 2] = "NodeOperator";
    /**
     * 资源提供者
     */
    UserRoleEnum[UserRoleEnum["ResourceProvider"] = 4] = "ResourceProvider";
})(UserRoleEnum = exports.UserRoleEnum || (exports.UserRoleEnum = {}));
/**
 * 用户类型
 */
var UserTypeEnum;
(function (UserTypeEnum) {
    /**
     * 正式用户
     */
    UserTypeEnum[UserTypeEnum["NormalUser"] = 0] = "NormalUser";
    /**
     * 内测用户
     */
    UserTypeEnum[UserTypeEnum["BetaTestUser"] = 1] = "BetaTestUser";
})(UserTypeEnum = exports.UserTypeEnum || (exports.UserTypeEnum = {}));
/**
 * 用户状态
 */
var UserStatusEnum;
(function (UserStatusEnum) {
    /**
     * 正常
     */
    UserStatusEnum[UserStatusEnum["Normal"] = 0] = "Normal";
    /**
     * 冻结
     */
    UserStatusEnum[UserStatusEnum["Freeze"] = 1] = "Freeze";
    /**
     * 测试资格审核中
     */
    UserStatusEnum[UserStatusEnum["BetaTestToBeAudit"] = 2] = "BetaTestToBeAudit";
    /**
     * 申请测试资格未通过
     */
    UserStatusEnum[UserStatusEnum["BetaTestApplyNotPass"] = 3] = "BetaTestApplyNotPass";
})(UserStatusEnum = exports.UserStatusEnum || (exports.UserStatusEnum = {}));
/**
 * 授权码状态
 */
var ActivationCodeStatusEnum;
(function (ActivationCodeStatusEnum) {
    /**
     * 禁用
     */
    ActivationCodeStatusEnum[ActivationCodeStatusEnum["disabled"] = 0] = "disabled";
    /**
     * 已启用
     */
    ActivationCodeStatusEnum[ActivationCodeStatusEnum["enabled"] = 1] = "enabled";
})(ActivationCodeStatusEnum = exports.ActivationCodeStatusEnum || (exports.ActivationCodeStatusEnum = {}));
/**
 * 消息记录状态
 */
var MessageRecordStatusEnum;
(function (MessageRecordStatusEnum) {
    /**
     * 发送成功
     */
    MessageRecordStatusEnum[MessageRecordStatusEnum["SendSuccessful"] = 1] = "SendSuccessful";
    /**
     * 发送失败
     */
    MessageRecordStatusEnum[MessageRecordStatusEnum["SendFailed"] = 2] = "SendFailed";
})(MessageRecordStatusEnum = exports.MessageRecordStatusEnum || (exports.MessageRecordStatusEnum = {}));
/**
 * 审核状态
 */
var AuditStatusEnum;
(function (AuditStatusEnum) {
    /**
     * 等待审核
     */
    AuditStatusEnum[AuditStatusEnum["WaitReview"] = 0] = "WaitReview";
    /**
     * 审核通过
     */
    AuditStatusEnum[AuditStatusEnum["AuditPass"] = 1] = "AuditPass";
    /**
     * 审核不通过
     */
    AuditStatusEnum[AuditStatusEnum["AuditNotPass"] = 2] = "AuditNotPass";
})(AuditStatusEnum = exports.AuditStatusEnum || (exports.AuditStatusEnum = {}));
/**
 * 验证码类型
 */
var AuthCodeTypeEnum;
(function (AuthCodeTypeEnum) {
    AuthCodeTypeEnum["AuditPass"] = "auditPass";
    AuthCodeTypeEnum["AuditFail"] = "auditFail";
    AuthCodeTypeEnum["Register"] = "register";
    AuthCodeTypeEnum["ResetPassword"] = "resetPassword";
    AuthCodeTypeEnum["ActivateTransactionAccount"] = "activateTransactionAccount";
    AuthCodeTypeEnum["UpdateTransactionAccountPwd"] = "updateTransactionAccountPwd";
    AuthCodeTypeEnum["UpdateMobileOrEmail"] = "updateMobileOrEmail";
})(AuthCodeTypeEnum = exports.AuthCodeTypeEnum || (exports.AuthCodeTypeEnum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxZQWdCWDtBQWhCRCxXQUFZLFlBQVk7SUFFcEI7O09BRUc7SUFDSCx1REFBWSxDQUFBO0lBRVo7O09BRUc7SUFDSCwrREFBZ0IsQ0FBQTtJQUVoQjs7T0FFRztJQUNILHVFQUFvQixDQUFBO0FBQ3hCLENBQUMsRUFoQlcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFnQnZCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFlBV1g7QUFYRCxXQUFZLFlBQVk7SUFFcEI7O09BRUc7SUFDSCwyREFBYyxDQUFBO0lBRWQ7O09BRUc7SUFDSCwrREFBZ0IsQ0FBQTtBQUNwQixDQUFDLEVBWFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFXdkI7QUFFRDs7R0FFRztBQUNILElBQVksY0FxQlg7QUFyQkQsV0FBWSxjQUFjO0lBRXRCOztPQUVHO0lBQ0gsdURBQVUsQ0FBQTtJQUVWOztPQUVHO0lBQ0gsdURBQVUsQ0FBQTtJQUVWOztPQUVHO0lBQ0gsNkVBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCxtRkFBd0IsQ0FBQTtBQUM1QixDQUFDLEVBckJXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBcUJ6QjtBQUVEOztHQUVHO0FBQ0gsSUFBWSx3QkFXWDtBQVhELFdBQVksd0JBQXdCO0lBRWhDOztPQUVHO0lBQ0gsK0VBQVksQ0FBQTtJQUVaOztPQUVHO0lBQ0gsNkVBQVcsQ0FBQTtBQUNmLENBQUMsRUFYVyx3QkFBd0IsR0FBeEIsZ0NBQXdCLEtBQXhCLGdDQUF3QixRQVduQztBQUVEOztHQUVHO0FBQ0gsSUFBWSx1QkFXWDtBQVhELFdBQVksdUJBQXVCO0lBRS9COztPQUVHO0lBQ0gseUZBQWtCLENBQUE7SUFFbEI7O09BRUc7SUFDSCxpRkFBYyxDQUFBO0FBQ2xCLENBQUMsRUFYVyx1QkFBdUIsR0FBdkIsK0JBQXVCLEtBQXZCLCtCQUF1QixRQVdsQztBQUVEOztHQUVHO0FBQ0gsSUFBWSxlQWdCWDtBQWhCRCxXQUFZLGVBQWU7SUFFdkI7O09BRUc7SUFDSCxpRUFBYyxDQUFBO0lBRWQ7O09BRUc7SUFDSCwrREFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxxRUFBZ0IsQ0FBQTtBQUNwQixDQUFDLEVBaEJXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBZ0IxQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxnQkFlWDtBQWZELFdBQVksZ0JBQWdCO0lBRXhCLDJDQUF1QixDQUFBO0lBRXZCLDJDQUF1QixDQUFBO0lBRXZCLHlDQUFxQixDQUFBO0lBRXJCLG1EQUErQixDQUFBO0lBRS9CLDZFQUF5RCxDQUFBO0lBRXpELCtFQUEyRCxDQUFBO0lBRTNELCtEQUEyQyxDQUFBO0FBQy9DLENBQUMsRUFmVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQWUzQiJ9