/**
 * 验证 手机,
 * 提示: intl.get('hzero.common.validation.phone').d('手机格式不正确')
 */

export const PHONE = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/;

/**
 * 非+86手机号码 仅且仅能包含数字
 * 验证 非+86手机号码
 * 提示: intl.get('hzero.common.validation.phone').d('手机格式不正确')
 */

export const NOT_CHINA_PHONE = /^\d+$/;

/**
 * 验证 邮箱
 * 提示: intl.get('hzero.common.validation.email').d('邮箱格式不正确')
 */
export const EMAIL = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;