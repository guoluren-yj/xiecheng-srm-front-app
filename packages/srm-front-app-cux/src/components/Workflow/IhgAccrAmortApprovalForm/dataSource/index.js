import { $T, SrmUtil } from "srm-mobile-ui";

function headerData(accrAmortHeaderId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      accrAmortHeaderId,
    },
    fields: [
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.documentNum").$D("预提摊销单编号"),
        fieldCode: "documentNum",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.createBy").$D("创建人"),
        fieldCode: "createdByName",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.documentType").$D("单据类型"),
        fieldCode: "documentTypeMeaning",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.cuxAccrAmortPeriod").$D("预提摊销期间"),
        fieldCode: "accrAmortPeriod",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.cuxCompanyName").$D(
          "公司名称",
        ),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.cuxSupplierCompanyName").$D(
          "供应商名称",
        ),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.accrAmortAmount").$D(
          "预提摊销总金额",
        ),
        fieldCode: "accrAmortAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.reverseAccrAmount").$D("冲销预提总金额"),
        fieldCode: "reverseAccrAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.remark").$D("备注"),
        fieldCode: "remark",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.currencyCode").$D("币种"),
        fieldCode: "currencyCode",
      },
      {
        fieldCode: "purchaserInnerAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.view.enterAttachment").$D("内部附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}/>
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ihg-accr-amort-headers/detail/${accrAmortHeaderId}`,
        method: "get",
      },
    },
  };
}

function lineInfoDs(accrAmortHeaderId) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.lineNum").$D("预提摊销单行号"),
        fieldCode: "lineNum",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.accrAmortNum").$D("预提摊销单事物编号"),
        fieldCode: "accrAmortNum",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.lineDocumentType").$D("预提摊销类型"),
        fieldCode: "documentTypeMeaning",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.displayPoNum").$D("订单编号"),
        fieldCode: "poNum",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.displayPoLineNum").$D("订单行号"),
        fieldCode: "poLineNum",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.itemName").$D("物料名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.currentAccrAmortSystemAmount").$D("本次预提摊销金额（系统计算）"),
        fieldCode: "currentAccrAmortSystemAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.currentAccrAmortAmount").$D("本次预提摊销金额"),
        fieldCode: "currentAccrAmortAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.currentReverseAccrAmount").$D("本次冲销预提金额"),
        fieldCode: "currentReverseAccrAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.cumPayNetAmount").$D("累计支付金额（不含税）"),
        fieldCode: "cumPayNetAmount",
      },
      {
        fieldName: $T("scux.prepaidAmortizationBill.model.cumPayTaxIncludedAmount").$D("累计支付金额（含税）"),
        fieldCode: "cumPayTaxIncludedAmount",
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ihg-accr-amort-lines/detail/${accrAmortHeaderId}`,
        method: "get",
      },
    },
  };
}
function attachmentInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldCode: "purchaserInnerAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.view.enterAttachment").$D("内部附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}/>
      },
    ],
  };
}

export { headerData, attachmentInfo, lineInfoDs };
