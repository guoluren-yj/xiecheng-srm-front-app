import { http, SrmUtil } from "srm-mobile-ui";

// 线下整单录入-询价头信息查询
export const fetchWholeHeader = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v1/${organizationId}/rfx/offline-whole/header-query`;
  return http.get(url, { params, });
};

// // 判断是否开启双单位
export const queryEnableDoubleUnit = (params = {}) => {
  const url = `/ssrc/v1/${SrmUtil.getTenantId()}/secondary/uom/isEnable`;
  return http.get(url, { params, });
};

// 线下整单录入-询价头信息查询
export const fetchWholeLadderLevelList = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v1/${organizationId}/rfx-offline-ladder-quotations`;
  return http.get(url, { params, });
};

// 适用范围-配置列表查询
export const fetchApplicationScopeUnitList = (params = {}) => {
  const { organizationId, } = params || {};
  const url = `/ssrc/v1/${organizationId}/source-app-scopes`;
  return http.get(url, { params, });
};

// 适用范围-配置配置下列表
export const fetchApplicationScopeConfigList = (params = {}) => {
  const { organizationId, sourceAppScopeId, } = params || {};
  const url = `/ssrc/v1/${organizationId}/source-app-scope-lines/${sourceAppScopeId}/exists/line`;
  return http.get(url, { params, });
};
