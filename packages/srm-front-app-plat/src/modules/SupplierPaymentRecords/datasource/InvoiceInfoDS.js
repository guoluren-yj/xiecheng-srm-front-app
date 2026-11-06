// 续费时开票信息填写
import { $T } from "srm-mobile-ui";

function invoiceInfoDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    fields: [
      {
        fieldCode: "invoiceTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("spfm.supplierInvoic.model.invoiceTypeStr").$D(
          "发票类型"
        ),
      },
      {
        fieldCode: "invoiceCode",
        fieldType: "TEXT",
        fieldName: $T("spfm.supplierInvoic.model.invoiceCode").$D("发票代码"),
      },
      {
        fieldCode: "invoiceNo",
        fieldType: "TEXT",
        fieldName: $T("spfm.supplierInvoic.model.invoiceNumber").$D("发票号码"),
      },
      {
        fieldCode: "feeNoTax",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.excludingTaxAmount").$D(
          "不含税金额"
        ),
      },
      {
        fieldCode: "taxRateMeaning",
        fieldType: "TEXT",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.taxRate").$D("税率"),
      },
      {
        fieldCode: "taxFee",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.taxAmount").$D("税额"),
      },
      {
        fieldCode: "feeIncludeTax",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.totalAmount").$D("价税合计"),
      },
      {
        fieldCode: "ticketFlag",
        fieldType: "TEXT",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.ticketFlag").$D("是否出票"),
      },
      {
        fieldCode: "expressCompanyMeaning",
        fieldType: "TEXT",
        fieldName: $T("spfm.supplierInvoic.model.courierCompany").$D(
          "快递公司"
        ),
      },
      {
        fieldCode: "expressNum",
        fieldType: "TEXT",
        fieldName: $T("spfm.supplierInvoic.model.trackingNumber").$D(
          "快递单号"
        ),
      },
      {
        fieldCode: "handleUserName",
        fieldType: "TEXT",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.handler").$D("处理人"),
      },
      {
        fieldCode: "submitDate",
        fieldType: "TEXT",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.handleTime").$D("处理时间"),
      },
      {
        fieldCode: "invoiceDate",
        fieldType: "TEXT",
        editor: false,
        fieldName: $T("spfm.supplierInvoic.model.invoicingDate").$D("开票日期"),
      },
      // {
      //   fieldCode: "attachField",
      //   editor: false,
      //   fieldType: "TEXT",
      //   fieldName: $T("spfm.supplierInvoic.view.model.attachmentFile").$D("附件信息"),
      // },
    ],
  };
}

export default invoiceInfoDS;