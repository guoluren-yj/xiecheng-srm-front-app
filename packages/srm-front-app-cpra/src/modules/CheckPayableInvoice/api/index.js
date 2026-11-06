/**
 * 与 【订单审批】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

// 获取审批列表
const getApprovalListApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/approve`;
  return http.get(url, { params });
};

// 供应商查询
const getSupplierApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("organizationId")}/user-authority-data/supplier`;
  return http.get(url, { params });
};

// 查验状态查询
const getPurchaserApi = () => {
  const url = "/hpfm/v1/lovs/data?lovCode=SFIN.INVOICE_HEADER_VALIDATE_STATUS";
  return http.get(url);
};

// 批量审批通过
const someAdoptApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/approve-confirm`;
  return http.post(url, params);
};

// 批量审批拒绝
const someRejectApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/invoice/approve-reject `;
  return http.post(url, params);
};

// 批量审批查验
const someCheckApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("organizationId")}/invoice/batch-check-invoice `;
  return http.post(url, params);
};

//  非寄销审核发票头查询
const getOrderHeaderApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/${poHeaderId}`;
  return http.get(url);
};

// 明细行查询
const getOrderLineApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice-line/${poHeaderId}`;
  return http.get(url);
};

// 税务发票行查询
const getOrderTaxApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/tax-invoice-lines/list/${poHeaderId}`;
  return http.get(url);
};

// 审批操作记录查询
const getOpRecordApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice-actions/${poHeaderId}`;
  return http.get(url);
};
// 获取附件
const getAttachedFile = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("organizationId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("organizationId")}/files/uuid`;
  return http.post(url);
};

// 详情页通过
const getApproveConfirmApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/approve-confirm`;
  return http.post(url, params);
};

// 详情页退回
const getApproveRejectApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/approve-reject`;
  return http.post(url, params);
};
// 获取对比类型
export const getSourceTypeApi = () => {
  const url = `/hpfm/v1/lovs/value?lovCode=SFIN.INVOICE_PRICE_DIFF&organizationId=${storage.getItem("organizationId")}&tenantId=${storage.getItem("tenantId")}`;
  return http.get(url);
};
export const getOrderLedgerAccountApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/supplier-deduction/invoice-page`;
  return http.get(url, { params });
};

export {
  getApprovalListApi,
  getSupplierApi,
  getPurchaserApi,
  someAdoptApi,
  someRejectApi,
  someCheckApi,
  getOrderHeaderApi,
  getOrderLineApi,
  getOrderTaxApi,
  getOpRecordApi,
  getAttachedFile,
  getFileUUIDApi,
  getApproveConfirmApi,
  getApproveRejectApi,
};
