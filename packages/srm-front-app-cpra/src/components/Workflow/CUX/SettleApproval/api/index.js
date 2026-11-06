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
