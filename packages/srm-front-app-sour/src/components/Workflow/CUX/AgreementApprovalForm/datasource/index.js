import { SrmUtil } from "srm-mobile-ui";

export function lineInfoDS({ pcHeaderId, isNewCust } = {}) {
  return {
    autoQuery: true,
    editable: false,
    paging: true,
    enableQuery: false,
    queryParameter: {
      customizeUnitCode: isNewCust ? "SPCM.WORKSPACE_DETAIL.SUBJECT" : "SPCM.PURCHASE_CONTRACT_MAINTAIN.SUBJECT"
    },
    fields: [],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract/${pcHeaderId}/pc-subject/page`,
        method: "get",
      },
    },
  };
}
