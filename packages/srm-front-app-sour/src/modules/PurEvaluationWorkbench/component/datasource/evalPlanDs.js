import { $T } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";

// 引用评估计划ds
function getEvalPlanDs() {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    editFlag: true,
    selection: Infinity,
    enableQuery: true,
    queryParameter: {
      page: 0,
      size: 10,
      customizeFilterComparison: "executeStatus:IN",
      customizeOrderField: "creationDate:asc",
      customMergeFilterField: "evalPlanDescription,evalPlanNum",
      // eslint-disable-next-line camelcase
      executeStatus_range: "TO_BE_EVALUATED,EVAL_CANCEL",
      evalStatusCustoms: "PUBLISHED",
      customizeUnitCode: "SSLM.PURCHASER_ASSESS_LIST.MANAGE.REF_EVA_PLAN_CRE_NEW,SSLM.PURCHASER_ASSESS_LIST.MANAGE.REF_EVA_PLAN_TABLE",
    },
    fastQueryField: {
      fieldCode: "evalPlanNum",
      fieldType: "TEXT",
      fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
    },
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/eval-plan-lines`,
        method: "get",
      },
    },
  };
}

export {
  getEvalPlanDs,
};
