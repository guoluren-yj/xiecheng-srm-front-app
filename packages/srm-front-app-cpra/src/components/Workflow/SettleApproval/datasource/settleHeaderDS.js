import { SrmUtil, $T } from "srm-mobile-ui";

const renderYesNo = (val) =>
  val ?
    $T("smbl.common.view.yes").$D("是") :
    $T("smbl.common.view.no").$D("否");

const amountPrecision = (val, item) => val && item.amountPrecision;

//const pricePrecision = (val, item)=> val && item.pricePrecision;
export const headUnitCodes = {
  INVOICE: [
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_BASE", // 开票单-基本信息
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_PAY_INFO", // 开票单-付款信息
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_DIR_BILL_INFO", // 开票单-直连开票信息
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_OTHER", // 开票单-其他信息'
    "SSTA.PURCHASE_SETTLE_DETAIL.OTHER_WORKFLOW", // 开票单-工作流预留'
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_CONFIRM", // 开票单-确认弹窗
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_RETURN", // 开票单-退回弹窗
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_CANCEL", // 开票单-取消研创
    "SSTA.PURCHASE_SETTLE_DETAIL.INV_SYNC", // 开票单-同步弹窗
    "SSTA.PURCHASE_SETTLE_DETAIL_MAIN_INFO.TOP", // 开票单主策略信息-上半部分
    "SSTA.PURCHASE_SETTLE_DETAIL_MAIN_INFO.BOTTOM", // 开票单主策略信息-下半部分
    "SSTA.PURCHASE_SETTLE_DETAIL.ENCLOSURE", // 开票单-附件
  ],
  PAYMENT: [
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_BASE", // 付款单-基本信息
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_PAY_INFO", // 付款单-付款信息
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_OTHER", // 付款单-其他信息
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_CONFIRM", // 付款单-确认弹窗
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_RETURN", // 付款单-退回研创
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_CANCEL", // 付款单-取消弹窗
    "SSTA.PURCHASE_SETTLE_DETAIL_MAIN_INFO.PAY_TOP", // 付款单主策略信息-上半部分
    "SSTA.PURCHASE_SETTLE_DETAIL_MAIN_INFO.PAY_BOTTOM", // 付款单主策略信息-下半部分
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_OTHER_ENCLOSURE", // 付款单-附件
  ],
};

