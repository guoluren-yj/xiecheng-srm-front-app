import { SrmUtil, $T } from "srm-mobile-ui";
import { yesOrNoRender } from "@/utils";
import { transformSearchBarData } from "./utils";
const tenantId = SrmUtil.getTenantId();

const amountPrecision = (val, record) => val && record.amountPrecision;
const pricePrecision = (val, record) => val && record.pricePrecision;
const renderAmount = (val, item) =>
  val && SrmUtil.getNumberLocalized(val, item.amountPrecision);
const renderPrice = (val) => val || "-";
const renderYesNo = (val) =>
  val
    ? $T("smbl.common.view.yes").$D("是")
    : $T("smbl.common.view.no").$D("否");

// 头关联个性化单元字段
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
// 行关联个性化单元字段
export const lineUnitCodes = {
  INVOICE: [
    "SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTIONDETAIL", // 开票单行-列表
    "SSTA.PURCHASE_SETTLE_DETAIL.TRANSACTION_DETAIL_SEARCH", // 开票单行-筛选器
  ],
  PAYMENT: [
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_TRANSACTIONDETAIL", // 付款单行-列表
    "SSTA.PURCHASE_SETTLE_DETAIL.PAY_TRANSACTION_DETAIL_SEARCH", // 付款单行-筛选器
  ],
};

export const taxInvGirdCode = "SSTA.PURCHASE_SETTLE_DETAIL.TAXINVOICE"; // 税务发票列表

export const writeOffAddUnitCodes = [
  "SSTA.PURCHASE_SETTLE_DETAIL.SEARCH_PRE_OFF_ADD", // 预付款核销新增-筛选器
  "SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT.PEYPAYMENT.BOX.ADD.LIST", // 预付款核销新增-列表
];

