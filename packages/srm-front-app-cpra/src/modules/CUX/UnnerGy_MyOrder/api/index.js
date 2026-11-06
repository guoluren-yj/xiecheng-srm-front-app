/**
 * 与 【我发出的订单】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
/*
订单明细头查询
*/
export const getOrderHeaderApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail?camp=1`;
  return http.get(url);
};
/*
订单明细行查询
*/
export const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};
/*
订单明细操作记录查询
*/
export const getOpRecordApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`;
  return http.get(url, { params });
};
/*
保存生成的UUID
*/
export const saveFileUUIDApi = ({ uuidType, uuid, poHeaderId }) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};
