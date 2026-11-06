function indexDatasource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: false,
    queryParameter: {},
    fields: [
      {
        fieldName: "招标编号",
        fieldCode: "bidNumber",
        langCode: "scux.bidEvaluationReport.model.bidNumber",
      },
      {
        fieldName: "采购方案评审单号",
        fieldCode: "schemeReviewNumber",
        langCode: "scux.bidEvaluationReport.model.schemeReviewNumber",
      },
      {
        fieldName: "品类经理",
        fieldCode: "categoryManagerName",
        langCode: "scux.bidEvaluationReport.model.categoryManager",
      },
      {
        fieldName: "采购策略",
        fieldCode: "procurementStrategy",
        fieldType: "SELECT",
        displayField: "procurementStrategyMeaning",
        lovCode: "SCUX.PROCUREMENT_STRATEGY",
        langCode: "scux.bidEvaluationReport.model.procurementStrategyMeaning",
        required: true,
        disabled: true,
      },
      {
        fieldName: "项目名称",
        fieldCode: "projectName",
        langCode: "scux.bidEvaluationReport.model.projectName",
        disabled: true,
      },

      {
        fieldName: "采购金额（元）",
        fieldCode: "procurementAmount",
        langCode: "scux.bidEvaluationReport.model.procurementAmount",
        required: true,
        disabled: true,
      },
      {
        fieldName: "审批矩阵",
        fieldCode: "approvalMatrix",
        langCode: "scux.bidEvaluationReport.model.approvalMatrix",
      },
      {
        fieldName: "附件上传",
        fieldCode: "uploadUuid",
        fieldType: "UPLOAD",
        showCount: true,
        langCode: "scux.bidEvaluationReport.model.uploadUuid",
      },
      {
        fieldName: "项目简介",
        fieldCode: "projectIntroduction",
        langCode: "scux.bidEvaluationReport.model.projectIntroduction",
        disabled: true,
      },
      {
        fieldName: "招标过程简介",
        fieldCode: "tenderProcessIntroduction",
        langCode: "scux.bidEvaluationReport.model.tenderProcessIntroduction",
        disabled: true,
      },
      {
        fieldName: "评标情况",
        fieldCode: "evaluationSituation",
        langCode: "scux.bidEvaluationReport.model.evaluationSituation",
        disabled: true,
      },
      {
        fieldName: "评标结果",
        fieldCode: "evaluationResult",
        langCode: "scux.bidEvaluationReport.model.evaluationResult",
        disabled: true,
      }
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/hygy-evaluation-reports/{changeReqId}`,
        method: "get",
      },
    },

  };
}

export default indexDatasource;
