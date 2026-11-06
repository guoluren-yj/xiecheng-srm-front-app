import { $T, SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";

import { SRM_SSLM } from "@/utils/utils";
import { yesOrNoRender } from "@/utils/sslmUtils.js";

const organizationId = SrmUtil.getTenantId();

// 评分完成情况ds
export const getScoreStatusDs = () => ({
  editable: false,
  enableQuery: false,
  paging:false,
  fields: [
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.loginName").$D("评分人账户"),
      fieldCode: "loginName",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.graderDesc").$D("评分人描述"),
      fieldCode: "userName",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeightPrec").$D("权重%"),
      fieldCode: "respWeight",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.defaultScore").$D("缺省分值"),
      fieldCode: "defaultScore",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.isStandard").$D("符合评分标准"),
      fieldCode: "isStandard",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.isVeto").$D("否决该项"),
      fieldCode: "isVeto",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.archiveFilled.indOptName").$D("评分选项"),
      fieldCode: "indOptName",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
      fieldCode: "score",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.respWeightScore").$D("评分人权重得分"),
      fieldCode: "respWeightScore",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
      fieldCode: "feedback",
    },
    {
      fieldCode: "scorerAttachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/eval-dtl-resps/{evalDtlId}`,
      method: "GET",
    },
  },
});

// 评分完成情况columns
export const scoreStatusColumns = [
  {
    fieldCode: "userName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val) => <SrmListHeader showOpenTag={false} >
      <span>{val}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "loginName",
    formRow: 20,
  },
  {
    fieldCode: "respWeight",
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "defaultScore",
    formRow: 30,
    formCol:2,
  },
  {
    fieldCode: "isStandard",
    render: (val) => isNil(val) ? "-" : yesOrNoRender(val),
    formRow: 40,
    formCol:1,
  },
  {
    fieldCode: "isVeto",
    render: (val) => isNil(val) ? "-" : yesOrNoRender(val),
    formRow: 40,
    formCol:2,
  },
  {
    fieldCode: "indOptName",
    formRow: 50,
    formCol:1,
  },
  {
    fieldCode: "score",
    formRow: 50,
    formCol:2,
  },
  {
    fieldCode: "respWeightScore",
    formRow: 60,
  },
  {
    fieldCode: "feedback",
    formRow: 70,
  },
  {
    fieldCode: "scorerAttachmentUuid",
    formRow: 80,
  },
];

// 系统计算评分情况ds
export const getSystemStatusDs = () => ({
  editable: false,
  enableQuery: false,
  pageSize: 5,
  fields: [
    {
      fieldCode: "paramDescription",
      fieldName: $T("sslm.common.model.evalDocManage.paramName").$D("参数名称"),
    },
    {
      fieldCode: "paramValue",
      fieldName: $T("sslm.common.model.evalDocManage.calculatedValue").$D("计算值"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/kpi-eval-processs/{evalDtlId}`,
      method: "GET",
    },
  },
});

// 系统计算评分情况columns
export const systemStatusColumns = [
  {
    fieldCode: "paramDescription",
  },
  {
    fieldCode: "paramValue",
  },
];
