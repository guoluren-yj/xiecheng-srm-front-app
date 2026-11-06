
import { http } from "srm-mobile-ui";

// 获取基础信息
export const getBasisInfoApi = (supplyAbilityExpandId) => {
  const customizeUnitCode = "SSLM.SUPPLIER_ABLILITY_DEFINITION.EXPAND_BASE_INFO,SSLM.SUPPLIER_ABLILITY_DEFINITION.EXPAND_CATEGORY_LIST";
  const url = `/sslm/v1/${window.localStorage.getItem("organizationId")}/supply-ability-expands/${supplyAbilityExpandId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};

// 获取附件信息
export const getAttachmentsApi = (params) => {
  const url = `/sslm/v1/${window.localStorage.getItem("organizationId")}/supply-ability-expand-line-att-lns`;
  return http.get(url, { params });
};

// 获取权限集配置
export const getApermissionsApi = (params) => {
  const url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, params);
};
