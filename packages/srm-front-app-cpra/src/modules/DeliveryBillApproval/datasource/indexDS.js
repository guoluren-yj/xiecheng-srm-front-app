import { $T } from "srm-mobile-ui";
export const indexDS = () => ({
  autoQuery: true,
  selection: Infinity,
  pageSize: 10,
  editable: true,
  editFlag: false,
  enableQuery: true,
  data: [],
  fields: [],
  filterCustomizeCode: "SMBL.DELIVERY_BILL_APPROVAL.SEARCH",
  queryParameter: {
    tenantId: localStorage.getItem("tenantId"),
    customizeUnitCode: "SINV.DELIVERY_APPROVED_LIST.GRID,SINV.DELIVERY_APPROVED_LIST.FILTER",
  },
  fastQueryField: {
    fieldCode: "asnNum",
    fieldType: "TEXT",
    fieldName: $T("sinv.common.model.common.asnNum").$D("送货单号"),
  },
  // 查询表单字段
  queryFields: [
    // {
    //   fieldCode: "creationDateFrom",
    //   endDateFieldCode: "creationDateTo",
    //   fieldType: "DATE_PICKER",
    //   selectType: "start-end",
    //   fieldName: $T("sinv.common.model.common.creationDate").$D("创建日期"),
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
    }
  ],
  transport: {
    read: {
      url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-header/approve`,
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
});

export const storeInfoDs = (asnLineId) => ({
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
      url: `/spuc/v1/${localStorage.getItem("organizationId")}/asn-detail-list/${asnLineId}`,
      method: "get",
    },
  },
});

export default indexDS;
