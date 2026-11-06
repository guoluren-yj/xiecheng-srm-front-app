/*
 * @Date: 2022-11-24 16:14:40
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getAccessEvaluateDS = () => ({
  editable: false,
  enableQuery: false,
  fields:[
    {
      fieldCode: "attributeVarchar18",
      fieldName: $T("scux.supplierQuery.modal.common.screeningScore").$D("采购筛选得分"),
    },
    {
      fieldCode: "attributeVarchar16Meaning",
      fieldName: $T("scux.supplierQuery.modal.common.assessmentResult").$D("评估结果"),
    },
    {
      fieldCode: "attributeVarchar9Meaning",
      fieldName: $T("scux.supplierQuery.modal.common.riskLevelScore").$D("风险等级得分"),
    },
    {
      fieldCode: "attributeVarchar10Meaning",
      fieldName: $T("scux.supplierQuery.modal.common.cooperationCategories").$D("风险评估-合作类别"),
    },
    {
      fieldCode: "attributeVarchar11Meaning",
      fieldName: $T("scux.supplierQuery.modal.common.sourcePoints").$D("风险评估-货源分数"),
    },
    {
      fieldCode: "attributeVarchar17",
      fieldType: "UPLOAD",
      showCount: true,
      fieldName: $T("scux.supplierQuery.modal.common.purchaseScoreAttachment").$D("采购评分附件"),
    }
  ]
});