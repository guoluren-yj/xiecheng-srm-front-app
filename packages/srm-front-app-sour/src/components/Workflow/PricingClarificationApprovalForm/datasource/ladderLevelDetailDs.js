// import { SrmUtil } from "srm-mobile-ui";

//阶梯报价ds
function ladderLevelDetailDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: { customizeUnitCode: "" },
    fields: [],
    transport: {
      // read: {
      //   url: `/ssrc/v1/${SrmUtil.getTenantId()}/rfx/supplier/${id}/ladder-quotation`,
      //   method: "get",
      // },
    },
  };
}

export default ladderLevelDetailDs;