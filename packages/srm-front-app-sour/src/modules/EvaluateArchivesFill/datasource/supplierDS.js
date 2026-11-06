import { $T, SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";

function supplierDS(evalGranularity, evalHeaderId, supplierDataSetAfterDelete) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    pathParameter: {
      evalHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplier").$D("供应商名称"),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierManage.model.supplierManage.supplierNum").$D("供应商编码"),
      },
      {
        fieldCode: "categoryIds",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
      },
      {
        fieldCode: "itemIds",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
      },
    ],
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "supplierId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.vendor").$D("供应商"),
        lovCode: "SSLM.KPI_DTL_SUPPLIER",
        options: {
          subDisplayField: "companyNum",
          queryParams: {
            evalHeaderId,
          }
        },
      },
      {
        fieldCode: "categoryIds",
        fieldType: "TREE",
        fieldName: $T("sslm.supplierDocManage.model.docManage.purchaseProduct").$D("采购品类"),
        lovCode: "SSLM.KPI_DTL_CATEGORY",
        visible: evalGranularity === "SU+CA",
        options: {
          subDisplayField: "categoryCode",
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "itemId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.itemName").$D("物料"),
        lovCode: "SSLM.KPI_DTL_ITEM",
        visible: evalGranularity === "SU+IT",
        options: {
          subDisplayField: "itemCode",
          queryParams: {
            evalHeaderId,
          }
        }
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/eval-suppliers-dis/{evalHeaderId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-line/save-eval-line/{evalHeaderId}",
        method: "POST",
      },
      destroy: {
        url: "/sslm/v1/{tenantId}/eval-line/delete/{evalHeaderId}",
        method: "delete",
      }
    },
    events: {
      beforeDelete: (ds, data) => {
        const scoreVendorId = uuid();
        data.forEach((e) => e.scoreVendorId = scoreVendorId);
        return data;
      },
      afterDelete: supplierDataSetAfterDelete,
    }
  };
}

export default supplierDS;
