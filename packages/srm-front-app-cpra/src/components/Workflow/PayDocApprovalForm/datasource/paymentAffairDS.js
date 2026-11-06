import { SrmUtil, $T } from "srm-mobile-ui";
import { transformSearchBarData } from "../utils";
const amountPrecision = (val, record) => val && record.amountPrecision;

export const headerDS = (payId) => ({
  autoQuery: true,
  editable: false,
  enableQuery: false,
  forceValidate: true,
  fields: [
    {
      fieldCode: "companyNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.companyNum").$D("公司编码"),
    },
    {
      fieldCode: "companyName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.companyName").$D("公司名称"),
    },
    {
      fieldCode: "displaySupplierNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierNum").$D("供应商编码"),
    },
    {
      fieldCode: "displaySupplierName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierName").$D("供应商名称"),
    },
    {
      fieldCode: "payBankName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseBankName").$D("采购方银行名称"),
    },
    {
      fieldCode: "payBankBranchName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseBankBranchName").$D("采购方开户行名称"),
    },
    {
      fieldCode: "payBankFirm",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseBankBranchCode").$D("采购方联行行号"),
    },
    {
      fieldCode: "payBankAccountNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseBankAccount").$D("采购方银行账号"),
    },
    {
      fieldCode: "payBankAccountName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseBankAccountName").$D("采购方银行账号名称"),
    },
    {
      fieldCode: "bankName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierBankName").$D("供应商银行名称"),
    },
    {
      fieldCode: "bankBranchName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierBankBranchName").$D("供应商开户行名称"),
    },
    {
      fieldCode: "bankFirm",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierBankBranchCode").$D("供应商联行行号"),
    },
    {
      fieldCode: "bankAccountNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierBankAccount").$D("供应商银行账号"),
    },
    {
      fieldCode: "bankAccountName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierBankAccountName").$D("供应商银行账号名称"),
    },
    {
      fieldCode: "ouName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.businessEntity").$D("业务实体"),
    },
    {
      fieldCode: "supplierSiteName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.supplierSite").$D("供应商地点"),
    },
    {
      fieldCode: "payNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.payTransactionNum").$D("支付事务编号"),
    },
    {
      fieldCode: "payErrorNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.errorPoolTransactionNum").$D("错误池事务编号"),
    },
    {
      fieldCode: "documentSystemMeaning",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.dataSourceSystem").$D("数据来源系统"),
    },
    {
      fieldCode: "documentTypeMeaning",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.dataSourceType").$D("数据来源类型"),
    },
    {
      fieldCode: "payAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.pendingTotalAmount").$D("待支付总金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.currency").$D("币种"),
    },
    {
      fieldCode: "payTypeName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentMethod").$D("付款方式"),
    },
    {
      fieldCode: "payFormMeaning",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentForm").$D("付款形式"),
    },
    {
      fieldCode: "exPaymentDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.expectedPayDate").$D("期望付款日期"),
    },
    {
      fieldCode: "payStatus",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentStatus").$D("支付状态"),
      lovCode: "SBSM.PAY_POOL_STATUS",
    },
    {
      fieldCode: "documentNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.sourceTransactionCode").$D("来源事务编号"),
    },
    {
      fieldCode: "documentLineNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.sourceTransactionLineNum").$D("来源事务行号"),
    },
    {
      fieldCode: "itemCode",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.settlementGoodsCode").$D("结算商品编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.settlementGoodsName").$D("结算商品名称"),
    },
    {
      fieldCode: "srmPoNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseOrderCode").$D("采购订单编号"),
    },
    {
      fieldCode: "srmPoLineNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaseOrderLineNum").$D("采购订单行号"),
    },
    {
      fieldCode: "pcNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.agreementCode").$D("协议编码"),
    },
    {
      fieldCode: "pcSubjectLineNum",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.agreementLineNum").$D("协议标的行号"),
    },
    {
      fieldCode: "agentName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.purchaser").$D("采购员"),
    },
    {
      fieldCode: "createdByName",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.creator").$D("创建人"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.creationDate").$D("创建时间"),
      options: {
        format: "yyyy-MM-dd HH:mm:ss"
      }
    },
    {
      fieldCode: "paySavedAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentSavedAmount").$D("支付单已保存金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "payOccupyAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentSubmittedAmount").$D("支付单已提交金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "payCompleteAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentCheckedAmount").$D("支付单已审核金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "payingAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentDirectAmount").$D("支付单银企直联支付发起金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "paidAmount",
      fieldName: $T("sbsm.paymentPool.model.paymentPool.paymentCompletedAmount").$D("支付单支付完成金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
  ],
  pathParameter: {
    payId,
    tenantId: SrmUtil.getTenantId(),
  },
  transport: {
    read: {
      url: "/sbdm/v1/{tenantId}/pay-pools/detail/{payId}",
      method: "get",
    },
  },
});

