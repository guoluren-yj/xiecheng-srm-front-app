import { SrmUtil, $T } from "srm-mobile-ui";
const tenantId = SrmUtil.getTenantId();

// const customizeUnitCode = [ "SMBL.SUPPLY_SETTLE.PRE_BASIC_INFO", "SMBL.SUPPLY_SETTLE.PRE_PAYMENT_INFO", "SMBL.SUPPLY_SETTLE.PRE_PAYMENT_OTHER_INFO", "SMBL.SUPPLY_SETTLE.PRE_OTHER_ENCLOSURE" ].join();

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
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleNum").$D("结算单编号"),
      type: "info",
    },
    {
      fieldCode: "settleStatusMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleStatus").$D("结算单状态"),
      type: "info",
    },
    {
      fieldCode: "campMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.camp").$D("创建方阵营"),
      type: "info",
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.supplySettle.model.supplySettle.creationDate").$D("创建日期"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
      type: "info",
    },
    {
      fieldCode: "createdUserName",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.createdUserName").$D("创建人"),
      type: "info",
    },
    {
      fieldCode: "settleTypeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.documentType").$D("结算单类型"),
      type: "info",
    },
    /**
     * 交易方信息
     */
    {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleCustomCompanyName")
        .$D("结算客户公司名称"),
      type: "info",
    },
    {
      fieldCode: "companyNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleCustomCompanyNum")
        .$D("结算客户公司编号"),
      type: "info",
    },
    {
      fieldCode: "currencyCode",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.currencyCode").$D("币种"),
      type: "info",
    },
    {
      fieldCode: "supplierCompanyNum",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleSupplierNum")
        .$D("结算供应商编码"),
      type: "info",
    },
    {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.settleSupplierName")
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
      fieldName: $T("ssta.supplySettle.model.supplySettle.supplierSiteLov").$D("供应商地点"),
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
      fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionType").$D("预收款类型"),
      type: "pay",
    },
    {
      fieldCode: "prepaymentAmount",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionAmount")
        .$D("预收款总金额"),
      type: "pay",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.supplySettle.model.supplySettle.bankId").$D("收款银行"),
      fieldType: "TEXT",
      fieldCode: "bankName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.supplySettle.model.supplySettle.bankBranchName").$D("收款开户行"),
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
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.bankAccountName")
        .$D("收款银行账户名称"),
      fieldType: "TEXT",
      fieldCode: "bankAccountName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.collectionMethod")
        .$D("收款方式"),
      fieldType: "TEXT",
      fieldCode: "paymentTypeName",
      type: "pay",
    },
    {
      fieldName: $T("ssta.supplySettle.model.supplySettle.collectionCondition").$D("收款条件"),
      fieldType: "TEXT",
      fieldCode: "paymentCondition",
      type: "pay",
    },
    {
      fieldName: $T("ssta.supplySettle.model.supplySettle.collectionMethod")
        .$D("收款方式"),
      fieldType: "TEXT",
      fieldCode: "paymentMethod",
      type: "pay",
    },
    {
      fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.expectCollectionDate")
        .$D("期望收款日期"),
      fieldType: "DATE_PICKER",
      fieldCode: "expectPaymentDate",
      options: { format: "yyyy-MM-dd" },
      editor: false,
      type: "pay",
    },
    {
      fieldCode: "remark",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.remark").$D("备注"),
      type: "info",
    },
    {
      fieldCode: "canceledReason",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.canceledReason").$D("取消原因"),
      type: "info",
      visible: (val, item) => ![ "NEW", "SUBMITED" ].includes(item.settleStatus),
    },
    {
      fieldCode: "confirmCollaborativeModeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.confirmCollaborativeMode")
        .$D("协同模式-确认"),
      type: "other",
    },
    {
      fieldCode: "confirmApproveMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.confirmApproveMethod")
        .$D("审批方式-确认"),
      type: "other",
    },
    {
      fieldCode: "cancelCollaborativeModeMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.cancelCollaborativeMode")
        .$D("协同模式-取消"),
      type: "other",
    },
    {
      fieldCode: "cancelApproveMethodMeaning",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.cancelApproveMethod")
        .$D("审批方式-取消"),
      type: "other",
    },
    {
      fieldCode: "approvedRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.approvedRemark")
        .$D("审批意见-确认"),
      type: "info",
      visible: (val, item) => item.settleStatus !== "NEW",
    },
    {
      fieldCode: "canceledRemark",
      fieldType: "TEXT",
      fieldName: $T("ssta.supplySettle.model.supplySettle.canceledRemark")
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
      fieldName: $T("ssta.supplySettlePool.model.supplySettlePool.purchaserEnclosure")
        .$D("销售方附件"),
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
    // customizeUnitCode: "SMBL.SUPPLY_SETTLE.PRE_TRANSACTIONDETAIL"
  },
  fields: [
    {
      fieldName: $T("ssta.supplySettle.model.supplySettle.lineNum").$D("结算单行号"),
      fieldType: "TEXT",
      fieldCode: "lineNum",
    },
    {
      fieldCode: "prepaymentAmount",
      fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionAmountBt")
        .$D("预收款金额"),
      fieldType: "TEXT",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldCode: "associateNum",
      fieldName: $T("ssta.supplySettle.model.supplySettle.associateNum").$D("关联单据号"),
      fieldType: "TEXT",
    },
    {
      fieldCode: "associateNumAndLineNum",
      fieldName: $T("ssta.supplySettle.model.supplySettle.associateNumAndLineNum")
        .$D("关联单据号 | 关联单据行号"),
      fieldType: "TEXT",
    },
    {
      fieldName: $T("ssta.supplySettle.view.message.model.supplySettle.associateAmount")
        .$D("关联单据金额"),
      fieldType: "TEXT",
      fieldCode: "associateAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.supplySettle.common.prepaymentApplyAmount").$D("已核销金额"),
      fieldType: "TEXT",
      fieldCode: "prepaymentApplyAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.supplySettle.common.itemName").$D("商品名称"),
      fieldType: "TEXT",
      fieldCode: "itemName",
    },
    {
      fieldName: $T("ssta.supplySettle.common.poItemName").$D("数量"),
      fieldType: "TEXT",
      fieldCode: "quantity",
    },
    {
      fieldName: $T("ssta.supplySettle.common.taxIncludedLineAmount").$D("含税行金额"),
      fieldType: "TEXT",
      fieldCode: "taxIncludedLineAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.supplySettle.common.lineAmount1").$D("不含税行金额"),
      fieldType: "TEXT",
      fieldCode: "lineAmount",
      render: (val, record) => SrmUtil.getNumberLocalized(val, record.amountPrecision),
    },
    {
      fieldName: $T("ssta.supplySettle.common.categoryName").$D("品类"),
      fieldType: "TEXT",
      fieldCode: "categoryName",
    },
    {
      fieldName: $T("ssta.supplySettle.common.poCreatedName").$D("订单创建人"),
      fieldType: "TEXT",
      fieldCode: "poCreatedName",
    },
    {
      fieldName: $T("ssta.supplySettle.common.poCreationDate").$D("订单创建时间"),
      fieldCode: "poCreationDate",
      fieldType: "DATE_PICKER",
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldName: $T("hzero.common.option").$D("操作"),
      fieldType: "TEXT",
      fieldCode: "operate",
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

