import { SrmUtil, $T } from "srm-mobile-ui";

function backScoreDS(id) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: true,
    selection: 20,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: [ {
      fieldCode: "indicatorCode",
      fieldType: "EMPTY",
      render: (val) => <srm-list-header>
        <span>{val}</span>
      </srm-list-header>,
    }, {
      fieldName: $T("sslm.commonApplication.model.commonApplication.indicatorName").$D("评价项目"),
      fieldCode: "indicatorName",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.commonApplication.model.commonApplication.procStatus").$D("状态"),
      fieldCode: "completeFlag",
      fieldType: "TEXT",
      render: (val) => Number(val) === 1 ? $T("sslm.common.model.status.submitted").$D("已提交") : val,
    }, {
      fieldName: $T("sslm.common.view.scorer").$D("评分人"),
      fieldCode: "userName",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.common.view.weight").$D("权重（%）"),
      fieldCode: "respWeight",
      fieldType: "TEXT",
    }, {
      fieldName: $T("sslm.commonApplication.view.message.score").$D("得分"),
      fieldCode: "score",
      fieldType: "TEXT",
    }, {
      fieldType: "INPUT",
      fieldCode: "backReason",
      fieldName: $T("sslm.commonApplication.model.message.backReason").$D("退回原因"),
    } ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/${id}/batch-query`,
        method: "get",
      },
    },
    events: {
      afterQuery: () => {
      }
    }
  };
}

export {
  backScoreDS
};