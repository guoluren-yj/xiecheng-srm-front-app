import { SrmUtil } from "srm-mobile-ui";

//过程附件ds
function processAttachmentDs (id) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {
    },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/${id}/process-attachment/download-query`,
        method: "get",
      },
    },
  };
}

export { processAttachmentDs };
