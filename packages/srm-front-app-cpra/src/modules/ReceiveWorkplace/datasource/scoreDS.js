import { $T, SrmUtil } from "srm-mobile-ui";

function scoreDs() {
  return {
    // autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: true,
    editFlag: true,
    forceValidate:true,
    fields: [
      {
        fieldCode: "overallScore",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.overallEvaluate").$D("总体评价"),
      },
      {
        fieldCode: "overallEvaluate",
        fieldType: "TEXT_AREA",
        fieldName: $T("sinv.receiptExecution.model.receipt.overallEvaluate").$D("总体评价"),
        height:76,
        maxLength:150,
      },
      {
        fieldCode: "deliveryScore",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.deliveryEvaluate").$D("交期评价"),
      },
      {
        fieldCode: "deliveryEvaluate",
        fieldType: "TEXT_AREA",
        fieldName:$T("sinv.receiptExecution.model.receipt.deliveryEvaluate").$D("交期评价"),
        height:76,
        maxLength:150,
      },
      {
        fieldCode: "qualityScore",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.qualityEvaluate").$D("质量评价"),
      },
      {
        fieldCode: "qualityEvaluate",
        fieldType: "TEXT_AREA",
        fieldName:$T("sinv.receiptExecution.model.receipt.qualityEvaluate").$D("质量评价"),
        height:76,
        maxLength:150,
      },
      {
        fieldCode: "serviceScore",
        fieldType: "TEXT",
        fieldName: $T("sinv.receiptExecution.model.receipt.rcvTypeName.serviceEvaluate").$D("服务评价"),
      },
      {
        fieldCode: "serviceEvaluate",
        fieldType: "TEXT_AREA",
        fieldName:$T("sinv.receiptExecution.model.receipt.rcvTypeName.serviceEvaluate").$D("服务评价"),
        height:76,
        maxLength:150,
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/sinv/rcv/trx/score/{rcvTrxHeaderId}/detail?customizeUnitCode=SINV.RECEIPT_WORKBENCH_THING.DETAIL.F`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, result) => {
        if (result && result.length === 0) {
          let temp = {};
          ds.fields.forEach((item) => {
            console.info(item.fieldCode, "lll");
            temp[item.fieldCode] = null;
          });
          result.push(temp);
        }
        // if (vue.scoreOpenFlag) {
        //   vue.scorePopupFlag = true;
        // }
      },
    }
  };
}

export { scoreDs };