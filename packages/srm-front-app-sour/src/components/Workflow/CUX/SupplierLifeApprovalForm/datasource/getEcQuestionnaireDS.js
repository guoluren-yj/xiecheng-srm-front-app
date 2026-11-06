/*
 * @Date: 2022-11-24 19:19:03
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
const organizationId = SrmUtil.getTenantId();
export const getEcQuestionnaireDS = ({ requisitionId }) => ({
  editable: false,
  enableQuery: false,
  autoQuery: true,
  fields:[
    // {
    //   fieldCode: "ratingMeaning",
    //   fieldName: $T("scux.starbucks.modal.ecQuestionnaire.rating").$D("准入调查问卷评估结果"),
    // },
    {
      fieldCode: "respReportAttachmentUuid",
      fieldType: "UPLOAD",
      showCount: true,
      fieldName: $T("scux.starbucks.modal.ecQuestionnaire.ddReport").$D("DD报告"),
    },
    {
      fieldCode: "ecEvaluateResult",
      fieldName: $T("scux.supplierQuery.modal.assessment.ecAssessResult").$D("E&C评估结果"),
    },
    {
      fieldCode: "ecEvaluateRemark",
      fieldName: $T("scux.supplierQuery.modal.assessment.comments").$D("E&C评语"),
    },
    {
      fieldCode: "finEvaluateResult",
      fieldName: $T("scux.supplierQuery.modal.common.finAssessResult").$D("FIN评估结果"),
    },
    {
      fieldCode: "finEvaluateRemark",
      fieldName: $T("scux.supplierQuery.modal.assessment.FINComments").$D("FIN评语"),
    },
  ],
  transport:{
    read:{
      url: `/sslm/v1/${organizationId}/starbucks-sup-access-reqs/${requisitionId}`,
      method: "GET"
    },
  },
});