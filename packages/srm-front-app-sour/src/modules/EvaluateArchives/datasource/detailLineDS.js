import { $T } from "srm-mobile-ui";

function evalListDS(evalHeaderId, lineDataSetAfterQuery, lineDataSetBeforeUpdate, lineDataSetBeforeSubmit) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode: "SSLM.ARCHIVE_FILLING_DETAIL.FILLING_DETAIL,SSLM.ARCHIVE_FILLING_DETAIL.FILLING_SEARCH_FORM,SSLM.ARCHIVE_FILLING_DETAIL.LIST",
      pageEntryPoint: "CUSTOMER_OWNED",
    },
    fields: [
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplierNum").$D("公司编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplier").$D("供应商名称"),
      },
      {
        fieldCode: "erpSupplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderCode").$D("erp供应商编码"),
      },
      {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.model.archiveFilled.scoreItem").$D("评分细则"),
      },
      {
        fieldCode: "completeFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
      },
      {
        fieldCode: "evalStandard",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.standard").$D("评分标准说明"),
      },
      {
        fieldCode: "backReason",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.backReason").$D("退回原因"),
        visible: (val, item) => Number(item.completeFlag) === 2,
      },
      {
        fieldCode: "indicatorType",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
      },
      {
        fieldCode: "finalScore",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
        precision: 2,
        editor: (val, item) => item.indicatorType === "SCORE" && item.completeFlag !== 4,
        validator: (val, item) => item.get("indicatorType") !== "SCORE" || !val || Number(val) >= Number(item.get("scoreFrom") || 0) && Number(val) <= Number(item.get("scoreTo") || 0)
      },
      {
        fieldCode: "evalWeight",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evalWeight").$D("指标权重%"),
      },
      {
        fieldCode: "scoreFrom",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreFrom").$D("分值从"),
      },
      {
        fieldCode: "scoreTo",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreTo").$D("分值至"),
      },
      {
        fieldCode: "isStandard",
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        fieldName: $T("sslm.supplierDocManage.model.docManage.isStandard").$D("符合评分标准"),
        disabled: (val, item) => item.indicatorType !== "TICK" || item.completeFlag === 4,
        displayField: "isStandardChange",
      },
      {
        fieldCode: "isVeto",
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        fieldName: $T("sslm.supplierDocManage.model.docManage.isVeto").$D("否决该项"),
        disabled: (val, item) => item.indicatorType !== "VETO" || item.completeFlag === 4,
        displayField: "isVetoChange",
      },
      {
        fieldCode: "evalTplIndOptId",
        fieldType: "LOV",
        lovCode: "SSLM.KPI.INDICATOR.OPT.CFG",
        fieldName: $T("sslm.supplierDocManage.model.archiveFilled.indOptName").$D("评分选项"),
        editor: (val, item) => item.indicatorType === "OPT" && item.completeFlag !== 4,
        displayField: "indOptName",
        options: {
          displayField: "meaning",
          subDisplayField: "none",
          valueField: "value",
        }
      },
      {
        fieldCode: "remark",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
        editor: (val, item) => item.completeFlag !== 4,
      },
      {
        fieldCode: "scorerAttachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scorerAttachmentUuid").$D("附件上传"),
        canUpload: true,
      },
    ],
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "indicatorType",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
        lovCode: "SSLM.KPI_INDICATOR_TYPE",
      },
      {
        fieldCode: "supplierId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.vendor").$D("供应商"),
        lovCode: "SSLM.KPI_DTL_SUPPLIER",
      },
      {
        fieldCode: "evaluationIndicators",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationIndicators").$D("考评指标"),
        lovCode: "SSLM.KPI_DTL_INDICATOR",
        options: {
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "completeFlag",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
        lovCode: "SSLM.EVAL_COMPLETE_STATUS",
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/evaluation/{evalHeaderId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps",
        method: "put",
      },
      submit: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps/submit",
        method: "put",
      },
    },
    events: {
      afterQuery: lineDataSetAfterQuery,
      beforeUpdate: lineDataSetBeforeUpdate,
      beforeSubmit: lineDataSetBeforeSubmit,
    }
  };
}

export default evalListDS;
