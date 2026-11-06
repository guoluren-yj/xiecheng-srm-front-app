import { $T, SrmUtil } from "srm-mobile-ui";
function indexDs () {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SODR.DELIVERY_CLOSED.FILTER,SODR.DELIVERY_CLOSED.LIST",
    },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fastQueryField: {
      fieldCode: "asnNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.common.view.message.asnNum").$D("送货单号"),
    },
    queryFields: [
      {
        fieldCode: "displayPoNum",
        fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "companyId",
        fieldName: $T("sodr.common.model.common.company").$D("公司"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          multiple: false,
          subDisplayField: "companyNum",
          displayField: "companyName",
          valueField: "companyId",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.addQueryParameter("companyName", val[0]["companyName"]);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("companyName", null);
          }
        }
      },
      {
        fieldCode: "supplierCompany",
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        fieldType: "LOV",
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
        fieldCode: "creationDateFrom",
        fieldName: $T("sodr.common.model.common.createDateFrom").$D("创建日期从"),
        fieldType: "DATE",
      },
      {
        fieldCode: "creationDateTo",
        fieldName: $T("sodr.common.model.common.createDateTo").$D("创建日期至"),
        fieldType: "DATE",
      },
      {
        fieldCode: "agentId",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.PURCHASE_AGENT",
        options: {
          multiple: false,
          subDisplayField: "purchaseAgentCode",
          valueField: "purchaseAgentId",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.addQueryParameter("agentName", val[0].purchaseAgentName);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("agentName", null);
          }
        }
      },
      {
        fieldCode: "shipDateFrom",
        fieldName: $T("sodr.common.model.common.shipDateFrom").$D("发货日期从"),
        fieldType: "DATE",
      },
      {
        fieldCode: "shipDateTo",
        fieldName: $T("sodr.common.model.common.shipDateTo").$D("发货日期至"),
        fieldType: "DATE",
      },
      {
        fieldCode: "closeSyncStatus",
        fieldName: $T("sodr.common.model.common.closeSyncStatus").$D("关闭导入状态"),
        fieldType: "SELECT",
        options: {
          multiple: false,
          displayField: "meaning",
          subDisplayField: "value",
          valueField: "value",
          listData: [
            {
              meaning: $T("sodr.common.model.common.fail").$D("导入失败"),
              value: "FAIL",
            },
            {
              meaning: $T("sodr.common.model.common.importing").$D("导入中"),
              value: "IMPORTING",
            },
          ],
        }
      },
      {
        fieldCode: "expectedArriveDateFrom",
        fieldName: $T("sodr.common.model.common.expectedArriveDateFrom").$D("预计到货时间从"),
        fieldType: "DATE_PICKER",
        timePicker:true,
      },
      {
        fieldCode: "expectedArriveDateTo",
        fieldName: $T("sodr.common.model.common.expectedArriveDateTo").$D("预计到货时间至"),
        fieldType: "DATE_PICKER",
        timePicker:true,
      },
    ],
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/asn-header/close",
        method: "get",
      },
      update: {
        url: "/spuc/v1/{tenantId}/asn-header/close",
        method: "post",
      },
      submit: {
        url: "/spuc/v1/{tenantId}/asn-header/close/repo",
        method: "post",
      }
    },
  };
}

function orderLineDs (id) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    enableSelect: (record) => record.data.canCloseByLineFlag !== 0 && record.data.closedFlag !== 1 && record.data.closeByLineFlag !== 0,
    queryParameter: { customizeUnitCode: "SODR.DELIVERY_CLOSED_DETAIL.BASIC,SODR.DELIVERY_CLOSED_DETAIL.OTHER" },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      id: id,
    },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/asn-header/{id}/page-lines",
        method: "get",
      },
      update: {
        url: "/spuc/v1/{tenantId}/asn-header/close-line",
        method: "post",
      },
    },
  };
}

function lineImportStatusDs (id) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: { importType: "ASN_CLOSE_SYN_ERP" },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      id: id,
    },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/asn-lines/{id}/asnInterLineRecords",
        method: "get",
      },
      update: {
        url: "/spuc/v1/{tenantId}/asn-lines/{id}/asnInterLineRecords/resend",
        method: "post",
      },
    },
  };
}

function commonDs () {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: false,
  };
}

export {
  indexDs,
  orderLineDs,
  lineImportStatusDs,
  commonDs
};