export const settleHeaderDS = (settleHeaderId, documentType) => ({
  autoQuery: false,
  queryParameter: {
    settleHeaderId,
    customizeUnitCode: headUnitCodes[documentType].join(),
  },
  fields: [
    // 基本信息
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D(
        "结算单编号"
      ),
    },
    {
      fieldCode: "settleTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning"
      ).$D("结算单类型"),
    },
    {
      fieldCode: "campMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.camp").$D(
        "创建方阵营"
      ),
    },
    {
      fieldCode: "settleStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleStatus").$D(
        "结算单状态"
      ),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D(
        "创建日期"
      ),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "createdUserName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.createdUserName"
      ).$D("创建人"),
    },
    {
      fieldCode: "purInvoiceHeader",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.purInvoiceHeader"
      ).$D("采购方发票抬头"),
    },
    {
      fieldCode: "purTaxRegistrationNumber",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.purTaxRegistrationNumber"
      ).$D("采购方税务登记号"),
    },
    // 交易方信息
    {
      fieldCode: "companyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum"
      ).$D("结算公司编号"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleCompanyName"
      ).$D("结算公司名称"),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D(
        "币种"
      ),
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleSupplierNum"
      ).$D("结算供应商编码"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleSupplierName"
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
      fieldCode: "sourceSupplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.sourceSupplierCompanyNum"
      ).$D("数据源平台供应商编码"),
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.ouName").$D(
        "业务实体"
      ),
    },
    {
      fieldCode: "unitName",
      fieldType: "TEXT",
      fieldName: $T("ssta.common.model.common.unitName").$D("部门名称"),
    },
    {
      fieldCode: "settleNetAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleNetAmount"
      ).$D("结算不含税总金额"),
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
    // 开票信息-系统
    {
      fieldCode: "netAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.netInvoiceApplyAmount"
      ).$D("发票申请金额（不含税）"),
    },
    {
      fieldCode: "taxAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceApplyTaxAmount"
      ).$D("发票申请税额"),
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.includedInvoiceApplyAmount"
      ).$D("发票申请金额（含税）"),
    },
    // 发票匹配信息
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
        "ssta.purchaseSettle.model.purchaseSettle.InvoiceTaxIncludedAmount"
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
      fieldCode: "invoiceSpliteRuleMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceSpliteRule"
      ).$D("发票自动拆分规则"),
    },
    {
      fieldCode: "applyAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.common.model.common.prePayWriteOffAmountThisTime").$D(
        "本次预付款核销金额"
      ),
    },
    {
      fieldCode: "prepaymentSpliteRuleMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentSpliteRule"
      ).$D("预付款拆分规则"),
    },
    /**
     * 付款信息
     */
    {
      fieldCode: "paymentAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.common.model.common.actualPaymentAmountThisTime").$D(
        "本次实际付款金额"
      ),
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
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankId").$D(
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
      fieldCode: "bankAccountNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.purchaseSettle.bankAccountNum").$D(
        "收款银行帐号"
      ),
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.colBankAccountName"
      ).$D("收款银行账户名称"),
      fieldType: "TEXT",
      fieldCode: "bankAccountName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.paymentMethod"
      ).$D("付款方式"),
      fieldType: "TEXT",
      fieldCode: "paymentTypeName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.paymentCondition"
      ).$D("付款条件"),
      fieldType: "TEXT",
      fieldCode: "paymentTermName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.paymentDiscountAmount"
      ).$D("付款折扣金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "paymentDiscountAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.expectPaymentDate"
      ).$D("期望付款日期"),
      fieldType: "DATE_PICKER",
      fieldCode: "expectPaymentDate",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    /**
     * 主策略信息
     */
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
        "ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyName"
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
      fieldCode: "invoiceMatchMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invoiceMatch").$D(
        "发票匹配规则"
      ),
    },
    {
      fieldCode: "confirmApproveMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.confirmApproveMethodMeaning"
      ).$D("审批方式-确认"),
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
      fieldCode: "invoiceToleranceRangeLimit",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.taxIncludedAmountTol"
      ).$D("含税金额允差范围"),
      render: (_, record) =>
        `${record.invoiceToleranceRangeUpper || 0} ~ ${
          record.invoiceToleranceRangeUpper || 0
        }`,
    },
    {
      fieldCode: "taxAmountTolLimit",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle..taxAmountTol"
      ).$D("税额允差范围"),
      render: (_, record) =>
        `${record.taxAmountTolLower || 0} ~ ${record.taxAmountTolUpper || 0}`,
    },
    {
      fieldCode: "amountValidateLevelMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle..validateLevel"
      ).$D("尾差校验等级"),
    },
    {
      fieldCode: "amountValidateActionMeaning",
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
      render: yesOrNoRender,
    },
    {
      fieldCode: "amountAdjustTolLimit",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.autoTaxIncludedAmountTol"
      ).$D("自动调整含税金额允差范围"),
      render: (_, record) =>
        `${record.amountAdjustTolLower || 0}~${
          record.amountAdjustTolUpper || 0
        }`,
    },
    {
      fieldCode: "taxAmountAdjustTolLimit",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.autoTaxAmountTol"
      ).$D("自动调整税额允差范围"),
      render: (_, record) =>
        `${record.taxAmountAdjustTolLower || 0}~${
          record.taxAmountAdjustTolUpper || 0
        }`,
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
      fieldCode: "auto",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.auto").$D(
        "自动出单"
      ),
    },
    {
      fieldCode: "lineLimitQuantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.lineLimitQuantity"
      ).$D("结算单行数限制"),
    },
    {
      fieldCode: "invoicePayEnableFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoicePayEnableFlag"
      ).$D("启用开票并付款"),
      render: yesOrNoRender,
    },
    {
      fieldCode: "prepaymentDimensionMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentDimension"
      ).$D("预付款核销维度"),
    },
    {
      fieldCode: "prepaymentCheckLevelMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentCheckLevel"
      ).$D("预付款核销校验等级"),
    },
    {
      fieldCode: "prepaymentCheckPointMeaning",
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
    {
      fieldCode: "invoiceUxFlag",
      fieldType: "TEXT",
      fieldName: $T("ssta.common.model.common.invoiceUxTitleShow").$D(
        "发票UX标题显示"
      ),
      render: yesOrNoRender,
    },
    {
      fieldCode: "paymentUxFlag",
      fieldType: "TEXT",
      fieldName: $T("ssta.common.model.common.paymentUxTitleShow").$D(
        "付款UX标题显示"
      ),
      render: yesOrNoRender,
    },
    {
      fieldCode: "invoicePaymentUxFlag",
      fieldType: "TEXT",
      fieldName: $T("ssta.common.model.common.paymentUxTitleShow").$D(
        "付款UX标题显示"
      ),
      render: yesOrNoRender,
    },
    /**
     * 直连开票信息
     */
    {
      fieldCode: "directInvoicingTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.directInvoicingTypeMeaning"
      ).$D("直连开票类型"),
    },
    {
      fieldCode: "invoiceTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceTypeMeaning"
      ).$D("开票类型"),
    },
    {
      fieldCode: "invoiceMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceMethod"
      ).$D("开票方式"),
    },
    {
      fieldCode: "taxRegistrationNumber",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.taxRegistrationNumber"
      ).$D("购方税号"),
    },
    {
      fieldCode: "supplierTaxRegistrationNumber",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.supplierTaxRegistrationNumber"
      ).$D("销方税号"),
    },
    {
      fieldCode: "regionName",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.regionName").$D(
        "收单地区"
      ),
      fieldType: "TEXT",
    },
    {
      fieldCode: "contactName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.contactName").$D(
        "联系人"
      ),
    },
    {
      fieldCode: "address",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.address").$D(
        "详细地址"
      ),
    },
    {
      fieldCode: "mobile",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.mobile").$D(
        "手机号"
      ),
    },
    {
      fieldCode: "invoiceContent",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceContent"
      ).$D("开票内容"),
    },
    {
      fieldCode: "invoiceContentDetail",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceContentDetail"
      ).$D("开票内容详情"),
    },
    {
      fieldCode: "invoiceFailMsg",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoiceFailMsg"
      ).$D("直连开票失败原因"),
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
    {
      fieldCode: "canceledRemark",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.canceledRemark"
      ).$D("审批意见-取消"),
    },
    {
      fieldCode: "accountingDate",
      fieldType: "DATE_PICKER",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.accountingDate"
      ).$D("记账日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "termCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.termCode").$D(
        "付款条件"
      ),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invOrganizationName"
      ).$D("库存组织"),
    },
    {
      fieldCode: "sourceSettleNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.sourceSettleNum"
      ).$D("结算事务来源编号"),
    },
    {
      fieldCode: "purOrganizationName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.purchOrganizationName"
      ).$D("采购组织"),
    },
    {
      fieldCode: "supplierSiteCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.supplierSiteCode"
      ).$D("供应商地点"),
    },
    /**
     * 附件
     */
    {
      fieldCode: "attachmentUuid",
      fieldType: "attachment",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.purchaserEnclosure"
      ).$D("采购方附件"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-headers`,
      method: "get",
    },
    update: {
      url: `/ssta/v1/${tenantId}/settle-headers/purchaser/return`,
      method: "put",
    },
    submit: {
      url: `/ssta/v1/${tenantId}/settle-headers/purchaser/confirm`,
      method: "put",
    },
  },
});

export const settleLineDS = (settleHeaderId, documentType) => ({
  autoQuery: true,
  editable: false,
  queryParameter: {
    settleHeaderId,
    customizeUnitCode: lineUnitCodes[documentType].join(),
  },
  fields: [
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D(
        "结算单行号"
      ),
      fieldType: "TEXT",
      fieldCode: "lineNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum"
      ).$D("结算事务编号"),
      fieldType: "TEXT",
      fieldCode: "settleNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.sourceSettleNumAndLineNum"
      ).$D("结算事务来源编号｜行号"),
      fieldType: "TEXT",
      fieldCode: "sourceSettleNumAndLineNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.itemCode"
      ).$D("结算商品编码"),
      fieldType: "TEXT",
      fieldCode: "itemCode",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.itemName").$D("结算商品名称"),
      fieldType: "TEXT",
      fieldCode: "itemName",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.sourceSettleHeaderNum").$D(
        "发票申请结算单"
      ),
      fieldType: "TEXT",
      fieldCode: "sourceSettleHeaderNum",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.common.quantity").$D(
        "本次开票数量"
      ),
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netPrice").$D(
        "本次开票不含税单价"
      ),
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
      fieldCode: "netPrice",
    },
    {
      fieldCode: "unitPriceBatch",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.unitPriceBatch"
      ).$D("每"),
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netAmounts").$D(
        "本次开票不含税金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "netAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.model.taxCode").$D("税码"),
      fieldType: "TEXT",
      fieldCode: "taxCode",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.model.taxRate").$D("税率"),
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldCode: "taxRate",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.taxAmount").$D("税额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "taxAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.taxIncludedPrice").$D(
        "本次开票含税单价"
      ),
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
      fieldCode: "taxIncludedPrice",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.currentTaxIncludedAmount").$D(
        "本次开票含税金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "taxIncludedAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.settleMatchDimension").$D(
        "结算匹配维度"
      ),
      fieldType: "TEXT",
      fieldCode: "settleMatchDimensionMeaning",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.settleBasePrice").$D(
        "结算基准价"
      ),
      fieldType: "TEXT",
      fieldCode: "settleBasePriceMeaning",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.enableQuantity").$D(
        "可开票数量"
      ),
      fieldType: "TEXT",
      fieldCode: "enableQuantity",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.orignPrice").$D("原开票单价"),
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
      fieldCode: "orignPrice",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.enableAmount").$D("可开票金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "enableAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.paymentAmount").$D(
        "本次付款金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "paymentAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.applyAmount").$D(
        "本次预付款核销金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "applyAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.invoicedTaxIncludedAmount").$D(
        "已开票含税金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "invoicedAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.paidAmount").$D("已付款金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "paidAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.remainingPaymentAmount").$D(
        "剩余付款金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "remainingPaymentAmount",
    },
    {
      fieldCode: "adjustNetAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.adjustNetAmount"
      ).$D("尾差不含税调整金额"),
    },
    {
      fieldCode: "adjustTaxAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.adjustTaxAmount"
      ).$D("尾差税额调整金额"),
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.invOrganizationName").$D(
        "库存组织"
      ),
      fieldType: "TEXT",
      fieldCode: "invOrganizationName",
    },
    {
      fieldCode: "thirdSkuCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.thirdSkuCode").$D(
        "第三方商品编码"
      ),
    },
    {
      fieldCode: "thirdSkuName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.thirdSkuName").$D(
        "第三方商品名称"
      ),
    },
    {
      fieldCode: "orderTypeName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.orderTyoeName"
      ).$D("订单类型名称"),
    },
    {
      fieldCode: "poCreateName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.poCreateName").$D(
        "订单创建人"
      ),
    },
    {
      fieldCode: "unitName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.unitName").$D(
        "部门名称"
      ),
    },
    {
      fieldCode: "prePaymentWriteOff",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.button.prePaymentWriteOff").$D(
        "预付款核销"
      ),
    },
    {
      fieldCode: "operation",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.button.action").$D("操作"),
    },
  ],
  queryFields: [
    {
      fieldCode: "poCreateName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.poCreateName").$D(
        "订单创建人"
      ),
      virtualFlag: true,
    },
    {
      fieldCode: "thirdSkuName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.thirdSkuName").$D(
        "第三方商品名称"
      ),
      virtualFlag: true,
    },
    {
      fieldCode: "agentId",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.agentIdLov"
      ).$D("采购员"),
      lovCode: "SPFM.TENANT_PURCHASE_AGENT",
      options: { multiple: true },
    },
    {
      fieldCode: "asnNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.asnNum").$D(
        "送货单号编号"
      ),
    },
    {
      fieldCode: "costId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.costName").$D(
        "成本中心"
      ),
      lovCode: "SSTA.COST_CENTER",
      options: { multiple: true },
    },
    {
      fieldCode: "deliverTime",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "deliverTime_end",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.deliverTime"
      ).$D("妥投时间"),
    },
    {
      fieldCode: "invOrganizationId",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invOrganizationLov"
      ).$D("库存组织"),
      lovCode: "HPFM.INV_ORGANIZATION",
      options: { multiple: true },
    },
    {
      fieldCode: "orderType",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.orderType"
      ).$D("订单类型"),
      lovCode: "SODR.ORDER_TYPE",
      options: { multiple: true, valueField: "orderTypeCode" },
    },
    {
      fieldCode: "purOrganizationId",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.purOrganizationIdLov"
      ).$D("采购组织"),
      lovCode: "HPFM.PURCHASE_ORGANIZATION",
      options: { multiple: true },
    },
    {
      fieldCode: "sourcePlatformCode",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.sourcePlatformLov"
      ).$D("数据来源类型"),
      lovCode: "SSTA.DATA_SOURCE_PLATFORM",
      options: { multiple: true },
    },
    {
      fieldCode: "sourceSupplierNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.sourceSupplierNum"
      ).$D("数据源ERP供应商编码"),
    },
    {
      fieldCode: "thirdSkuCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.thirdSkuCode").$D(
        "第三方商品编码"
      ),
    },
    {
      fieldCode: "trxDate",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "trxDate_end",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.dateRange").$D(
        "结算事务日期"
      ),
    },
    {
      fieldCode: "unitId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.unitName").$D(
        "部门名称"
      ),
      lovCode: "SSTA.UNIT_NFO",
    },
    {
      fieldCode: "amountAdjustFlag",
      fieldType: "SELECT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.amountAdjustFlag"
      ).$D("金额尾差自动调整"),
      lovCode: "HPFM.FLAG",
    },
    {
      fieldCode: "contractNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.contractNum"
      ).$D("协议编号"),
    },
    {
      fieldCode: "dataSource",
      fieldType: "SELECT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.sourcePlatformsCode"
      ).$D("数据来源系统"),
      lovCode: "SSTA.DATA_SOURCE",
      options: { multiple: true },
    },
    {
      fieldCode: "ecPoSubNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.ecPoSubNum"
      ).$D("子订单编号"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum"
      ).$D("结算商品编码"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.itemName").$D(
        "结算商品名称"
      ),
    },
    {
      fieldCode: "lineNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D(
        "结算单行号"
      ),
    },
    {
      fieldCode: "poNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.poNum").$D(
        "订单编号"
      ),
    },
    {
      fieldCode: "settleBasePrice",
      fieldType: "SELECT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleBasePrice"
      ).$D("结算基准价"),
      lovCode: "SSTA.BASE_PRICE",
      options: { multiple: true },
    },
    {
      fieldCode: "settleConfigNum",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum"
      ).$D("结算策略编码"),
      lovCode: "SSTA.SETTLE_CONFIG",
      options: { multiple: true },
    },
    {
      fieldCode: "settleMatchDimension",
      fieldType: "SELECT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleMatchDimension"
      ).$D("结算匹配维度"),
      lovCode: "SSTA.MATCH_DIMENSION",
      options: { multiple: true },
    },
    {
      fieldCode: "settleMode",
      fieldType: "SELECT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.settleMode"
      ).$D("结算模式"),
      lovCode: "SSTA.SETTLE_MODE",
      options: { multiple: true },
    },
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum"
      ).$D("结算事务编号"),
    },
    {
      fieldCode: "sourceCompanyNum",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.sourceCompanyNum"
      ).$D("数据源公司编码"),
      lovCode: "SPFM.USER_AUTH.COMPANY",
      options: { multiple: true },
    },
    {
      fieldCode: "sourceSettleNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum"
      ).$D("结算事务来源编号"),
    },
    {
      fieldCode: "sourceSupplierCompanyNum",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.sourceSupplierCompanyNum"
      ).$D("数据源供应商编码"),
      lovCode: "SPFM.USER_AUTH.SUPPLIER_CODE",
      options: { multiple: true },
    },
    {
      fieldCode: "taxCode",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.taxCode").$D(
        "税率代码"
      ),
      lovCode: "SMDM.TAX",
      options: { multiple: true },
    },
    {
      fieldCode: "trxTypeCode",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.trxTypeCode").$D(
        "采购事务类型"
      ),
      lovCode: "SSTA.RECEIVE_TRX_TYPE",
      options: { multiple: true },
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-lines/${settleHeaderId}`,
      method: "get",
    },
  },
  events: {
    beforeQuery: transformSearchBarData,
  },
});

