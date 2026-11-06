function indexDatasource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false, //是否可编辑
    enableQuery: true,
    data: [],
    showTotalCount: false,
    queryParameter: {},
    fields: [],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/hygy-evaluation-report-approvals/list`,
        method: "get",
      },
    },

  };
}

export default indexDatasource;
