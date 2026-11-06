/**
 * 与 【我收到的订单】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// const tenantId = window.localStorage.getItem('tenantId') || 30;
// const organizationId = window.localStorage.getItem('organizationId') || 30;
// const supplierTenantId = window.localStorage.getItem('supplierTenantId') || 30;

/*
我收到的订单列表查询
*/
export const getOrderListApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/supplier?supplierTenantId=${storage.getItem("supplierTenantId")}`;
  return http.get(url, { params });
};
/*
提交操作
*/
export const submitOrderApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/submit/after-confirm?customizeUnitCode=SODR.RECEIVED_ORDER_DETAIL.HEADER%2CSODR.RECEIVED_ORDER_DETAIL.BASIC`;
  return http.post(url, params);
};

/*
客户查询
*/
export const getSupplierApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/customer`;
  return http.get(url, { params });
};
/*
订单状态查询
*/
export const getOrderStatusApi = (params) => {
  const url = `/hpfm/v1/lovs/data?tenantId=${storage.getItem("tenantId")}`;
  return http.get(url, { params });
};
/*
订单明细头查询
*/
export const getOrderHeaderApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail`;
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
订单明细行查询（三江）
*/
export const getSanjiangOrderLineApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail_sanjiang`;
  return http.get(url, { params });
};

/*
订单明细操作记录查询
*/
export const getOpRecordApi = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}?tenantId=${storage.getItem("tenantId")}`;
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
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};
/*
采购方附件查询
*/
export const getFileApi = (attachmentUUID) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file/?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.get(url);
};
/*
供应商附件查询
*/
export const getSupplierFileApi = (supplierAttachmentUuid) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${supplierAttachmentUuid}/file/?attachmentUUID=${supplierAttachmentUuid}&bucketName=${bucketName}`;
  return http.get(url);
};
/*
采购方附件上传
*/
export const uploadFileApi = (params) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/attachment/multipart`;
  return http.post(url, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "bearer 2c11a355-ef72-44e9-850e-b9c5b34e2bc5",
    },
  });
};
/*
采购方附件预览
*/
export const previewFileApi = (params) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/redirect-url`;
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
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.post(url, params);
};
/*
获取二维码链接
*/
export const getQrCodeRedirectUrl = (params) => {
  const templateCode = "SCUX.SUPPLY_DETAIL.CREATE", thirdPlatformCode = "wechatService";
  const url = `/smbl/v1/${storage.getItem("organizationId")}/msg-url-mapping/getMobileFormUrl?templateCode=${templateCode}&thirdPlatformCode=${thirdPlatformCode}`;
  return http.post(url, params);
};
/*
获取二维码
*/
export const getQrCode = (src) => {
  const url = "/smbl/v1/common/qr/code";
  return http.post(url, { content: src }, { responseType: "arraybuffer" });
};

/*
 根据id获取行信息验收标准数据
 */
export const getAcceptabilityCriteria = (lineItemId) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-line-item/${lineItemId}/detail`);

/**
 * 查询是否开启双单位配置
 * @async
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
 export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params});
};

/**
 * 双单位计算公式
 * @async
 * @function calculateDoubleUom
 * @returns {object}
 */
export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${storage.getItem("organizationId")}/items/uom/calculate/quantity`;
  return http.post(url, params);
}