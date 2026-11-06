function indexDs(requestId, templateCode) {
  return {
    autoQuery: true,
    // selection: Infinity,
    paging: true,
    pageSize: 5,
    editable: false,
    enableQuery:false,
    showTotalCount: true,
    queryParameter: {
      requestId:requestId,
      templateCode:templateCode
    },
    fields: [],
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-req-mains`,
        method: "get",
      },
    },
  };
}

export default indexDs;
