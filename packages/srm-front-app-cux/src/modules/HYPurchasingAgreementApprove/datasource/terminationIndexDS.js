import { $T } from "srm-mobile-ui";
// 协议终止
function agreementTermination() {
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
        fieldName: "协议名称",
        fieldCode: "pcName",
        langCode: "sprm.common.model.common.contractName",
      },
      {
        fieldName: "公司名称",
        fieldCode: "companyName",
        langCode: "smbl.common.view.queryCompanyName",
      },
      {
        fieldName: "供应商",
        fieldCode: "supplierCompanyName",
        langCode: "scux.soQuery.model.soQuery.supplierCompanyName",
      },
      {
        fieldName: "品名",
        fieldCode: "productName",
        langCode: "scux.analysisConfirm.model.brandName",
      },
      {
        fieldName: "金额",
        fieldCode: "contractAmount",
        langCode: "ssta.costSheet.model.costSheet.Amounts",
      },
      {
        fieldName: "申请人手机号",
        fieldCode: "applicationUserName",
        langCode: "ssta.costSheet.model.costSheet.applicationUserName",
      },
      {
        fieldName: "币种",
        fieldCode: "currencyDescription",
        langCode: "sprm.common.model.common.currency",
      },
      {
        fieldName: "用章附件（文件）",
        fieldCode: "electricalSignatureAttachmentUuid",
        langCode: "scux.procurementDecisionReview.model.sealAttatchment",
      },
      {
        fieldName: "用章附件（文本）",
        fieldCode: "contractFileUrl",
        langCode: "scux.procurementDecisionReview.model.contractFileUrl",
      },
      {
        fieldName: "非用章附件",
        fieldCode: "purchaserAttachmentUuid",
        langCode: "scux.procurementDecisionReview.model.unsealAttatchment",
      },
      {
        fieldName: "采购方案评审单号",
        fieldCode: "schemeIdMeaning",
        langCode: "scux.procurementDecisionReview.model.schemeReviewIdLov",
      },
      {
        fieldName: "采购决议评审单号",
        fieldCode: "decisionIdMeaning",
        langCode: "scux.procurementDecisionReview.model.decisionReviewNumber",
      },
      {
        fieldName: "评标报告",
        fieldCode: "evaluationIdMeaning",
        langCode: "scux.bidEvaluationReport.view.title.bidEvaluationReport",
      },
      {
        fieldName: "备注",
        fieldCode: "remark",
        langCode: "smpc.common.excel.remark",
      },
      {
        fieldName: $T("scux.myModoList.model.frameworkContractNumber").$D("框架合同"),
        fieldCode: "frameworkContractNumber",
      },
      {
        fieldName: $T("spcm.contractChange.view.message.terminationReason").$D("终止原因"),
        fieldCode: "processRemark",
      },
      {
        fieldName: $T("sodr.common.model.common.mainPcNum").$D("主协议编号"),
        fieldCode: "mainPcNum",
      },
    ],
    fastQueryField: {
      fieldCode: "pcNum",
      fieldType: "TEXT",
      langCode: "spcm.common.model.common.pcNum",
      fieldName: "协议编号",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        langCode: "spcm.common.model.common.pcNum",
        fieldName: "协议编号",
      },
    ],
    // https://gateway.dev.isrm.going-link.com/spcm/v1/8078/purchase-contract-workflow-hygy/listTaskPage/termination?page=0&size=10&__dirty=true
    transport: {
      read: {
        url:`/spcm/v1/${localStorage.getItem("organizationId")}/purchase-contract-workflow-hygy/listTaskPage/termination`,
        method: "get",
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

export default agreementTermination;
