import { SrmUtil, http } from "srm-mobile-ui";

// 获取付费时确认的信息（核企、有效期、金额）
export const getPaymentInfoApi = (supplierPaymentId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment/${supplierPaymentId}`;
  let params = {
    supplierPaymentId,
  };
  return http.get(url, { params });
};

// 获取开票信息
export const getMakeInvoiceInfoApi = (supplierTicketId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/ticket-detail`;
  let params = {
    supplierTicketId,
  };
  return http.get(url, { params });
};

// 获取发票信息
export const getInvoiceInfoApi = (supplierInvoiceId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/invoice/${supplierInvoiceId}`;
  let params = {
    supplierInvoiceId,
  };
  return http.get(url, { params });
};

// 获取开票状态
export const getTicketStatusApi = () => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/queryAmktLov`;
  let params = {
    lovCode: "AMKT.TICKET_STATUS",
  };
  return http.get(url, { params });
};

// 获取发票种类
export const getAmktLovApi = (lovCode) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/queryAmktLov`;
  let params = {
    lovCode,
  };
  return http.get(url, { params });
};

// 申请开票（开票状态修改）
export const applyMakeInvoiceApi = (supplierPaymentIdList) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment/operate-ticket-state`;
  let params = {
    supplierPaymentIdList,
    ticketState: "INVOICE_APPLY",
  };
  return http.post(url, params);
};

// 保存开票信息
export const saveMakeInvoiceInfoApi = (params) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/ticket/save`;
  return http.post(url, params);
};

// prePay预支付
export const sullierPaymentPrePayApi = (supplierPaymentId, returnUrl) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/pre-pay`;
  let params = {
    supplierPaymentId,
    returnUrl,
  };
  return http.post(url, params);
};

// 续费信息
export const getRenewPaymentInfoApi = (supplierPaymentId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment/renew-payment`;
  let params = {
    supplierPaymentId,
  };
  return http.post(url, params);
};

// 检查是否可以继续续费
export const checkPaymentStateApi = (renewId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/check-already-pay/${renewId}`;
  return http.get(url);
};

// 取消缴费
export const cancelcurrentPaymentApi = (supplierPaymentId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment/cancel-payment/${supplierPaymentId}`;
  return http.get(url);
};

// 撤回操作
export const getMakeInvoiceWithdrawApi = (params) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/payment/operate-ticket-state`;
  return http.post(url, params);
};

// 开票记录
export const fetchOperationRecord = (supplierPaymentId) => {
  let url = `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/ticket-record/${supplierPaymentId}`;
  return http.get(url);
};

// 获取流程状态
export const getWorkFlowStatusApi = (code) =>
  http.get(`/hpfm/v1/lovs/value?lovCode=${code}`);