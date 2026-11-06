
import { http, SrmUtil } from "srm-mobile-ui";

/*
获取我的货款列表
@param param: 参数对象
*/
export const getMyPaymentList = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-loans/list`;
  return http.get(url, { params });
};

/*
* 确认货款信息
* @param list: 货款列表信息
* */
export const confirmPaymentsApi = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/sanjiang-loans/confirm`;
  return http.post(url, params);
};

