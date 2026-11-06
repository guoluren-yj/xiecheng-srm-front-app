import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {
      customizeUnitCode: "SSRC.SUPPLIER_QUOTATION_LIST.QUOTATION_TABLE",
      organizationId:window.localStorage.getItem("organizationId")
    },
    fastQueryField: {
      fieldCode: "rfxTitle",
      fieldType: "TEXT",
      fieldName: $T("ssrc.supplierQuotation.model.rfxTitle").$D("询价单标题"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "companyName",
        fieldType: "LOV",
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.companyName").$D("客户"),
        lovCode: "HPFM.PURCHASE_COMPANY",
        options: {
          queryField: "companyName", // 查询
          displayField: "companyName", // 主键
          subDisplayField: "companyNum",
          valueField: "companyName",
        },
      },
      {
        fieldCode: "sourceCategory",
        fieldType: "SELECT",
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.sourcingCategory").$D("寻源类别"),
        lovCode: "SSRC.SOURCE_CATEGORY",
      },
      {
        fieldCode: "rfxNum",
        fieldType: "TEXT",
        fieldName: $T("ssrc.supplierQuotation.model.supQuo.rfxNum").$D("RFX单号"),
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/list`,
        method: "get",
      },
      create: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/list`,
        method: "post",
      },
      update: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/list`,
        method: "put",
      },
      destroy: {
        url: `/ssrc/v1/${localStorage.getItem("organizationId")}/rfx/supplier/list`,
        method: "delete",
      },
    },
  };
}

export default indexDS;
