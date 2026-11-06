import { SrmUtil } from "srm-mobile-ui";
// 订单基础信息和采买组织信息共用Ds
function basicInfoDs() {
  return {
    pageSize: 10,
    autoQuery: false,
    selection: Infinity,
    showTotalCount: false,
    editable: false,
    enableQuery: false,
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
    editable: false,
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
