import { $T, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";

function receiveHeaderDs(vue) {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "displayTrxNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.displayTrxNum").$D("单据编号"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.supplierCompanyName").$D("供应商"),
      },
      {
        fieldCode: "nodeConfigName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.nodeConfigName").$D("收货节点"),
      },
      {
        fieldCode: "returnedFlag",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogReturnedThings").$D("收货/退回"),
      },
      {
        fieldCode: "rcvTrxTypeId",
        // fieldType: "LOV",
        fieldName: $T("sinv.receiptWorkbench.model.receipt.rcvTypeReName").$D("收货类型"),
        // lovCode: "SPUC.SINV_MOVE_TYPE",
        displayField: "rcvTypeName",
        required: true,
        disabled: (i, item) => item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)
      },
      {
        fieldCode: "creationName",
        fieldType: "TEXT",
        fieldName: $T("sinv.receipWorkbench.model.receipt.creationName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sinv.receiptExecution.model.receipt.creationDateTime").$D("创建时间"),
        editor: false,
        timePicker: true
      },
      {
        fieldCode: "unitIds",
        fieldType: "LOV",
        displayField: "unitNames",
        lovCode: "SPFM.USER_AUTHORITY_UNIT",
        fieldName: $T("sinv.receiptExecution.model.receipt.unitAll").$D("创建人部门"),
        disabled: (i, item) => item.rcvStatusCode === "40_FINISHED" || item.rcvStatusCode === "20_SUBMITTED" || item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode),
        editor: (i, item) => item.rcvStatusCode !== "40_FINISHED" && item.rcvStatusCode !== "20_SUBMITTED",
        // required: true
      },
      {
        fieldCode: "receiveLocationAddress",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.receiveLocationAddress").$D("收货地点"),
        disabled: (i, item) => item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)
      },
      {
        fieldCode: "receiveDetailAddress",
        fieldType: "INPUT",
        fieldName: $T("sinv.receiptExecution.model.receipt.receiveDetailAddress").$D("收货详细地点"),
        editor: (val, item) => [ "10_NEW" ].includes(item.rcvStatusCode) || (item.sourceCode === "SRM" || item.sourceCode === "SRM_MALL") && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode),
      },
      {
        fieldCode: "rcvStatusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.aogRcvStatusCode").$D("收货单状态"),
      }, {
        fieldCode: "totalQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.invoicesQuantity").$D("单据总数"),
        editor: false,
      },
      {
        fieldCode: "totalTaxIncludedAmount",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sinv.receiptExecution.model.receipt.totalTaxIncludedAmount").$D("汇总金额"),
        editor: false,
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT_AREA",
        fieldName: $T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
        disabled: (i, item) => item.sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(item.rcvStatusCode)
      },
      {
        fieldCode: "hidePriceFlag",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/workbench/trx/header/{rcvTrxHeaderId}/detail`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, result) => {
        if (result[0]) {
          //头上金额先进行隐藏，根据行的隐藏状态判断头隐藏是否方案
          result[0]["totalTaxIncludedAmountTemp"] = result[0]["totalTaxIncludedAmount"];
          result[0]["totalTaxIncludedAmount"] = "***";
          result[0].attachmentTemplateUuid = result[0].attachmentTemplateUuid || uuid();
          result[0].sinvHeaderAttachmentUuid = result[0].sinvHeaderAttachmentUuid || uuid();
          result[0]["mobileHeaderAttachmentUuids"] = [];
          console.info(vue.returnFlag, vue.returnFlag === 0, "ffffffff");
          if (Number(vue.returnFlag) === 0) {
            result[0]["mobileHeaderAttachmentUuids"].push({
              title: $T("sinv.receiptExecution.model.receipt.attachmentTemplateUuid").$D("附件模板"),
              attachmentUuid: result[0].attachmentTemplateUuid,
              readOnly: true,
              bucketName: "private-bucket"
            });
          }
          result[0]["mobileHeaderAttachmentUuids"].push({
            title: $T("sinv.receiptExecution.model.uploadFile").$D("上传附件"),
            attachmentUuid: result[0].sinvHeaderAttachmentUuid,
            readOnly: result[0].rcvStatusCode === "40_FINISHED" || result[0].sourceCode !== "SRM" && [ "30_REJECTED", "30_SUP_REJECTED" ].includes(result[0].rcvStatusCode),
            required: true,
            bucketName: "private-bucket"
          });
          //行数据
          vue.lineDataSet.reset();
          vue.lineDataSet.addPathParameter("rcvTrxHeaderId", result[0].rcvTrxHeaderId);
          vue.lineDataSet.addQueryParameter("customizeUnitCode", vue.customizeUnitCodes[vue.returnFlag].line + vue.nodeConfigIndexAbc);
          vue.lineDataSet.refresh();
        }
      },
    }
  };

}

export { receiveHeaderDs };
