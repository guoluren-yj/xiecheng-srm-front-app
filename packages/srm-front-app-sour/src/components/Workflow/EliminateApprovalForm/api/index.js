import {
  http
} from "srm-mobile-ui";

const storage = window.localStorage;

// 头信息查询
export const getOrderHeadInfoApi = (type, changeReqId) => {
  const customizeUnitCode = "SSLM.SUPPLIER_LIFE_MANAGE.DEGRADE_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.DEGRADE_SUP_CLASSIFY_TABLE,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_HEADER,SSLM.SUPPLIER_LIFE_MANAGE.PURCHASE_LINES";
  const url = `/sslm/v1/${storage.getItem("organizationId")}/life-cycle/${type}/${changeReqId}?customizeUnitCode=${customizeUnitCode}`;
  return http.get(url);
};
