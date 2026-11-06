import { http, SrmUtil } from "srm-mobile-ui";

// 基础信息
export const getBaseInfoApi = (paymentHeaderId) => {
  let url = `/scux/v1/yx-payment-headers/${SrmUtil.getTenantId()}/query-header/${paymentHeaderId}`;
  return http.get(url);
};