import { SrmUtil } from "srm-mobile-ui";

// 订单基础信息和采买组织信息共用Ds
function basicInfoDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId()
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-header/{poHeaderId}/detail",
        method: "get"
      }
    }
  };
}

function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: false,
    enableQuery: false,
    fields: [],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      poHeaderId: null
    },
    transport: {
      read: {
        url: "spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get"
      }
    }
  };
}

export { basicInfoDs, lineDs };
