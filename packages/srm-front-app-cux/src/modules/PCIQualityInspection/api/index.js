import { http, SrmUtil } from "srm-mobile-ui";

// 评分接口-获取供应商信息
export const fetchOperation = (params, type) => {
  const url = type === "distribution" ? `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/assign` : `/scux/v1/${SrmUtil.getTenantId()}/pci-asn-check-headers/back`;
  return http.post(url, params);
};