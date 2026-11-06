<!-- 评估信息，下级指标组件 -->
<template>
  <div class="srm-indicatorMaintain-wrap">
    <div class="srm-indicatorMaintain-header">
      <srm-flex justify="between" align-content="center">
        <div class="srm-indicatorMaintain-header-line">
          <span>{{ $T('sslm.purchaserEvaluationDetail.table.column.label.indicatorCode').$D('评估项目代码') }}：</span>
          <span>{{ parentIndicatorInfo && parentIndicatorInfo.indicatorCode }}</span>
        </div>
        <div class="srm-indicatorMaintain-header-line">
          <span>{{ $T('sslm.purchaserEvaluationDetail.table.column.label.indicatorName').$D('评估项目名称') }}：</span>
          <span>{{ parentIndicatorInfo && parentIndicatorInfo.indicatorName }}</span>
        </div>
      </srm-flex>
    </div>
    <div class="srm-indicatorMaintain-tab">
      <srm-flex justify="between" align-content="center">
        <div>
          <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
        </div>
        <div v-if="editFlag">
          <span v-if="indicatorDs && !indicatorDs.editFlag">
            <em class="button srm-icon icon-edit" @click="handleEdit(true)"/>
          </span>
          <span v-if="indicatorDs && indicatorDs.editFlag">
            <srm-button class="button" style="font-size: 16px;" plain @click="handleEdit(false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          </span>
        </div>
      </srm-flex>
    </div>
    <srm-list v-if="indicatorDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSESSMENT" :data-set="indicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" />
    <srm-list-bottom-bar v-if="indicatorDs" style="height: 72px" :data-set="indicatorDs" :buttons="srmListButtons()"/>
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
              <span>{{ $T('sslm.purchaserEvaluationDetail.table.column.label.indicatorCode').$D('评估项目代码') }}：</span>
              <span>{{ nextIndicatorInfo.indicatorCode }}</span>
            </div>
            <div class="srm-indicatorMaintain-header-line">
              <span>{{ $T('sslm.purchaserEvaluationDetail.table.column.label.indicatorName').$D('评估项目名称') }}：</span>
              <span>{{ nextIndicatorInfo.indicatorName }}</span>
            </div>
          </srm-flex>
        </div>
        <div class="srm-indicatorMaintain-tab">
          <srm-flex justify="between" align-content="center">
            <div>
              <span>{{ $T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息') }}</span>
            </div>
            <div v-if="editFlag">
              <span v-if="nextIndicatorDs && !nextIndicatorDs.editFlag">
                <em class="button srm-icon icon-edit" @click="handleNextEdit(true)"/>
              </span>
              <span v-if="nextIndicatorDs && nextIndicatorDs.editFlag">
                <srm-button class="button" style="font-size: 16px;" plain @click="handleNextEdit(false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
              </span>
            </div>
          </srm-flex>
        </div>
        <srm-list v-if="nextIndicatorDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSESSMENT" :data-set="nextIndicatorDs" :scrollable="false" :columns="getBasicColumns" :show-bottom-bar="false" />
        <srm-list-bottom-bar v-if="nextIndicatorDs" style="height: 72px" :data-set="nextIndicatorDs" :buttons="srmListButtons()"/>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { commonDs } from "./datasource/indicatorMaintainDs";
import { DataSet, $T } from "srm-mobile-ui";
import AssignedRater from "./AssignedRater.vue";
import { renderStatus, yesOrNoRender } from "@/utils/sslmUtils";

export default {
  modules: [ "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluationDetail", "sslm.common", "smbl.common", "sslm.purchaserEvaluation", "hzero.common", "hipspfm.common" ],
  name: "IndicatorMaintain",
  // eslint-disable-next-line vue/no-unused-components
  components: { AssignedRater },
  props: {
    indicatorInfo: {
      type: Object,
      default: () => {},
    },
    basicDs: {
      type: Object,
      default: () => {},
    },
    editFlag: {
      type: Boolean,
      default: true,
    }
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
    // 基本信息
    getBasicColumns() {
      const { needFeedbackFlag, progressStatus, evalType, selfIndicatorType } = this.basicDs?.current?.data || {};
      // 评估策略为勾选‘按照指标类型自评’，‘供应商自评’且为线上打分，显示字段
      const showSelfEvaluation = evalType === "ONLINE" && needFeedbackFlag && selfIndicatorType;
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
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
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
        this.editFlag ? {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlag",
          fieldType: "SELECT",
          lovCode: "SSLM_IS_TRUE",
          visible: needFeedbackFlag,
          formRow: 40,
          formCol: 10,
        } : {
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
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus) && !showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfSupplierScore",
          fieldType: "TEXT",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.selfSupplierScore").$D("供应商自评打分"),
          visible:() => showSelfEvaluation,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "selfIsStandard",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.selfIsStandard").$D("供应商自评符合评分标准"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsStandard),
          visible:() => showSelfEvaluation,
          formRow: 60,
          formCol: 10,
        },
        {
          fieldCode: "selfIsVeto",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.selfIsVeto").$D("供应商自评否决该项"),
          fieldType: "TEXT",
          render: (val, record) => yesOrNoRender(record.selfIsVeto),
          visible:() => showSelfEvaluation,
          formRow: 70,
          formCol: 10,
        },
        {
          fieldCode: "selfIndOptId",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.selfIndOptId").$D("供应商自评评分选项"),
          fieldType: "TEXT",
          render: (val, record) => record.selfIndOptName,
          visible:() => showSelfEvaluation,
          formRow: 80,
          formCol: 10,
        },
        {
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 90,
          formCol: 10,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          showCount: true,
          visible:() => needFeedbackFlag && ![ "EVAL_PREPARE" ].includes(progressStatus),
          formRow: 100,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evalWeight").$D("指标权重"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
          formRow: 110,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.scorer").$D("评分人"),
          fieldCode: "scorer",
          fieldType: "TEXT",
          formRow: 120,
          formCol: 10,
          visible: this.editFlag,
          render: (val, record) => {
            // 评分信息
            const { leafFlag, scoreType, evalResps } = record || {};
            const evalRespsNum = evalResps && evalResps.filter((e) => e.isSelect).length || 0;
            return scoreType === "SYSTEM" ?
              <span> { this.$T("sslm.common.modal.grade.systemRate").$D("系统评分") } </span> :
              !leafFlag ? "-" : <srm-button plain onClick={(e) => {
                e.stopPropagation();
                this.openAssignedRater(record, false);
              }}>
                { this.$T("sslm.common.model.message.assign").$D("分配") }{`(${evalRespsNum})`}
              </srm-button>;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorStatus").$D("指标评估状态"),
          fieldCode: "completeFlag",
          fieldType: "TEXT",
          formRow: 130,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            return flag ? "-" : <srm-button plain onClick={(e) => {
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
          formRow: 140,
          formCol: 10,
          render: (val, record) => {
            const showFlag = record.children && record.children.length > 0;
            return showFlag ? <srm-button
              plain
              onClick={() => {
                this.maintainChildrenAction(record);
              }}>
              {this.editFlag ? this.$T("sslm.purchaserEvaluationDetail.table.column.label.maintain").$D("编辑") : this.$T("smbl.common.view.button.view").$D("查看")}
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
          render: (val, record) => {
            const color = renderStatus(record.completeFlag);
            return <SrmListHeader showOpenTag={true}>
              <span>{val}</span>
              <span slot="right" style={{ color: `${color}` }}>{record.completeFlagMeaning}</span>
            </SrmListHeader>;
          },
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
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.siteLocation").$D("现场定位"),
          fieldCode: "siteLocation",
          fieldType: "TEXT",
          formRow: 40,
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
        headerAlign: "start",
        showBack: true,
        content: <div class="srm-assessment-panel">
          <div class="srm-assessment-panel-header">
            <span class="srm-assessment-header-left">
              <span>{this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码")}：</span>
              <span>{indicatorCode}</span>
            </span>
            <span class="srm-assessment-header-right">
              <span>{this.$T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称")}：</span>
              <span>{indicatorName}</span>
            </span>
          </div>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSESSMENT.IND_STATUS"
            columns={this.getIndicatorColumns}
            dataSet={indicatorDataSet}/>
        </div>,
      });
    },
    // record：行数据 ｜ batchFlag：批量分配
    openAssignedRater(record, batchFlag = false) {
      const { evalHeaderId } = record || {};
      this.scorePopRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.isSelect").$D("分配评分人"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <AssignedRater
          assessmentDs={this.indicatorDs}
          curRecord={record}
          basicDs={this.parentBasicDs}
          evalHeaderId={evalHeaderId}
          batchFlag={batchFlag}
          on-closePop={() => {
            this.scorePopRef?.closePopup();
            this.closePop();
          }}
        />,
      });
    },
    // 关闭指标弹窗
    closePop() {
      this.$emit("closeIndicatorMaintainPop");
    },
    // 按钮
    srmListButtons() {
      return [ {
        text: this.$T("sslm.purchaserEvaluationDetail.scoreTable.label.isSelect").$D("分配评分人"),
        type: "primary",
        bordered: true,
        size: "small",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.handleEdit(false);
          this.openAssignedRater(this.parentIndicatorInfo, true);
        }
      }, ];
    },
    // 编辑回调
    handleEdit(editFlag) {
      this.indicatorDs.editFlag = editFlag;
    },
    // 编辑回调
    handleNextEdit(editFlag) {
      this.nextIndicatorDs.editFlag = editFlag;
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
      min-height: 52px;
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
