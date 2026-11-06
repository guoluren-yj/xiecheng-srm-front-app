import { http } from "srm-mobile-ui";

/*
个人信息查询
*/
export function getUserInfo(params) {
  const url = "/iam/hzero/v1/users/self";
  return http.get(url, { params });
}

/**
 * 查询智能应用对接配置
 * @returns {*}
 */
export function getCustomerConfig() {
  const url = "/smbl/v1/common/customer/config";
  return http.get(url);
}
