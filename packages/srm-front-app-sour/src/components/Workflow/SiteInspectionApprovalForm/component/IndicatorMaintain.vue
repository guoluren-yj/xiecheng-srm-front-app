<!-- 评估信息，下级指标组件 -->
<template>
  <div class="srm-indicatorMaintain-wrap">
    <div class="srm-indicatorMaintain-header">
      <srm-flex justify="between" align-content="center">
        <div class="srm-indicatorMaintain-header-line">
          <span>{{ $T("sslm.siteInvestigateReport.modal.mange.projectCode").$D("考察项目编码") }}：</span>
          <span>{{ parentIndicatorInfo && parentIndicatorInfo.indicatorCode }}</span>
        </div>
        <div class="srm-indicatorMaintain-header-line">
          <span>{{ $T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称") }}：</span>
          <span>{{ parentIndicatorInfo && parentIndicatorInfo.indicatorName }}</span>
        </div>
      </srm-flex>
    </div>
    <div class="srm-indicatorMaintain-tab">
      <srm-flex justify="between" align-content="center">
        <div>
          <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
        </div>
      </srm-flex>
    </div>
    <srm-list v-if="indicatorDs" :data-set="indicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" customize-code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORE_INFO" />
    <!-- 子集弹窗 -->
    <srm-popup
      :visible.sync="childrenPop"
      position="right"
      :title="$T('sslm.purchaserEvaluationDetail.view.content.assessmentInfo').$D('评估信息')"
      show-back>
      <div class="srm-indicatorMaintain-pop-wrap">
        <div class="srm-indicatorMaintain-header">
          <srm-flex justify="between" align-content="center">
            <div class="srm-indicatorMaintain-header-line">
              <span>{{ $T("sslm.siteInvestigateReport.modal.mange.projectCode").$D("考察项目编码") }}：</span>
              <span>{{ nextIndicatorInfo.indicatorCode }}</span>
            </div>
            <div class="srm-indicatorMaintain-header-line">
              <span>{{ $T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称") }}：</span>
              <span>{{ nextIndicatorInfo.indicatorName }}</span>
            </div>
          </srm-flex>
        </div>
        <div class="srm-indicatorMaintain-tab">
          <srm-flex justify="between" align-content="center">
            <div>
              <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
            </div>
          </srm-flex>
        </div>
        <srm-list v-if="nextIndicatorDs" :data-set="nextIndicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" customize-code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORE_INFO" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { commonDs, indicatorStatusDs } from "../datasource";
import { DataSet, $T } from "srm-mobile-ui";

export default {
  modules: [ "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluationDetail", "sslm.common", "smbl.common", "sslm.purchaserEvaluation", "hzero.common", "hipspfm.common", "sslm.siteInvestigateReport" ],
  name: "IndicatorMaintain",
  props: {
    indicatorInfo: {
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
      childrenPop: false,
      indicatorDataSet: {},
    };
  },
  computed: {
    // 基本信息
    getBasicColumns() {
      return [
        {
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称"),
          fieldCode: "indicatorName",
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
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.projectType").$D("考察项目类型"),
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
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlagMeaning",
          fieldType: "TEXT",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldCode: "supplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 60,
          formCol: 10,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          showCount: true,
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
          formRow: 80,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人"),
          fieldCode: "scorer",
          formRow: 90,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const scorerMeaning = this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人");
            return flag ? scorerMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.viewIndicatorScorer(record);
            }}>
              { scorerMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreStatus").$D("评分状态"),
          fieldCode: "completeFlag",
          fieldType: "TEXT",
          formRow: 100,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType, completeFlag } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const completeFlagMeaning = completeFlag ? this.$T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成") : this.$T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
            return flag ? completeFlagMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.viewIndicatorStatus(record);
            }}>
              { completeFlagMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.chidrenMaintain").$D("下级指标"),
          fieldCode: "chidrenMaintain",
          fieldType: "TEXT",
          formRow: 110,
          formCol: 10,
          render: (val, record) => {
            const showFlag = record.children && record.children.length > 0;
            return showFlag ? <srm-button
              plain
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
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.account").$D("评分人账户"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.userDescribe").$D("评分用户描述"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
          fieldCode: "respWeight",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准"),
          fieldCode: "isStandard",
          render: (val, record) => record.isStandard ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
          fieldCode: "isVeto",
          render: (val, record) => record.isVeto ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.score").$D("得分"),
          fieldCode: "score",
        },
      ];
      return columns;
    },
    // 评分人
    getScorerInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.scoreUser").$D("评分用户"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.userDescribe").$D("评分用户描述"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
          fieldCode: "respWeight",
        },
      ];
      return columns;
    },
  },
  mounted() {
    const childrenIndicator = this.indicatorInfo?.children || [];
    this.parentIndicatorInfo = this.indicatorInfo;
    this.indicatorDs.setData(childrenIndicator || []);
  },
  methods: {
    maintainChildrenAction(record) {
      const childrenIndicator = record?.children || [];
      this.nextIndicatorDs = null;
      this.nextIndicatorDs = new DataSet(commonDs());
      this.nextIndicatorDs.setData(childrenIndicator || []);
      this.nextIndicatorInfo = record;
      this.childrenPop = !this.childrenPop;
    },
    // 查看评分人
    viewIndicatorScorer(record) {
      const { evalLineId } = record || {};
      this.indicatorDataSet = new DataSet(indicatorStatusDs(evalLineId));
      this.$popup({
        title: this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <srm-list
          customize-code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORER_INFO"
          scrollable={false}
          columns={this.getScorerInfoColumns}
          dataSet={this.indicatorDataSet}/>,
      });
    },
    // 指标评估状态
    viewIndicatorStatus(record) {
      const { evalLineId } = record || {};
      this.indicatorDataSet = new DataSet(indicatorStatusDs(evalLineId));
      this.$popup({
        title: this.$T("sslm.siteInvestigateReport.modal.mange.scoreStatus").$D("评分状态"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <srm-list
          customize-code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.RATING_STATUS_INFO"
          scrollable={false}
          columns={this.getIndicatorColumns}
          dataSet={this.indicatorDataSet}/>,
      });
    },
  }
};
</script>

  <style lang="stylus" scoped>
    .srm-indicatorMaintain-wrap {
      .srm-indicatorMaintain-header {
        height: 52px;
        display: flex;
        padding: 0 16px;
        font-size: 14px;
        .srm-indicatorMaintain-header-line {
          line-height: 20px;
        }
      }
      .srm-indicatorMaintain-tab {
        height: 48px;
        display: flex;
        padding: 0 16px;
        background: #F6F6F6;
      }
    }

    .srm-indicatorMaintain-pop-wrap {
      .srm-indicatorMaintain-header {
        height: 52px;
        display: flex;
        padding: 0 16px;
        font-size: 14px;
        .srm-indicatorMaintain-header-line {
          line-height: 20px;
        }
      }
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
