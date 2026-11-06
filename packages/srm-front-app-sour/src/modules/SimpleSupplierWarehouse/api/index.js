/**
 * 简易供应商子应用业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getSupplierInfoApi = (extSupplierReqId, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/supplierInfo/${extSupplierReqId}`;
  return http.get(url, { params });
};

// 保存
export const saveSupplierInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT,SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/save?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 提交
export const submitSupplierInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.BASIC_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT,SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO,SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/submit?customizeUnitCode=${customizeUnitCode}`;
  return http.post(url, params);
};

// 校验银行账户是否重复
export const checkBankAccountCommon = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/common-data/firm/check-bank-account`;
  return http.post(url, params);
};

// 查询业务规则定义银行名称校验方式
export const queryCheckModeApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/cnf`;
  return http.get(url, { params });
};

// 删除
export const deleteSupplierInfoApi = (params, customizeUnitCode) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/delete?customizeUnitCode=${customizeUnitCode}`;
  return http.delete(url, params);
};

// 获取新建用户信息
export const getuserAndUserMasterUnitApi = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/sample-send-reqs/getUserAndUserMasterUnit`;
  return http.get(url);
};

// 获取业务规则配置
export const getRequiredTabsInfoApi = () => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/required-tabs`;
  return http.get(url);
};

// 删除联系人
export const deleteContactInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.CONTACT_INFO";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-contact-reqs/batch-delete?customizeUnitCode=${customizeUnitCode}`;
  return http.delete(url, params);
};

// 删除地址
export const deleteAddressInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.ADDRESS_INFO";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-address-reqs/batch-delete?customizeUnitCode=${customizeUnitCode}`;
  return http.delete(url, params);
};

// 删除银行
export const deleteBankInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.BANK_ACCOUNT";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/ext-sup-bk-account-reqs/batch-delete?customizeUnitCode=${customizeUnitCode}`;
  return http.delete(url, params);
};

// 删除附件
export const deleteAttachmentInfoApi = (params) => {
  const customizeUnitCode = "SSLM.EASY_SUPPLIER_WAREHOUSE.ATTACHMENT";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-attachment-reqs/batch-delete?customizeUnitCode=${customizeUnitCode}`;
  return http.delete(url, params);
};

// 删除采购/财务行
export const deletePurchaseLineInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/ext-supplier-pf-line-req/deletePfLines`;
  return http.delete(url, params);
};

// 获取省市区
export const getRegionsInfoApi = (countryId, regionId) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/regions/regional-linkage?countryId=${countryId}&regionId=${regionId}`;
  return http.get(url);
};

// 获取银行代码
export const getBankInfoApi = () => {
  const lovCode = "SMDM.BANK";
  const url = `/smdm/v1/platform/banks?enabledFlag=1&lovCode=${lovCode}&page=0&size=10000`;
  return http.get(url);
};

//校验变更信息
export const changeVerifyApi = (supplierId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/external-supplier-reqs/change/verify/${supplierId}`;
  return http.get(url);
};