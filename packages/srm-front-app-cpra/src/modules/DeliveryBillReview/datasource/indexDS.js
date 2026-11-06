import { $T } from "srm-mobile-ui";
function indexDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    filterCustomizeCode: "SMBL.DELIVERY_BILL_REVIEW.SEARCH",
    // table表单显示的字段
    headerField: {
      fieldName: $T("sinv.common.model.common.rfxNum").$D("询价单号"),
      fieldCode: "asnNum",
      fieldType: "TEXT",
      defaultValue: "",
    },
    queryParameter: {
      customizeUnitCode: "SINV.DELIVERY_APPROVED_LIST.GRID,SINV.DELIVERY_APPROVED_LIST.FILTER",
    },
    fields: [
      {
        fieldName: $T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: $T("sinv.common.model.common.creationDate").$D("创建日期"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("sinv.common.model.common.organizationName").$D("收货组织"),
        fieldCode: "organizationName",
      },
    ],
    fastQueryField: {
      fieldCode: "asnNum",
      fieldType: "TEXT",
      fieldName: $T("sinv.common.model.common.asnNum").$D("送货单号"),
    },
    // 查询表单字段
    queryFields: [
      // {
      //   fieldCode: "creationDateFrom",
      //   fieldType: "DATE_PICKER",
      //   fieldName: $T("sinv.common.model.common.creationDate").$D("创建日期"),
      //   selectType: "start-end",
      //   endDateFieldCode: "creationDateTo",
      // },
      {
        fieldCode: "supplierCompany",
        fieldType: "LOV",
        fieldName: $T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: true,
          subDisplayField: "supplierNum",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              let tempkeys = val.map((res) => res["tempKey"] ? res["tempKey"] : `${res["supplierCompanyId"]}s`);
              let supplierIds = val.map((res) => res["supplierId"] || null);
              let supplierCompanyIds = val.map((res) => res["supplierCompanyId"] || null);
              ds.addQueryParameter("tempkeys", tempkeys ? tempkeys.join(",") : null);
              if (supplierIds && supplierIds.length && supplierIds[0]) {
                ds.addQueryParameter("supplierIds", supplierIds ? supplierIds.join(",") : null);
                if (supplierCompanyIds && supplierCompanyIds.length && supplierCompanyIds[0]) {
                  ds.addQueryParameter("supplierCompanyIds", supplierCompanyIds ? supplierCompanyIds.join(",") : null);
                }
              } else if (supplierCompanyIds && supplierCompanyIds.length && supplierCompanyIds[0]) {
                ds.addQueryParameter("supplierCompanyIds", supplierCompanyIds ? supplierCompanyIds.join(",") : null);
              }
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("supplierCompanyIds", null);
            ds.addQueryParameter("supplierIds", null);
            ds.addQueryParameter("tempkeys", null);
          }
        }
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("sinv.common.model.common.displayPoNum").$D("订单号"),
      },
    ],
    transport: {
      read: {
        url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/review`,
        method: "get",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      update: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "put",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
    setData(data) {
      this.data = data;
    },
    clear() {
      this.setData([]);
    },
  };
}

export default indexDS;
