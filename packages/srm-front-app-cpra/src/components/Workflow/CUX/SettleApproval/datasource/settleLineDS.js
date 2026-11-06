import { SrmUtil, $T } from "srm-mobile-ui";

const amountPrecision = (val, item) => val && item.amountPrecision;

const pricePrecision = () => null;

const headUnitCodes = {
  INVOICE: [
    "SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTIONDETAIL",
    "SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTION_DETAIL_SEARCH",
    "SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO",
  ],
  PAYMENT: [
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_TRANSACTIONDETAIL",
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_TRANSACTION_DETAIL_SEARCH",
    "SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO_PAY",
  ],
};

function settleLineDS(documentType) {
  const code = documentType === "INVOICE" ? headUnitCodes["INVOICE"] : headUnitCodes["PAYMENT"];
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: code.join(),
      customizeFilterComparison: "settleNum:LIKE,poNum:LIKE,sourceCompanyNum:IN,purOrganizationId:IN,sourceSupplierCompanyNum:IN,lineNum:LIKE,settleConfigNum:IN,invOrganizationId:IN",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      //基本信息
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
      },
      {
        fieldCode: "settleNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号"),
      },
      {
        fieldCode: "sourceSettleNumAndLineNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNumAndLineNum").$D("结算事务来源编号｜行号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.itemCode").$D("结算商品编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.itemName").$D("结算商品名称"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.common.quantity").$D("本次开票数量"),
      },
      {
        fieldCode: "netPrice",
        fieldType: "INPUT_NUMBER",
        editor: false,
        precision: pricePrecision,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netPrice").$D("本次开票不含税单价"),
      },
      {
        fieldCode: "unitPriceBatch",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.unitPriceBatch").$D("每"),
      },
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netAmounts").$D("本次开票不含税金额"),
      },
      {
        fieldCode: "taxCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.taxCode").$D("税码"),
      },
      {
        fieldCode: "taxRate",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.taxRate").$D("税率"),
      },
      {
        fieldCode: "taxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.taxAmount").$D("税额"),
      },
      {
        fieldCode: "taxIncludedPrice",
        fieldType: "INPUT_NUMBER",
        precision: pricePrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.taxIncludedPrice").$D("本次开票含税单价"),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.taxIncludedAmount").$D("本次开票含税金额"),
      },
      {
        fieldCode: "settleMatchDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleMatchDimension").$D("结算匹配维度"),
      },
      {
        fieldCode: "settleBasePriceMeaning",
        fieldType: "INPUT_NUMBER",
        precision: pricePrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleBasePrice").$D("结算基准价"),
      },
      {
        fieldCode: "enableQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.enableQuantity").$D("可开票数量"),
      },
      {
        fieldCode: "orignPrice",
        fieldType: "INPUT_NUMBER",
        precision: pricePrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.orignPrice").$D("原开票单价"),
      },
      {
        fieldCode: "enableAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.enableAmount").$D("可开票金额"),
      },
      {
        fieldCode: "invoicedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.invoicedAmount").$D("已开票含税金额"),
      },
      {
        fieldCode: "paidAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D("已付款金额"),
      },
      {
        fieldCode: "remainingPaymentAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.remainingPaymentAmount").$D("剩余付款金额"),
      },
      {
        fieldCode: "adjustNetAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.adjustNetAmount").$D("尾差不含税调整金额"),
      },
      {
        fieldCode: "adjustTaxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.adjustTaxAmount").$D("尾差税额调整金额"),
      },
      {
        fieldCode: "paymentAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentAmount").$D("本次付款金额"),
      },
      {
        fieldCode: "applyAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.common.prepaymentVerificationAmount").$D("本次预付款核销金额"),
      },
      {
        fieldCode: "sourceSettleHeaderNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleHeaderNum").$D("开票结算单号"),
      },
      {
        fieldCode: "uom",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.uom").$D("单位"),
      },
    ],
    queryFields: [
      {
        fieldCode: "settleNum",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "settleConfigNum_range",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum").$D("结算策略编码"),
        fieldType: "LOV",
        lovCode: "SSTA.SETTLE_CONFIG",
        options: {
          multiple: true,
        }
      },
      {
        fieldCode: "poNum",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.poNum").$D("订单编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sourceCompanyNum_range",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceCompanyNum").$D("数据源公司编码"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          multiple: true,
          subDisplayField: "companyNum",
          valueField: "companyNum",
        }
      },
      {
        fieldCode: "sourceSupplierCompanyNum_range",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.sourceSupplierCompanyNum").$D("数据源供应商编码"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.SUPPLIER_CODE",
        options: {
          multiple: true,
          valueField: "supplierCompanyCode",
        }
      },
      {
        fieldCode: "lineNum",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "invOrganizationId_range",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invOrganizationId").$D("库存组织"),
        fieldType: "LOV",
        lovCode: "HPFM.INV_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
        }
      },
      {
        fieldCode: "purOrganizationId_range",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.purOrganizationId").$D("采购组织"),
        fieldType: "LOV",
        lovCode: "HPFM.PURCHASE_ORGANIZATION",
        options: {
          multiple: true,
          subDisplayField: "organizationCode",
        }
      },
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-lines/{settleHeaderId}",
        method: "get",
      },
    },
  };
}

export default settleLineDS;
