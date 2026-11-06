import {$T, SrmUtil} from "srm-mobile-ui";

function baseInfoDataSet() {
  return {
    autoQuery: false,
    editable: true,
    enableQuery: false,
    editFlag: true,
    selection: Infinity,
    forceValidate: true,
    fields: [],
  };
}

function currentTabFormDataSet() {
  return {
    autoQuery: false,
    editable: true,
    enableQuery: false,
    editFlag: true,
    selection: Infinity,
    forceValidate: true,
    fields: [
      {
        fieldCode: "rfxLineItemId",
      },
      {
        fieldCode: "rfxLineSupplierId",
      },
    ],
  };
}

function selectTabSupplierListDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: true,
    editFlag: false,
    selection: Infinity,
    paging: false,
    pathParameter: {
      organizationId: SrmUtil.getTenantId()
    },
    fastQueryField: {
      fieldCode: "supplierCompanyName",
      fieldType: "TEXT",
      fieldName: $T("ssrc.common.supplierName").$D("供应商名称"),
    },
    queryFields: null,
    fields: [
      {
        fieldCode: "rfxLineSupplierId",
      },
    ],
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        let curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if ([ "customizeUnitCode", ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "supplierCompanyName", ].includes(key)) {
            curCustomMergeFilterField.push(key);
            bodyParameter.supplierCompanyName = value;
            ds.addBodyParameter("supplierCompanyName", value);
          }
        });

        params["page"] = null;
        params["size"] = null;
        bodyParameter["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        bodyParameter["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v1/{organizationId}/rfx/check/approval-form/supplier/list`,
        method: "POST",
      },
    },
  };
}

function selectTabItemListDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: true,
    editFlag: false,
    selection: Infinity,
    paging: false,
    pathParameter: {
      organizationId: SrmUtil.getTenantId()
    },
    fastQueryField: {
      fieldCode: "itemName",
      fieldType: "TEXT",
      fieldName: $T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料描述"),
    },
    queryFields: null,
    fields: [
      {
        fieldCode: "rfxLineItemId",
      },
    ],
    events: {
      // eslint-disable-next-line no-unused-vars
      beforeQuery: (ds, params, pathParam, bodyParameter) => {
        let curCustomizeFilterComparison = [];
        const curCustomMergeFilterField = [];
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if ([ "customizeUnitCode", ].includes(key)) {
            curCustomizeFilterComparison.push(key + ":=");
          } else if ([ "itemName" ].includes(key)) {
            curCustomMergeFilterField.push(key);
            bodyParameter.itemName = value;
            ds.addBodyParameter("itemName", value);
          }
        });
        params["page"] = null;
        params["size"] = null;
        bodyParameter["customizeFilterComparison"] = curCustomizeFilterComparison.join(",");
        bodyParameter["customMergeFilterField"] = curCustomMergeFilterField.join(",");
      }
    },
    transport: {
      read: {
        url: `/ssrc/v1/{organizationId}/rfx/check/approval-form/item/list`,
        method: "POST",
      },
    },
  };
}

function currentSupplierTabTableDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields: [
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{organizationId}/rfx/check/approval-form/item/page",
        method: "get",
      },
    },
  };
}

function currentItemTabTableDataSet() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    fields: [
    ],
    transport: {
      read: {
        url: "/ssrc/v1/{organizationId}/rfx/check/approval-form/supplier/page",
        method: "get",
      },
    },
  };
}

export {
  baseInfoDataSet,
  currentTabFormDataSet,
  currentSupplierTabTableDataSet,
  currentItemTabTableDataSet,
  selectTabSupplierListDataSet,
  selectTabItemListDataSet
};
