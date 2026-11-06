// import { SRM_SSLM } from "@/utils/utils";
import { SrmUtil } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function indicatorStatusDs(evalLineId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/${evalLineId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  indicatorStatusDs,
};
