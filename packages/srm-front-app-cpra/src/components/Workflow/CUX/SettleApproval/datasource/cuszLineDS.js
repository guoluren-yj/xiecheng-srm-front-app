import { SrmUtil, $T } from "srm-mobile-ui";

function cuszLineDS(documentType, settleHeaderId) {
  const shortType = documentType === "INVOICE" ? "INV" : "PAY";
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      documentType,
      documentId: settleHeaderId,
      customizeUnitCode: `SMBL.WORKFLOW.SETTLE_APPROVAL.${shortType}_CUSZ_LINES`,
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "attributeVarchar11",
        fieldType: "TEXT",
        fieldName: $T("hzero.common.view.serialNumber").$D("序号"),
      },
      {
        fieldCode: "attributeVarchar1",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum").$D("结算事务来源编号"),
      },
      {
        fieldCode: "attributeDecimal1",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.taxHavaMoney").$D("开票金额(含税)"),
      },
      {
        fieldCode: "attributeDecimal2",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.supplySettlePool.model.supplySettlePool.netAmountsy").$D("开票金额（不含税）"),
      },
      {
        fieldCode: "attributeDecimal4",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.adjustTaxAmount").$D("尾差税额调整金额"),
      },
      {
        fieldCode: "attributeDecimal3",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.purchaseSettlePool.model.purchaseSettlePool.adjustAmount").$D("尾差调整金额（不含税）"),
      },
      {
        fieldCode: "attributeVarchar3",
        fieldType: "TEXT",
        fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum").$D("发票申请"),
      },
      {
        fieldCode: "attributeVarchar6",
        fieldType: "TEXT",
        fieldName: $T("ssta.common.model.receipt.receivingNum").$D("收货单编号"),
      },
      {
        fieldCode: "attributeDecimal5",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.ec.bill.line.model.ec.taxIncludedAmount").$D("含税金额"),
      },
      {
        fieldCode: "attributeDecimal6",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.ec.bill.line.model.ec.netAmount").$D("不含税金额"),
      },
      {
        fieldCode: "attributeDecimal7",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.ec.bill.line.model.ec.taxRate").$D("税率"),
      },
      {
        fieldCode: "attributeDecimal8",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.common.model.common.taxAamount").$D("税额"),
      },
      {
        fieldCode: "attributeVarchar28",
        fieldType: "TEXT",
        fieldName: $T("ssta.common.model.common.invoiceTitle").$D("开票抬头"),
      },
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-expand-lines/list",
        method: "get",
      },
    },
  };
}

function cuszLineListDS(ids, precision) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { ids },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "paymentApplyLineNo",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.paymentApplyLineNo").$D("付款申请单行号"),
      },
      {
        fieldCode: "numAndLine",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.sourceSettleNoAndLineNo").$D("结算事务来源编号-行号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.allocationLineNo").$D("分摊行号"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.materialCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.materialName").$D("物料名称"),
      },
      {
        fieldCode: "dataSource",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.sourceDocType").$D("来源单据类型"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.unit").$D("单位"),
      },
      {
        fieldCode: "quantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.quantity").$D("数量"),
      },
      {
        fieldCode: "costCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.costCenterCode").$D("成本中心"),
      },
      {
        fieldCode: "costName",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.costCenterName").$D("成本中心名称"),
      },
      {
        fieldCode: "attributeVarchar8",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.accountCode").$D("会计科目"),
      },
      {
        fieldCode: "attributeVarchar8Meaning",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.accountDes").$D("会计科目描述"),
      },
      {
        fieldCode: "attributeVarchar15",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.CPNorVVCode").$D("CPN/VV Code"),
      },
      {
        fieldCode: "taskCode",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.taskCode").$D("Task Code"),
      },
      {
        fieldCode: "taxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.taxIncludedAmount").$D("含税金额"),
        precision,
      },
      {
        fieldCode: "poAndNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.poNoAndLineNo").$D("PO号-行号"),
      },
      {
        fieldCode: "attributeVarchar18",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.releaseNo").$D("Release号"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.agreementNo").$D("协议编号"),
      },
    ],
    transport: {
      read: {
        url: "/marmot/v1/{tenantId}/marmot-api/ewfYbYGyAxD1hI36waSeaZh89T64JS0LiaGcNNNPkllTF7jhKgzFZoTfrNT95CH3f",
        method: "get",
      },
    },
  };
}

export { cuszLineDS, cuszLineListDS };
