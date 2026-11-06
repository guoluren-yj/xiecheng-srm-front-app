
import { SrmUtil, $T } from "srm-mobile-ui";

function subjectDatasource(pcHeaderId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
    },
    transport: {
      read: {
        url: `/spcm/v1/${localStorage.getItem("organizationId")}/purchase-contract-approval-form-starbucks/${pcHeaderId}/pc-subject/page`,
        method: "get",
      },
    }
  };
}

function supplierScoreResDS(pcHeaderId) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: false,
    fields: [
      {
        fieldName: $T("spcm.contractmoney.EcScorerResults").$D("E&C评分结果"),
        fieldCode: "ecAssessmentResultsMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.contractmoney.EcScorerOpinion").$D("E&C评分意见"),
        fieldCode: "ecComment",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.contractmoney.FinanceScorerResults").$D("Finance评分结果"),
        fieldCode: "rating",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.contractmoney.FinanceScorerOpinion").$D("Finance评分意见"),
        fieldCode: "finComment",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/querySupplierScoreResults`,
        method: "get",
      },
    },
  };
}

export {
  subjectDatasource,
  supplierScoreResDS,
};