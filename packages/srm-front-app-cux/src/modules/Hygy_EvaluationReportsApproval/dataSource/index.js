import { $T } from "srm-mobile-ui";

function evaluationReportsDataSource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    fastQueryField: [
      {
        fieldCode: "categoryManager",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.bidEvaluationReport.model.common.categoryManager"
        ).$D("品类经理"),
      },
      {
        fieldCode: "bidNumber",
        fieldType: "TEXT",
        fieldName: $T("scux.bidEvaluationReport.model.common.bidNumber").$D(
          "单号"
        ),
      },
      {
        fieldCode: "projectName",
        fieldType: "TEXT",
        fieldName: $T("scux.bidEvaluationReport.model.common.projectName").$D(
          "物资名称/项目名称"
        ),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem(
          "organizationId"
        )}/marmot-api/GLJ52AX2yQhB4jeXVjBLybtP9T9MjibpaKdsqrltHam4`,
        method: "get",
        params: { requestType: "pbbg" },
      },
    },
    events: {
      beforeQuery: () => {},
    },
  };
}

export { evaluationReportsDataSource };
