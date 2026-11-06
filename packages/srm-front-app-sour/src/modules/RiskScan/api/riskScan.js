import { http, SrmUtil } from "srm-mobile-ui";

// 查询企业详情
export const fetchRiskDetail = (params) => {
  const url = `/sdat/v1/${SrmUtil.getTenantId()}/risk-scan/basic-info`;
  return http.get(url, { params });
};

// 查询动态展示的接口
export const fetchDynamicUrl = (params) => {
  const url = `/sdat/v1/${SrmUtil.getTenantId()}/risk-scan/scan-scope`;
  return http.get(url, { params });
};

// 查询值集
export const queryIdpValue = (params) => {
  const { tenantId = "", lovCode = "" } = params;
  const url = `/hpfm/v1/${tenantId}/lovs/value?lovCode=${lovCode}`;
  return http.get(url);
};

// 查询动态列表
export const fetchDynamicTable = (params) => {
  const { tenantId = "", fetchUrl = "" } = params;
  const url = `/sdat/v1/${tenantId}/risk-scan${fetchUrl}`;
  return http.get(url, { params });
};
