<template>
  <div class="score-info-children">
    <nav-head :title="$T('sslm.siteInvestigateReport.view.manage.maintainChildren').$D('维护子级')"/>
    <srm-list :scrollable="false" :data-set="scoreInfoDS" :columns="getScoreInfoColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.SCORE_INFO" />
    <!-- 评分人 -->
    <scorer-maintain-view v-model="scorerEditPopFlag" :editable="newEditable" :info-ids="scorerInfoIds" :eval-header-id="newEvalHeaderId" :target-line-id="targetLineId"/>
    <!-- 评分附件上传 -->
    <scorer-attchment-view v-model="scoreAttEditFlag" :eval-line-id="selectedEvalLineId" :can-edit="newCanAttEdit" :eval-header-id="newEvalHeaderId"/>
    <!-- 子集弹窗 -->
    <srm-popup
      :visible.sync="childrenPop"
      position="right"
      :title="$T('sslm.siteInvestigateReport.view.manage.maintainChildren').$D('维护子级')"
      show-back>
      <srm-list v-if="scoreNextInfoDS" :scrollable="false" :data-set="scoreNextInfoDS" :columns="getScoreInfoColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.SCORE_INFO" />
    </srm-popup>
  </div>
</template>

<script>
import {
  getScoreInfoApi
} from "../api/index";
import { scoreInfoDataSet } from "../datasource/ScoreInfoDataSet";
import { commonDs } from "../datasource/CommonDS";
import { scorerCompleteDS } from "../datasource/scorerCompleteDS";
import { DataSet } from "srm-mobile-ui";
import ScorerMaintainView from "../components/ScorerMaintainView";
import ScorerAttchmentView from "../components/ScorerAttchmentView";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "sslm.commonApplication", "sslm.common", "hzero.common", "hipspfm.common" ],
  name: "SiteInvestiogationScoreInfoChildren",
  components: {
    ScorerMaintainView,
    ScorerAttchmentView
  },
  props:{
    indicatorCode:{
      type: String,
      default: null,
    },
    evalHeaderId:{
      type: String | Number,
      default: null,
    },
    subIndicatorCode:{
      type: String,
    },
    editable:{
      type: Boolean,
      default:false,
    },
    canAttEdit:{
      type:  Boolean,
      default:false,
    },
    evalStatus:{
      type: String,
      default:"",
    }
  },
  data() {
    return {
      newIndicatorCode: null,
      newEvalHeaderId: null,
      newSubIndicatorCode: null,
      scoreInfoDS: null,
      scoreNextInfoDS: null,
      superInfo: {},
      scorerEditPopFlag: false,
      scorerInfoIds: [],
      targetLineId: null,
      newEditable: false,
      newCanAttEdit: false,
      newEvalStatus: "",
      scoreAttEditFlag: false,
      selectedEvalLineId: null,
      childrenPop:false,
      scorerCompleteDataSet:null,
    };
  },
  computed: {
    getScorerCompleteColumns() {
      return [
        {
          formRow: 10,
          formCol: 10,
          fieldCode: "loginName",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldCode: "realName",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldCode: "respWeight",
        },
        {
          formRow: 30,
          formCol: 20,
          fieldCode: "defaultScore",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldCode: "isStandard",
        },
        {
          formRow: 40,
          formCol: 20,
          fieldCode: "isVeto",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldCode: "indOptName",
        },
        {
          formRow: 50,
          formCol: 20,
          fieldCode: "score",
        },
      ];
    },
    getScoreInfoColumns() {
      return [ {
        fieldCode: "indicatorCode",
        formRow: 10,
      }, {
        fieldCode: "indicatorName",
        formRow: 20,
      }, {
        fieldCode: "scoreTypeMeaning",
        formRow: 30,
      }, {
        fieldCode: "evalStandard",
        formRow: 40,
      }, {
        fieldCode: "indicatorTypeMeaning",
        formRow: 50,
        formCol: 10,
      }, {
        fieldCode: "supplierScore",
        formRow: 50,
        formCol: 20,
      }, {
        fieldCode: "supplierRemarks",
        formRow: 60,
      }, {
        fieldCode: "attachmentUuid",
        formRow: 69,
        formCol: 10,
      }, {
        fieldCode: "scorer",
        formRow: 70,
        formCol: 20,
        fieldType: "EMPTY",
        render: (val, item) => {
          if (item.children && item.children.length) {
            return null;
          }
          return <srm-flex>{this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人")}：<div style="color: var(--font-color-primary)" onclick={(e) => {
            e.stopPropagation();
            this.scorerInfoItemEdit(item);
          }}>{this.$T("smbl.common.view.button.edit").$D("编辑")}</div></srm-flex>;
        },
      }, {
        fieldCode: "completeFlag",
        render: (val, record) => {
          const isNoEditFlag = record.children && record.children.length > 0;
          let statusDes = "";
          switch (val) {
          case 1:
            statusDes = this.$T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成");
            break;
          case 2:
            statusDes = this.$T("sslm.siteInvestigateReport.model.mange.back").$D("退回");
            break;
          default:
            statusDes = this.$T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
            break;
          }
          if (isNoEditFlag) {
            return statusDes;
          }
          return <div style="color: var(--font-color-primary)" onclick={(e) => {
            e.stopPropagation();
            this.toCompleteDetail(record);
          }}> {statusDes} </div>;
        },
        formRow: 80,
        formCol: 10,
      }, {
        fieldCode: "evalWeight",
        formRow: 80,
        formCol: 20,
      }, {
        fieldCode: "finalScore",
        formRow: 90,
        formCol: 10,
      }, {
        fieldCode: "scoreFrom",
        formRow: 90,
        formCol: 20,
      }, {
        fieldCode: "scoreTo",
        formRow: 100,
        formCol: 10,
      }, {
        fieldCode: "defaultScore",
        formRow: 100,
        formCol: 20,
      }, {
        fieldCode: "uploadAttachment",
        fieldType: "EMPTY",
        formRow: 105,
        visible: () => [ "MANUAL_COMPLETE", "FINAL_COLLECTED", "APPROVALING", "APPROVED", "REJECTED", "PUBLISHED" ].includes(this.newEvalStatus),
        render: (val, item) => {
          let title = this.newCanAttEdit ? this.$T("sslm.common.view.message.upload").$D("上传附件") : `${this.$T("smbl.common.button.viewAttachments").$D("查看附件")}(${item.attCount})`;
          return <srm-flex>
            <span>{this.$T("sslm.siteInvestigateReport.modal.common.gradeAttachment").$D("评分附件")}：</span>
            <srm-button plain={true} onClick={() => {
              this.selectedEvalLineId = item.evalLineId;
              this.scoreAttEditFlag = true;
            }}>{title}</srm-button>
          </srm-flex>;
        },
      }, {
        fieldCode: "respRemarks",
        formRow: 110,
      }, {
        fieldCode: "chidrenMaintain",
        fieldType: "EMPTY",
        render: (val, item) => <srm-flex justify="end" align="center" style="padding: 14px 15px 0px 15px; height: 44px; border-top: 1px solid var(--split-line-color-primary);">
          <srm-button size="mid" fill
            disabled={!item.children || !item.children.length} onClick={() => {
              this.maintainChildrenAction(item);
            }}>{this.$T("sslm.siteInvestigateReport.view.manage.maintainChildren").$D("维护子级")}</srm-button>
        </srm-flex>,
      } ];
    },
  },
  beforeMount() {
    this.newIndicatorCode = this.$route && this.$route.query && this.$route.query.indicatorCode || this.indicatorCode;
    this.newEvalHeaderId = this.$route && this.$route.query && this.$route.query.evalHeaderId || this.evalHeaderId;
    this.newSubIndicatorCode = this.$route && this.$route.query && this.$route.query.subIndicatorCode || this.subIndicatorCode;
    this.newEditable = this.$route && this.$route.query && this.$route.query.editable === "true" || this.editable;
    this.newCanAttEdit = this.$route && this.$route.query && this.$route.query.canAttEdit === "true" || this.canAttEdit;
    this.newEvalStatus = this.$route && this.$route.query && this.$route.query.evalStatus || this.evalStatus;
    this.requestData();
  },
  methods: {
    toCompleteDetail(record) {
      this.scorerCompleteDataSet = new DataSet(scorerCompleteDS(record.evalLineId));
      this.scorerCompleteDataSet.refresh();
      this.$popup({
        // title: this.$T("sslm.siteInvestigateReport.modal.mange.performance").$D("评分完成情况"),
        showHeader: false,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <srm-list
          scrollable={false}
          columns={this.getScorerCompleteColumns}
          dataSet={this.scorerCompleteDataSet}/>,
      });
    },
    async requestData() {
      this.$loading.show();
      this.scoreInfoDS = new DataSet(scoreInfoDataSet(this.newEvalHeaderId, false, false));
      let res = await getScoreInfoApi(this.newEvalHeaderId, this.newIndicatorCode);
      this.superInfo = {};
      (res || []).forEach((e) => {
        if (e.indicatorCode === this.newIndicatorCode) {
          this.superInfo = e;
        }
      });
      let targetInfo = this.getChildren(this.superInfo);
      if (targetInfo) {
        this.scoreInfoDS.setData(targetInfo.children || []);
      }

      this.$loading.hide();
    },
    getChildren(info) {
      if (info.indicatorCode === this.newSubIndicatorCode) {
        return info;
      }
      if (!info.children || !info.children.length) {
        return null;
      }
      let chil = null;
      for (let i = 0; i < info.children.length; i++) {
        let element = info.children[i];
        chil = this.getChildren(element);
        if (chil) {
          return chil;
        }
      }
      return chil;
    },
    maintainChildrenAction(item) {
      // this.scoreInfoDS.reset();
      this.newSubIndicatorCode = item.indicatorCode;
      this.scoreNextInfoDS = null;
      this.scoreNextInfoDS = new DataSet(commonDs());
      let targetInfo = this.getChildren(this.superInfo);
      if (targetInfo) {
        this.scoreNextInfoDS.setData(targetInfo.children || []);
        // this.scoreInfoDS.setData(targetInfo.children || []);
      }
      this.childrenPop = !this.childrenPop;
    },
    scorerInfoItemEdit(item) {
      this.scorerInfoIds = [ item.evalLineId ];
      this.targetLineId = item.evalLineId;
      this.scorerEditPopFlag = true;
    },
  }
};
</script>

<style lang="stylus" scoped>
.score-info-children {
  width: 100vw;
  height: 100vh;
}
</style>