import { http, SrmUtil } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

export const queryIdpValue = async (lovCode) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value`;
  return http.get(url, { params: { lovCode } });
};

export const queryMapIdpValue = async (lovCodes) => {
  const url = `/hpfm/v1/${tenantId}/lovs/value/batch`;
  return http.get(url, { params: lovCodes });
};

export const queryHistoryRecords = async (settleHeaderId) => {
  const url = `/ssta/v1/${tenantId}/settle-header-actions/${settleHeaderId}`;
  return http.get(url, { params: { size: 0 } });
};

export async function queryApproveRecords(params) {
  const url = `/ssta/v1/${tenantId}/settle-headers/ssta-historyApproval-batch`;
  return http.get(url, { params });
}

export async function invoiceCheck(settleHeaderId, action) {
  const url = `/ssta/v1/${tenantId}/tax-invoice-headers/check-settle-header/${settleHeaderId}/${action}`;
  return http.post(url);
}

export async function batchConfirmSettle({ role = "purchaser", body, isOnlyPre }) {
  const url = isOnlyPre ?
    `/ssta/v1/${tenantId}/pre-pay-headers/confirm` :
    `/ssta/v1/${tenantId}/settle-headers/${role}/confirm`;
  return http.put(url, body);
}

export async function confirmValidate({ body, role = "purchaser" }) {
  const url = `/ssta/v1/${tenantId}/settle-headers/${role}/validate/confirm`;
  return http.put(url, body);
}

export async function batchReturnSettle({ body, role = "purchaser", isOnlyPre }) {
  const url = isOnlyPre ?
    `/ssta/v1/${tenantId}/pre-pay-headers/return-back` :
    `/ssta/v1/${tenantId}/settle-headers/${role}/return`;
  return http.put(url, body);
}

//获取税务发票操作记录
export const getTaxInvoiceOperationRecord = (taxInvoiceHeaderId) => http.get(`/ssta/v1/${SrmUtil.getTenantId()}/tax-invoice-action/${taxInvoiceHeaderId}`, {
  params: {
    page: 0,
    size: 0,
    taxInvoiceHeaderId
  }
});

export async function confirmPrepayment(params) {
  const url = `/ssta/v1/${tenantId}/pre-pay-headers/confirm`;
  return http.put(url, params);
}

export async function returnPrepayment(params) {
  const url = `/ssta/v1/${tenantId}/pre-pay-headers/return-back`;
  return http.put(url, params);
}

export async function confirmPrepaymentSup(params) {
  const url = `/ssta/v1/${tenantId}/pre-pay-headers/supplier/confirm`;
  return http.put(url, params);
}

export async function returnPrepaymentSup(params) {
  const url = `/ssta/v1/${tenantId}/pre-pay-headers/supplier/return-back`;
  return http.put(url, params);
}
