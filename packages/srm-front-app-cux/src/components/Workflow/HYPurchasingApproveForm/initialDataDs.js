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
        fieldName: "采购决议评审单号",
        fieldCode: "decisionReviewNumber",
        langCode: "scux.procurementDecisionReview.model.decisionReviewNumber",
      },
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
        fieldName: "采购决议审批描述",
        fieldCode: "reviewDescription",
        langCode: "scux.procurementDecisionReview.model.reviewDescriptionD",
        disabled: true,
      },
      {
        fieldName: "采购策略",
        fieldCode: "procurementStrategy",
        fieldType: "SELECT",
        displayField: "procurementStrategyMeaning",
        langCode: "scux.procurementDecisionReview.model.procurementStrategyMeaning",
        lovCode: "SCUX_HYGY_PROCURMENT_STRATEGY",
        required: true,
        disabled: true,
      },
      {
        fieldName: "是否紧急采购",
        fieldCode: "urgencyProcurementFlag",
        langCode: "scux.procurementDecisionReview.model.urgencyProcurementFlagMeaning",
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        displayField: "urgencyProcurementFlagMeaning",
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
        fieldName: "采购金额（元）",
        fieldCode: "purchaseAmount",
        inputType: "number",
        langCode: "scux.procurementDecisionReview.model.purchaseAmountD",
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
        disabled: true,
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/hygy-decision-reviews/{changeReqId}`,
        method: "get",
      },
    },

  };
}

export default indexDatasource;
