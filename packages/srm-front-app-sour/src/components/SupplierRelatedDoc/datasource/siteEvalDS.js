import { SrmUtil, $T } from "srm-mobile-ui";

function siteEvalDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { customizeUnitCode: "SSLM.SUPPLIER_LIFE_MANAGE.ELIMINATE_RELATED_DOC" },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "evalNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteEvalHeader.view.code.evalNum").$D("考察报告编码"),
      },
      {
        fieldCode: "evalStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteEvalHeader.view.code.evalStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "evalDescription",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
      },
      {
        fieldCode: "evalTplName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板"),
      },
      {
        fieldCode: "finalScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
      },
      {
        fieldCode: "grade",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.level").$D("等级"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
      },
      {
        fieldCode: "realName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/site-eval-headers/result/evaluating",
        method: "get",
      },
    },
  };
}

export default siteEvalDS;
