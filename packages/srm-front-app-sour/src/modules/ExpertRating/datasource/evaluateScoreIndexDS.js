import { $T } from "srm-mobile-ui";
export const evaluateScoreIndexDS = (config) => ({
  pageSize: 10,
  enableQuery: true,
  editable:false,
  data: [],
  fields: [],
  queryParameter: {},
  fastQueryField: {
    fieldCode: "sourceTitle",
    fieldType: "TEXT",
    fieldName: $T("ssrc.expertScoring.model.expertScoring.sourceTitle").$D("寻源标题"),
  },
  // 查询表单字段
  queryFields: [
    {
      fieldCode: "companyId",
      fieldType: "LOV",
      fieldName: $T("hipspfm.common.message.company").$D("公司"),
      lovCode: "HPFM.COMPANY",
      options: {
        valueField: "companyId",
        displayField: "companyName",
        subDisplayField:"companyNum",
        queryField: "companyName"
      },
    },
    {
      fieldName: $T("ssrc.expertScoring.model.supplierQuotation.bidStatus").$D("状态"),
      fieldCode: "sourceStatus",
      fieldType: "SELECT",
      displayField: "scoredStatusMeaning",
      lovCode: "SSRC.SOURCE_STATUS",
    },
    {
      fieldName:$T("hipspfm.expertScoring.view.message.sourceType").$D("寻源类型"),
      fieldCode: config.isBid ? "secondarySourceCategory" : "sourceCategory",
      fieldType: "SELECT",
      displayField: "sourceCategoryMeaning",
      lovCode: config.isOldBid && config.isBid ? "SSRC.SECONDARY_SOURCE_CATEGORY_WITH_RF_BID" : config.isBid ? "SSRC.SECONDARY_SOURCE_CATEGORY_SCORE" : "SOURCE_CATEGORY_SCORE"
    },
    {
      fieldName:$T("ssrc.expertScoring.model.expertScoring.bidNum").$D("寻源单号"),
      fieldCode:"sourceNum"
    }
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${localStorage.getItem("organizationId")}/evaluate-scores/scoring-list`,
      method: "get",
    },
  },
  events: {
  }
});

export default evaluateScoreIndexDS;