export const taxInvoiceDS = (settleHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: { customizeUnitCode: taxInvGirdCode },
  fields: [
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceSpecies"
      ).$D("发票种类"),
      fieldType: "TEXT",
      fieldCode: "invoiceSpeciesMeaning",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNumber").$D(
        "行号"
      ),
      fieldType: "TEXT",
      fieldCode: "lineNum",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.supplySettle.invoiceCode").$D(
        "发票代码"
      ),
      fieldType: "TEXT",
      fieldCode: "invoiceCode",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.supplySettle.invoiceNumber").$D(
        "发票号码"
      ),
      fieldType: "TEXT",
      fieldCode: "invoiceNumber",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.invoicingDate"
      ).$D("开票日期"),
      fieldType: "DATE_PICKER",
      fieldCode: "invoicingDate",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.netAmount"
      ).$D("不含税金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "netAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.taxAmount"
      ).$D("税额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "taxAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.taxIncludedAmount"
      ).$D("含税金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "taxIncludedAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceSpecies"
      ).$D("发票种类"),
      fieldType: "TEXT",
      fieldCode: "invoiceSpecies",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.deductFlag"
      ).$D("是否抵扣"),
      fieldType: "TEXT",
      fieldCode: "deductFlag",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.checkCodeMeaning"
      ).$D("校验码"),
      fieldType: "TEXT",
      fieldCode: "checkCode",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.validateStatus"
      ).$D("查验状态"),
      fieldType: "TEXT",
      fieldCode: "validateStatusMeaning",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.validateMessage"
      ).$D("查验状态说明"),
      fieldType: "TEXT",
      fieldCode: "validateMessage",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.taxInvoiceStatus"
      ).$D("发票状态"),
      fieldType: "TEXT",
      fieldCode: "taxInvoiceStatusMeaning",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceUrl"
      ).$D("电子发票地址"),
      fieldType: "TEXT",
      fieldCode: "invoiceUrl",
    },
    // 发票池字段转来
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierCompanyName"
      ).$D("销方名称"),
    },
    {
      fieldCode: "supUnifiedSocialCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supUnifiedSocialCode"
      ).$D("销方纳税人识别号"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.companyName"
      ).$D("购方名称"),
    },
    {
      fieldCode: "purUnifiedSocialCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purUnifiedSocialCode"
      ).$D("购方纳税人识别号"),
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.title.operationHistory").$D(
        "操作记录"
      ),
      fieldType: "TEXT",
      fieldCode: "operation",
    },
    {
      fieldCode: "ocrFileUrl",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.OcrFile"
      ).$D("OCR文件"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/tax-invoice-headers/${settleHeaderId}`,
      method: "get",
    },
  },
});

export const prePayWriteOffDS = (settleHeaderId, settleLineId) => {
  const urlSuffix = settleLineId ? `/${settleLineId}` : "";
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: "SSTA.PURCHASE_SETTLE_DETAIL.PAYMENT.PEYPAYMENT.BOX",
    },
    fields: [
      {
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentTitle"
        ).$D("预付款结算单号｜行号"),
        fieldType: "TEXT",
        fieldCode: "prepaymentTitle",
      },
      {
        fieldName: $T(
          "ssta.purchaseSettle.model.purchaseSettle.prepaymentRemainingAmount"
        ).$D("预付款剩余核销金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldCode: "prepaymentRemainingAmount",
      },
      {
        fieldName: $T("ssta.purchaseSettle.purchaseSettle.applyAmount").$D(
          "本次核销金额"
        ),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldCode: "applyAmount",
      },
      {
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentAmount"
        ).$D("预付款金额"),
        fieldType: "INPUT_NUMBER",
        precision: amountPrecision,
        editor: false,
        fieldCode: "prepaymentAmount",
      },
      {
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentType"
        ).$D("预付款类型"),
        fieldType: "TEXT",
        fieldCode: "prepaymentTypeMeaning",
      },
      {
        fieldName: $T("ssta.purchaseSettle.purchaseSettle.associateNumd").$D(
          "关联单据编号"
        ),
        fieldType: "TEXT",
        fieldCode: "associateNum",
      },
      {
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentCreatedBy"
        ).$D("预付款申请人"),
        fieldType: "TEXT",
        fieldCode: "prepaymentCreatedBy",
      },
      {
        fieldName: $T(
          "ssta.purchaseSettle.view.message.model.purchaseSettle.prepaymentCreationDates"
        ).$D("预付款创建时间"),
        fieldType: "DATE_PICKER",
        fieldCode: "prepaymentCreationDate",
        options: { format: "yyyy-MM-dd" },
        editor: false,
      },
    ],
    transport: {
      read: {
        url: `/ssta/v1/${tenantId}/settle-apply-lines/${settleHeaderId}${urlSuffix}`,
        method: "get",
      },
    },
  };
};

export const multiDimensionPayDS = (settleHeaderId, paymentDimensionData) => ({
  autoQuery: true,
  editable: false,
  queryParameter: {
    customizeUnitCode: writeOffAddUnitCodes.join(),
  },
  queryFields: [
    {
      fieldCode: "paymentDimension",
      fieldType: "LOV",
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.paymentRangeCode"
      ).$D("付款维度"),
      lovCode: "SSTA.PAYMENT_DIMENSION",
      defaultValue: paymentDimensionData,
      disabled: true,
    },
  ],
  fields: [
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentNum").$D(
        "单据编号"
      ),
      fieldType: "TEXT",
      fieldCode: "documentNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.invoicedTaxIncludedAmounts"
      ).$D("已开票含税金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "invoicedTaxIncludedAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.purchaseSettle.remainingPaymentAmount"
      ).$D("剩余可付金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "remainingPaymentAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.paymentAmount"
      ).$D("本次付款金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "paymentAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.view.message.model.purchaseSettle.applyAmount"
      ).$D("本次核销金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "applyAmount",
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-lines/mutil-payment/${settleHeaderId}`,
      method: "get",
      params: { size: 0 },
    },
  },
});

