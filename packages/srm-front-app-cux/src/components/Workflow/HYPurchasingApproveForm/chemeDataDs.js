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
        fieldName: "采购方案评审单号",
        fieldCode: "schemeReviewNumber",
        langCode: "scux.procurementDecisionReview.model.schemeReviewNumber",
      },
      {
        fieldName: "品类经理",
        fieldCode: "categoryManager",
        langCode: "scux.procurementDecisionReview.model.categoryManager",
      },
      {
        fieldName: "部门/项目",
        fieldCode: "department",
        fieldType: "SELECT",
        displayField: "departmentMeaning",
        lovCode: "SCUX_HYGY_REVIEW_DEPARTMENT",
        langCode: "scux.procurementDecisionReview.model.departmentMeaning",
        required: true,
        disabled: true,
      },
      {
        fieldName: "采购方案评审描述",
        fieldCode: "reviewDescription",
        langCode: "scux.procurementDecisionReview.model.reviewDescriptionP",
        disabled: true,
      },
      {
        fieldName: "采购策略",
        fieldCode: "procurementStrategy",
        fieldType: "SELECT",
        displayField: "procurementStrategyMeaning",
        langCode: "scux.procurementDecisionReview.model.procurementStrategyMeaning",
        lovCode: "SCUX_HYGY_SCHEME_STRATEGY",
        required: true,
        disabled: true,
      },
      {
        fieldName: "物资名称",
        fieldCode: "materialName",
        langCode: "scux.procurementDecisionReview.model.materialName",
        required: true,
        disabled: true,
      },
      {
        fieldName: "物资品类",
        fieldCode: "materialCategory",
        langCode: "scux.procurementDecisionReview.model.materialCategory",
        disabled: true,
      },
      {
        fieldName: "预估金额（元）",
        fieldCode: "purchaseAmount",
        inputType: "number",
        langCode: "scux.procurementDecisionReview.model.purchaseAmountP",
        disabled: true,
      },

      {
        fieldName: "审批矩阵",
        fieldCode: "approvalMatrix",
        langCode: "scux.procurementDecisionReview.model.approvalMatrix",
      },

      {
        fieldName: "附件上传",
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        showCount: true,
        langCode: "scux.procurementDecisionReview.model.attachmentUuid",
      },
      {
        fieldName: "相关说明",
        fieldCode: "remark",
        langCode: "scux.procurementDecisionReview.model.remark",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/hygy-scheme-reviews/{changeReqId}`,
        method: "get",
      },
    },

  };
}

export default indexDatasource;
