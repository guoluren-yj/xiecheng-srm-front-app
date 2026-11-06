import { SrmUtil, $T } from "srm-mobile-ui";

function headerData() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "batchSettleNum",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.batchSettleNum",
        ).$D("批量审批单据号"),
      },
      {
        fieldCode: "createdByMeaning",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.createdByMeaning",
        ).$D("发起人"),
      },
      {
        fieldCode: "createdUnitIdMeaning",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.createdUnitIdMeaning",
        ).$D("发起部门"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.companyName").$D(
          "公司",
        ),
      },
      {
        fieldCode: "attributeDecimal1",
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.currencyCode").$D(
          "币种",
        ),
      },
      {
        fieldCode: "documentTypeMeaning",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.documentTypeMeaning",
        ).$D("结算单类型"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.creationDate",
        ).$D("发起时间"),
      },
      {
        fieldCode: "attributeLongtext4",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.attributeLongtext2",
        ).$D("补充附件"),
      },
      {
        fieldCode: "attributeLongtext2",
        fieldName: $T(
          "scux.PylontechSettlementBatchStatementSubmitForm.model.attributeLongtext3",
        ).$D("说明"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YpDP74B8xtyL9Bicg5AwaZMS2nAweKTCMaukP1AzVP0A?type=header`,
        method: "get",
      },
    },
  };
}

function lineInfoDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "index",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.index").$D("序号"),
      },
      {
        fieldCode: "settleNum",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.settleNum").$D("结算单编号"),
      },
      {
        fieldCode: "supplierIdMeaning",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "companyIdMeaning",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.companyIdMeaning").$D("公司"),
      },
      {
        fieldCode: "paymentAmount",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.paymentAmount").$D(
          "实际付款金额",
        ),
      },
      {
        fieldCode: "invoiceTaxIncludedAmount",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.invoiceTaxIncludedAmount").$D(
          "发票金额",
        ),
      },
      {
        fieldCode: "prepaymentAmount",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.prepaymentAmount").$D(
          "预付金额",
        ),
      },
      {
        fieldCode: "remark",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.remark").$D(
          "备注",
        ),
      },
      {
        fieldCode: "attributeLongtext1",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.attributeLongtext1").$D(
          "用途",
        ),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("scux.PylontechSettlementBatchStatementSubmitForm.model.attachmentUuid").$D("附件"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YpDP74B8xtyL9Bicg5AwaZMS2nAweKTCMaukP1AzVP0A?type=details`,
        method: "get",
      },
    },
  };
}

export { headerData, lineInfoDs };
