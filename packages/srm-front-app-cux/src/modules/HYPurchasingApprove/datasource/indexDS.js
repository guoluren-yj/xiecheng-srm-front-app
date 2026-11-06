import { $T } from "srm-mobile-ui";
// eslint-disable-next-line no-unused-vars
function srmListExampleDS(vm) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    // table表单显示的字段
    fields: [
      {
        fieldCode:"schemeReviewId",
      },
      {
        fieldCode:"processName",
      },
      {
        fieldCode:"applicationUserName",
      },
      {
        fieldCode:"applicationTime",
      },
      {
        fieldCode: "schemeReviewNumber",
      },
      {
        fieldCode:"reviewDescription",
      },
      {
        fieldCode:"currentTaskId",
      },
      {
        fieldCode:"processDefinitionId",
      },
      {
        fieldCode:"processInstanceId",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.categoryManager").$D("品类经理"),
        fieldCode: "categoryManager",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.materialName").$D("物资名称"),
        fieldCode: "materialName",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.materialCategory").$D("物资品类"),
        fieldCode: "materialCategory",
      },
      {
        fieldCode: "procurementStrategyMeaning",
        fieldName: $T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略"),
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.purchaseAmountPg").$D("预估金额（元）"),
        fieldCode: "purchaseAmount",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.applicationUserName").$D("申请人手机号"),
        fieldCode: "applicationUserName",
      },
      {
        fieldName: $T("spcm.common.view.message.title.purchaseAttachmentList").$D("附件信息"),
        fieldCode:"attachmentUuid",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.remark").$D("相关说明"),
        fieldCode: "remark",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "categoryManager",
        fieldType: "TEXT",
        fieldName: $T("scux.procurementDecisionReview.model.common.categoryManager").$D("品类经理"),
      },
      {
        fieldCode: "schemeReviewNumber",
        fieldType: "TEXT",
        fieldName: $T("scux.procurementDecisionReview.model.common.schemeReviewNumber").$D("单号"),
      },
      {
        fieldCode: "materialName",
        fieldType: "TEXT",
        fieldName: $T("scux.procurementDecisionReview.model.common.materialName").$D("物资名称/项目名称"),
      },
    ],
    transport: {
      read: {
        url:`/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/GLJ52AX2yQhB4jeXVjBLybtP9T9MjibpaKdsqrltHam4`,
        method: "get",
        params: { requestType: "cgfa" },
      },
    },
    buttons: [
    ],
    setData(data) {
      this.data = data;
    },
    clear() {
      this.setData([]);
    },
  };
}

export default srmListExampleDS;