export const multiPrePayWriteOffDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentTitle"
      ).$D("预付款结算单号｜行号"),
      fieldType: "TEXT",
      fieldCode: "prepaymentTitle",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentRemainingAmount"
      ).$D("预付款剩余核销金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "prepaymentRemainingAmount",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D(
        "本次核销金额"
      ),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "applyAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount"
      ).$D("预付款金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "prepaymentAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentType"
      ).$D("预付款类型"),
      fieldType: "TEXT",
      fieldCode: "prepaymentTypeMeaning",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNum").$D(
        "关联单据编号"
      ),
      fieldType: "TEXT",
      fieldCode: "associateNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentCreatedBy"
      ).$D("预付款申请人"),
      fieldType: "TEXT",
      fieldCode: "prepaymentCreatedBy",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettle.prepaymentCreationDate"
      ).$D("预付款创建时间"),
      fieldType: "DATE_PICKER",
      fieldCode: "prepaymentCreationDate",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
  ],
});

export const settleLineDetailDS = () => ({
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
    {
      fieldCode: "sourceCompanyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyNum"
      ).$D("数据源公司编码"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceCompanyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceCompanyName"
      ).$D("数据源公司名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceSupplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSupplierName"
      ).$D("数据源供应商名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceSupplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSupplierNum"
      ).$D("数据源供应商编码"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyName"
      ).$D("结算公司名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "companyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyNum"
      ).$D("结算公司编码"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierNum"
      ).$D("结算供应商编码"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.supplierName"
      ).$D("结算供应商名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "itemCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemCode"
      ).$D("结算商品编码"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemName"
      ).$D("货物或应税劳务，服务名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "quantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsQuantity"
      ).$D("可结算数量"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "unitPriceBatch",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.unitPriceBatch"
      ).$D("每"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "netPrice",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netPriceMeaning1"
      ).$D("不含税单价"),
      render: renderPrice,
    },
    {
      fieldCode: "netAmount",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.netAmountMeaning1"
      ).$D("不含税金额"),
      render: renderAmount,
    },
    {
      fieldCode: "taxRate",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxRate"
      ).$D("税率"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoice.currencyCode"
      ).$D("币种"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "uom",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.uom"
      ).$D("单位"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "specificationsModel",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.spec"
      ).$D("规格型号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "categoryName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.categoryName"
      ).$D("物料分类"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "srmItemCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.srmItemCode"
      ).$D("srm物料编号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "taxIncludedPrice",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedPriceMeaning1"
      ).$D("含税单价"),
      render: renderPrice,
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxIncludedAmountMeaning1"
      ).$D("含税金额"),
      render: renderAmount,
    },
    {
      fieldCode: "taxAmount",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.taxAmountMeaning"
      ).$D("税额"),
      render: renderAmount,
    },
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum"
      ).$D("结算事务编号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceSettleNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleNum"
      ).$D("结算事务来源编号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceSettleLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceSettleLineNum"
      ).$D("结算事务来源行号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "dataSourceMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.dataSourceMeaning"
      ).$D("数据来源"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "trxDate",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseSettlePool.trxDate"
      ).$D("事务日期"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "trxYear",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.trxYear"
      ).$D("事务年度"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "contractAndLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.contractAndLineNum"
      ).$D("协议编号|行号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "poAndLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoice.poAndLineNum"
      ).$D("采购订单编号|行号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "asnAndLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.asnAndLineNum"
      ).$D("送货单号|行号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "poLineLocation",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.poLineLocation"
      ).$D("发运行"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "releaseNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.releaseNum"
      ).$D("发放号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "orderType",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.orderType"
      ).$D("订单类型"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "purOrganizationName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purOrganizationName"
      ).$D("采购组织"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invOrganizationName"
      ).$D("库存组织"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "inventoryName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.inventoryName"
      ).$D("库房"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "trxTypeCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoice.trxTypeCode"
      ).$D("采购事务类型"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "trxTypeCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoice.trxTypeCodeMeaning"
      ).$D("采购事务类型名称"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "createdByName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.createdByName"
      ).$D("创建人"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "purchaseAgentName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.purchaseAgentName"
      ).$D("采购员"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "sourceParentSettleLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.sourceParentSettleLineNum"
      ).$D("父事务处理编号|行号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "freightFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.freightFlag"
      ).$D("运费标识"),
      render: (val) =>
        val
          ? $T("smbl.common.view.yes").$D("是")
          : $T("smbl.common.view.no").$D("否"),
    },
    {
      fieldCode: "ecPoNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.ecPoNum"
      ).$D("电商订单编号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "ecPoSubNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.ecPoSubNum"
      ).$D("电商子订单编号"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "deliverTime",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.deliverTime"
      ).$D("妥投时间"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "deliverQuantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.deliverQuantity"
      ).$D("妥投数量"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "invoiceMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceMethodMeaning"
      ).$D("开票方式"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "elecInvoiceView",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseSettlePool.invoiceInfo"
      ).$D("电商发票信息"),
    },
    {
      fieldCode: "afterSalesStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.afterSalesStatusMeaning"
      ).$D("电商售后状态"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "invoiceTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTypeMeaning"
      ).$D("电商开票类型"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "costName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.costName"
      ).$D("成本中心"),
      render: (val) => (val ? val : "-"),
    },
    // termOption
    {
      fieldCode: "termCode",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.termOption"
      ).$D("付款条件"),
      render: (val) => (val ? val : "-"),
    },
    {
      fieldCode: "settleAttach",
      fieldType: "UPLOAD",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleAttach"
      ).$D("结算事务行附件"),
    },
    {
      fieldCode: "pcSubjectLineNum",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.pcSubjectLineNum"
      ).$D("协议标的行号"),
      render: (val) => (val ? val : "-"),
    },
    //对账信息
    {
      fieldCode: "billOccupiedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedQuantity"
      ).$D("对账占用数量"),
    },
    {
      fieldCode: "billOccupiedAmount",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedAmountMeaning"
      ).$D("对账占用含税金额"),
      fieldType: "TEXT",
      render: renderAmount,
    },
    {
      fieldCode: "billCompletedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedQuantity"
      ).$D("对账完成数量"),
    },
    {
      fieldCode: "billCompletedAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedAmount"
      ).$D("对账完成含税金额"),
    },
    {
      fieldCode: "billRemoveFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billRemoveFlag"
      ).$D("对账暂挂"),
      render: (val) =>
        val
          ? $T("smbl.common.view.yes").$D("是")
          : $T("smbl.common.view.no").$D("否"),
    },
    {
      fieldCode: "billOccupiedNetAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedNetAmount"
      ).$D("对账占用不含税金额"),
    },
    {
      fieldCode: "billOccupiedTaxAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedTaxAmount"
      ).$D("对账占用税额"),
    },
    {
      fieldCode: "billCompletedNetAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billCompletedNetAmount"
      ).$D("对账完成不含税金额"),
    },
    {
      fieldCode: "billCompletedTaxAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billCompletedTaxAmount"
      ).$D("对账完成税额"),
    },
    {
      fieldCode: "billLockQuantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.billLockQuantity"
      ).$D("对账锁定标记"),
    },
    //开票信息
    {
      fieldCode: "invoiceOccupiedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedQuantity"
      ).$D("开票占用数量"),
    },
    {
      fieldCode: "invoiceCompletedQuantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedQuantity"
      ).$D("开票完成数量"),
    },
    {
      fieldCode: "invoiceCompletedNetAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedNetAmountMeaning"
      ).$D("开票完成不含税金额"),
    },
    {
      fieldCode: "invoiceCompletedTaxAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedTaxAmountMeaning"
      ).$D("开票完成税额"),
    },
    {
      fieldCode: "invoiceRemoveFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceRemoveFlag"
      ).$D("开票暂挂"),
      render: (val) =>
        val
          ? $T("smbl.common.view.yes").$D("是")
          : $T("smbl.common.view.no").$D("否"),
    },
    {
      fieldCode: "invoiceOccupiedNetAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedNetAmountMeaning"
      ).$D("开票占用不含税金额"),
    },
    {
      fieldCode: "invoiceOccupiedTaxAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedTaxAmountMeaning"
      ).$D("开票占用税额"),
    },
    {
      fieldCode: "invoiceOccupiedAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedAmountMeaning"
      ).$D("开票占用含税金额"),
    },
    {
      fieldCode: "invoiceCompletedAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceCompletedAmountMeaning"
      ).$D("开票完成含税金额"),
    },
    {
      fieldCode: "invoiceLockQuantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceLockQuantity"
      ).$D("开票锁定标记"),
    },
    //付款信息
    {
      fieldCode: "paymentRemoveFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentRemoveFlag"
      ).$D("付款暂挂"),
      render: (val) =>
        val
          ? $T("smbl.common.view.yes").$D("是")
          : $T("smbl.common.view.no").$D("否"),
    },
    {
      fieldCode: "paymentOccupiedAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentOccupiedAmount"
      ).$D("付款占用金额"),
    },
    {
      fieldCode: "paymentCompletedAmount",
      fieldType: "TEXT",
      render: renderAmount,
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentCompletedAmount"
      ).$D("付款完成金额"),
    },
    {
      fieldCode: "paymentLockQuantity",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentLockQuantity"
      ).$D("付款锁定标记"),
    },
  ],
  transport: {
    read: {
      url: "/ssta/v1/{tenantId}/settles/detail/{settleId}",
      method: "get",
    },
  },
});

