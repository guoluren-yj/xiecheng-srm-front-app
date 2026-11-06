import { SrmUtil, $T } from "srm-mobile-ui";

const renderYesNo = (val) => val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");

function settleLineDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSTA.PURCHASE_POOL_DETAIL.TRADINGPARTY",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      //结算数据规则
      {
        fieldCode: "settleConfigNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum").$D("结算策略编码"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "settleConfigName",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleConfigName").$D("结算策略名称"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "settleBasePriceMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleBasePrice").$D("结算基准价"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "settleModeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMode").$D("结算模式"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "settleMatchDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMatchDimension").$D("结算匹配维度"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "versionNumber",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.versionNumber").$D("版本号"),
        render: (val) => val || "-",
      },
      //结算单规则
      {
        fieldCode: "invoiceSettleCompanyCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceSettleCompanyCodeMeaning").$D("开票结算公司"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "paymentSettleCompanyCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.paymentSettleCompanyCodeMeaning").$D("付款结算公司"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "invoiceSettleSupplierCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceSettleSupplierCodeMeaning").$D("开票供应商"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "paymentSettleSupplierCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.paymentSettleSupplierCodeMeaning").$D("付款供应商"),
        render: (val) => val || "-",
      },
      {
        fieldCode: "invoicePartMatchFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoicePartMatchFlag").$D("部分匹配-开票"),
        render: renderYesNo,
      },
      {
        fieldCode: "paymentPartMatchFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.paymentPartMatchFlag").$D("部分匹配-付款"),
        render: renderYesNo,
      },
      {
        fieldCode: "invoicePriceEditFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoicePriceEditFlag").$D("单价调整"),
        render: renderYesNo,
      },
      {
        fieldCode: "invoiceTaxRateEditFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxRateEditFlag").$D("税率调整"),
        render: renderYesNo,
      },
      {
        fieldCode: "invoiceTaxAmountEditFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxAmountEditFlag").$D("税额调整"),
        render: renderYesNo,
      },
      {
        fieldCode: "taxAllowanceAmountLower",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxAllowanceAmount").$D("税额允差"),
        render: (val, item) => `${val}~${item.taxAllowanceAmountUpper}`
      },
      {
        fieldCode: "invoiceDependencyFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceDependencyFlag").$D("是否依赖-开票"),
        render: renderYesNo,
      },
      {
        fieldCode: "paymentDependencyFlag",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.paymentDependencyFlag").$D("是否依赖-付款"),
        render: renderYesNo,
      },
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-config/release-config/{settleConfigNum}",
        method: "get",
      },
    },
  };
}

export default settleLineDS;
