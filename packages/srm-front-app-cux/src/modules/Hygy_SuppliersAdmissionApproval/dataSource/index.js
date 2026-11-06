import { $T } from "srm-mobile-ui";
function suppliersWarehouseDataSource(nameFlag) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    fastQueryField: {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      langCode: "scux.common.model.supplier.name",
      fieldName: $T("scux.common.model.supplier.name").$D("供应商名称"),
    },
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/GLJ52AX2yQhB4jeXVjBLybtP9T9MjibpaKdsqrltHam4`,
        method: "get",
        params: { requestType: nameFlag ? "gyszr" : "gysls", stageCode: nameFlag ? "RECOMMEND" : "TEMPORARY" },
      },
    },
  };
}

export default suppliersWarehouseDataSource;