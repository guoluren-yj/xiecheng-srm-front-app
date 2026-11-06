import { http } from "srm-mobile-ui";

/**
 * 获取验证码
 */
export const desensitizeCaptchaApi = (params = {}) => {
  const url = "hpfm/v1/desensitize/captcha";
  return http.get(url, { params });
};

/**
 * 检验验证码
 */
export const checkCaptchaApi = (params = {}) => {
  const url = "hpfm/v1/desensitize/captcha/check";
  return http.post(url, params);
};

