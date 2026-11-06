// 获取pc端业务规则配置
import { http, SrmUtil } from "srm-mobile-ui";

// 采购申请创建
export const getCreationApi = (code, params) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/cnf/do-execute?fullPathCode=${code}`;
  return http.post(url, params);
};

// 根据公司获取 业务实体、采购组织
export const purchaseRequestsApi = (params) => {
  let url = `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/purchase-company`;
  return http.get(url, { params });
};

// 获取业务规则信息-双单位配置
export const getUomControlApi = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/items/secondary/uom/getcnf`;
  return http.get(url, { params });
};

// 根据辅助单位，辅助数量换算单
export const getUomQuantityApi = (params) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/items/uom/calculate/quantity`;
  return http.post(url, params);
};

// 获取按钮权限
export const checkPermission = (params) => {
  let url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, params);
};