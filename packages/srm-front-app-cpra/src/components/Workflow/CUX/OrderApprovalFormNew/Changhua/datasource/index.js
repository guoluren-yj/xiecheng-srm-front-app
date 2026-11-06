
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

function lineDs ({ poHeaderId }) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      camp:1,
      sortType: 0,
      poEntryPoint:"PURCHASE_APPROVAL_DETAIL",
      lineCustomizeUnitCode: "SODR.WORKSPACE_ORDERAPPROVAL_DETAIL.DETAILINFO",
    },
    transport: {
      read: {
        url: `/spuc/v1/${SrmUtil.getTenantId()}/po-line/${poHeaderId}/detail`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  lineDs,
};