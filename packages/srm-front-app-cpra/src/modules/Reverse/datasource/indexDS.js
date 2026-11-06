import { $T } from "srm-mobile-ui";
export const indexDS = (type) => {
  console.log(type, "type");
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    fields: [],
    queryParameter: {},
    fastQueryField: {
      fieldCode: type,
      fieldType: "TEXT",
      fieldName: type === "asnNum" ? $T("sinv.common.model.common.asnNum").$D("送货单号") : $T("sinv.common.model.common.displayPoNum").$D("订单号"),
      langCode: type === "asnNum" ? "sinv.common.model.common.asnNum" : "sinv.common.model.common.displayPoNum",
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
        lovCode: "SODR.USER_AUTH.SUPPLIER",
        options: {
          valueField: "supplierCompanyId",
          displayField: "supplierCompanyName",
          subDisplayField:"supplierCompanyCode",
          queryField: "supplierCompanyName"
        },
      },
      {
        fieldCode: "itemId",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.item").$D("物料"),
        lovCode: "SODR.PO_ITEM",
        options: {
          valueField: "itemId",
          displayField: "itemName",
          subDisplayField:"itemCode",
          queryField: "itemName"
        },
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.company").$D("公司"),
        lovCode: "SPFM.USER_AUTHORITY_COMPANY",
        options: {
          valueField: "companyId",
          displayField: "companyName",
          subDisplayField:"companyNum",
          queryField: "companyName"
        },
      },
      {
        fieldCode: "invOrganizationId",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.organizationName").$D("收货组织"),
        lovCode: "SODR.COMPANY_INVORGNIZATION",
        options: {
          valueField: "invOrganizationId",
          displayField: "organizationName",
          subDisplayField:"organizationCode",
          queryField: "organizationName"
        },
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/rcv-trx-header/permit-reverse-asn-line?customizeUnitCode=SODR.WRITE_OFF.LIST,SODR.WRITE_OFF.FILTER`,
        method: "get",
      },
    },
    events: {
      beforeQuery: (ds, param) => {
        console.log(param, "params");
        param[type] = param.asnNum;
        if (type !== "asnNum") {
          delete param.asnNum;
        }
      }
    }
  };
};

export default indexDS;