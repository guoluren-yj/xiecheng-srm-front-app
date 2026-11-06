import { $T, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";

function scoreDs() {
  return {
    selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    editable: true,
    forceValidate: true,
    fields: [
      {
        fieldCode: "content",
        fieldName: $T("scux.acceptBench.model.view.content").$D("评分维度"),
      },
      {
        fieldCode: "score",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("scux.acceptBench.model.view.score").$D("评分"),
        required: (val, item) => {
          if (item?.requiredFlag) {
            return true;
          }
          return false;
        },
        validator: (val, item) => {
          if (val <= item?.get("maxScore") || val < 0) {
            return true;
          }
        },
        // errorMessage: $T("scux.acceptBench.model.view.score").$D("评分")
      },
      {
        fieldCode: "opinion",
        fieldType: "INPUT",
        fieldName: $T("scux.acceptBench.model.view.opinion").$D("评价说明"),
        required: (val, item) => {
          if (!isNil(item.score)) {
            if (item?.score < item?.maxScore) {
              return true;
            }
          }
          return false;
        }
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ldjt/header-detail/{acceptHeaderId}`,
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, params) => params[0]?.ldjtAcceptScoreList || [],
    },
  };
}

export { scoreDs };