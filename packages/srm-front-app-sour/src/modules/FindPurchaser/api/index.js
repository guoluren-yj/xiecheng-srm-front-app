/**
 * 与 【发现供应商】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const stroge = window.localStorage;

// const tenantId = window.localStorage.getItem('tenantId') || 30;
// const organizationId = window.localStorage.getItem('organizationId') || 30;
// const supplierTenantId = window.localStorage.getItem('supplierTenantId') || 30;

/*
发现供应商列表查询
*/
const getOrderListApi = (params, page, size) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/companies/search/purchaser?page=${page}&size=${size}`;
  return http.post(url, params);
};
/*
批量获取值集（调查表类型、送货或服务范围、注册资本）
*/
const getValueApi = (params) => {
  const url = "/hpfm/v1/lovs/value/batch";
  return http.get(url, { params });
};
/*
供应商行业树查询
*/
const getTreeApi = () => {
  const url = "/hpfm/v1/industries/tree";
  return http.get(url);
};
/*
供应商明细查询
*/
const getSupplierApi = (companyId) => {
  const url = `/spfm/v1/companies/latest?companyId=${companyId}`;
  return http.get(url);
};

/*
 邀请方lov查询
*/
const getInviterApi = (params) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/user-authority-data/company`;
  return http.get(url, { params });
};

/*
确认邀请
*/
const postInviteApi = (params) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/supplier-invite`;
  return http.post(url, params);
};

export {
  getValueApi,
  getOrderListApi,
  getSupplierApi,
  getTreeApi,
  getInviterApi,
  postInviteApi,
};
