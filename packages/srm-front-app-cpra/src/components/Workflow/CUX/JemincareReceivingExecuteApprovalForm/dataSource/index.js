import { SrmUtil, $T } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    forceValidate:true,
    queryParameter: {},
    fields: [ {
      fieldName: "displayTrxNum",
      fieldType: "EMPTY",
      fieldCode: "displayTrxNum",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName").$D("事务类型"),
      fieldType: "TEXT",
      fieldCode: "rcvTypeName",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.companyName").$D("公司"),
      fieldType: "TEXT",
      fieldCode: "companyName",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
      fieldType: "TEXT",
      fieldCode: "supplierName",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.creationName").$D("单据创建人"),
      fieldType: "TEXT",
      fieldCode: "creationName",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.creationDate").$D("创建日期"),
      fieldType: "TEXT",
      fieldCode: "creationDate",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.totalQuantity").$D("汇总数量"),
      fieldType: "INPUT_NUMBER",
      fieldCode: "totalQuantity",
      editor: false,
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.returnedFlag").$D("是否退回"),
      fieldType: "TEXT",
      fieldCode: "returnedFlag",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.attachmentTemplateUuid").$D("附件模板"),
      fieldType: "TEXT",
      fieldCode: "attachmentTemplateUuid",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.fileCheck").$D("附件查看"),
      fieldType: "TEXT",
      fieldCode: "sinvHeaderAttachmentUuid",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
      fieldType: "TEXT",
      fieldCode: "remark",
    }, {
      fieldName: $T("sinv.receiptExecution.model.receipt.attributeLongtext1").$D("验收说明"),
      fieldType: "TEXT_AREA",
      fieldCode: "attributeLongtext1",
      editor: (val, item) => item.editorFlag,
      required: (val, item) => item.editorFlag,
    }, ],
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

function lineDs () {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    forceValidate:true,
    queryParameter: {
      customizeUnitCode: null,
    },
    pathParameter: {
      id: null,
    },
    transport: {
      read: {
        url: `spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/line/{id}/detail`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  lineDs
};
