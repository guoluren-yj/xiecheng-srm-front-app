import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export const getPrePayHeader = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-pay-headers/${id}`, { params });

export const getPrePayLine = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-payment-lines/${id}`, { params });

export const getPrePayLineRecord = (id, params) => http.get(`/ssta/v1/${storage.getItem("organizationId")}/pre-payment-lines/write/off/record/${id}`, { params });

/*
订单明细操作记录查询
*/
export const getOpRecordApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`;
  return http.get(url, { params });
};
  /*
订单明细行查询
*/
export const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};
  /*
订单明细头查询
*/
export const getOrderHeaderApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail?camp=1`;
  const params = {
    customizeUnitCode: "SODR.SEND_ORDER_DETAIL.HEADER,SODR.SEND_ORDER_DETAIL.DELIVERY_CATA",
  };
  return http.get(url, { params });
};
  /*
保存生成的UUID
*/
export const saveFileUUIDApi = ({ uuidType, uuid, poHeaderId }) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};