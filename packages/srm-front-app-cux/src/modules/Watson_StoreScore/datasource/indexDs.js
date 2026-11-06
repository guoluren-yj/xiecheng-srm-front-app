import { $T } from "srm-mobile-ui";
function indexDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      orderScore: "N/A",
      gro: 1,
    },
    fields: [],
    fastQueryField: {
      fieldCode: "organizationName",
      fieldType: "TEXT",
      fieldName: $T("scux.common.view.message.organizationName").$D("店号"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "ceNo",
        fieldType: "TEXT",
        fieldName: $T("mallf.common.view.CENum").$D("CE号"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("scux.common.model.list.supplier").$D("供应商"),
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/watsons-store-scores/list`,
        method: "get",
      },
    },
  };
}

export default indexDs;
