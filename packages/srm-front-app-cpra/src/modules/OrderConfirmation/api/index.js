/**
 * 与 【订单确认】相关的业务接口
 */
import { http, SrmUtil } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取订单确认列表
export const getOrderConfirmationListApi = (params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-header/confirm-list`, { params });

// 订单确认-采购订单批量确认
export const confirmOrderListApi = (params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/po-header/confirm`, params);

// 订单确认-明细采购订单确认
export const confirmDetailApi = (params) => http.post(`/spuc/v1/${storage.getItem("organizationId")}/po-header/confirm-detail?customizeUnitCode=SODR.CONFIRM_ORDER_DETAIL.BASIC,CSODR.CONFIRM_ORDER_DETAIL.HEADER`, params);

// 订单确认-明细页面订单保存
export const saveDetailApi = (params) => http.put(`/spuc/v1/${storage.getItem("organizationId")}/po-header/supplier/save?customizeUnitCode=SODR.CONFIRM_ORDER_DETAIL.HEADER,SODR.CONFIRM_ORDER_DETAIL.BASIC,SODR.CONFIRM_ORDER_DETAIL.OTHER`, params);

// 获取状态
export const getStatusApi = () => http.get(`/hpfm/v1/lovs/data?lovCode=SODR.PO_STATUS&tenantId=${storage.getItem("organizationId")}`);

// 获取客户
export const getSupplierApi = (params) => http.get(`/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/customer`, { params });

// 订单确认明细头查询-供应商
export const getOrderHeadInfo = (poHeaderId) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-header/${poHeaderId}/detail?camp=2&poEntryPoint=PURCHASE_PO_CONFIRM&customizeUnitCode=SODR.CONFIRM_ORDER_DETAIL.HEADER,SODR.CONFIRM_ORDER_DETAIL.DELIVERY_CATA`);

// 订单明细行查询-供应商<基础信息>
export const getOrderLineInfo = ({ poHeaderId, page = 0, size = 1000 }) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail?camp=2&poEntryPoint=PURCHASE_PO_CONFIRM&page=${page}&size=${size}&sortType=4&customizeUnitCode=SODR.CONFIRM_ORDER_DETAIL.BASIC,SODR.CONFIRM_ORDER_DETAIL.OTHER`);

// 订单明细行查询-供应商<基础信息>
export const getOrderLineInfoBJHL = (poHeaderId, params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-line/${poHeaderId}/detail`;
  return http.get(url, { params });
};

// 获取操作记录
export const getOperationRecordsApi = (poHeaderId) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-process-actions/${poHeaderId}`;
  return http.get(url, {
    params: {
      page: 0,
      size: 0,
      tenantId: SrmUtil.getTenantId()
    }
  });
};

// 采购方附件查询
export const getFileApi = (attachmentUUID) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file/?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.get(url);
};

// 供应商附件查询
export const getSupplierFileApi = (supplierAttachmentUuid) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/${supplierAttachmentUuid}/file/?attachmentUUID=${supplierAttachmentUuid}&bucketName=${bucketName}`;
  return http.get(url);
};

// 获取上传附件UUID
export const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 保存生成的UUID
export const saveFileUUIDApi = ({ uuidType = 2, uuid, poHeaderId }) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-header/attachmentUUID?uuidType=${uuidType}&uuid=${uuid}&poHeaderId=${poHeaderId}`;
  return http.put(url);
};

// 供应商附件删除
// eslint-disable-next-line no-shadow
export const deleteFileApi = ({ attachmentUUID, bucketName, params }) => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.post(url, params);
};

/*
获取确认字段属性，可编辑，必输等
*/
export const getOrderConfirmField = () => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/po-approve-rules`;
  return http.get(url);
};

// eslint-disable-next-line valid-jsdoc
/**
 * 查询是否开启双单位配置
 * @function queryDoubleUomConfig
 * @returns {object} fetch Promise 0不开启双单位，1上下游和订单都开启，2仅订单开启
 */
 export const queryDoubleUomConfigApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/secondary/getcnf`;
  return http.get(url, { params });
};

// eslint-disable-next-line valid-jsdoc
/**
 * 双单位计算公式
 * @function calculateDoubleUom
 * @returns {object}
 */
export async function calculateDoubleUomApi(params) {
  const url = `/smdm/v1/${storage.getItem(
    "organizationId"
  )}/items/uom/calculate/quantity`;
  return http.post(url, params);
}