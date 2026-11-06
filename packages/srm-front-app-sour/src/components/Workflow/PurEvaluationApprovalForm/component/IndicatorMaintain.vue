<!-- 评估信息，下级指标组件 -->
<template>
  <div class="srm-indicatorMaintain-wrap">
    <customize :need-padding="true" :columns="getIndicatorFormColumns" :data-source="parentIndicatorInfo"/>
    <div class="srm-indicatorMaintain-tab">
      <srm-flex justify="between" align-content="center">
        <div>
          <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
        </div>
      </srm-flex>
    </div>
    <srm-list v-if="indicatorDs" :data-set="indicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" />
    <!-- 子集弹窗 -->
    <srm-popup
      :visible.sync="childrenPop"
      position="right"
      :title="$T('sslm.purchaserEvaluationDetail.view.content.assessmentInfo').$D('评估信息')"
      show-back>
      <div class="srm-indicatorMaintain-pop-wrap">
        <customize :need-padding="true" :columns="getIndicatorFormColumns" :data-source="nextIndicatorInfo"/>
        <div class="srm-indicatorMaintain-tab">
          <srm-flex justify="between" align-content="center">
            <div>
              <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
            </div>
          </srm-flex>
        </div>
        <srm-list v-if="nextIndicatorDs" :data-set="nextIndicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { commonDs } from "../datasource";
import { DataSet, $T } from "srm-mobile-ui";
import { yesOrNoRender } from "@/utils/sslmUtils.js";

export default {
  modules: [ "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluationDetail", "sslm.common", "smbl.common", "sslm.purchaserEvaluation", "hzero.common", "hipspfm.common", "sslm.siteInvestigateReport" ],
  name: "IndicatorMaintain",
  props: {
    indicatorInfo: {
      type: Object,
      default: () => {},
    },
    basicDs: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      indicatorDs: new DataSet(commonDs()), // 指标信息
      nextIndicatorDs: null, // 下一级指标ds
      nextIndicatorInfo: {}, // 下一级指标信息
      parentIndicatorInfo: {}, // 顶级指标信息
      parentBasicDs: null, // 基本信息
      childrenPop: false,
    };
  },
  computed: {
    // 指标
    getIndicatorFormColumns() {
      return [
        {
          fieldCode:"indicatorCode",
          fieldName:$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码"),
          formRow:10,
          formCol:1,
        },
        {
          fieldCode:"indicatorName",
          fieldName:$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          formRow:10,
          formCol:2,
        },
      ];
    },
    // 基本信息
    getBasicColumns() {
      const { needFeedbackFlag, progressStatus, evalType, selfIndicatorType } = this.basicDs?.current?.data || {} || {};
      // 评估策略为勾选‘按照指标类型自评’，‘供应商自评’且为线上打分，显示字段
      const showSelfEvaluation = evalType === "ONLINE" && needFeedbackFlag && selfIndicatorType;
      return [
        {
          fieldCode: "indicatorName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            {this.showResultsFlag && <span slot="right">
              <SrmTag type="success">{$T("sslm.common.model.archiveFilled.score").$D("得分")}:{record.finalScore}</SrmTag>
            </span>}
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码"),
          fieldCode: "indicatorCode",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.scoreType").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorType").$D("评估项目类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.evalStandard").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlagMeaning",
          fieldType: "TEXT",
          visible: needFeedbackFlag,
          formRow: 40,
          formCol: 10,
        },
        {
          fieldCode: "supplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus) && !showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfSupplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfSupplierScore").$D("供应商自评打分"),
          visible:() => showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfIsStandard",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIsStandard").$D("供应商自评符合评分标准"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsStandard),
          visible:() => showSelfEvaluation,
          formRow: 60,
          formCol: 10,
        },
        {
          fieldCode: "selfIsVeto",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIsVeto").$D("供应商自评否决该项"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsVeto),
          visible:() => showSelfEvaluation,
          formRow: 70,
          formCol: 10,
        },
        {
          fieldCode: "selfIndOptId",
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.selfIndOptId").$D("供应商自评评分选项"),
          fieldType: "TEXT",
          render: (val, record) => record.selfIndOptName,
          visible:() => showSelfEvaluation,
          formRow: 80,
          formCol: 10,
        },
        {
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 90,
          formCol: 10,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          showCount: true,
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 100,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.evalWeight").$D("指标权重"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
          formRow: 110,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorStatus").$D("指标评估状态"),
          fieldCode: "completeFlag",
          fieldType: "TEXT",
          formRow: 120,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            return flag ? "-" : <srm-button plain style={{ fontWeight:400, fontSize: "12px" }} onClick={(e) => {
              e.stopPropagation();
              this.viewIndicatorStatus(record, false);
            }}>
              { this.$T("smbl.common.view.button.view").$D("查看") }
            </srm-button>;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.chidrenMaintain").$D("下级指标"),
          fieldCode: "chidrenMaintain",
          fieldType: "TEXT",
          formRow: 130,
          formCol: 10,
          render: (val, record) => {
            const showFlag = record.children && record.children.length > 0;
            return showFlag ? <srm-button
              plain
              style={{ fontWeight:400, fontSize: "12px" }}
              onClick={() => {
                this.maintainChildrenAction(record);
              }}>
              {this.$T("smbl.common.view.button.view").$D("查看")}
            </srm-button> : "-";
          },
        }
      ];
    },
    // 指标评估状态
    getIndicatorColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "realName",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            <span slot="right">
              <SrmTag type="success">{record.completeFlagMeaning}</SrmTag>
            </span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.common.modal.grade.description").$D("评分描述"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.respWeight").$D("评分人权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.common.modal.grade.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
      ];
      return columns;
    },
  },
  mounted() {
    const childrenIndicator = this.indicatorInfo?.children || [];
    this.parentIndicatorInfo = this.indicatorInfo;
    this.parentBasicDs = this.basicDs;
    this.indicatorDs.setData(childrenIndicator || []);
  },
  methods: {
    maintainChildrenAction(record) {
      const childrenIndicator = record?.children || [];
      this.nextIndicatorDs = null;
      this.nextIndicatorDs = new DataSet(commonDs());
      this.nextIndicatorDs.setData(childrenIndicator || []);
      this.nextIndicatorInfo = record;
      this.childrenPop = true;
    },
    // 指标评估状态
    viewIndicatorStatus(record) {
      const indicatorDataSet = new DataSet(commonDs());
      const { evalResps, indicatorName, indicatorCode } = record || {};
      indicatorDataSet.setData(evalResps || []);
      this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorStatus").$D("指标评估状态"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <div class="srm-assessment-panel">
          <customize
            need-padding
            dataSource={{ indicatorCode, indicatorName }}
            columns={this.getIndicatorFormColumns}/>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            columns={this.getIndicatorColumns}
            dataSet={indicatorDataSet}/>
        </div>,
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
  .srm-indicatorMaintain-wrap {
    .srm-indicatorMaintain-tab {
      height: 48px;
      display: flex;
      padding: 0 16px;
      background: #F6F6F6;
    }
  }

  .srm-indicatorMaintain-pop-wrap {
    .srm-indicatorMaintain-tab {
      height: 48px;
      display: flex;
      padding: 0 16px;
      background: #F6F6F6;
    }
  }

  .srm-assessment-panel {
    .srm-assessment-panel-header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 52px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      .srm-assessment-header-left {
        flex:1
      }
      .srm-assessment-header-right {
        flex:1
      }
    }
    .srm-assessment-panel-division {
      background: #F6F6F6;
      height: 8px;
    }
  }
</style>
