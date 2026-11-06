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
      customizeUnitCode: "SINV.DELIVERY_CANCELLED.FILTER,SINV.DELIVERY_CANCELLED.LIST",
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
        fieldName: $T("sodr.common.model.common.custom").$D("客户"),
        fieldType: "LOV",
        lovCode: "SINV.ASN_CUSTOMER",
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
        fieldCode: "purchaseAgentName",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
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
        fieldCode: "cancelSyncStatus",
        fieldName: $T("sodr.common.model.common.cancelSyncStatus").$D("取消导入状态"),
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
      {
        fieldCode: "cancelStatus",
        fieldName: $T("sodr.common.model.common.cancelStatus").$D("取消状态"),
        fieldType: "SELECT",
        lovCode: "SPUC.ASN_CANCEL_STATUS",
        options: {
          multiple: false,
        }
      },
    ],
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/asn-header/cancel",
        method: "get",
      },
      update: {
        url: "/spuc/v1/{tenantId}/asn-header/cancel",
        method: "post",
      },
      submit: {
        url: "/spuc/v1/{tenantId}/asn-header/cancel/repo",
        method: "post",
      }
    },
  };
}

function orderLineDs (id, cancelSyncStatus) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    enableSelect: (record) => cancelSyncStatus !== "FAIL" && record.data.canCancelByLineFlag !== 0 && ![ "SUCCESS", "IMPORTING" ].includes(record.data.cancelSyncStatus),
    queryParameter: { customizeUnitCode: "SODR.DELIVERY_CANCELLED_DETAIL.BASIC,SODR.DELIVERY_CANCELLED_DETAIL.OTEHR", quaryType: "Cancel" },
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
        url: "/spuc/v1/{tenantId}/asn-header/cancel-line",
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
    queryParameter: { importType: "ASN_CANCEL_SYN_ERP" },
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
