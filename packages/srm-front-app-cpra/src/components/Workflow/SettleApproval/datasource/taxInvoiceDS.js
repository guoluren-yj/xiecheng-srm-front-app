import { SrmUtil, $T } from "srm-mobile-ui";

function taxInvoiceDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode:
        "SSTA.PURCHASE_SETTLE_DETAIL.TAX_INVOICE_ADD,SSTA.PURCHASE_SETTLE_DETAIL.TAXINVOICE,SSTA.PURCHASE_SETTLE_DETAIL.TAX_INVOICE_EDIT",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      //基本信息
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNums").$D(
          "行号"
        ),
      },
      {
        fieldCode: "invoiceCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.supplySettle.invoiceCode").$D(
          "发票代码"
        ),
      },
      {
        fieldCode: "invoiceNumber",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.supplySettle.invoiceNumber"
        ).$D("发票号码"),
      },
      {
        fieldCode: "invoicingDate",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.invoicingDate"
        ).$D("开票日期"),
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.netAmount"
        ).$D("不含税金额"),
      },
      {
        fieldCode: "taxAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.taxAmount"
        ).$D("税额"),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.taxIncludedAmount"
        ).$D("含税金额"),
      },
      {
        fieldCode: "invoiceSpeciesMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceSpecies"
        ).$D("发票种类"),
      },
      {
        fieldCode: "deductFlag",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.deductFlag"
        ).$D("是否抵扣"),
      },
      {
        fieldCode: "checkCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.checkCodeMeaning"
        ).$D("校验码"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.supplierCompanyName"
        ).$D("销方名称"),
      },
      {
        fieldCode: "supUnifiedSocialCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.supUnifiedSocialCode"
        ).$D("销方纳税人识别号"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.companyName"
        ).$D("购方名称"),
      },
      {
        fieldCode: "purUnifiedSocialCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.purUnifiedSocialCode"
        ).$D("购方纳税人识别号"),
      },
      {
        fieldCode: "validateStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.validateStatus"
        ).$D("查验状态"),
      },
      {
        fieldCode: "validateMessage",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.validateMessage"
        ).$D("查验状态说明"),
      },
      {
        fieldCode: "taxInvoiceStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.taxInvoiceStatus"
        ).$D("发票状态"),
      },
      {
        fieldCode: "invoiceUrl",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceUrl"
        ).$D("电子发票地址"),
      },
      {
        fieldCode: "ocrFileUrl",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.ocrFile"
        ).$D("OCR文件"),
      },
    ],
    events: {
      afterQuery: (ds, data) => {
        data &&
          data.length &&
          data.forEach(
            (e) =>
              e.invoicingDate &&
              (e.invoicingDate = e.invoicingDate.substring(0, 10))
          );
      },
    },
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/tax-invoice-headers/{settleHeaderId}",
        method: "get",
      },
    },
  };
}

export default taxInvoiceDS;
