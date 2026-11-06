// 续费时开票信息填写
import { $T, SrmUtil } from "srm-mobile-ui";

function renewMakeInvoiceDS(autoQuery = false, supplierTicketId = null, invoiceTypeList = []) {
  return {
    autoQuery: autoQuery,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    data: [],
    queryParameter: {
      supplierTicketId,
    },
    fields: [ {
      fieldCode: "invoiceType",
      displayField: "invoiceType",
      fieldType: "SELECT",
      options: {
        listData: invoiceTypeList,
        valueField: "value",
        displayField: "meaning",
      },
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.invoiceType").$D("发票种类"),
    }, {
      fieldCode: "invoiceTitle",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.invoiceTitle").$D("发票抬头"),
    }, {
      fieldCode: "taxNo",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.taxRegistNumber").$D("税务登记号"),
    }, {
      fieldCode: "bankName",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.accountBank").$D("开户行"),
    }, {
      fieldCode: "bankAccount",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.bankAccountNumber").$D("开户行账号"),
    }, {
      fieldCode: "taxAddress",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.taxRegisAddress").$D("税务登记地址"),
    }, {
      fieldCode: "taxPhone",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.taxRegisPhone").$D("税务登记电话"),
    }, {
      fieldCode: "invoicePerson",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.recipient").$D("收票人"),
    }, {
      fieldCode: "invoiceEmaill",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.recipientEmail").$D("收票人邮箱"),
    }, {
      fieldCode: "invoicePhone",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.recipientPhone").$D("收票人手机号"),
    }, {
      fieldCode: "invoiceAddress",
      fieldType: "INPUT",
      required: (val, item) => item.editorFlag,
      editor: (val, item) => item.editorFlag,
      fieldName: $T("spfm.supplierInvoic.model.recipientAddress").$D("收票人地址"),
    }, ],
    transport: {
      read: {
        url: `/spfm/v1/${SrmUtil.getTenantId()}/supplier-payment/ticket-detail`,
        method: "get",
      },
    },
  };
}

export default renewMakeInvoiceDS;