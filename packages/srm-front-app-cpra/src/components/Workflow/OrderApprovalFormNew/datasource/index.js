
import { SrmUtil } from "srm-mobile-ui";

function commonDs () {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
  };
}

function lineDs () {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {},
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  lineDs,
};