export const settleConfigDS = () => ({
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
      fieldName: $T(
        "ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum"
      ).$D("结算策略编码"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "settleConfigName",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleConfigName"
      ).$D("结算策略名称"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "settleBasePriceMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleBasePrice"
      ).$D("结算基准价"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "settleModeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMode"
      ).$D("结算模式"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "settleMatchDimensionMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleMatchDimension"
      ).$D("结算匹配维度"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "versionNumber",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseInvoicePool.model.purchaseInvoicePool.versionNumber"
      ).$D("版本号"),
      render: (val) => val || "-",
    },
    //结算单规则
    {
      fieldCode: "invoiceSettleCompanyCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceSettleCompanyCodeMeaning"
      ).$D("开票结算公司"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "paymentSettleCompanyCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentSettleCompanyCodeMeaning"
      ).$D("付款结算公司"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "invoiceSettleSupplierCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceSettleSupplierCodeMeaning"
      ).$D("开票供应商"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "paymentSettleSupplierCodeMeaning",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentSettleSupplierCodeMeaning"
      ).$D("付款供应商"),
      render: (val) => val || "-",
    },
    {
      fieldCode: "invoicePartMatchFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoicePartMatchFlag"
      ).$D("部分匹配-开票"),
      render: renderYesNo,
    },
    {
      fieldCode: "paymentPartMatchFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentPartMatchFlag"
      ).$D("部分匹配-付款"),
      render: renderYesNo,
    },
    {
      fieldCode: "invoicePriceEditFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoicePriceEditFlag"
      ).$D("单价调整"),
      render: renderYesNo,
    },
    {
      fieldCode: "invoiceTaxRateEditFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxRateEditFlag"
      ).$D("税率调整"),
      render: renderYesNo,
    },
    {
      fieldCode: "invoiceTaxAmountEditFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxAmountEditFlag"
      ).$D("税额调整"),
      render: renderYesNo,
    },
    {
      fieldCode: "taxAllowanceAmountLower",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceTaxAllowanceAmount"
      ).$D("税额允差"),
      render: (val, item) => `${val}~${item.taxAllowanceAmountUpper}`,
    },
    {
      fieldCode: "invoiceDependencyFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.invoiceDependencyFlag"
      ).$D("是否依赖-开票"),
      render: renderYesNo,
    },
    {
      fieldCode: "paymentDependencyFlag",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentDependencyFlag"
      ).$D("是否依赖-付款"),
      render: renderYesNo,
    },
  ],
  transport: {
    read: {
      url: "/ssta/v1/{tenantId}/settle-config/release-config/{settleConfigNum}",
      method: "get",
    },
  },
});

