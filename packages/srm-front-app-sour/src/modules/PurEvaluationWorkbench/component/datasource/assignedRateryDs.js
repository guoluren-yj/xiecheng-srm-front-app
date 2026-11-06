import { SRM_SSLM } from "@/utils/utils";
function commonDs () {
  return {
    autoQuery: false,
    // editable: false,
    enableQuery: false,
    editable: true,
    editFlag: true,
    selection: Infinity,
    showTotalCount: false,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 评估策略ds
function getScorerDs(evalHeaderId) {
  return {
    autoQuery: true,
    pageSize: 10,
    editable: true,
    editFlag: true,
    selection: Infinity,
    enableQuery: false,
    showTotalCount: false,
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${localStorage.getItem("organizationId")}/site-eval-groups/eval-report/${evalHeaderId}/assign`,
        method: "get",
      },
    },
  };
}

export {
  getScorerDs,
  commonDs,
};
