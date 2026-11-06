/*
 * @Date: 2025-04-08 09:50:09
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2024, Hand
 */
import { SrmUtil, $T } from "srm-mobile-ui";

function assessmentDS() {
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
        fieldCode: "evalNum",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalNum").$D("评估报告编号"),
      },
      {
        fieldCode: "evalDescription",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalDescription").$D("评估报告描述"),
      },
      {
        fieldCode: "groupFlag",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.groupFlag").$D("是否集团级"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.companyName").$D("公司"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.supplierCompanyName")
          .$D("供应商"),
      },
      {
        fieldCode: "resultsFlagMeaning",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evaluationResult").$D("评估结果"),
      },
      {
        fieldCode: "finalScore",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evaluateScore").$D("评估得分"),
      },
      {
        fieldCode: "grade",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evaluateLevel").$D("评估等级"),
      },
      {
        fieldCode: "strategyName",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.strategyName").$D("评估策略"),
      },
      {
        fieldCode: "evalTplName",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalTplName").$D("评估模板名称"),
      },
      {
        fieldCode: "evalTypeMeaning",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.evalType").$D("评分方式"),
      },
      {
        fieldCode: "assessTypeMeaning",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.assessType").$D("评估类型"),
      },
      {
        fieldCode: "realName",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.realName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("sslm.purchaserEvaluation.table.column.label.creationDate").$D("创建时间"),
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/site-eval-headers/eval-report-header",
        method: "get",
      },
    },
  };
}

export default assessmentDS;