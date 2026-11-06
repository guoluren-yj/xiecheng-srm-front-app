import { SrmUtil, $T } from "srm-mobile-ui";
import { transformSearchBarData } from "./utils";
const tenantId = SrmUtil.getTenantId();

export const wholeTableUnitCodes = {
  ALL: "SSTA.PURCHASE_SETTLE_LIST.GRID",
  APPROVE: "SSTA.PURCHASE_SETTLE_LIST.CHECK_GRID",
};
export const wholeSearchUnitCodes = {
  ALL: "SSTA.PURCHASE_SETTLE_LIST.SEARCH_BAR_ALL",
  APPROVE: "SSTA.PURCHASE_SETTLE_LIST.SEARCH_BAR_APPROVE",
};

const amountPrecision = (val, record) => val && record.amountPrecision;

export const wholeTableDS = (action) => ({
  autoQuery: true,
  selection: Infinity,
  editable: action === "APPROVE",
  queryParameter: {
    action,
    ...action === "APPROVE" ? { mobileQueryFlag: 1 } : {}, // 过滤掉移动端工作流可审核数据
    customizeUnitCode: [ wholeSearchUnitCodes[action], wholeTableUnitCodes[action] ].join(),
  },
  fields: [
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号"),
    },
    {
      fieldType: "TEXT",
      fieldCode: "settleTypeMeaning",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
    },
    {
      fieldCode: "invOrganizationName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invOrganizationName").$D("库存组织"),
    },
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompany").$D("结算公司"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplier").$D("结算供应商"),
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种"),
    },
    {
      fieldCode: "netAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.netInvoiceApplyAmount").$D("发票申请金额（不含税）"),
    },
    {
      fieldCode: "taxAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invoiceApplyTaxAmount").$D("发票申请税额"),
    },
    {
      fieldCode: "taxIncludedAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.includedInvoiceApplyAmount").$D("发票申请金额（含税）"),
    },
    {
      fieldCode: "paymentAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paymentApplyAmount").$D("付款申请金额"),
    },
    {
      fieldCode: "applyAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D("预付款核销总金额"),
    },
    {
      fieldCode: "prepaymentAmount",
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
      editor: false,
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prePaymentApplyAmount").$D("预付款申请金额"),
    },
    {
      fieldCode: "settleStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleStatus").$D("结算单状态"),
    },
    {
      fieldCode: "syncStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.syncStatusMeaning").$D("同步ERP状态"),
    },
    {
      fieldCode: "syncResponseMsg",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.processRemark").$D("反馈信息"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.submitedDate").$D("创建日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "createdUserName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
    },
    {
      fieldCode: "campMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.campMeaning").$D("创建方阵营"),
    },
    {
      fieldCode: "isPrint",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.isPrint").$D("打印状态"),
    },
    {
      fieldCode: "sourceSupplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSupplierName").$D("数据源平台供应商名称"),
    },
    {
      fieldCode: "sourceSupplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSupplierCompanyNum").$D("数据源平台供应商编码"),
    },
    {
      fieldCode: "confirmCollaborativeMode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeModes").$D("协同模式"),
    },
    {
      fieldCode: "supplierSiteCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.supplierSiteCode").$D("供应商地点"),
    },
  ],
  fastQueryField: [
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号"),
    }
  ],
  queryFields: [
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "creationDate_end",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.submitedDate").$D("创建日期"),
    },
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompany").$D("结算公司"),
      lovCode: "SPFM.USER_AUTHORITY_COMPANY",
      options: { multiple: true },
    },
    {
      fieldCode: "supplierCompanyId_supplierId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplier").$D("结算供应商"),
      lovCode: "SSTA.USER_AUTH.EXT_SUPPLIER",
      virtualFlag: true,
    },
    {
      fieldCode: "currencyCode",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种"),
      lovCode: "SSTA.CURRENCY",
      options: { multiple: true },
    },
    {
      fieldCode: "settleConfigNum",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum").$D("结算策略编码"),
      lovCode: "SSTA.SETTLE_CONFIG",
      options: { multiple: true },
    },
    {
      fieldCode: "camp",
      fieldType: "SELECT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.camp").$D("创建方阵营"),
      lovCode: "SSTA.CAMP",
    },
    {
      fieldCode: "isPrint",
      fieldType: "SELECT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.isPrint").$D("是否打印"),
      lovCode: "HPFM.FLAG",
    },
    {
      fieldCode: "sourceSupplierCompanyId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSupplierCompany").$D("数据源供应商公司"),
      lovCode: "SSTA.USER_AUTH.SUPPLIER",
      options: { multiple: true },
    },
    {
      fieldCode: "supplierSiteId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.supplierSiteLov").$D("供应商地点"),
      lovCode: "SSTA.SUPPLIER_SITE",
      options: { multiple: true },
    },
    {
      fieldCode: "sourceSettleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum").$D("结算事务来源编号"),
    },
    {
      fieldCode: "unitId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.unit").$D("部门"),
      lovCode: "SSTA.SETTLE.ACCOUNT.UNIT",
      options: { multiple: true },
    },
    {
      fieldCode: "settleStatus",
      fieldType: "SELECT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleStatus").$D("结算单状态"),
      lovCode: "SSTA.SETTLE_STATUS",
    },
    {
      fieldCode: "invOrganizationId",
      fieldType: "LOV",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.invOrganizationLov").$D("库存组织"),
      lovCode: "HPFM.INV_ORGANIZATION",
      options: { multiple: true },
    },
    {
      fieldCode: "confirmCollaborativeMode",
      fieldType: "SELECT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeModes").$D("协同模式"),
      lovCode: "SSTA.SETTLE_STATUS",
      options: { multiple: true },
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/settle-headers/purchaser/page`,
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
  events: {
    beforeQuery: transformSearchBarData,
  }
});

export const checkDS = () => ({
  autoCreate: true,
  fields: [
    {
      fieldCode: "canceledReason",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.canceledReason").$D("取消原因"),
    },
    {
      fieldCode: "approvedRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.approvedRemark").$D("审批意见-确认"),
    },
    {
      fieldCode: "canceledRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.canceledRemark").$D("审批意见-取消"),
    },
    {
      fieldCode: "accountingDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.accountingDate").$D("记账日期"),
      options: { format: "yyyy-MM-dd" },
      editor: true,
    },
  ],
});