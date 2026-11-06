import { $T } from "srm-mobile-ui";
import { SrmUtil } from "srm-mobile-ui";
function checkSuccessDataSource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      checkedFlag: 1,
      validateStatusCode: "CHECK_SUCCESS",
    },
    fastQueryField: {
      fieldCode: "invoiceCode",
      fieldType: "TEXT",
      fieldName: $T("sfin.invoiceInspection.model.InvoiceCode").$D("发票代码"),
    },
    queryFields: [ {
      fieldCode: "billingDateFrom",
      endDateFieldCode: "billingDateTo",
      fieldType: "DATE",
      selectType: "start-end",
      fieldName: $T("sfin.invoiceInspection.model.billingDate").$D("开票日期"),
    }, {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sfin.inputInvoice.model.purchaser").$D("购买方"),
    }, {
      fieldCode: "supplierName",
      fieldType: "TEXT",
      fieldName: $T("sfin.inputInvoice.model.supplierCompanyName").$D("销售方"),
    }, ],
    transport: {
      read: {
        url: `/sfin/v1/${SrmUtil.getTenantId()}/tax-invoice-check/page`,
        method: "get",
      },
    }
  };
}

export {
  checkSuccessDataSource,
};
