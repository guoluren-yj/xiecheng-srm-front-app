/*
 * @Date: 2024-08-12 18:06:14
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
const organizationId = SrmUtil.getTenantId();

export const getScoreResultDs = ({ evalHeaderId }) => ({
  autoQuery:true,
  editable: false,
  enableQuery: false,
  pageSize: 5,
  queryParameter:{
    customizeUnitCode: [ "SSLM.APPRAISAL_PURCHASER_DETAIL.SCORE_RESULT_LIST" ].join()
  },
  fields: [
    {
      fieldName: $T("sslm.common.view.supplier.code").$D("供应商编码"),
      fieldCode: "supplierNum",
    },
    {
      fieldName: $T("sslm.common.view.supplier.fieldCode").$D("供应商名称"),
      fieldCode: "supplierName",
    },
    {
      fieldName: $T("sslm.common.model.archiveFilled.purchaseCategory").$D("采购品类"),
      fieldCode: "categoryName",
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sslm.common.model.archiveFilled.item").$D("物料"),
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.sumScore").$D("汇总得分"),
      fieldCode: "lineScore",
    },
    {
      fieldCode: "checkCollectScore",
      fieldName: $T("sslm.common.model.docManage.checkCollectScore").$D("校准得分"),
    },
    {
      fieldCode: "rankNum",
      fieldName:$T("sslm.common.model.field.rank").$D("排名"),
    },
    {
      fieldCode: "levelCode",
      fieldName: $T("sslm.common.model.archiveFilled.level").$D("等级"),
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.checkLevelDesc").$D("校准等级"),
      fieldCode: "checkLevelDesc",
    },
    {
      fieldCode: "executeActionMeaning",
      fieldName: $T("sslm.common.model.field.subsequentExecutionAction").$D("后续执行动作"),
    },
    {
      fieldCode: "executeTotalCount",
      fieldName: $T("sslm.common.model.field.executionDocument").$D("执行单据"),
    },
    {
      fieldCode:"scoreDetail",
      fieldName:$T("sslm.common.model.field.scoreDetail").$D("评分详情"),
    },
    // 申诉字段
    {
      fieldCode: "appealRemark",
      fieldName: $T("sslm.common.model.feedback.complaintRemark").$D("申诉说明"),
    },
    {
      fieldCode: "attachmentUuid",
      fieldType: "UPLOAD",
      fieldName: $T("sslm.common.model.evaluation.supplierAttachment").$D("供方上传附件"),
    },
    {
      fieldCode: "appealCheckCollectScore",
      fieldName: $T("sslm.common.model.feedback.calibrationGrade").$D("校准分数"),
    },
    {
      fieldCode: "appealReply",
      fieldName: $T("sslm.common.model.feedback.appealReply").$D("采购方回复"),
    },
    {
      fieldCode: "appealLevelCode",
      fieldName: $T("sslm.common.model.feedback.newRank").$D("新等级"),
    },
    {
      fieldCode: "appealRankNum",
      fieldName: $T("sslm.common.model.feedback.newRanking").$D("新排名"),
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/eval-line/eval-manage/preview/${evalHeaderId}`,
      method: "GET",
    },
  },
});

export const scoreResultDsColumns = (_this, type) => [
  {
    fieldCode: "supplierName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val) => <SrmListHeader showOpenTag={false} >
      <span>{val}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "supplierNum",
    formRow: 20,
    formCol:1,
  },
  {
    fieldCode: "categoryName",
    formRow: 20,
    formCol:2,
    visible:_this.evalGranularity === "SU+CA"
  },
  {
    fieldCode: "itemName",
    formRow: 20,
    formCol:2,
    visible:_this.evalGranularity === "SU+IT"
  },
  {
    fieldCode: "lineScore",
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "checkCollectScore",
    formRow: 30,
    formCol:2,
    visible:type !== "APPEAL",
  },
  {
    fieldCode: "rankNum",
    formRow: 40,
    formCol:1,
    render: (val, data) => {
      const { supplierTotalNum } = data;
      return val ? `${val}/${supplierTotalNum}` : "-";
    },
  },
  {
    fieldCode: "levelCode",
    formRow: 40,
    formCol:2,
  },
  {
    fieldCode: "appealRankNum",
    formRow: 45,
    formCol:1,
    visible:type === "APPEAL",
  },
  {
    fieldCode: "appealLevelCode",
    formRow: 45,
    formCol:2,
    visible:type === "APPEAL",
  },
  {
    fieldCode:"appealRemark",
    formRow: 46,
    visible:type === "APPEAL",
  },
  {
    fieldCode: "attachmentUuid",
    formRow: 47,
    formCol:1,
    visible:type === "APPEAL",
  },
  {
    fieldCode:"appealCheckCollectScore",
    formRow: 47,
    formCol:2,
    visible:type === "APPEAL",
  },
  {
    fieldCode: "checkLevelDesc",
    formRow: 50,
    visible:type !== "APPEAL",
  },
  {
    fieldCode:"appealReply",
    formRow: 55,
    visible:type === "APPEAL",
  },
  {
    fieldCode: "executeActionMeaning",
    formRow: 60,
  },
  {
    fieldCode:"executeTotalCount",
    formRow: 70,
    formCol:1,
    render: (val, data) =>
      <span style="color: var(--color-other-default-b);"
        on-click={(n) => {
          n.stopPropagation();
          _this.handleExecutionDocument(data);
        }}>
        {$T("hzero.common.button.view").$D("查看")}({val})
      </span>,
  },
  {
    fieldCode:"scoreDetail",
    formRow: 70,
    formCol:2,
    render: (val, data) =>
      <span style="color: var(--color-other-default-b);"
        on-click={(n) => {
          n.stopPropagation();
          _this.handleScoreDetail(data);
        }}>
        {$T("hzero.common.button.view").$D("查看")}
      </span>,
  }
];