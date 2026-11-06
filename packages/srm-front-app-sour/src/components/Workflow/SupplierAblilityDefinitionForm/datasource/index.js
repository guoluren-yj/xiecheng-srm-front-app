// 通用ds
function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    pageSize: 10,
    // 快速查询
    fastQueryField: {
    },
    // 查询表单字段
    queryFields: [
    ],
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

// 基础信息
function basisDs (supplyAbilityExpandId) {
  return {
    autoQuery: true,
    editable: false,
    enableQuery: false,
    selection: Infinity,
    fields: [],
    // 快速查询
    fastQueryField: {
    },
    // 查询表单字段
    queryFields: [
    ],
    queryParameter: {
      customizeUnitCode:"SSLM.SUPPLIER_ABLILITY_DEFINITION.EXPAND_BASE_INFO,SSLM.SUPPLIER_ABLILITY_DEFINITION.EXPAND_CATEGORY_LIST",
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `/sslm/v1/${window.localStorage.getItem("organizationId")}/supply-ability-expands/${supplyAbilityExpandId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  basisDs,
};
