import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, item) => val && item.amountPrecision;

function multiplePaymentInfoDS(paymentDimension = {}) {
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: true,
    showTotalCount: false,
    queryParameter: {
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "paymentDimension",
      fieldType: "LOV",
      defaultValue: paymentDimension,
      disabled: true,
    },
    fields: [
      //结算数据规则
      {
        fieldCode: "documentNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentNum").$D("单据编号"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "invoicedTaxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmounts").$D("已开票含税金额"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "remainingPaymentAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: $T("ssta.purchaseSettle.purchaseSettle.remainingPaymentAmount").$D("剩余可付金额"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "paymentAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentAmount").$D("本次付款金额"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "applyAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: $T("ssta.purchaseSettle.view.message.model.supplySettle.applyAmount").$D("本次核销金额"),
        render: (val) => val || "-",
      },
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-lines/mutil-payment/{settleHeaderId}",
        method: "get",
      },
    },
  };
}

export default multiplePaymentInfoDS;
