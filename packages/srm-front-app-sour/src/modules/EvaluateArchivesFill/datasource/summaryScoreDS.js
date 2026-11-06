import { $T, SrmUtil } from "srm-mobile-ui";

function summaryScoreDS(evalLineId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCORESUM_SUMSCORE"
    },
    pathParameter: {
      evalLineId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "indicatorCode",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      },
      {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      },
      {
        fieldCode: "benchmarkScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.benchmarkScore").$D("基准分值"),
      },
      {
        fieldCode: "evalWeight",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evalWeight").$D("指标权重%"),
      },
      {
        fieldCode: "scoreTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreType").$D("评分方式"),
      },
      {
        fieldCode: "indicatorTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
      },
      {
        fieldCode: "isVeto",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.vetoFlag").$D("已否决"),
      },
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
      },
      {
        fieldCode: "respRemarks",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.processRemark").$D("系统计算说明"),
      },
      {
        fieldCode: "finalScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-dtls/{evalLineId}",
        method: "get",
      },
    },
    events: {
    }
  };
}

export default summaryScoreDS;
