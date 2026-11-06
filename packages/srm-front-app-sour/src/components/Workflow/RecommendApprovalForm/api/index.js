import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取获取评分人信息列表
const getEvalueUserInfoListApi = (requisitionId, indicateLineId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/score/${requisitionId}/${indicateLineId}/query?stageCode=RECOMMEND`;

  return http.get(url);
};

/**供应商审批**/

// 头信息查询
const getOrderHeadInfoApi = (type, changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=SSLM.SUPPLIER_LIFE_MANAGE.REC_ATT_IN,SSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_ITEM_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_HEADER&organizationId=7860`;
  return http.get(url);
};
// 供应商分类查询
const getSupplierCategoryInfoApi = (params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/supplier-category-assign`;
  return http.get(url, {
    params
  });
};
export {
  getEvalueUserInfoListApi,
  getOrderHeadInfoApi,
  getSupplierCategoryInfoApi,
};
