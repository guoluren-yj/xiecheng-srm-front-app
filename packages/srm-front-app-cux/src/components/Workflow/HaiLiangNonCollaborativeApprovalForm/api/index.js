import { http, SrmUtil } from "srm-mobile-ui";

// 基本信息
export const getHeaderInfo = (supplierZrBasicId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-basics/${supplierZrBasicId}`;
  return http.get(url);
};

// 登记信息
export const getLoginInfo = (supplierZrBasicId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-basics/reg-detail/${supplierZrBasicId}`;
  return http.get(url);
};

// 业务信息
export const getBusinessInfo = (supplierZrBasicId) => {
  let url = `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-basics/business-detail/${supplierZrBasicId}`;
  return http.get(url);
};