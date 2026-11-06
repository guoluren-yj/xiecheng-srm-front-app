/**
 * 与 【我发出的订单】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

/*
我发出的订单列表查询
*/
export const getMyOrderListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem(
    "organizationId"
  )}/po-header/purchaser`;
  return http.get(url, { params });
};
/*
供应商查询
*/
export const getSupplierApi = (params) => {
  const url = `spfm/v1/lovs/sql/data?tenantId=${storage.getItem("tenantId")}`;
  return http.get(url, { params });
};
/*
订单状态查询
*/
export const getOrderStatusApi = (params) => {
  const url = "/hpfm/v1/lovs/data";
  return http.get(url, { params });
};
/*
订单明细头查询
*/
export const getOrderHeaderApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem(
    "organizationId"
  )}/po-header/${poHeaderId}/detail?camp=1`;
  const params = {
    customizeUnitCode:
      "SODR.SEND_ORDER_DETAIL.HEADER,SODR.SEND_ORDER_DETAIL.DELIVERY_CATA"
  };
  return http.get(url, { params });
};
/*
订单明细行查询
*/
export const getOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem(
    "organizationId"
  )}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};
/*
订单明细操作记录查询
*/
export const getOpRecordApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem(
    "organizationId"
  )}/po-process-actions/${poHeaderId}`;
  return http.get(url, { params });
};
/*
获取上传附件UUID
*/
export const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};
/*
保存生成的UUID
*/
export const saveFileUUIDApi = ({ uuidType, uuid, poHeaderId }) => {
  const url = `/spuc/v1/${storage.getItem(
    "organizationId"
  )}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};
/*
采购方附件查询
*/
export const getFileApi = (attachmentUUID) => {
  const url = `/hfle/v1/${storage.getItem(
    "organizationId"
  )}/files/${attachmentUUID}/file/?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.get(url);
};
/*
供应商附件查询
*/
export const getSupplierFileApi = (supplierAttachmentUuid) => {
  const url = `/hfle/v1/${storage.getItem(
    "organizationId"
  )}/files/${supplierAttachmentUuid}/file/?attachmentUUID=${supplierAttachmentUuid}&bucketName=${bucketName}`;
  return http.get(url);
};
/*
采购方附件上传
*/
export const uploadFileApi = (params) => {
  const url = `/hfle/v1/${storage.getItem(
    "organizationId"
  )}/files/attachment/multipart`;
  return http.post(url, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "bearer 2c11a355-ef72-44e9-850e-b9c5b34e2bc5"
    }
  });
};
/*
采购方附件预览
*/
export const previewFileApi = (params) => {
  const url = `/hfle/v1/${storage.getItem(
    "organizationId"
  )}/files/redirect-url`;
  return http.get(url, { params });
};
/*
采购方附件下载
*/
export const downloadFileApi = (params) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/download`;
  return http.get(url, { params });
};
/*
采购方附件删除
*/
export const deleteFileApi = ({ attachmentUUID, params }) => {
  const url = `/hfle/v1/${storage.getItem(
    "organizationId"
  )}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.post(url, params);
};

/**
 * 查询是否开启双单位配置
 * @param {Object}
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params });
};

/**
 * 双单位计算公式
 * @async
 * @function calculateDoubleUom
 * @returns {object}
 */
export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${storage.getItem(
    "organizationId"
  )}/items/uom/calculate/quantity`;
  return http.post(url, params);
}