function settleHeaderDS(documentType) {
  return {
    autoQuery: false,
    selection: Infinity,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      //基本信息
      {
        fieldCode: "settleNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D(
          "结算单编号"
        ),
      },
      {
        fieldCode: "settleStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.settleStatus"
        ).$D("结算单状态"),
      },
      {
        fieldCode: "documentTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.documentType"
        ).$D("结算单类型"),
      },
      {
        fieldCode: "taxRate",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.taxRate").$D(
          "汇率"
        ),
      },
      {
        fieldCode: "termCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.termCode").$D(
          "付款条件"
        ),
      },
      {
        fieldCode: "createdUserName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.createdUserName"
        ).$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.creationDate"
        ).$D("创建日期"),
      },
      {
        fieldCode: "campMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.camp").$D(
          "创建方阵营"
        ),
      },
      //交易方信息
      {
        fieldCode: "currencyCode",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.currencyCode"
        ).$D("币种"),
      },
      {
        fieldCode: "companyNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.companyNum").$D(
          "结算公司编号"
        ),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.companyNames"
        ).$D("结算公司名称"),
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.supplierCompanyNum"
        ).$D("结算供应商编号"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.supplierCompanyNames"
        ).$D("结算供应商名称"),
      },
      {
        fieldCode: "sourceSupplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.sourceSupplierName"
        ).$D("数据源平台供应商名称"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.ouName").$D(
          "业务实体"
        ),
      },
      //汇总信息
      {
        fieldCode: "settleNetAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.settleNetAmount"
        ).$D("结算不含税总金额"),
        render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
      },
      {
        fieldCode: "settleTaxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.settleTaxAmount"
        ).$D("结算总税额"),
      },
      {
        fieldCode: "settleTaxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.settleTaxIncludedAmount"
        ).$D("结算含税总金额"),
      },
      {
        fieldCode: "invoicedNetAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoicedNetAmount"
        ).$D("已开票不含税总金额"),
      },
      {
        fieldCode: "invoicedTaxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoicedTaxAmount"
        ).$D("已开票税额"),
      },
      {
        fieldCode: "invoicedTaxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmounts"
        ).$D("已开票含税金额"),
      },
      {
        fieldCode: "paidAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paidAmount").$D(
          "已付款金额"
        ),
      },
      {
        fieldCode: "remainingPaymentAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.remainingPaymentAmount"
        ).$D("剩余付款金额"),
      },
      //付款信息
      {
        fieldCode: "paymentAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentAmount"
        ).$D("付款总金额"),
      },
      {
        fieldCode: "paymentSpliteRuleMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentSpliteRule"
        ).$D("付款自动拆分规则"),
      },
      {
        fieldCode: "bankName",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankName").$D(
          "收款银行"
        ),
      },
      {
        fieldCode: "bankBranchName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.bankBranchName"
        ).$D("收款开户行"),
      },
      {
        fieldCode: "bankAccountName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.bankAccountName"
        ).$D("银行账户名称"),
      },
      {
        fieldCode: "paymentTypeName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentTypeName"
        ).$D("付款方式"),
      },
      {
        fieldCode: "paymentTermName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentTermName"
        ).$D("付款条件"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.bankAccountNum"
        ).$D("收款银行账号"),
      },
      {
        fieldCode: "expectPaymentDate",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.expectPaymentDate"
        ).$D("期望付款日期"),
        render: (val) => val && val.substring(0, 10) || "-",
      },
      {
        fieldCode: "paymentDiscountAmount",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentDiscountAmount"
        ).$D("付款折扣金额"),
        render: (val) => val || "-",
      },
      //预付款核销信息
      {
        fieldCode: "applyAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.applyAmount"
        ).$D("预付款核销总金额"),
      },
      {
        fieldCode: "prepaymentSpliteRuleMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentSpliteRule"
        ).$D("预付款拆分规则"),
      },
      //开票信息（系统）
      {
        fieldCode: "netAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netAmount").$D(
          "开票不含税总金额"
        ),
        render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
      },
      {
        fieldCode: "taxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.taxAmount").$D(
          "开票总税额"
        ),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.taxIncludedAmount"
        ).$D("开票含税总金额"),
      },
      //发票匹配信息
      {
        fieldCode: "invoiceNetAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceNetAmount"
        ).$D("发票不含税总金额"),
      },
      {
        fieldCode: "invoiceTaxAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceTaxAmount"
        ).$D("发票总税额"),
      },
      {
        fieldCode: "invoiceTaxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceTaxIncludedAmount"
        ).$D("发票含税总金额"),
      },
      {
        fieldCode: "invoiceDifferenceAmount",
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceDifferenceAmount2"
        ).$D("发票尾差值"),
      },
      {
        fieldCode: "invoiceSpliteRule",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceSpliteRule"
        ).$D("发票自动拆分规则"),
      },
      //主策略信息
      {
        fieldCode: "settleConfigNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyNum"
        ).$D("主结算策略编码"),
      },
      {
        fieldCode: "settleConfigName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.settleConfigName"
        ).$D("主结算策略名称"),
      },
      {
        fieldCode: "configVersionNumber",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.configVersionNumber"
        ).$D("主结算策略版本号"),
      },
      {
        fieldCode: "confirmCollaborativeModeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeModeMeaning"
        ).$D("协同模式-确认"),
      },
      {
        fieldCode: "confirmApproveMethodMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.confirmApproveMethodMeaning"
        ).$D("审批方式-确认"),
      },
      {
        fieldCode: "invoiceMatchMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.invoiceMatch"
        ).$D("发票匹配规则"),
      },
      {
        fieldCode: "cancelCollaborativeModeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.cancelCollaborativeModeMeaning"
        ).$D("协同模式-取消"),
      },
      {
        fieldCode: "cancelApproveMethodMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.cancelApproveMethodMeaning"
        ).$D("审批方式-取消"),
      },
      {
        fieldCode: "invoiceToleranceRangeLower",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.taxIncludedAmountTol"
        ).$D("含税金额允差范围"),
        render: (val, item) =>
          (val || val === 0 || null) &&
          `${val}~${item.invoiceToleranceRangeUpper}`,
      },
      {
        fieldCode: "taxAmountTolLower",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.taxAmountTol"
        ).$D("税额允差范围"),
        render: (val, item) =>
          (val || val === 0 || null) && `${val}~${item.taxAmountTolUpper}`,
      },
      {
        fieldCode: "amountValidateLevelMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.validateLevel"
        ).$D("尾差校验等级"),
      },
      {
        fieldCode: "amountValidateAction",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.validateAction"
        ).$D("尾差校验节点"),
      },
      {
        fieldCode: "amountAdjustFlag",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.amountAdjustFlag"
        ).$D("尾差自动调整"),
        render: renderYesNo,
      },
      {
        fieldCode: "amountAdjustTolLower",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.autoTaxIncludedAmountTol"
        ).$D("自动调整含税金额允差范围"),
        render: (val, item) =>
          (val || val === 0 || null) && `${val}~${item.amountAdjustTolUpper}`,
      },
      {
        fieldCode: "taxAmountAdjustTolLower",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.autoTaxAmountTol"
        ).$D("自动调整税额允差范围"),
        render: (val, item) =>
          (val || val === 0 || null) &&
          `${val}~${item.taxAmountAdjustTolUpper}`,
      },
      {
        fieldCode: "amountAdjustModeMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.adjustMode").$D(
          "尾差分摊模式"
        ),
      },
      {
        fieldCode: "amountAdjustRuleMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.adjustRule").$D(
          "尾差分摊规则"
        ),
      },
      {
        fieldCode: "defaultPaymentDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.defaultPaymentDimensionMeaning"
        ).$D("付款维度【默认】"),
      },
      {
        fieldCode: "defaultPaymentSpliteRuleMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.defaultPaymentSpliteRule"
        ).$D("付款自动拆分规则【默认】"),
      },
      {
        fieldCode: "defaultPrepaymentSpliteRuleMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.defaultPrepaymentSpliteRule"
        ).$D("预付款核销自动拆分规则【默认】"),
      },
      {
        fieldCode: "lineLimitQuantity",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.lineLimitQuantity"
        ).$D("结算单行数限制"),
        render: (val) =>
          val ||
          $T("ssta.purchaseSettle.model.purchaseSettle.noLimit").$D("无限制"),
      },
      {
        fieldCode: "prepaymentDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentDimensionMeaning"
        ).$D("预付款核销维度"),
      },
      {
        fieldCode: "prepaymentCheckLevel",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentCheckLevel"
        ).$D("预付款核销校验等级"),
      },
      {
        fieldCode: "prepaymentCheckPoint",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentCheckPoint"
        ).$D("预付款核销校验节点"),
      },
      {
        fieldCode: "initSettleConfigNum",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.initSettleConfigNum"
        ).$D("初始策略编码"),
      },
      {
        fieldCode: "initConfigVersionNumber",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.initConfigVersionNumber"
        ).$D("初始策略版本号"),
      },
      //其他信息
      {
        fieldCode: "sourceSettleNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum").$D("结算事务来源编号"),
      },
      {
        fieldCode: "purOrganizationName",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.purOrganizationId"
        ).$D("采购组织"),
      },
      {
        fieldCode: "accountingDate",
        fieldType: "DATE_PICKER",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.accountingDate"
        ).$D("记账日期"),
      },
      {
        fieldCode: "paymentCondition",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.paymentCondition"
        ).$D("付款条件"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.remark").$D(
          "备注"
        ),
      },
      {
        fieldCode: "canceledReason",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.canceledReason"
        ).$D("取消原因"),
      },
      {
        fieldCode: "approvedRemark",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.approvedRemark"
        ).$D("审批意见-确认"),
      },
      //附件
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.attachmentUuid"
        ).$D("附件"),
      },
    ],
    events: {
      afterQuery: (ds, data) => {
        data &&
          data.length &&
          data.forEach(
            (e) =>
              e.creationDate &&
              (e.creationDate = e.creationDate.substring(0, 10))
          );
      },
    },
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-headers",
        method: "get",
        params: {
          customizeUnitCode: headUnitCodes[documentType].join(),
        }
      },
      update: {
        url: "/ssta/v1/{tenantId}/settle-headers/purchaser/update",
        method: "put",
        params: {
          customizeUnitCode: [
            ...headUnitCodes[documentType],
            "SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTIONDETAIL",
            "SSTA.PURCHASE_SETTLE_DETAIL.PAY_TRANSACTIONDETAIL"
          ].join(),
        }
      },
    },
  };
}

export default settleHeaderDS;
