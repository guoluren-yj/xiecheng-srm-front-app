import { SrmUtil } from "srm-mobile-ui";
function approvalItemDs(rfxHeaderId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      rfxHeaderId,
    },
    fields: [
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/aixuexi-all-line/reqItem/${rfxHeaderId}`,
        method: "get",
      },
    },
  };
}

export default approvalItemDs;