/*
 * @Date: 2023-01-31 09:49:37
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { SrmUtil, $T } from "srm-mobile-ui";

function evaluationDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "evalTplName",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.template").$D("考评模板"),
      },
      {
        fieldCode: "evalStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.archive.status").$D("档案状态"),
      },
      {
        fieldCode: "evalNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.archive.num").$D("档案编码"),
      },
      {
        fieldCode: "evalName",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.archive.describe").$D("档案描述"),
      },
      {
        fieldCode: "kpiMethodMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.exam.method").$D("考评方式"),
      },
      {
        fieldCode: "evalCycleMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.cycle").$D("考评周期"),
      },
      {
        fieldCode: "evalDateFrom",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.startDate").$D("考评日期从"),
      },
      {
        fieldCode: "evalDateTo",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.endDate").$D("考评日期至"),
      },
      {
        fieldCode: "evalDimensionMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.dimension").$D("考评维度"),
      },
      {
        fieldCode: "evalDimensionValueMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.dimension.value").$D("维度值"),
      },
      {
        fieldCode: "levelCodes",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.level").$D("评分等级"),
      },
      {
        fieldCode: "processUserName",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.evaluation.charger").$D("考评负责人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sslm.evaluationQuery.model.archive.create.time").$D("建档时间"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/result/life/purchase",
        method: "get",
      },
    },
  };
}

export default evaluationDS;