import { SrmUtil } from "srm-mobile-ui";
function rfxDetailSuppliersDS(pcHeaderId, rfxNum) {
  return {
    autoQuery: false,
    pageSize: 1,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: {
    },
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-approval-form-starbucks/${pcHeaderId}/queryRfx-supplier/${rfxNum}`,
        method: "get",
      },
    }
  };
}

export {
  rfxDetailSuppliersDS,
};