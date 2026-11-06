import { $T, SrmUtil } from "srm-mobile-ui";
import { transformSearchBarData } from "@/modules/SettleWorkbench/datasource/utils";

const amountPrecision = (val, record) => val && record.amountPrecision;

export const batchHeaderDS = (batchApproveId) => ({
  autoQuery: true,
  selection: Infinity,
  pathParameter: {
    batchApproveId,
    tenantId: SrmUtil.getTenantId(),
  },
  fields: [
    {
      fieldCode: "batchNum",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.batchApproveNum").$D("结算单批次号"),
    },
    {
      fieldCode: "createdName",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sponsor").$D("发起人"),
    },
    {
      fieldCode: "creationDate",
      fieldType: "DATE_PICKER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.riseTime").$D("发起时间"),
      options: { format: "yyyy-MM-dd" },
      editor: false,
    },
    {
      fieldCode: "settleTypeMeaning",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
    },
  ],
  transport: {
    read: {
      url: "/ssta/v1/{tenantId}/batch-approve/detail/{batchApproveId}",
      method: "get",
      params: {
        customizeUnitCode: "SMBL.WORKFLOW.SETTLE_BATCH_APPROVAL.BASIC",
      }
    },
  },
});

export const batchLineDS = (batchApproveId) => ({
  autoQuery: true,
  editable: false,
  pathParameter: {
    batchApproveId,
    tenantId: SrmUtil.getTenantId(),
  },
  fields: [
    {
      fieldCode: "settleNum",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号"),
    },
    {
      fieldCode: "companyName",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompany").$D("结算公司"),
    },
    {
      fieldCode: "supplierCompanyName",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplier").$D("结算供应商"),
    },
    {
      fieldCode: "paymentApplyAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paymentApplyAmount").$D("付款申请金额"),
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldCode: "paymentAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("ssta.common.model.common.actualPaymentAmountThisTime").$D("本次实际付款金额"),
      precision: amountPrecision,
      editor: false,
    },
    {
      fieldCode: "applyAmount",
      fieldType: "INPUT_NUMBER",
      fieldName: $T("ssta.purchaseSettle.common.applyAmount").$D("本次预付款核销金额"),
      precision: amountPrecision,
      editor: false,
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
  ],
  transport: {
    read: {
      url: "/ssta/v1/{tenantId}/batch-approve/{batchApproveId}/settle/page",
      method: "post",
      params: {
        customizeUnitCode: "SMBL.WORKFLOW.SETTLE_BATCH_APPROVAL.LINE,SSTA.PURCHASE_SETTLE_DETAIL.BATCH_PAY_LIST_SEARCH",
      }
    },
  },
  events: {
    beforeQuery: transformSearchBarData,
  }
});