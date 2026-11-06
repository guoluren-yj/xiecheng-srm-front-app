import { SrmUtil, $T } from "srm-mobile-ui";

function scorePeopleDataSet(evalHeaderId) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        formRow: 10,
        formCol: 10,
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.name").$D("评分人名称"),
        fieldCode: "respUserName",
        fieldType: "TEXT",
      },
      {
        formRow: 20,
        formCol: 10,
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.unit").$D("评分人部门"),
        fieldCode: "userDepartmentName",
        fieldType: "TEXT",
      },
      {
        formRow: 30,
        formCol: 10,
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.totalScore").$D("当前评分人填制总分"),
        fieldCode: "sumScore",
        fieldType: "TEXT",
      },
      {
        formRow: 40,
        formCol: 10,
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.siteLocation").$D("现场定位"),
        fieldCode: "siteLocation",
        fieldType: "TEXT",
      },
    ],
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATE_FILLING_DETAIL.SCORER_INFO",
    },
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-resp-headers/get-resp-header/${evalHeaderId}`,
        method: "get",
      },
    },
  };
}

export {
  scorePeopleDataSet
};
