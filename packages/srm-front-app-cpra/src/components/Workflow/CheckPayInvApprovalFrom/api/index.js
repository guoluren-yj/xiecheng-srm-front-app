
import { http } from "srm-mobile-ui";
const storage = window.localStorage;

//  非寄销审核发票头、基础信息查询
export const getInvoiceHeaderApi = (invoiceHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice/${invoiceHeaderId}`;
  return http.get(url);
};

// 明细行查询
export const getInvoiceLineApi = (invoiceHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/invoice-line/${invoiceHeaderId}`;
  return http.get(url);
};

// 税务发票行查询
export const getInvoiceTaxApi = (invoiceHeaderId) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/tax-invoice-lines/list/${invoiceHeaderId}`;
  return http.get(url);
};

// 总账信息
export const getSupplierDeductionApi = (invoiceHeaderId, page = 0, size = 1000) => {
  const url = `/sfin/v1/${storage.getItem("organizationId")}/supplier-deduction/invoice-page?invoiceHeaderId=${invoiceHeaderId}&organizationId=${storage.getItem("organizationId")}&page=${page}&size=${size}`;
  return http.get(url);
};
//发票种类
