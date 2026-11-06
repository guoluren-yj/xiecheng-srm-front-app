function ladderQuotationDs(priceLibId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    showTotalCount: true,
    enableQuery:false,
    queryParameter: {
      priceLibId: priceLibId
    },
    fields: [],
    transport: {
      read: {
        url: `/spc/v1/${localStorage.getItem("organizationId")}/price-lib-req-ladders`,
        method: "get",
      },
    },
  };
}

export default ladderQuotationDs;
