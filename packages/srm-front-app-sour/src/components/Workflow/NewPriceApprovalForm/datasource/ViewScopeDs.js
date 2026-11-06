function viewScopeDs(priceLibId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 5,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    queryParameter: {
      priceLibId: priceLibId
    },
    fields: [],
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-req-scopes`,
        method: "get",
      },
    },
  };
}
function commonDs(priceLibId, dimensionCode) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 5,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    queryParameter: {
      priceLibId: priceLibId,
      dimensionCode:dimensionCode
    },
    fields: [],
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-req-scope-lns`,
        method: "get",
      },
    },
  };
}
export { viewScopeDs, commonDs };
