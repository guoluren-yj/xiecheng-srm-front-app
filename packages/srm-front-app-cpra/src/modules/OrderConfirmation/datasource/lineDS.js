import { SrmUtil } from "srm-mobile-ui";

//const tenantNum = JSON.parse(window.localStorage.getItem("userInfo")).tenantNum;

function lineDS() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    fields: [],
    queryParameter: {
      camp: 2,
      poEntryPoint: "PURCHASE_PO_CONFIRM",
      sortType: 4,
      customizeUnitCode: "SODR.CONFIRM_ORDER_DETAIL.BASIC,SODR.CONFIRM_ORDER_DETAIL.OTHER"
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      update: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "put",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
  };
}

export default lineDS;
