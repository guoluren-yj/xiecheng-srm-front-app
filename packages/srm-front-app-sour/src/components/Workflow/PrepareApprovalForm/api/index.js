import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取获取评分人信息列表
const getEvalueUserInfoListApi = (requisitionId, indicateLineId, stageCode, templateId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/score/${requisitionId}/${indicateLineId}/query?stageCode=${stageCode}&templateId=${templateId}`;

  return http.get(url);
};
export {
  getEvalueUserInfoListApi
};

/**
 * 代码迁移改造
 */

// 头信息查询
export const getOrderHeadInfoApi = (type, changeReqId) => {
  const customizeUnitCode = "SSLM.SUPPLIER_LIFE_MANAGE.PREPARE_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_LINES,SSLM.SUPPLIER_LIFE_MANAGE.PREPARE_SCORE_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.PREPARE_ITEM_FORM,SSLM.SUPPLIER_LIFE_MANAGE.PREPARE_ITEM_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.PREPARE_SUP_CLASSIFY_TABLE";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};

// 供应商分类查询
export const getSupplierCategoryInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  return http.get(url, {
    params
  });
};