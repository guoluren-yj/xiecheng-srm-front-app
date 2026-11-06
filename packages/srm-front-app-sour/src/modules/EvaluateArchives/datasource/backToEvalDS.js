import { $T, SrmUtil } from "srm-mobile-ui";

function backToEvalDS(evalHeaderId = 0) {
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
    },
    fields: [
      {
        fieldCode: "indicatorCode",
        fieldType: "TEXT",
        fieldName: $T("sslm.commonApplication.model.commonApplication.indicatorCode").$D("评价项目编号"),
      },
      {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.commonApplication.model.commonApplication.indicatorName").$D("评价项目"),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.commonApplication.model.commonApplication.supplierCompanyNum").$D("供应商编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.commonApplication.model.commonApplication.supplierCompanyName").$D("供应商名称"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
      },
      {
        fieldCode: "completeFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.completeFlag").$D("状态"),
      },
      {
        fieldCode: "userName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationPerson").$D("评分人"),
      },
      {
        fieldCode: "respWeight",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeightPrec").$D("权重（%）"),
      },
      {
        fieldCode: "score",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
      },
      {
        fieldCode: "backReason",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.backReason").$D("退回原因"),
      },
    ],
    fastQueryField: {
      fieldCode: "indicatorId",
      fieldType: "LOV",
      fieldName: $T("sslm.commonApplication.model.commonApplication.indicatorName").$D("评价项目"),
      lovCode: "SSLM.TEMPLATE_INDICATOR",
    },
    queryFields: [
      {
        fieldCode: "userId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationPerson").$D("评分人"),
        lovCode: "SSLM.KPI_USER",
      },
      {
        fieldCode: "supplierId",
        fieldType: "LOV",
        fieldName: $T("sslm.commonApplication.model.commonApplication.supplierCompanyNum").$D("供应商编码"),
        lovCode: "SSLM.KPI_DTL_SUPPLIER",
        options: {
          queryParams: {
            evalHeaderId,
          }
        }
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps/{evalHeaderId}/batch-query",
        method: "get",
      },
      submit: {
        url: "/sslm/v1/{tenantId}/eval-headers/processEvalScoreBack/{evalHeaderId}",
        method: "post",
      }
    },
    events: {
      beforeSubmit: (ds, data) => ({
        evalHeaderId,
        kpiEvalDtlResps: data,
        selectAllFlag: 0,
        tenantId: SrmUtil.getTenantId(),
        standardFlag: 1,
      })
    }
  };
}

export default backToEvalDS;
