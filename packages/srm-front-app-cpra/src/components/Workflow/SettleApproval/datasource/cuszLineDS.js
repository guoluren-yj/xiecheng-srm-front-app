import { SrmUtil } from "srm-mobile-ui";

function cuszLineDS(documentType, settleHeaderId) {
  const shortType = documentType === "INVOICE" ? "INV" : "PAY";
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: {
      documentType,
      documentId: settleHeaderId,
      customizeUnitCode: `SMBL.WORKFLOW.SETTLE_APPROVAL.${shortType}_CUSZ_LINES`,
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
    ],
    transport: {
      read: {
        url: "/ssta/v1/{tenantId}/settle-expand-lines/list",
        method: "get",
      },
    },
  };
}

export default cuszLineDS;
