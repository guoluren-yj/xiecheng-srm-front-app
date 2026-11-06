import { $T } from "srm-mobile-ui";
function indexDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 15,
    editable: false,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      storeTemplate: "1",
    },
    fields: [],
    fastQueryField: {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("ssrc.bidHall.model.bidHall.supplierCompanyName").$D("供应商名称"),
    },
    // 查询表单字段
    queryFields: [],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/watsons-store-template-sds/supplier`,
        method: "get",
      },
    },
  };
}
function kindDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 15,
    editable: false,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      groupFlag: "1",
      storeTemplate: "1",
      status: "1"
    },
    fields: [],
    fastQueryField: {
    },
    // 查询表单字段
    queryFields: [],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/watsons-store-template-sds/list`,
        method: "get",
      },
    },
  };
}
export { indexDs, kindDs };
