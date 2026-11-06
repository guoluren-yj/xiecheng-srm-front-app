function packingMaterialsListDatasource() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    showTotalCount: false,
    queryParameter: {
      lovCode: "SPUC.DONLIM.ASN_PKG_ITEM",
      tenantId: `${localStorage.getItem("organizationId")}`,
    },
    fields: [

    ],
    fastQueryField: {
      fieldCode: "itemName",
      fieldType: "TEXT",
      langCode: "smbl.common.model.name",
      fieldName: "请输入名称查询",
    },
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/lovs/sql/data`,
        method: "get",
      },
    },
    events: {
    },
  };
}

export default packingMaterialsListDatasource;