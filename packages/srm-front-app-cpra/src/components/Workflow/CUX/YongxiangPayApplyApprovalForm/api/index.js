import { http, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

// 获取操作记录
export const getHistoryDataApi = (paymentHeaderId) => {
  const url = `/scux/v1/yx-payment-records/${tenantId}/${paymentHeaderId}/page`;
  return http.get(url);
};

export async function fetchSupplierBalance(params) {
  const url = `/scux/v1/yx-payment-headers/${tenantId}/get-supplier-balance`;
  return http.get(url, { params, timeout: 240000 });
}
