/*
 * @Date: 2024-08-12 21:04:11
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
import { isNil, isEmpty } from "lodash";

import { SRM_SSLM } from "@/utils/utils";
import { yesOrNoRender } from "@/utils/sslmUtils.js";

const organizationId = SrmUtil.getTenantId();

export const getScoreDetailDS = () => ({
  editable: false,
  enableQuery: false,
  paging:false,
  queryParameter:{
    customizeUnitCode: "SSLM.APPRAISAL_PURCHASER_DETAIL.SCORE_RESULT_DETAIL",
  },
  fields:[
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      fieldCode: "indicatorName",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      fieldCode: "indicatorCode",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
      fieldCode: "indicatorTypeMeaning",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationWay").$D("评分方式"),
      fieldCode: "scoreTypeMeaning",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.processRemark").$D("系统计算说明"),
      fieldCode: "processRemark",
    },
    {
      fieldName: $T("sslm.common.view.title.paramQuery").$D("参数值查询"),
      fieldCode: "paramQuery",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
      fieldCode: "evalStandard",
    },
    {
      fieldName: $T("sslm.common.model.archiveFilled.indexWeight").$D("指标权重%"),
      fieldCode: "evalWeight",
    },
    {
      fieldName: $T("spfm.supplierKpiIndicator.model.supplier.benchmarkScore").$D("基准分值"),
      fieldCode: "benchmarkScore",
    },
    {
      fieldName: $T("sslm.evaluationQuery.model.docManage.vetoFlag").$D("已否决"),
      fieldCode: "vetoFlag",
    },
    {
      fieldName: $T("sslm.common.model.field.checked").$D("已勾选"),
      fieldCode: "standardFlag",
    },
    {
      fieldName: $T("sslm.common.model.field.selected").$D("已选择"),
      fieldCode: "indOptFlag",
    },
    {
      fieldCode: "scoreFrom",
      fieldName: $T("sslm.scoreLevel.model.scoreLevel.indicatorScoreFrom").$D("指标分值从(=)"),
    },
    {
      fieldCode: "scoreTo",
      fieldName: $T("sslm.scoreLevel.model.scoreLevel.indicatorScoreTo").$D("指标分值至(<)"),
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
      fieldCode: "finalScore",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.checkDetailScore").$D("校准明细得分"),
      fieldCode: "checkDetailScore",
    },
    {
      fieldName: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
      fieldCode: "childIndicators",
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/kpi-eval-header-datas/eval-manage/line/{evalRespRule}/{evalLineId}`,
      method: "GET",
    },
  },
});

export const scoreDetailColumns = (_this, type, systemDataFlag = false) => [
  {
    fieldCode: "indicatorName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val) => <SrmListHeader showOpenTag={false} >
      <span>{val}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "indicatorCode",
    fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
    formRow: 20,
  },
  {
    fieldCode: "indicatorTypeMeaning",
    fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "scoreTypeMeaning",
    fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationWay").$D("评分方式"),
    formRow: 30,
    formCol:2,
  },
  {
    fieldCode: "processRemark",
    fieldName: $T("sslm.supplierDocManage.model.docManage.processRemark").$D("系统计算说明"),
    visible:systemDataFlag,
    formRow: 40,
    formCol:1,
  },
  {
    fieldCode: "paramQuery",
    fieldName: $T("sslm.common.view.title.paramQuery").$D("参数值查询"),
    visible:systemDataFlag,
    formRow: 40,
    formCol:2,
    render: (val, data) => {
      const { scoreType, processStatus } = data;
      return scoreType === "SYSTEM" && processStatus === "COMPLETE" ?
        <span style="color: var(--color-other-default-b);" onClick={() => _this.handleParamQuery(data)}>
          {$T("sslm.common.view.title.paramQuery").$D("参数值查询")}
        </span> :
        "-"
      ;
    },
  },
  {
    fieldCode: "evalStandard",
    fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
    formRow: 50,
    formCol:1,
  },
  {
    fieldCode: "evalWeight",
    fieldName: $T("sslm.common.model.archiveFilled.indexWeight").$D("指标权重%"),
    formRow: 50,
    formCol:2,
  },
  {
    fieldCode: "benchmarkScore",
    fieldName: $T("spfm.supplierKpiIndicator.model.supplier.benchmarkScore").$D("基准分值"),
    formRow: 60,
    formCol:1,
  },
  {
    fieldCode: "vetoFlag",
    fieldName: $T("sslm.evaluationQuery.model.docManage.vetoFlag").$D("已否决"),
    formRow: 60,
    formCol:2,
    render:(val, data) => data.indicatorType === "VETO" ? yesOrNoRender(val) : "-",
  },
  {
    fieldCode: "standardFlag",
    fieldName: $T("sslm.common.model.field.checked").$D("已勾选"),
    formRow: 70,
    formCol:1,
    render:(val, data) => data.indicatorType === "TICK" ? yesOrNoRender(val) : "-",
  },
  {
    fieldCode: "indOptFlag",
    fieldName: $T("sslm.common.model.field.selected").$D("已选择"),
    formRow: 70,
    formCol:2,
    render:(val, data) => data.indicatorType === "OPT" ? yesOrNoRender(val) : "-",
  },
  {
    fieldCode: "scoreFrom",
    fieldName: $T("sslm.scoreLevel.model.scoreLevel.indicatorScoreFrom").$D("指标分值从(=)"),
    formRow: 80,
    formCol:1,
  },
  {
    fieldCode: "scoreTo",
    fieldName: $T("sslm.scoreLevel.model.scoreLevel.indicatorScoreTo").$D("指标分值至(<)"),
    formRow: 80,
    formCol:2,
  },
  {
    fieldCode: "finalScore",
    fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
    formRow: 90,
    formCol:1,
    render:(val, data) => {
      if (isNil(val)) {
        return "-";
      } else if (!isEmpty(data.children)) {
        return val;
      }
      return <span style="color: var(--color-other-default-b);"
        on-click={(n) => {
          n.stopPropagation();
          _this.hanldeScoreStatus(data);
        }}>
        {val}
      </span>;
    },
  },
  {
    fieldCode: "checkDetailScore",
    fieldName: $T("sslm.supplierDocManage.model.docManage.checkDetailScore").$D("校准明细得分"),
    formRow: 90,
    formCol:2,
  },
  {
    fieldCode:"childIndicators",
    fieldName: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
    formRow: 100,
    visible:type === "parent",
    render: (val, data) => {
      if (data.children) {
        return <span style="color: var(--color-other-default-b);"
          on-click={(n) => {
            n.stopPropagation();
            _this.handleChildIndicators(data);
          }}>
          {$T("hzero.common.button.view").$D("查看")}
        </span>;
      }
      return "-";
    },
  }
];