import { http } from "srm-mobile-ui";

/*
 * 查询智能应用对接配置
 * @returns {*}
 */
export function getCustomerConfig() {
  const url = `/spfm/v1/${window.localStorage.organizationId}/application-market-client/has-order-quota-purchase`;
  return http.get(url);
}
