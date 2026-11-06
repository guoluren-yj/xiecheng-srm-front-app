import { SrmUtil, $T } from "srm-mobile-ui";

export const Type = {
  APPROVE: "WAITING",
};

export const CustomizeCode = {
  APPROVE: "SMPC.WORKBENCH_PUR.SKU_WAIT_APPROVE.SEARCH_BAR,SMPC.WORKBENCH_PUR.LIST_WAIT_APPROVE",
};

function indexDs(type) {
  const updateUrlMap = {
    APPROVE: "/smpc/v1/{tenantId}/skus/approve-and-shelf", // 审批通过并上架
  };
  const submitUrlMap = {
    APPROVE: "/smpc/v1/{tenantId}/skus/approve", // 审批通过
  };

  return {
    autoQuery: true,
    selection: Infinity,
    editable: true,
    queryParameter: {},
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      approveStatus: Type[type],
      customizeUnitCode: CustomizeCode[type],
    },
    fastQueryField: {
      fieldCode: "skuName",
      fieldType: "TEXT",
      fieldName: $T("smpc.product.model.productCodeAndName").$D("商品编码/名称"),
    },
    queryFields: [
      {
        fieldCode: "supplierCompanyId",
        fieldType: "LOV",
        fieldName: $T("smpc.product.model.supplier").$D("供应商"),
        lovCode: "SMPC.TENANT_SUPPLIER_ALL",
        options: {
          subDisplayField: "supplierCompanyNum",
          valueField: "supplierCompanyId",
        },
      },
      {
        fieldCode: "catalogId",
        fieldType: "LOV",
        fieldName: $T("smpc.product.model.catalog").$D("目录"),
        lovCode: "SMPC.CATALOG_THREE",
        options: {
          subDisplayField: "catalogCode",
          valueField: "catalogId",
        },
      },
      {
        fieldCode: "itemId",
        fieldType: "LOV",
        fieldName: $T("smpc.product.model.item").$D("物料"),
        lovCode: "SMAL.CUSTOMER_ITEM",
        options: {
          subDisplayField: "itemCode",
          displayField: "itemName",
          valueField: "itemId",
        },
      },
    ],
    events: {
      beforeQuery: (ds, params) => {
        if (params.skuName) {
          params["customMergeFilterField"] = "skuName";
        }
      },
      beforeSubmit: (ds, data) => {
        console.log("审批通过");
        return {
          approvalFlag: 1,
          skuApproveDTOS: data,
        };
      },
      beforeUpdate: (ds, data) => {
        console.log("审批通过并上架");
        return {
          approvalFlag: 1,
          skuApproveDTOS: data,
        };
      },
    },
    transport: {
      read: {
        url: "/smpc/v1/{tenantId}/skus/query-sku-temporary?approveStatus={approveStatus}&customizeUnitCode={customizeUnitCode}",
        method: "get",
      },
      update: {
        url: updateUrlMap[type],
        method: "post",
      },
      submit: {
        url: submitUrlMap[type],
        method: "post",
      },
    },
  };
}

export default indexDs;
