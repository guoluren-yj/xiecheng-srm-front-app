import { http, SrmUtil } from "srm-mobile-ui";

// 送货单头 查询
export const getHeaderApi = (asnHeaderId, params) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/asn-header/${asnHeaderId}`;
  return http.get(url, { params });
};

// 获取操作记录
export const getHistoryDataApi = (asnHeaderId) => {
  const url = `/spuc/v1/${SrmUtil.getTenantId()}/asn-header/${asnHeaderId}/action`;
  return http.get(url);
};