import { SrmUtil, $T } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

// const customizeUnitCode = [ "SMBL.PURCHASE_SETTLE.PRE_BASIC", "SMBL.PURCHASE_SETTLE.OTHER_INFO_PRE", "SMBL.PURCHASE_SETTLE.PRE_ENCLOSURE", "SMBL.PURCHASE_SETTLE.PRE_PAYMENT_INFO" ].join();

export const headerDS = (settleHeaderId) => ({
  autoQuery: false,
  queryParameter: {
    settleHeaderId,
    // customizeUnitCode,
  },
  fields: [
    /**
     * 基本信息
     */
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号"),
      type: "info",
    },
    {
      fieldCode: "settleStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleStatus").$D("结算单状态"),
      type: "info",
    },
    {
      fieldCode: "campMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.camp").$D("创建方阵营"),
      type: "info",
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D("创建日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
      type: "info",
    },
    {
      fieldCode: "createdUserName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
      type: "info",
    },
    {
      fieldCode: "settleTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentType").$D("结算单类型"),
      type: "info",
    },
    /**
     * 交易方信息
     */
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyName")
        .$D("结算公司名称"),
      type: "info",
    },
    {
      fieldCode: "companyNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum")
        .$D("结算公司编码"),
      type: "info",
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种"),
      type: "info",
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierNum")
        .$D("结算供应商编码"),
      type: "info",
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierName")
        .$D("结算供应商名称"),
      type: "info",
    },
    {
      fieldCode: "ouName",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.ouName").$D("业务实体"),
      type: "info",
    },
    {
      fieldCode: "supplierSiteCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.supplierSiteLov").$D("供应商地点"),
      type: "info",
      visible: (val, item) => item.supplierSiteEnableFlag === 1,
    },
    {
      fieldName: $T("ssta.common.model.common.unitName").$D("部门名称"),
      fieldType: "TEXT",
      fieldCode: "unitName",
      type: "info",
    },
    /**
     * 付款信息
     */
    {
      fieldCode: "prepaymentTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentType").$D("预付款类型"),
      type: "pay",
    },
    {
      fieldCode: "prepaymentAmount",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount")
        .$D("预付款总金额"),
      type: "pay",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankId").$D("收款银行"),
      fieldType: "TEXT",
      fieldCode: "bankName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankBranchName").$D("收款开户行"),
      fieldType: "TEXT",
      fieldCode: "bankBranchName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.purchaseSettle.bankAccountNum").$D("收款银行帐号"),
      fieldType: "TEXT",
      fieldCode: "bankAccountNum",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.bankAccountName1")
        .$D("收款银行账户名称"),
      fieldType: "TEXT",
      fieldCode: "bankAccountName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentMethod")
        .$D("付款方式"),
      fieldType: "TEXT",
      fieldCode: "paymentTypeName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paymentCondition").$D("付款条件"),
      fieldType: "TEXT",
      fieldCode: "paymentCondition",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.expectPaymentDate")
        .$D("期望付款日期"),
      fieldType: "DATE_PICKER",
      fieldCode: "expectPaymentDate",
      options: { format: "yyyy-MM-dd" },
      editor: false,
      type: "pay",
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.remark").$D("备注"),
      type: "info",
    },
    {
      fieldCode: "canceledReason",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.canceledReason").$D("取消原因"),
      type: "info",
      visible: (val, item) => ![ "NEW", "SUBMITED" ].includes(item.settleStatus),
    },
    {
      fieldCode: "confirmCollaborativeModeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.confirmCollaborativeMode")
        .$D("协同模式-确认"),
      type: "other",
    },
    {
      fieldCode: "confirmApproveMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.confirmApproveMethod")
        .$D("审批方式-确认"),
      type: "other",
    },
    {
      fieldCode: "cancelCollaborativeModeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.cancelCollaborativeMode")
        .$D("协同模式-取消"),
      type: "other",
    },
    {
      fieldCode: "cancelApproveMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.cancelApproveMethod")
        .$D("审批方式-取消"),
      type: "other",
    },
    {
      fieldCode: "approvedRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.approvedRemark")
        .$D("审批意见-确认"),
      type: "info",
      visible: (val, item) => item.settleStatus !== "NEW",
    },
    {
      fieldCode: "canceledRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.canceledRemark")
        .$D("审批意见-取消"),
      type: "info",
      visible: (val, item) => ![ "NEW", "SUBMITED", "SUBMITED_APPROVING" ].includes(item.settleStatus),
    },
    /**
     * 附件
     */
    {
      fieldCode: "attachmentUuid",
      fieldType: "attachment",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.purchaserEnclosure")
        .$D("采购方附件"),
    },
    {
      fieldCode: "supplierApprovedRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.approvedRemark")
        .$D("审批意见-确认"),
    },
    {
      fieldCode: "supplierCanceledRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.canceledRemark")
        .$D("审批意见-取消"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/pre-pay-headers/${settleHeaderId}`,
      method: "get",
    },
  },
});

export const lineDS = (settleHeaderId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  queryParameter: {
    settleHeaderId,
    // customizeUnitCode: "SMBL.PURCHASE_SETTLE.PRE_TRANSACTIONDETAIL",
  },
  fields: [
    {
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
      fieldType: "TEXT",
      fieldCode: "lineNum",
    },
    {
      fieldCode: "prepaymentAmount",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount1")
        .$D("预付款行金额"),
      fieldType: "TEXT",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldCode: "associateNum",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNum").$D("关联单据号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "associateNumAndLineNum",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNumAndLineNum")
        .$D("关联单据号 | 关联单据行号"),
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.associateAmount")
        .$D("关联单据金额"),
      fieldType: "TEXT",
      fieldCode: "associateAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.prepaymentApplyAmount").$D("已核销金额"),
      fieldType: "TEXT",
      fieldCode: "prepaymentApplyAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.poItemName").$D("商品名称"),
      fieldType: "TEXT",
      fieldCode: "itemName",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.quantity").$D("数量"),
      fieldType: "TEXT",
      fieldCode: "quantity",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.taxIncludedLineAmount").$D("含税行金额"),
      fieldType: "TEXT",
      fieldCode: "taxIncludedLineAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.lineAmount1").$D("不含税行金额"),
      fieldType: "TEXT",
      fieldCode: "lineAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.categoryName").$D("品类"),
      fieldType: "TEXT",
      fieldCode: "categoryName",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.poCreatedName").$D("订单创建人"),
      fieldType: "TEXT",
      fieldCode: "poCreatedName",
    },
    {
      fieldName: $T("ssta.purchaseSettle.common.poCreationDate").$D("订单创建时间"),
      fieldCode: "poCreationDate",
      fieldType: "DATE_PICKER",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T("hzero.common.button.action").$D("操作"),
      fieldType: "TEXT",
      fieldCode: "operate",
      visible: (val, item) => item.lineNum,
    },
  ],
  queryFields: [
    {
      fieldCode: "sourceSettleNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
    },
    {
      fieldCode: "associateNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNum").$D("关联单据号"),
    },
    {
      fieldCode: "allApplyFlag",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.allApplyFlag").$D("是否完全核销"),
      fieldType: "SELECT",
      lovCode: "HPFM.FLAG",
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/pre-payment-lines/${settleHeaderId}`,
      method: "get",
    },
  },
});

export const hxDS = (prepaymentLineId) => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  queryParameter: {
    prepaymentLineId,
  },
  fields: [
    {
      fieldCode: "settleTransactionNum",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.components.operationAudit.settleTransactionNum").$D("结算事务编号"),
    },
    {
      fieldCode: "settleNum",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.components.operationAudit.settleNum").$D("关联结算单号"),
    },
    {
      fieldCode: "lineNum",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.components.operationAudit.lineNum").$D("关联结算行号"),
    },
    {
      fieldCode: "applyAmount",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.components.operationAudit.applyAmount").$D("核销金额"),
    },
    {
      fieldCode: "settleStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("hzero.common.components.operationAudit.settleStatusMeaning").$D("关联结算单状态"),
    },
  ],
  transport: {
    read: {
      url: `/ssta/v1/${tenantId}/pre-payment-lines/write/off/record/${prepaymentLineId}`,
      method: "get",
    },
  },
});
