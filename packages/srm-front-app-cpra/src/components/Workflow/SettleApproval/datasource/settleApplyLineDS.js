import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, item) => val && item.amountPrecision;

function settleLineDS(purchaserFlag) {
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT.PEYPAYMENT.BOX",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "prepaymentTitle",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentTitle").$D("预付款结算单号｜行号"),
      },
      {
        fieldCode: "prepaymentRemainingAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentRemainingAmount").$D("预付款剩余核销金额"),
      },
      {
        fieldCode: "applyAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: purchaserFlag ?
          $T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D("预付款核销总金额") :
          $T("ssta.purchaseSettle.view.message.model.purchaseSettle.applyAmount").$D("本次核销金额"),
      },
      {
        fieldCode: "prepaymentAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: amountPrecision,
        fieldName: purchaserFlag ?
          $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount").$D("预付款总金额") :
          $T("ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentAmount").$D("预付款金额"),
      },
      {
        fieldCode: "prepaymentTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentType").$D("预付款类型"),
      },
      {
        fieldCode: "associateNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNums").$D("关联单据编号"),
      },
      {
        fieldCode: "prepaymentCreatedBy",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentCreatedBy").$D("预付款申请人"),
      },
      {
        fieldCode: "prepaymentCreationDate",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentCreationDate").$D("预付款创建时间"),
        render: (val) => val && val.substring(0, 10)
      },
    ],
    transport: {
      read: {
        url: purchaserFlag ? "/ssta/v1/{tenantId}/settle-lines/mutil-payment-apply/purchaser" : "/ssta/v1/{tenantId}/settle-apply-lines/{settleHeaderLineId}",
        method: "get",
      },
    },
  };
}

export default settleLineDS;
