import { $T, SrmUtil } from "srm-mobile-ui";

function createSupplierDS(evalHeaderId, exist = []) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: true,
    enableQuery: true,
    showTotalCount: true,
    pathParameter: {
      evalHeaderId,
      tenantId: SrmUtil.getTenantId(),
      customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREVENDOR_ADDMODAL,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREVENDOR_FILTER",
    },
    fields: [
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.workbench.model.workbench.platformSupplierName").$D("平台供应商名称"),
      },
      {
        fieldCode: "companyNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.workbench.model.workbench.platformSupplierNum").$D("平台供应商编码"),
      },
      {
        fieldCode: "erpSupplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationTemplate.view.supplier.erpSupplierName").$D("ERP供应商名称"),
      },
      {
        fieldCode: "erpSupplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.workbench.model.platformSupplier.erpSupplierNum").$D("ERP供应商编码"),
      },
    ],
    fastQueryField: {
      fieldCode: "companyName",
      fieldType: "TEXT",
      fieldName: $T("sslm.workbench.model.workbench.platformSupplierName").$D("平台供应商名称"),
    },
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "companyNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.workbench.model.workbench.platformSupplierNum").$D("平台供应商编码"),
      },
      {
        fieldCode: "erpSupplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationTemplate.view.supplier.erpSupplierName").$D("ERP供应商名称"),
      },
      {
        fieldCode: "erpSupplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.workbench.model.platformSupplier.erpSupplierNum").$D("ERP供应商编码"),
      },
      {
        fieldCode: "categoryId",
        fieldType: "LOV",
        lovCode: "SSLM.SUPPLIER_CATEGORY",
        fieldName: $T("sslm.supplierDocManage.model.evalDocManage.categoryDescriptions").$D("供应商分类"),
        options: {
          subDisplayField: "categoryCode",
        }
      },
      {
        fieldCode: "stageIds",
        fieldType: "SELECT",
        lovCode: "SSLM.LIFE_CYCLE_STAGE",
        fieldName: $T("sslm.evaluationTemplate.model.evalTemplate.stageId").$D("供应商生命阶段"),
        options: {
          subDisplayField: "stageCode",
          multiple: true,
        }
      },
      {
        fieldCode: "companyId",
        fieldType: "LOV",
        lovCode: "HPFM.PURCHASE_COMPANY",
        fieldName: $T("sslm.evaluationTemplate.model.evalTemplate.companyName").$D("公司"),
        options: {
          subDisplayField: "companyNum",
        }
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-templates/scope/supplier",
        method: "get",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        data.forEach((r) => {
          if (exist.includes(r.supplierCompanyId)) {
            r.exist = true;
          }
        });
        return data;
      },
    }
  };
}

export default createSupplierDS;
