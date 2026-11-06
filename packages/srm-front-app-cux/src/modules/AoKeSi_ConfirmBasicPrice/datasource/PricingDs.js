//询价大厅核价-报价明细信息
// eslint-disable-next-line no-unused-vars
import { http, SrmUtil } from "srm-mobile-ui";
function pricingQuotaionDetailInfoDs(item) {
  return {
    autoQuery: true,
    selection: Infinity,
    editable: false,
    enableQuery: true,
    data: [],
    queryParameter: {
      itemId: item.itemId,
      quotationHeaderId: item.quotationHeaderId,
      quotationLineId: item.quotationLineId,
      rfxLineItemId: item.rfxLineItemId,
      sourceFrom: "RFX"
    },
    fields: [],
    transport: {
      read: {
        url: `ssrc/v1/${SrmUtil.getTenantId()}/rfx/${item.rfxHeaderId}/quotationTemplate/view`,
        method: "get",
      },
    },
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, param) => {
      }
    }
  };
}
function quotaionDetailQuoteInfoDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}
//阶梯报价ds
function ladderLevelDetailDs (id) {
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
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${id}/ladder-quotation`,
        method: "get",
      },
    },
  };
}

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
export { pricingQuotaionDetailInfoDs, quotaionDetailQuoteInfoDs, ladderLevelDetailDs, processAttachmentDs };