export const executionDS = (payId) => ({
  editable: false,
  autoQuery: true,
  forceValidate: true,
  fields: [
    {
      fieldCode: "payHeaderNum",
      fieldName: $T("sbsm.paymentPool.model.execution.payDocNum").$D("支付单据编号"),
    },
    {
      fieldCode: "payLineNum",
      fieldName: $T("sbsm.paymentPool.model.execution.payDocLineNum").$D("支付单据行号"),
    },
    {
      fieldCode: "payAmount",
      fieldName: $T("sbsm.paymentPool.model.execution.payAmount").$D("支付金额"),
      fieldType: "INPUT_NUMBER",
      precision: amountPrecision,
    },
    {
      fieldCode: "recordTypeMeaning",
      fieldName: $T("sbsm.paymentPool.model.execution.payRecordType").$D("支付记录类型"),
    },
    {
      fieldCode: "recordStatusMeaning",
      fieldName: $T("sbsm.paymentPool.model.execution.paymentOperateType").$D("支付单操作类型"),
    },
    {
      fieldCode: "creationDate",
      fieldName: $T("sbsm.paymentPool.model.execution.operateDate").$D("操作日期"),
      fieldType: "DATE_PICKER",
    },
    {
      fieldCode: "operationSourceMeaning",
      fieldName: $T("sbsm.paymentPool.model.execution.operateSource").$D("操作来源"),
    },
    {
      fieldCode: "companyNum",
      fieldName: $T("sbsm.paymentPool.model.execution.docCompanyNum").$D("单据公司编码"),
    },
    {
      fieldCode: "companyName",
      fieldName: $T("sbsm.paymentPool.model.execution.docCompanyName").$D("单据公司名称"),
    },
    {
      fieldCode: "displaySupplierNum",
      fieldName: $T("sbsm.paymentPool.model.execution.docSupplierCompanyNum").$D("单据供应商公司编码"),
    },
    {
      fieldCode: "displaySupplierName",
      fieldName: $T("sbsm.paymentPool.model.execution.docSupplierCompanyName").$D("单据供应商公司名称"),
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("sbsm.paymentPool.model.execution.currency").$D("币种"),
    },
    {
      fieldCode: "payTypeName",
      fieldName: $T("sbsm.paymentPool.model.execution.thisPayMethod").$D("本次付款方式"),
    },
    {
      fieldCode: "payFormMeaning",
      fieldName: $T("sbsm.paymentPool.model.execution.thisPayForm").$D("本次付款形式"),
    },
  ],
  fastQueryField: [
    {
      fieldCode: "payHeaderNum",
      fieldType: "TEXT",
      fieldName: $T("sbsm.paymentPool.model.execution.payDocNum").$D("支付单据编号"),
    },
  ],
  queryFields: [
    {
      fieldCode: "creationDate",
      fieldName: $T("sbsm.paymentPool.model.execution.operateDate").$D("操作日期"),
      fieldType: "DATE_PICKER",
      selectType: "start-end",
      endDateFieldCode: "creationDate_end",
    },
    {
      fieldCode: "recordType",
      fieldType: "SELECT",
      fieldName: $T("sbsm.paymentPool.model.execution.payRecordType").$D("支付记录类型"),
      lovCode: "SBSM.PAY_POOL_RECORD_TYPE",
      options: { multiple: true },
    },
    {
      fieldCode: "recordStatus",
      fieldType: "SELECT",
      fieldName: $T("sbsm.paymentPool.model.execution.paymentOperateType").$D("支付单操作类型"),
      lovCode: "SBSM.PAY_POOL_RECORD_STATUS",
      options: { multiple: true },
    },
  ],
  queryParameter: {
    payId,
    customizeUnitCode: "SBSM.PAYMENT_POOL_DETAIL.EXECUTION_FILTER",
  },
  pathParameter: {
    tenantId: SrmUtil.getTenantId(),
  },
  transport: {
    read: {
      url: "/sbdm/v1/{tenantId}/pay-pool-stages/list",
      method: "get",
    },
  },
  events: {
    beforeQuery: transformSearchBarData,
  }
});