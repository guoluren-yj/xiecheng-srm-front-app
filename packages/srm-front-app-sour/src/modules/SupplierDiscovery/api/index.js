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
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/companies/search/supplier?page=${page}&size=${size}`;

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
调查版模板lov查询
*/
const getTemplateApi = (params) => {
  const url = `/sslm/v1/${stroge.getItem("organizationId")}/investigate-templates/real`;

  return http.get(url, { params });
};
/*
确认邀请
*/
const postInviteApi = (params) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/purchase-invite`;

  return http.post(url, params);
};

/*
确认邀请
*/
const postBathInviteApi = (params) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/purchase-batch-invite`;

  return http.post(url, params);
};

/*
发送邀请
*/
const postInviteRegisterApi = (params) => {
  const url = `/spfm/v1/${stroge.getItem("organizationId")}/supplier-invite-register`;

  return http.post(url, params);
};
// 获取标签

export const getLabelsApi = (params) => {
  const url = `/sslm/v1/${stroge.getItem("organizationId")}/supplier-companies/query-label`;

  return http.get(url, { params });
};
// 提交标签
export const getConfirmLabelsApi = (companyId, params) => {
  const url = `/sslm/v1/${stroge.getItem("organizationId")}/supplier-companies/update-label?companyId=${companyId}`;

  return http.post(url, params);
};

// 获取准入平类
export const getCategorysApi = () => {
  const url = `/smdm/v1/${stroge.getItem("organizationId")}/item-categories/category-agent/lov`;

  return http.get(url);
};

// 校验供应商分类
export const checkIntroCategoryApi = (params) => {
  const url = `/sslm/v1/${stroge.getItem("organizationId")}/supplier-categorys/check-intro-category?${params}`;

  return http.get(url);
};

// 获取准入品类对应采购员
export const getPurchaserApi = (params) => {
  const url = `/smdm/v1/${stroge.getItem("organizationId")}/item-category-purchasers/getPurchaser`;
  return http.post(url, params);
};

export {
  getValueApi,
  getOrderListApi,
  getSupplierApi,
  getTreeApi,
  getInviterApi,
  getTemplateApi,
  postInviteApi,
  postBathInviteApi,
  postInviteRegisterApi,
};
