import { $T, SrmUtil } from "srm-mobile-ui";

function relatedProblemDS(evalHeaderId = 0) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      orderSource: "kpiEval",
    },
    pathParameter: {
      evalHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "problemNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.orderNum").$D("单据编号"),
      },
      {
        fieldCode: "problemStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.orderStatus").$D("单据状态"),
      },
      {
        fieldCode: "problemTitle",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.problemTitle").$D("整改报告标题"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/site_eval_external_orders/{evalHeaderId}",
        method: "get",
      },
    },
  };
}

export default relatedProblemDS;
