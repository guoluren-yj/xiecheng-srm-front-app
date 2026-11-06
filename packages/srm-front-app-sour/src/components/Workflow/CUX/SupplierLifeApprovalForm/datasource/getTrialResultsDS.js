/*
 * @Date: 2022-11-21 20:50:46
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getTrialResultsDS = () => ({
  editable: true,
  enableQuery: false,
  forceValidate: true,
  fields:[
    {
      fieldCode:"attributeVarchar7Meaning",
      fieldName:$T("scux.starbucks.modal.common.evaluateResult").$D("Buyer 预审评估结果"),
    },
    {
      fieldCode:"attributeLongtext2",
      fieldName:$T("scux.starbucks.modal.common.buyerEvaluateOpinion").$D("Buyer 预审评估意见"),
    },
    {
      fieldCode:"attributeVarchar8",
      fieldType: "SELECT",
      required: true,
      lovCode: "SCUX.STARBUCKS.PRE_EVALUATE_RESULT",
      fieldName:$T("scux.starbucks.modal.common.directorEvaluate").$D("Line Director 评估结果"),
    },
    {
      fieldCode:"attributeVarchar8Meaning",
      fieldName:$T("scux.starbucks.modal.common.directorEvaluate").$D("Line Director 评估结果"),
    },
    {
      fieldCode:"attributeLongtext3",
      fieldType: "INPUT",
      required: true,
      fieldName:$T("scux.starbucks.modal.common.lineDirectorOpinion").$D("Line Director 预审评估意见"),
    },
  ],
});