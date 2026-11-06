import { http } from "srm-mobile-ui";
const storage = window.localStorage;

// 获取品类淘汰/供应能力基础信息
export const getSupplyAbilityBaseInfo = (id) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supply-abilitys/${id}`;
  let params = {
    customizeUnitCode: "SSLM.SUPPLIER_ABILITY_REVIEW.ITEM_TABLE,SSLM.SUPPLIER_ABILITY_REVIEW.DETAIL.HEADER,SSLM.SUPPLIER_ABLILITY_MANAGE.DETAIL.BASIC,SSLM.SUPPLIER_ABLILITY_MANAGE.EXPAND_DETAIL.BASE_INFO",
  };
  return http.get(url, { params });
};

// 获取物料/样品列表
export const getSampleListApi = (id, abilityLineIds) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supply-ability-lines/${id}`;
  let params = {
    abilityLineIds,
    customizeUnitCode: "SSLM.SUPPLIER_ABILITY_REVIEW.ITEM_TABLE,SSLM.SUPPLIER_ABILITY_REVIEW.DETAIL.HEADER,SSLM.SUPPLIER_ABLILITY_MANAGE.DETAIL.CATEGORY_MATERIALS,SSLM.SUPPLIER_ABLILITY_MANAGE.EXPAND_DETAIL.CATEGORY_LIST",
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
};

// 获取供应商分类信息
export const getSupplyCategoryApi = (supplierCompanyId, supplierTenantId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  let params = {
    isAssignFlag: 1,
    page: 0,
    size: 1000,
    supplierCompanyId,
    supplierTenantId,
  };
  return http.get(url, { params });
};

// 获取附件列表
export const getAttachmentListApi = (id) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supply-ability-att-lns/${id}`;
  let params = {
    customizeUnitCode: "SSLM.SUPPLIER_ABLILITY_MANAGE.DETAIL.ATTACHMENT",
  };
  return http.get(url, { params });
};

// 获取物料的附件列表
export const getMaterialAttachmentListApi = (supplyAbilityLineId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supply-ability-line-att-lns`;
  let params = {
    supplyAbilityLineId,
    customizeUnitCode: "SSLM.SUPPLIER_ABILITY_REVIEW.LINE_ATTACHMENT",
    page: 0,
    size: 1000,
  };
  return http.get(url, { params });
};

// 获取权限集配置
export const getApermissionsApi = (params) => {
  const url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, params);
};

// 获取值集参数
export const getCompanyIdReserveApi = (params) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`;
  return http.get(url, { params });
};