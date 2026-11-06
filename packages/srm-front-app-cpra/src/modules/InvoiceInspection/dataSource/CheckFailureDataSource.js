import { $T } from "srm-mobile-ui";
import { SrmUtil } from "srm-mobile-ui";
function checkFailureDataSource() {
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
      checkedFlag: 0,
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
      fieldCode: "validateStatusCode",
      fieldType: "SELECT",
      fieldName: $T("sfin.invoiceBill.model.invoiceBill.CheckStatus").$D("查验状态"),
      options: {
        displayField: "meaning",
        valueField: "value",
        listData: [ {
          meaning: $T("hipspfm.invoiceInspection.view.message.waiting.check").$D("待查验"),
          value: "UNCHECK",
        }, {
          meaning: $T("hipspfm.invoiceInspection.view.message.checkFailed").$D("查验失败"),
          value: "CHECK_FAILED",
        }, ],
      },
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
  checkFailureDataSource,
};
