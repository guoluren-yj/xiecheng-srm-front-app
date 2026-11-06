import { $T, SrmUtil } from "srm-mobile-ui";

function indicatorDS(evalHeaderId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    showTotalCount: true,
    pathParameter: {
      evalHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      },
      {
        fieldCode: "indicatorCode",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      },
      {
        fieldCode: "scoreTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreType").$D("评分方式"),
      },
      {
        fieldCode: "evalWeight",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeight").$D("权重"),
      },
      {
        fieldCode: "evalStandard",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
      },
    ],
    fastQueryField: {
      fieldCode: "indicatorName",
      fieldType: "TEXT",
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
    },
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/tree-selected/{evalHeaderId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-line/createOrUpdate/{evalHeaderId}",
        method: "POST",
      },
      destroy: {
        url: "/sslm/v1/{tenantId}/eval-line/deleteKpiEvalLineByIds/{evalHeaderId}",
        method: "POST",
      }
    },
  };
}

export default indicatorDS;
