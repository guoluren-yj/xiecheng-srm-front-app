import { http, SrmUtil } from "srm-mobile-ui";

const tenantId = SrmUtil.getTenantId();

// 获取操作记录
export const getHistoryDataApi = (params) => {
  const url = `/scux/v1/${tenantId}/yxCostInvoice/operate/list`;
  return http.get(url, { params });
};
