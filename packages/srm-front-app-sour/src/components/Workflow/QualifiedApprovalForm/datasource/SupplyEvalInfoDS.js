import { $T } from "srm-mobile-ui";
function supplyEvalInfoDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldName: $T("sslm.commonApplication.model.score.goal").$D("得分"),
        fieldCode: "score",
        fieldType: "TEXT",
        defaultValue: "",
      },
      {
        fieldName: $T("sslm.commonApplication.model.commonApplication.indicateCode").$D("评价项目编号"),
        fieldCode: "indicatorCode",
        fieldType: "TEXT",
        defaultValue: "",
      },
      {
        fieldName: $T("sslm.commonApplication.model.commonApplication.itemRemark").$D("评分标准"),
        fieldCode: "evalStandard",
        fieldType: "TEXT",
      },
    ],
    transport: {
    },
  };
}

export default supplyEvalInfoDS;
