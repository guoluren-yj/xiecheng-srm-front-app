import { SRM_SSLM } from "@/utils/utils";

// 评估策略ds
function getEvaluationPolicyDS(strategyId) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/eval-plan-strategys/detail/${strategyId}`,
        method: "get",
      },
    },
  };
}

export {
  getEvaluationPolicyDS,
};
