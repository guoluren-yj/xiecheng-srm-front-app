function indexDs(quotaHeaderId, sourceKey) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      quotaHeaderId: quotaHeaderId,
      customizeUnitCode: sourceKey === "NEW" ?
        "SSLM.SUP_QUOTA_APPLICATIONS_DETAIL.AUOTA_ASIGNS" :
        "SSLM.SUPPLIER_QUOTA_MANAGE.LINE",
    },
    fields: [],
    transport: {
      read: {
        url: `/sslm/v1/${localStorage.getItem(
          "organizationId"
        )}/supplier-quota-lines/${quotaHeaderId}`,
        method: "get",
      },
    },
  };
}

export default indexDs;
