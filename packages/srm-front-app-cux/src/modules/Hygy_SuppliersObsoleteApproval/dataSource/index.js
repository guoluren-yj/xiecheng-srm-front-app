function suppliersObsoleteDataSource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {

    },
    fastQueryField: {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      langCode: "scux.common.model.supplier.name",
      fieldName: "供应商名称",
    },
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/GLJ52AX2yQhB4jeXVjBLybtP9T9MjibpaKdsqrltHam4`,
        method: "get",
        params: { requestType: "gystt" },
      },
    },
    events: {
      beforeQuery: () => {

      }
    }
  };
}

export default suppliersObsoleteDataSource;