export const billRecordDS = (settleId, finalFlag) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: {
    settleId,
    finalFlag,
    documentType: "BILL",
  },
  fields: [
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.status"
      ).$D("状态"),
      fieldType: "TEXT",
      fieldCode: "recordStatusMeaning",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.statementNumAndLines"
      ).$D("对账单编号-行号"),
      fieldType: "TEXT",
      fieldCode: "documentNumAndLine",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.reconciliationQuantity"
      ).$D("对账数量"),
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billNetPrice"
      ).$D("对账单价(不含税)"),
      fieldCode: "netPrice",
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
    },
    {
      fieldName: $T("hzero.common.view.unitPriceBatch").$D("每"),
      fieldCode: "unitPriceBatch",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billNetAmount"
      ).$D("对账金额(不含税)"),
      fieldCode: "netAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billTaxRate"
      ).$D("对账税率"),
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldCode: "taxRate",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billTaxAmount"
      ).$D("对账税额"),
      fieldCode: "taxAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billTaxIncludedsPrice"
      ).$D("对账单价(含税)"),
      fieldCode: "taxIncludedPrice",
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billNetAmount"
      ).$D("对账金额(不含税)"),
      fieldCode: "netAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billTaxIncludedAmount"
      ).$D("对账金额(含税)"),
      fieldCode: "taxIncludedAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billRecordDate"
      ).$D("对账日期"),
      fieldCode: "recordDate",
      fieldType: "DATE_PICKER",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.billRecordSource"
      ).$D("对账来源"),
      fieldType: "TEXT",
      fieldCode: "recordSource",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.companyNamess"
      ).$D("执行公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.supplierCompanyNames"
      ).$D("执行供应商"),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.camp_range"
      ).$D("创建方阵营"),
      fieldType: "TEXT",
      fieldCode: "campMeaning",
    },
    {
      fieldName: $T("ssta.common.model.common.processUser").$D("操作人"),
      fieldType: "TEXT",
      fieldCode: "createdUserName",
    },
    {
      fieldName: $T("ssta.common.model.common.processTime").$D("操作时间"),
      fieldCode: "creationDate",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.processRemarks"
      ).$D("操作备注"),
      fieldType: "TEXT",
      fieldCode: "remark",
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-records/record/${settleId}/BILL`,
      method: "get",
      params: { size: 0 },
    },
  },
});

export const invoiceRecordDS = (settleId, finalFlag) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: {
    settleId,
    finalFlag,
    documentType: "INVOICE",
  },
  fields: [
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.settlementNumAndLines"
      ).$D("结算单编号-行号"),
      fieldType: "TEXT",
      fieldCode: "documentNumAndLine",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.quantitys"
      ).$D("开票数量"),
      fieldCode: "quantity",
      fieldType: "INPUT_NUMBER",
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.netPrices"
      ).$D("开票单价(不含税)"),
      fieldCode: "netPrice",
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.unitPriceBatch"
      ).$D("每"),
      fieldCode: "unitPriceBatch",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.netAmounts"
      ).$D("开票金额(不含税)"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "netAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.taxRates"
      ).$D("开票税率"),
      fieldType: "INPUT_NUMBER",
      editor: false,
      fieldCode: "taxRate",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.taxAmounts"
      ).$D("开票税额"),
      fieldCode: "taxAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.taxIncludedPrices"
      ).$D("开票单价(含税)"),
      fieldCode: "taxIncludedPrice",
      fieldType: "INPUT_NUMBER",
      precision: pricePrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.taxHavaMoney"
      ).$D("开票金额(含税)"),
      fieldCode: "taxIncludedAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.recordStatuss"
      ).$D("开票状态"),
      fieldType: "TEXT",
      fieldCode: "recordStatusMeaning",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.recordDates"
      ).$D("开票日期"),
      fieldCode: "recordDate",
      fieldType: "DATE_PICKER",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.recordSources"
      ).$D("开票来源"),
      fieldType: "TEXT",
      fieldCode: "recordSource",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.companynames"
      ).$D("执行公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.supplierCompanysNames"
      ).$D("执行供应商"),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.camp_range"
      ).$D("创建方阵营"),
      fieldType: "TEXT",
      fieldCode: "campMeaning",
    },
    {
      fieldName: $T("ssta.common.model.common.processUser").$D("操作人"),
      fieldType: "TEXT",
      fieldCode: "createdUserName",
    },
    {
      fieldName: $T("ssta.common.model.common.processTime").$D("操作时间"),
      fieldCode: "creationDate",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.processRemarks"
      ).$D("操作备注"),
      fieldType: "TEXT",
      fieldCode: "remark",
    },
    {
      fieldCode: "operation",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.operation"
      ).$D("操作"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-records/record/${settleId}/INVOICE`,
      method: "get",
      params: { size: 0 },
    },
  },
});

