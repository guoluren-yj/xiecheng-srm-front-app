import { http, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

// 获取操作记录
export const getHistoryDataApi = (invoiceHeaderId) => {
  const url = `/sfin/v1/${tenantId}/invoice-actions/${invoiceHeaderId}`;
  return http.get(url);
};
