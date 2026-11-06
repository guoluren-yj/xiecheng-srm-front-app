export default function indexDs() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      distributionStatus: 4,
      title: "",
      reqByName: "",
      unitId: "",
      liaisonType: "",
      companyId: "",
      brand: "",
      supplierCompanyId: "",
      reqFromDate: "",
      reqFromTo: ""
    },
    fastQueryField: {
      fieldName: "需求联络单号",
      fieldCode: "liaisonNum",
      fieldType: "TEXT",
      langCode: "scux.demandContactFrom.model.liaisonNum",
    },
    queryFields: [
      {
        fieldName: "标题",
        fieldCode: "title",
        fieldType: "TEXT",
        langCode: "hipspfm.order.model.line.title",
      },
      {
        fieldName: "申请人",
        fieldCode: "reqByName",
        fieldType: "TEXT",
        langCode: "scux.demandContactFrom.model.reqByName",
      },
      {
        fieldName: "申请部门",
        fieldCode: "unitId",
        fieldType: "LOV",
        lovCode: "SPRM.USER_DEPARTMENT",
        langCode: "scux.demandContactFrom.model.unitId",
        options: {
          multiple: false,
          subDisplayField: "unitCode",
          queryField: "unitName"
        },
      },
      {
        fieldName: "需求类型",
        fieldCode: "liaisonType",
        fieldType: "SELECT",
        lovCode: "SCUX.JALA.LIAISON.TYPE",
        langCode: "scux.demandContactFrom.model.liaisonTypeMeaning",
        options: {
          multiple: false,
        },
      },
      {
        fieldName: "公司",
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        langCode: "scux.demandContactFrom.model.companyId",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
          queryField: "companyName"
        },
      },
      {
        fieldName: "品牌",
        fieldCode: "brand",
        fieldType: "SELECT",
        lovCode: "SCUX.JALA.LIAISON.BRAND",
        langCode: "scux.demandContactFrom.model.brandMeaning",
        options: {
          multiple: false,
        },
      },
      {
        fieldName: "供应商",
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        lovCode: "SPFM.TENANT_SUPPLIER",
        langCode: "scux.demandContactFrom.model.supplierCompanyId",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
          queryField: "companyName"
        },
      },
      {
        fieldName: "申请日期从",
        fieldCode: "reqFromDate",
        fieldType: "DATE",
        langCode: "scux.demandContactFrom.model.reqFromDate",
      },
      {
        fieldName: "申请日期至",
        fieldCode: "reqFromTo",
        fieldType: "DATE",
        langCode: "scux.demandContactFrom.model.reqFromTo",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/jala-req-liaison-hs/all/list`,
        method: "get",
      },
    }
  };
}
