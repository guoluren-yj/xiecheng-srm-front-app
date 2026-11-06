import { http, SrmUtil } from "srm-mobile-ui";

//获取操作记录
export const getOperationRecord = (settleHeaderId) => http.get(`/ssta/v1/${SrmUtil.getTenantId()}/settle-header-actions/${settleHeaderId}`, {
  params: {
    page: 0,
    size: 0,
    settleHeaderId
  }
});

//获取税务发票操作记录
export const getTaxInvoiceOperationRecord = (taxInvoiceHeaderId) => http.get(`/ssta/v1/${SrmUtil.getTenantId()}/tax-invoice-action/${taxInvoiceHeaderId}`, {
  params: {
    page: 0,
    size: 0,
    taxInvoiceHeaderId
  }
});

export const batchUpdateLine = ({ data, params }) => http.put(`/ssta/v1/${SrmUtil.getTenantId()}/settle-headers/purchaser/update/batch`, data, { params });

export const workflowValidate = (data) => http.put(`/ssta/v1/${SrmUtil.getTenantId()}/settle-headers/validate/workflow`, data);