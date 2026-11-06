import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;

// 头信息查询
export const getOrderHeadInfoApi = (type, changeReqId) => {
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=SSLM.SUPPLIER_LIFE_MANAGE.REC_ATT_IN,SSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_ITEM_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.RECOMMEND_HEADER&organizationId=7860`;
  return http.get(url);
};
