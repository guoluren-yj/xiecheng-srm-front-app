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
        fieldCode:"pcNum",
      },
      {
        fieldCode:"currentTaskId",
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
        fieldCode:"purchaseAgent",
      },
      {
        fieldCode:"unitId",
      },
      {
        fieldCode:"creationDate",
      },
      {
        fieldCode:"startDateActive",
      },
      {
        fieldCode:"processDefinitionId",
      },
      {
        fieldCode:"processInstanceId",
      },
      {
        fieldCode:"schemeId",
      },
      {
        fieldCode:"decisionId",
      },
      {
        fieldCode:"evaluationId",
      },
      {
        fieldName: $T("sprm.common.model.common.contractName").$D("协议名称"),
        fieldCode: "pcName",
      },
      {
        fieldName: $T("smbl.common.view.queryCompanyName").$D("公司名称"),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("scux.soQuery.model.soQuery.supplierCompanyName").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("scux.analysisConfirm.model.brandName").$D("品名"),
        fieldCode: "productName",
      },
      {
        fieldName: $T("ssta.costSheet.model.costSheet.Amounts").$D("金额"),
        fieldCode: "contractAmount",
      },
      {
        fieldName: $T("sprm.common.model.common.currency").$D("币种"),
        fieldCode: "currencyDescription",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.sealAttatchment").$D("用章附件（文件）"),
        fieldCode: "electricalSignatureAttachmentUuid",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.contractFileUrl").$D("用章附件（文本）"),
        fieldCode: "contractFileUrl",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.unsealAttatchment").$D("非用章附件"),
        fieldCode: "purchaserAttachmentUuid",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.schemeReviewIdLov").$D("采购方案评审单号"),
        fieldCode: "schemeIdMeaning",
      },
      {
        fieldName: $T("scux.procurementDecisionReview.model.decisionReviewNumber").$D("采购决议评审单号"),
        fieldCode: "decisionIdMeaning",
      },
      {
        fieldName: $T("scux.bidEvaluationReport.view.title.bidEvaluationReport").$D("评标报告"),
        fieldCode: "evaluationIdMeaning",
      },
      {
        fieldName: $T("scux.bidEvaluationReport.view.title.frameworkContract").$D("框架合同"),
        fieldCode: "frameworkContractNumber",
      },
      {
        fieldName: $T("scux.bidEvaluationReport.view.title.mainPcNum").$D("主协议号"),
        fieldCode: "mainPcNum",
      },
      {
        fieldName: $T("scux.bidEvaluationReport.view.title.attributeVarchar21").$D("供应商是否拒绝"),
        fieldCode: "attributeVarchar21",
      },
      {
        fieldName: $T("smpc.common.excel.remark").$D("备注"),
        fieldCode: "remark",
      },
    ],
    fastQueryField: [
      {
        fieldCode: "purchaseAgent",
        fieldType: "TEXT",
        fieldName: $T("scux.purchaseRecordApproval.model.common.purchaseAgent").$D("品类经理"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T("scux.purchaseRecordApproval.model.common.pcNum").$D("单号"),
      },
      {
        fieldCode: "productName",
        fieldType: "TEXT",
        fieldName: $T("scux.purchaseRecordApproval.model.common.productName").$D("物资名称/项目名称"),
      },
    ],
    transport: {
      read: {
        url:`/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/GLJ52AX2yQhB4jeXVjBLybtP9T9MjibpaKdsqrltHam4`,
        method: "get",
        params: { requestType: "cgxy" },
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
