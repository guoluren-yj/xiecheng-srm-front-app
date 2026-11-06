import { http, SrmUtil } from "srm-mobile-ui";

// 评分接口-获取供应商信息
export const fetchSubmitInspection = (params, type) => {
  const url = type === "resultSubmit" ? `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/submit` : `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/back`;
  return http.post(url, params);
};

export const deleteAsns = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/deleteAsn`;
  return http.post(url, params);
};

// 转交
export const fetchTransfer = (params) => {
  const url = `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/transfer`;
  return http.post(url, params);
};