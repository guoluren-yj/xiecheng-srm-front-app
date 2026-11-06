import { $T, SrmUtil } from "srm-mobile-ui";
function scorerCompleteDS(evalLineId) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 100,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.account").$D("评分人账户"),
        fieldCode: "loginName",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.describe").$D("评分人描述"),
        fieldCode: "realName",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
        fieldCode: "respWeight",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.defaultScore").$D("缺省分值"),
        fieldCode: "defaultScore",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.modal.scorer.isCriteria").$D("符合评分标准"),
        fieldCode: "isStandard",
        render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : val === 0 ? $T("hipspfm.common.status.no").$D("否") : "",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
        fieldCode: "isVeto",
        render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : val === 0 ? $T("hipspfm.common.status.no").$D("否") : "",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.indOptName").$D("评分选项"),
        fieldCode: "indOptName",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.score").$D("得分"),
        fieldCode: "score",
      },
      {
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.siteLocation").$D("现场定位"),
        fieldCode: "siteLocation",
      },
    ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/${evalLineId}`,
        method: "get",
        params:{
          customizeUnitCode:"SMBL.SITE_INVESTIGATE_REPORT.SCORE_INFO_STATUS"
        },
      },
    },
  };
}

export {
  scorerCompleteDS
};
