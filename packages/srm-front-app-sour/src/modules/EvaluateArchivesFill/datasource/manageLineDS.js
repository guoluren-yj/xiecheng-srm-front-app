import { $T } from "srm-mobile-ui";

function manageLineDS(evalGranularity, evalHeaderId, lineDataSetAfterQuery, lineDataSetBeforeUpdate, lineDataSetBeforeSubmit) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.ARCHIVE_FILLING_DETAIL.FILLING_DETAIL,SSLM.ARCHIVE_FILLING_DETAIL.FILLING_SEARCH_FORM,SSLM.ARCHIVE_FILLING_DETAIL.LIST",
      pageEntryPoint: "CUSTOMER_OWNED",
    },
    fields: [
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplierNum").$D("公司编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplier").$D("供应商名称"),
      },
      {
        fieldCode: "erpSupplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderCode").$D("erp供应商编码"),
      },
      {
        fieldCode: "erpSupplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderName").$D("erp供应商名称"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
        visible: (val, item) => item.evalGranularity === "SU+CA",
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
        visible: (val, item) => item.evalGranularity === "SU+IT",
      },
      {
        fieldCode: "lineScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.sumScore").$D("汇总得分"),
      },
      {
        fieldCode: "suggestStrategies",
        fieldType: "SELECT",
        lovCode: "SSLM.SUGGESTED_STRATEGIES",
        displayField: "suggestStrategiesMeaning",
        fieldName: $T("sslm.supplierDocManage.model.docManage.suggestedStrategy").$D("建议策略"),
      },
      {
        fieldCode: "levelCode",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreLevelDesc").$D("等级"),
      },
      {
        fieldCode: "rankNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.rank").$D("考评排名"),
        // /visible: (val, item) => Number(item.completeFlag) === 2,
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
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "categoryIds",
        fieldType: "TREE",
        fieldName: $T("sslm.supplierDocManage.model.docManage.purchaseProduct").$D("采购品类"),
        lovCode: "SSLM.KPI_DTL_CATEGORY",
        visible: evalGranularity === "SU+CA",
        options: {
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
      {
        fieldCode: "scoreFrom",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreFrom").$D("分值从"),
      },
      {
        fieldCode: "scoreTo",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreTo").$D("分值至"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/eval-lines/{evalHeaderId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-line/save-line",
        method: "POST",
      }
    },
    events: {
      afterQuery: lineDataSetAfterQuery,
      //beforeUpdate: lineDataSetBeforeUpdate,
      beforeSubmit: lineDataSetBeforeSubmit,
    }
  };
}

export default manageLineDS;