export const paymentRecordDS = (settleId, finalFlag) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: {
    settleId,
    finalFlag,
    documentType: "PAYMENT",
  },
  fields: [
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.documentNumsAndLines"
      ).$D("结算单编号"),
      fieldType: "TEXT",
      fieldCode: "documentNum",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentTypes"
      ).$D("付款类型"),
      fieldCode: "paymentTypeMeaning",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paymentAmounts"
      ).$D("付款金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldCode: "paymentAmount",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.recordPayStatus"
      ).$D("付款状态"),
      fieldCode: "recordStatusMeaning",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paysDate"
      ).$D("付款日期"),
      fieldCode: "recordDate",
      fieldType: "TEXT",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.paySources"
      ).$D("付款来源"),
      fieldType: "TEXT",
      fieldCode: "recordSource",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.companyNames"
      ).$D("执行公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.supplierCompanyNames"
      ).$D("执行供应商"),
      fieldType: "TEXT",
      fieldCode: "supplierCompanyName",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.camp_range"
      ).$D("创建方阵营"),
      fieldType: "TEXT",
      fieldCode: "campMeaning",
    },
    {
      fieldName: $T("ssta.common.model.common.processUser").$D("操作人"),
      fieldType: "TEXT",
      fieldCode: "createdUserName",
    },
    {
      fieldName: $T("ssta.common.model.common.processTime").$D("操作时间"),
      fieldType: "TEXT",
      fieldCode: "creationDate",
    },
    {
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.processRemarks"
      ).$D("操作备注"),
      fieldType: "TEXT",
      fieldCode: "remark",
    },
    {
      fieldCode: "operation",
      fieldType: "TEXT",
      fieldName: $T(
        "ssta.purchaseSettlePool.model.purchaseSettlePool.operation"
      ).$D("操作"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-records/record/${settleId}/PAYMENT`,
      method: "get",
      params: { size: 0 },
    },
  },
});
