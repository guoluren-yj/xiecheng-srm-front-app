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
      customizeUnitCode: "SODR.ORDER_RELEASE.GRID,SODR.ORDER_RELEASE.LIST.HEADER_BY_REQUEST",
    },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fastQueryField: {
      fieldCode: "displayPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.common.view.message.displayPoNum").$D("订单号"),
    },
    queryFields: [
      {
        fieldCode: "supplierCompany",
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        fieldType: "LOV",
        lovCode: "SPRM.SUPPLIER",
        options: {
          multiple: false,
          subDisplayField: "supplierCompanyNum",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              if (val[0].supplierId) {
                ds.addQueryParameter("supplierId", val[0].supplierId || null);
              }
              if (val[0].supplierCompanyId) {
                ds.addQueryParameter("supplierCompanyId", val[0].supplierCompanyId || null);
              }
              ds.addQueryParameter("tempkey", val[0].tempKey || null);
              ds.addQueryParameter("displaySupplierName", val[0].displaySupplierName || null);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("supplierId", null);
            ds.addQueryParameter("supplierCompanyId", null);
            ds.addQueryParameter("tempkey", null);
            ds.addQueryParameter("displaySupplierName", null);
          }
        }
      },
      {
        fieldCode: "poTypeId",
        fieldName: $T("sodr.common.model.common.orderType").$D("订单类型"),
        fieldType: "LOV",
        lovCode: "SPUC_ORDER_TYPE",
        options: {
          multiple: false,
          subDisplayField: "orderTypeCode",
          displayField: "orderTypeName",
          valueField: "orderTypeId",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.addQueryParameter("orderTypeCode", val[0]["orderTypeCode"]);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("orderTypeCode", null);
          }
        }
      },
      {
        fieldCode: "purchaseOrgId",
        fieldName: $T("sodr.common.model.common.purchaseOrgId").$D("采购组织"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.PURORG",
        options: {
          multiple: false,
          subDisplayField: "organizationCode",
          displayField: "organizationName",
          valueField: "purchaseOrgId",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.addQueryParameter("purOrganizationName", val[0]["organizationName"]);
            }
          },
          onClear: (ds) => {
            ds.addQueryParameter("purOrganizationName", null);
          }
        }
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
        fieldCode: "erpCreationDateStart",
        fieldName: $T("sodr.common.model.common.createDateFrom").$D("创建日期从"),
        fieldType: "DATE",
      },
      {
        fieldCode: "erpCreationDateEnd",
        fieldName: $T("sodr.common.model.common.createDateTo").$D("创建日期至"),
        fieldType: "DATE",
      },
    ],
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-header/publishing",
        method: "get",
      },
      submit: {
        url: "/spuc/v1/{tenantId}/po-header/batch-publish",
        method: "post",
      }
    },
  };
}

function commonDs () {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
  };
}

function lineDs (poHeaderId) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SODR.ORDER_PUBLISH_LINE_LIST.PUBLISH_LINE,SODR.ORDER_PUBLISH_LINE_LIST.OTHER",
      camp: 1,
      sortType: 2
    },
    pathParameter: { tenantId: SrmUtil.getTenantId(), poHeaderId: poHeaderId },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-line/{poHeaderId}/detail",
        method: "get",
      },
    },
  };
}

function partnerDs (poHeaderId) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    pathParameter: { tenantId: SrmUtil.getTenantId(), poHeaderId: poHeaderId },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-header/{poHeaderId}/partners",
        method: "get",
      },
    },
  };
}

function bomDs ({ poHeaderId, poLineId, poLineLocationId }) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      poHeaderId: poHeaderId,
      poLineId:poLineId,
      poLineLocationId: poLineLocationId,
    },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/po-item-boms",
        method: "get",
      },
    },
  };
}

export {
  indexDs,
  commonDs,
  lineDs,
  partnerDs,
  bomDs,
};