import { SrmUtil } from "srm-mobile-ui";

//阶梯报价ds
function ladderLevelDetailDs (id) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: { customizeUnitCode: "SMBL.WORKFLOW.PRICING_APPROVAL.PRICE_LADDER_LEVEL_LINE_INFO" },
    fields: [],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${id}/ladder-quotation`,
        method: "get",
      },
    },
  };
}

export default ladderLevelDetailDs;