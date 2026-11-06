import { SrmUtil } from "srm-mobile-ui";

function ladderLineDataSet(quotationLineId, data = {}) {
  const { customizeUnitCode = "", } = data || {};
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    paging: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      customizeUnitCode,
    },
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${quotationLineId}/ladder-inquiry/bargain`,
        method: "get",
      },
    },
    events: {
    },
  };
}

export default ladderLineDataSet;