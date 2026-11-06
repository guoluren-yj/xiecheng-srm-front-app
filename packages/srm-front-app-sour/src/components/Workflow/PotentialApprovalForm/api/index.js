import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;
// 获取供货能力行附件
const getSupplyAbilityAttrLineInfoApi = (potentialLineId, requisitionId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-ability-item-ln-atts/${potentialLineId}?requisitionId=${requisitionId}`;

  return http.get(url);
};
// 获取获取评分人信息列表
const getEvalueUserInfoListApi = (requisitionId, indicateLineId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/score/${requisitionId}/${indicateLineId}/query?stageCode=POTENTIAL`;

  return http.get(url);
};

// 头信息查询
const getOrderHeadInfoApi = (type, changeReqId, params) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}`;
  return http.get(url, { params });
};

export {
  getSupplyAbilityAttrLineInfoApi,
  getEvalueUserInfoListApi,
  getOrderHeadInfoApi,
};