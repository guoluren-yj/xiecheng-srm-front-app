/**
 * 与 【创建应收发票】相关的业务接口
 */

import { http } from "srm-mobile-ui";

const storage = window.localStorage;
const bucketName = "private-bucket";

//事务列表
const getListApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice/create`;
  return http.get(url, { params });
};
//配置中心规则
const getRulesApi = () => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice-update-rules`;
  return http.get(url);
};
//配置中心单价规则
const getPriceRulesApi = (key) => {
  const url = `/spfm/v1/${storage.getItem("tenantId")}/settings/batch?${key}=${key}`;
  return http.get(url);
};
//配置中心单价规则
const getSettingsApi = () => {
  const url = `/spfm/v1/${storage.getItem("tenantId")}/settings`;
  return http.get(url);
};
//客户lov
const getSupplierApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("tenantId")}/user-authority-data/customer`;
  return http.get(url, { params });
};
//移除
const getUnNeedApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("tenantId")}/rcv-trx-line/un-need-invoice`;
  return http.post(url, params);
};
//撤销移除
const getRemoveUnNeedApi = (params) => {
  const url = `/spuc/v1/${storage.getItem("tenantId")}/rcv-trx-line/need-invoice`;
  return http.post(url, params);
};
//创建
const getNeedApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice`;
  return http.post(url, params);
};

//  非寄销审核发票头查询
const getOrderHeaderApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice/supplier/${poHeaderId}`;
  return http.get(url);
};

// 明细行查询
const getOrderLineApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice-line/supplier/${poHeaderId}`;
  return http.get(url);
};

// 税务发票行查询
const getOrderTaxApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-lines/list/${poHeaderId}`;
  return http.get(url);
};

// 审批操作记录查询
const getOpRecordApi = (poHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice-actions/${poHeaderId}`;
  return http.get(url);
};
// 保存
const getSaveApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice?customizeUnitCode=SFIN.INVOICE_CREATE_DETAIL.TAX_LINE,SFIN.INVOICE_UPDATE_DETAIL.HEADER_INFO,SFIN.INVOICE_UPDATE_DETAIL.BASIC_INFO`;
  return http.put(url, params);
};
// 税务发票行保存
const taxInvoiceLinesSaveApi = (headerId, lines) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-lines/save/${headerId}`;
  return http.post(url, lines);
};

// 提交
const getSubmitApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice/submit`;
  return http.post(url, params);
};
// 获取附件
const getFileApi = (attachmentUUID) => http.get(`/hfle/v1/${storage.getItem("tenantId")}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`);

// 获取上传附件UUID
const getFileUUIDApi = () => {
  const url = `/hfle/v1/${storage.getItem("tenantId")}/files/uuid`;
  return http.post(url);
};
/*
附件删除
*/
// eslint-disable-next-line no-shadow
const deleteFileApi = ({ attachmentUUID, bucketName, params }) => {
  const url = `/hfle/v1/${storage.getItem("tenantId")}/files/delete-by-uuidurl?attachmentUUID=${attachmentUUID}&bucketName=${bucketName}`;
  return http.post(url, params);
};
//发票列表
const getInvoiceListApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-check/page`;
  return http.get(url, { params });
};

//购买方lov
const getBuyerApi = (params) => {
  const url = `/spfm/v1/${storage.getItem("tenantId")}/user-authority-data/company`;
  return http.get(url, { params });
};

//手工录入保存
const saveInvoiceApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-check`;
  return http.post(url, params);
};

//非寄销发票维护-删除
const deleteInvoiceApi = (params) => {
  const url = `sfin/v1/${storage.getItem("tenantId")}/invoice/${params}`;
  return http.delete(url);
};
//税务发票行删除
const batchRemoveApi = (params) => {
  const url = `sfin/v1/${storage.getItem("tenantId")}/tax-invoice-lines/batch-remove`;
  return http.delete(url, params);
};
//税务发票行查验
const batchCheckApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice/batch-check-ARinvoice`;
  return http.post(url, params);
};
//发票查验
const checkInvoiceApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-check/check`;
  return http.post(url, params);
};

//OCR识别
const ocrImportApi = (invoiceHeaderId, params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/tax-invoice-lines/ocr-import/${invoiceHeaderId}`;
  return http.post(url, params);
};

export const getOrderLedgerAccountApi = (params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/supplier-deduction/invoice-page`;
  return http.get(url, { params });
};

const updateInvoiceLineApi = (headerId, params) => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/invoice-line/update/${headerId}`;
  return http.put(url, [ params ]);
};

// 获取OCR上传文件大小
export const getOcrConfig = () => {
  const url = `/sfin/v1/${storage.getItem("tenantId")}/common/ocr-channel-mapping`;
  return http.get(url);
};

export {
  getListApi,
  getUnNeedApi,
  getNeedApi,
  getOrderHeaderApi,
  getOrderLineApi,
  getOrderTaxApi,
  getOpRecordApi,
  getSaveApi,
  getSubmitApi,
  getFileApi,
  getFileUUIDApi,
  deleteFileApi,
  deleteInvoiceApi,
  batchRemoveApi,
  getRemoveUnNeedApi,
  batchCheckApi,
  getRulesApi,
  getPriceRulesApi,
  getBuyerApi,
  getSupplierApi,
  saveInvoiceApi,
  checkInvoiceApi,
  ocrImportApi,
  getInvoiceListApi,
  taxInvoiceLinesSaveApi,
  getSettingsApi,
  updateInvoiceLineApi,
};
