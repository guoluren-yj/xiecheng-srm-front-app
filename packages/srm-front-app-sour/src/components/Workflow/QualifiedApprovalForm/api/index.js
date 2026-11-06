import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;

// 头信息查询
export const getOrderHeadInfoApi = (type, changeReqId) => {
  const customizeUnitCode = "SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_ITEM_FORM,SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_ITEM_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_SCORE_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_ATT_LN,SSLM.SUPPLIER_LIFE_MANAGE.QUALIFIED_SUP_CLASSIFY_TABLE";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};

