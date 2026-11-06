<template>
  <div class="site-investigation-report-detail-maintain">
    <nav-head :title="navTitle"/>
    <srm-scroll-tab customize-code="SMBL.SITE_INVESTIGATE_REPORT.TABS">
      <!-- 基本信息 -->
      <srm-scroll-tab-item code="basicInfo" :label="$T('sslm.siteInvestigateReport.view.tabs.basicInfo').$D('基本信息')">
        <div>
          <srm-form v-if="basicDataSet" customize-type="list" :data-set="basicDataSet" :columns="getBasicInfoColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.MANAGE.BASIC_INFO" />
          <!-- <customize :need-padding="true" :columns="getBasicInfoColumns" :data-source="basicInfo" type="list" code=""/> -->
        </div>
        <srm-flex justify="end" align="center" class="basic-more-button">
          <srm-button fill @click="showBasicInfoDetail">{{ $T("sslm.siteInvestigateReport.view.buttom.moreDetail").$D("更多详情") }}</srm-button>
        </srm-flex>
      </srm-scroll-tab-item>
      <!-- 考察物料/品类 -->
      <srm-scroll-tab-item code="reviewMaterialCategory" :label="$T('sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory').$D('考察物料/品类')" style="position: relative;">
        <srm-flex v-if="!readOnly&& reviewMaterDataSet && !reviewMaterDataSet.editFlag && editable.matercategory" justify="end" class="review-material-buttons">
          <div class="button srm-icon icon-save" @click="reviewMaterialSaveAction"/>
          <div class="button srm-icon icon-edit" @click="reviewMaterialEditAction"/>
          <div class="button srm-icon icon-plus" @click="reviewMaterialCreatAction"/>
        </srm-flex>
        <srm-flex v-if="!readOnly&&reviewMaterDataSet && reviewMaterDataSet.editFlag && editable.matercategory" justify="end" class="review-material-buttons">
          <srm-button class="button" style="font-size: 16px;" plain @click="reviewMaterialCancelAction">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
        </srm-flex>
        <srm-list v-if="reviewMaterDataSet" :data-set="reviewMaterDataSet" :scrollable="false" :columns="getMatersColumns" :show-bottom-bar="false" customize-code="SMBL.SITE_INVESTIGATE_REPORT.INVESTIGATE_MATERIAL"/>
      </srm-scroll-tab-item>
      <!-- 考察小组 -->
      <srm-scroll-tab-item code="inspectTeam" :label="$T('sslm.siteInvestigateReport.view.tabs.inspectTeam').$D('考察小组')" style="position: relative;">
        <srm-flex v-if="!readOnly&&inspectTeamDataSet && !inspectTeamDataSet.editFlag && editable.inspectTeam" justify="end" class="review-material-buttons">
          <div class="button srm-icon icon-save" @click="inspectTeamSaveAction"/>
          <div class="button srm-icon icon-edit" @click="inspectTeamEditAction"/>
          <div class="button srm-icon icon-plus" @click="inspectTeamCreatAction"/>
        </srm-flex>
        <srm-flex v-if="!readOnly&&inspectTeamDataSet && inspectTeamDataSet.editFlag && editable.inspectTeam" justify="end" class="review-material-buttons">
          <srm-button class="button" style="font-size: 16px;" plain @click="inspectTeamCancelAction">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
        </srm-flex>
        <srm-list v-if="inspectTeamDataSet" :data-set="inspectTeamDataSet" :scrollable="false" :columns="getInspectTeamColumns" :show-bottom-bar="false" customize-code="SMBL.SITE_INVESTIGATE_REPORT.INSPECT_TEAM"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item code="attachmentInfo" :label="$T('sslm.siteInvestigateReport.view.tabs.attachmentInfo').$D('附件信息')" style="position: relative;">
        <srm-flex v-if="!readOnly&&attachmentDataSet && !attachmentDataSet.editFlag && editable.attachment" justify="end" class="review-material-buttons">
          <!-- <div class="button srm-icon icon-edit" @click="attachmentEditAction"/> -->
          <!-- <srm-attachment-button ref="attachmentCreateButton" class="button" title=" " :plain="true" icon="icon-plus" size="small" :attachments="[ { directory: 'sslm-report' } ]" @fileUpload="attachmentCreatAction"/> -->
          <div class="button srm-icon icon-plus" @click="attachmentCreatAction"/>
        </srm-flex>
        <srm-flex v-if="!readOnly&&attachmentDataSet && attachmentDataSet.editFlag && editable.attachment" justify="end" class="review-material-buttons">
          <srm-button class="button" style="font-size: 16px;" plain @click="attachmentCancelAction">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
        </srm-flex>
        <srm-list v-if="attachmentDataSet" :data-set="attachmentDataSet" :scrollable="false" :columns="getAttachmentColumns" :show-bottom-bar="false" customize-code="SMBL.SITE_INVESTIGATE_REPORT.ATTACHMENT"/>
      </srm-scroll-tab-item>
      <!-- 评分信息 -->
      <srm-scroll-tab-item v-if="basicInfo.evalType === 'ONLINE'" code="scoreInfo" :label="$T('sslm.siteInvestigateReport.view.title.scoreInfo').$D('评分信息')" style="position: relative;">
        <srm-flex v-if="!readOnly&&scoreInfoDataSet && !scoreInfoDataSet.editFlag && editable.scoreInfo" justify="end" class="review-material-buttons">
          <srm-button class="button" style="font-size: 16px; color: var(--font-color-primary);" plain @click="scorerEditAction">{{ $T("smbl.common.view.button.batch.edit").$D("编辑") }}</srm-button>
        </srm-flex>
        <srm-flex v-if="!readOnly&&scoreInfoDataSet && scoreInfoDataSet.editFlag && editable.scoreInfo" justify="end" class="review-material-buttons">
          <srm-button class="button" style="font-size: 16px; color: var(--font-color-primary);" plain @click="scorerEditCancelAction">{{ $T("smbl.common.button.complete").$D("完成") }}</srm-button>
        </srm-flex>
        <srm-list v-if="scoreInfoDataSet" :data-set="scoreInfoDataSet" :scrollable="false" :columns="getScoreInfoColumns" :show-bottom-bar="false" customize-code="SMBL.SITE_INVESTIGATE_REPORT.SCORE_INFO" />
        <!-- 适配iPhoneX，考察结果存在不显示 -->
        <div v-if="getButtonStatus('results') && basicInfo.evalType === 'ONLINE'" class="bottom-space-view" />
      </srm-scroll-tab-item>
      <!-- 考察结果，如果是结果展示或者线下打分，显示 -->
      <srm-scroll-tab-item v-if="!getButtonStatus('results') || basicInfo.evalType !== 'ONLINE'" code="inspectionResults" :label="$T('sslm.siteInvestigateReport.view.title.inspectResults').$D('考察结果')">
        <div>
          <srm-form v-if="basicDataSet" customize-type="list" :data-set="basicDataSet" :columns="getInspectResultColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.MANAGE.RESULT"/>
        </div>
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-bottom-handler v-if="!readOnly" :btn-arr="bottomButtons"/>
    <!-- 基本信息-详情弹框 -->
    <srm-popup :visible.sync="basicInfoDetailFlag" height="100%" :title="$T('sslm.siteInvestigateReport.view.tabs.basicInfo').$D('基本信息')">
      <srm-form v-if="basicDataSet" customize-type="detail" :data-set="basicDataSet" :columns="getBasicInfoDetailColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.MANAGE.BASIC_INFO.DETAIL" />
      <!-- <customize-detail style="padding-right: 15px;" :need-padding="true" :columns="getBasicInfoDetailColumns" :data-source="basicInfo" type="list" code=""/> -->
    </srm-popup>
    <!-- 退回评分 -->
    <srm-popup :visible.sync="backScorePopFlag" :title="$T('sslm.siteInvestigateReport.view.button.backScore').$D('退回评分')" rounded>
      <srm-list v-if="backScoreDataSet" :data-set="backScoreDataSet" :columns="getBackScoreColumns" :buttons="backScoreButtons"/>
    </srm-popup>
    <srm-list-bottom-bar v-if="reviewMaterDataSet" style="height: 72px" :data-set="reviewMaterDataSet" :buttons="reviewMaterButtons"/>
    <srm-list-bottom-bar v-if="inspectTeamDataSet" style="height: 72px" :data-set="inspectTeamDataSet" :buttons="inspectTeamButtons"/>
    <srm-list-bottom-bar v-if="scoreInfoDataSet" style="height: 72px" :data-set="scoreInfoDataSet" :buttons="scorerButtons"/>
    <srm-list-bottom-bar v-if="attachmentDataSet" style="height: 72px" :data-set="attachmentDataSet" :buttons="attachmentButtons"/>
    <!-- 评分人 -->
    <scorer-maintain-view v-model="scorerEditPopFlag" :editable="editable.scoreInfo && !readOnly" :info-ids="scorerInfoIds" :eval-header-id="newEvalHeaderId" :target-line-id="targetLineId" :read-only="readOnly"/>
    <!-- 评分附件上传 -->
    <scorer-attchment-view v-model="scoreAttEditFlag" :eval-line-id="selectedEvalLineId" :can-edit="false" :eval-header-id="newEvalHeaderId"/>
  </div>
</template>

<script>
import {
  getBasicInfoApi,
  saveAttachmentApi,
  saveAllApi,
  performScoreApi,
  submitFeedback,
  publishReport,
  handleBack,
  queryProblemHeader,
  summaryStatistics,
  submitApproval,
  detailInvalid,
  handleBackScore,
} from "../api/index";
import { reportBasicDS } from "../datasource/ReportBasicDS";
import { reviewMaterDS } from "../datasource/ReviewMaterDS";
import { inspectTeamDS } from "../datasource/InspectTeamDS";
import { scoreInfoDataSet } from "../datasource/ScoreInfoDataSet";
import { attachmentDS } from "../datasource/AttachmentDS";
import { backScoreDS } from "../datasource/BackScoreDS";
import { scorerCompleteDS } from "../datasource/scorerCompleteDS";
import ScorerMaintainView from "../components/ScorerMaintainView";
import ScorerAttchmentView from "../components/ScorerAttchmentView";
import ScoreInfoChildren from "./SiteInvestiogationScoreInfoChildren";
import { DataSet, SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "sslm.commonApplication", "sslm.common", "hzero.common", "sslm.common", "hipspfm.common" ],
  name: "SiteInvestigationReportDetailMaintain",
  components: {
    ScorerMaintainView,
    ScorerAttchmentView,
  },
  props:{
    evalHeaderId:{
      type: String | Number,
      default: null,
    },
    evalNum:{
      type: String,
      default: null,
    },
    viewFlag:{ // 是否只读
      type: Boolean,
      default:false,
    }
  },
  data() {
    return {
      navTitle: null,
      readOnly: false,
      newEvalHeaderId: null,
      basicInfo: {},
      editable: {
        basicInfo: false,
        matercategory: false,
        inspectTeam: false,
        attachment: false,
        scoreInfo: true,
        inspectResults: true,
      },
      basicInfoDetailFlag: false,
      basicDataSet: null,
      // 物料/品类
      reviewMaterDataSet: null,
      // 考察小组
      inspectTeamDataSet: null,
      // 评分信息
      scoreInfoDataSet: null,
      scorerEditPopFlag: false,
      scorerInfoIds: [],
      targetLineId: null,
      scoreAttEditFlag: false,
      selectedEvalLineId: null,
      // 编号记录
      localLineNum: {
        materLineNum: 0,
        inspectTeamLineNum: 0,
      },
      // 附件
      attachmentDataSet: null,
      // 退回评分
      backScorePopFlag: false,
      backScoreDataSet: null,
      // 评分完成情况
      scorerCompleteDataSet: null,
    };
  },
  computed: {
    // 底部按钮
    bottomButtons() {
      let evalStatus = this.basicInfo.evalStatus;
      let needFeedbackFlag = Number(this.basicInfo.needFeedbackFlag); // 字符串null
      let evalType = this.basicInfo.evalType;
      let callSuppliersFlag = Number(this.basicInfo.callSuppliersFlag); // 字符串0

      let buttons = [];
      // 保存按钮
      if (!this.getButtonStatus("save")) {
        buttons.push({
          title: this.$T("hzero.common.button.save").$D("保存"),
          handler: () => {
            this.handleSaveAndExecute("save");
          },
        });
      }
      // 发起质量整改(移动端没有质量整改报告-删除)
      // if (evalStatus === "APPROVED" || evalStatus === "PUBLISHED") {
      //   buttons.push({
      //     title: this.$T("sslm.siteInvestigateReport.view.button.qualityRectification").$D("发起质量整改"),
      //     handler: () => {
      //       this.goToQualityRectification();
      //     },
      //   });
      // }
      // 提交反馈
      if (evalStatus === "NEW" && needFeedbackFlag) {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.submitFeedback").$D("提交反馈"),
          handler: () => {
            this.handleSaveAndExecute("submitFeedback");
          },
        });
      }
      // 执行评分
      if (evalType === "ONLINE" && (needFeedbackFlag ? evalStatus === "FEEDBACK" : evalStatus === "NEW")) {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.execute").$D("执行评分"),
          handler: () => {
            this.handleSaveAndExecute("execute");
          },
        });
      }

      // 汇总统计
      if (!this.getButtonStatus("sum") && evalType === "ONLINE") {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.sum").$D("汇总统计"),
          handler: () => {
            this.handleSum();
          },
        });
      }

      // 提交审批
      // eslint-disable-next-line no-extra-parens
      const isSubmitReview = evalStatus === "FINAL_COLLECTED" || evalStatus === "REJECTED" || (evalType !== "ONLINE" && (needFeedbackFlag ? evalStatus === "FEEDBACK" : evalStatus === "NEW"));
      if (isSubmitReview) {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.submitReview").$D("提交审批"),
          handler: () => {
            this.handleSubmit();
          },
        });
      }

      // 发布按钮
      const publishFlag = evalStatus === "APPROVED" && callSuppliersFlag;
      if (publishFlag) {
        buttons.push({
          title: this.$T("hzero.common.button.publish").$D("发布"),
          handler: () => {
            this.handleSaveAndExecute("publish");
          },
        });
      }

      // 作废
      if (!this.getButtonStatus("destroy")) {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.invalid").$D("作废"),
          handler: () => {
            this.handleInvalid();
          },
        });
      }

      // 退回评分
      let backScoreFlag = [ "MANUAL_EVALUATING", "MANUAL_COMPLETE", "FINAL_COLLECTED", "REJECTED", ].includes(evalStatus) && evalType === "ONLINE";
      if (backScoreFlag) {
        buttons.push({
          title: this.$T("sslm.siteInvestigateReport.view.button.backScore").$D("退回评分"),
          handler: () => {
            this.backScoreModal();
          },
        });
      }

      // 退回
      let backFalg = !this.getButtonStatus("back") && needFeedbackFlag;
      if (backFalg) {
        buttons.push({
          title: this.$T("hzero.common.button.return").$D("退回"),
          handler: () => {
            this.handleSaveAndExecute("back");
          },
        });
      }
      buttons.forEach((e) => {
        e.bordered = true;
      });
      if (buttons.length > 1) {
        let mainButton = buttons[0];
        buttons[0] = buttons[1];
        buttons[1] = mainButton;
        mainButton.bordered = false;
        mainButton.fill = true;
      }

      return buttons;
    },
    // 基础信息
    getBasicInfoColumns() {
      return [ {
        fieldCode: "evalNum",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "evalDescription",
      }, {
        fieldCode: "evalType",
      }, {
        fieldCode: "evalDateFrom",
      }, {
        fieldCode: "evalDateTo",
      }, {
        fieldCode: "supplierCompanyId",
      }, {
        fieldCode: "supplierContactor",
      } ];
    },
    // 基础信息-详情
    getBasicInfoDetailColumns() {
      return [ {
        fieldCode: "evalNum",
      }, {
        fieldCode: "evalDescription",
      }, {
        fieldCode: "evalStatusMeaning",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "unitId",
      }, {
        fieldCode: "companyId",
      }, {
        fieldCode: "ouId",
      }, {
        fieldCode: "invOrganizationId",
      }, {
        fieldCode: "inventoryId",
      }, {
        fieldCode: "evalType",
      }, {
        fieldCode: "evalTplId",
      }, {
        fieldCode: "weightedFlag",
      }, {
        fieldCode: "evalDateFrom",
      }, {
        fieldCode: "evalDateTo",
      }, {
        fieldCode: "supplierCompanyId",
      }, {
        fieldCode: "supplierContactor",
      }, {
        fieldCode: "supplierContactMail",
      }, {
        fieldCode: "supplierContactPhone",
      }, {
        fieldCode: "needFeedbackFlag",
      }, {
        fieldCode: "callSuppliersFlag",
      }, {
        fieldCode: "supplierType",
      }, {
        fieldCode: "investigationType",
      }, {
        fieldCode: "supplierOverview",
      }, {
        fieldCode: "supplierRegisteredAddress",
      }, {
        fieldCode: "evalAddress",
      }, {
        fieldCode: "evalRemark",
      }, {
        fieldCode: "backRemark",
      } ];
    },
    // 考察物料/品类
    getMatersColumns() {
      return [ {
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          let index = item.localLineNum;
          if (index < 10) {
            index = "0" + String(index);
          } else {
            index = String(index);
          }
          return <srm-list-header show-open-tag={false}>
            {
              this.$T("smbl.common.model.lineNumber").$D("行号") + "：" + index
            }
          </srm-list-header>;
        },
      }, {
        fieldCode: "itemId",
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "itemCategoryId",
      }, {
        fieldCode: "itemCategoryName",
      }, {
        fieldCode: "brand",
      }, {
        fieldCode: "remark",
      } ];
    },
    // 考察物料编辑按钮
    reviewMaterButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "small",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.reviewMaterDataSet.removeSelect();
          this.setFirstReponse(this.reviewMaterDataSet, false);
        }
      }, ];
    },
    // 考察小组
    getInspectTeamColumns() {
      return [ {
        fieldCode: "header",
        fieldType: "EMPTY",
        render: (val, item) => {
          let index = item.localLineNum;
          if (index < 10) {
            index = "0" + String(index);
          } else {
            index = String(index);
          }
          return <srm-list-header show-open-tag={false}>
            {
              this.$T("smbl.common.model.lineNumber").$D("行号") + "：" + index
            }
          </srm-list-header>;
        },
      }, {
        fieldCode: "userId",
      }, {
        fieldCode: "member",
      }, {
        fieldCode: "department",
      }, {
        fieldCode: "post",
      }, {
        fieldCode: "phone",
      }, {
        fieldCode: "email",
      }, {
        fieldCode: "leaderFlag",
      } ];
    },
    // 考察小组编辑按钮
    inspectTeamButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "small",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.inspectTeamDataSet.removeSelect();
          this.setFirstReponse(this.inspectTeamDataSet, false);
        }
      }, ];
    },
    // 评分信息
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
        formRow: 65,
        formCol: 10,
      }, {
        fieldCode: "scorer",
        formRow: 70,
        formCol: 20,
        fieldType: "TEXT",
        fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人"),
        render: (val, item) => {
          if (item.children && item.children.length) {
            return null;
          }
          return <div style="color: var(--font-color-primary)" onclick={(e) => {
            e.stopPropagation();
            this.scorerInfoItemEdit(item);
          }}>{this.$T("smbl.common.view.button.edit").$D("编辑")}</div>;
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
        visible: () => [ "MANUAL_COMPLETE", "FINAL_COLLECTED", "APPROVALING", "APPROVED", "REJECTED", "PUBLISHED" ].includes(this.basicInfo.evalStatus),
        render: (val, item) =>
          <srm-flex>
            <span>{this.$T("sslm.siteInvestigateReport.modal.common.gradeAttachment").$D("评分附件")}：</span>
            <srm-button plain={true} onClick={() => {
              this.selectedEvalLineId = item.evalLineId;
              this.scoreAttEditFlag = true;
            }}>{this.$T("smbl.common.button.viewAttachments").$D("查看附件")}({item.attCount})</srm-button>
          </srm-flex>
        ,
      }, {
        fieldCode: "respRemarks",
        formRow: 110,
      }, {
        fieldCode: "chidrenMaintain",
        fieldType: "EMPTY",
        formRow: 120,
        render: (val, item) => <srm-flex justify="end" align="center" style="padding: 14px 15px 0px 15px; height: 44px; border-top: 1px solid var(--split-line-color-primary);">
          <srm-button size="mid" fill
            disabled={!item.children || !item.children.length} onClick={() => {
              this.maintainChildrenAction(item);
            }}>{String(this.editable.scoreInfo) && !this.readOnly ? this.$T("sslm.siteInvestigateReport.view.manage.maintainChildren").$D("维护子级") : this.$T("sslm.siteInvestigateReport.view.manage.viewChildren").$D("查看子级")}</srm-button>
        </srm-flex>,
      } ].filter(Boolean);
    },
    // 评分信息-按钮（批量维护）
    scorerButtons() {
      return [ {
        text: this.$T("sslm.siteInvestigateReport.view.button.batchMaintenGrader").$D("批量维护"),
        bordered: true,
        visible: true,
        fill: true,
        disabled: (records) => !records.length,
        callback: (records) => {
          let idsAry = [];
          records.forEach((e) => {
            let ids = this.getNoChildScoreInfoIds(e.data);
            idsAry.push(...ids);
          });
          this.scorerInfoIds = idsAry;
          this.targetLineId = null;
          this.scorerEditPopFlag = true;
        }
      }, ];
    },
    // 附件信息-按钮
    attachmentButtons() {
      return [ {
        text: this.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        size: "mid",
        visible: true,
        disabled: (records) => !records.length,
        callback: () => {
          this.attachmentDataSet.removeSelect();
          this.setFirstReponse(this.attachmentDataSet, false);
        }
      }, ];
    },
    // 考察结果
    getInspectResultColumns() {
      return [ {
        fieldCode: "finalScore",
      }, {
        fieldCode: "grade",
      }, {
        fieldCode: "resultsFlag",
      }, {
        fieldCode: "opinion",
      }, {
        fieldCode: "informUserIds",
      }, {
        fieldCode: "resultLinkUuid",
      }, ];
    },
    // 附件
    getAttachmentColumns() {
      return [ {
        fieldCode: "lnEvalStatusMeaning",
      }, {
        fieldCode: "attachmentlType",
      }, {
        fieldCode: "attachmentDesc",
      }, {
        fieldCode: "attachmentSize",
      }, {
        fieldCode: "uploadDate",
      }, {
        fieldCode: "uploadUserName",
      }, {
        fieldCode: "insideFlag",
      }, {
        fieldCode: "remark",
      }, {
        fieldCode: "attachmentUrl",
        fieldType: "EMPTY",
        render: (val, item, v, record) => <srm-flex justify="end" style="padding: 14px 15px 2px 15px; height: 44px; border-top: 1px solid var(--split-line-color-primary);">
          {!this.readOnly && this.editable.attachment && item.lnEvalStatus === this.basicInfo.evalStatus ? <srm-button class="att-button" size="mid" bordered type="danger" onClick={() => {
            this.attachmentDataSet.removeRecords([ record ]);
          }}>{this.$T("smbl.common.button.delete").$D("删除")}</srm-button> : null}
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            this.$downloadFile(item.attachmentUrl, SrmUtil.getDefaultBucketName(), "sslm-report");
          }}>{this.$T("smbl.common.view.button.download").$D("下载")}</srm-button>
          <srm-button class="att-button" size="mid" bordered onClick={() => {
            SrmUtil.previewFile({
              fileName: item.attachmentDesc,
              fileUrl: item.attachmentUrl,
              bucketName: SrmUtil.getDefaultBucketName(),
            });
          }}>{this.$T("hzero.common.preview").$D("预览")}</srm-button>
          { !this.readOnly && (this.editable.attachment && item.lnEvalStatus === this.basicInfo.evalStatus ? item.localEditable ? <srm-button class="att-button" size="mid" bordered onClick={() => {
            // this.attachmentDataSet.submit();
            this.saveAttachmentAction(item);
            item.localEditable = false;
          }}>{this.$T("smbl.common.button.save").$D("保存")}</srm-button> :
            <srm-button class="att-button" size="mid" bordered onClick={() => {
              item.localEditable = true;
            }}>{this.$T("smbl.common.view.button.edit").$D("编辑")}</srm-button> : null)}
        </srm-flex>,
      } ];
    },
    // 退回评分
    getBackScoreColumns() {
      return [ {
        fieldCode: "indicatorCode",
      }, {
        fieldCode: "indicatorName",
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
      }, {
        fieldCode: "userName",
      }, {
        fieldCode: "respWeight",
      }, {
        fieldCode: "score",
      }, {
        fieldCode: "backReason",
      }, ];
    },
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
        {
          formRow: 60,
          formCol: 10,
          fieldCode: "siteLocation",
        }
      ];
    },
    backScoreButtons() {
      return [
        {
          text: this.$T("sslm.siteInvestigateReport.view.button.backScore").$D("退回评分"),
          fill: true,
          visible: true,
          disabled: (records) => !records.length,
          callback: () => {
            this.backScoreDoneAction();
          }
        }
      ];
    }
  },
  beforeMount() {
    // 解析参数
    let params = this.$route && this.$route.query || {};
    this.navTitle = params.evalNum || this.evalNum;
    this.readOnly = params.viewFlag === "true" || this.viewFlag;
    this.newEvalHeaderId = params.evalHeaderId || this.evalHeaderId;
    // 请求数据
    this.requestData();
  },
  methods: {
    async requestData() {
      // 基本信息
      this.$loading.show();
      let headInfo = await getBasicInfoApi(this.newEvalHeaderId);
      let informUserIds = [];
      let informUserNames = [];
      (headInfo.userNames || []).forEach((user) => {
        informUserIds.push(user.userId);
        informUserNames.push(user.userName);
      });
      headInfo.informUserIds = informUserIds.join(",");
      headInfo.informUserNames = informUserNames.join(",");
      this.$loading.hide();
      this.basicInfo = headInfo;
      this.basicInfo.needFeedbackFlag = this.basicInfo.needFeedbackFlag && String(this.basicInfo.needFeedbackFlag);
      this.basicInfo.callSuppliersFlag = this.basicInfo.callSuppliersFlag && String(this.basicInfo.callSuppliersFlag);
      if (this.basicInfo.weightedFlag !== null) {
        this.basicInfo.weightedFlagMeaning = this.basicInfo.weightedFlag ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
      }
      this.resetEditable(this.basicInfo);
      if (!this.basicDataSet) {
        this.basicDataSet = new DataSet(reportBasicDS(headInfo, "MANAGE", this.readOnly));
      }
      // 供应商lov处理
      if (headInfo.supplierId && !headInfo.supplierCompanyId) {
        headInfo.supplierCompanyId = headInfo.supplierId;
      }
      this.basicDataSet.create(headInfo, 0);

      // 考察物料
      if (!this.reviewMaterDataSet) {
        this.reviewMaterDataSet = new DataSet(reviewMaterDS(this.newEvalHeaderId, this.localLineNum, "MANAGE", this.basicInfo, this.readOnly));
      }
      this.reviewMaterDataSet.refresh();
      this.reviewMaterDataSet.events.afterQuery = (ds, datas) => {
        // 延时是因为执行时ds.records无法获取，临时方案
        setTimeout(() => {
          ds.records.forEach((r) => {
            const itemCategoryId = r.getField("itemCategoryId");
            // itemCategoryId.options.queryParams.itemId = itemIdValue;
            itemCategoryId.setLovParam({ itemId: r.data.itemId });
            const itemId = r.getField("itemId");
            // itemId.options.queryParams.categoryId = r.data.itemCategoryId;
            itemId.setLovParam({ categoryId: r.data.itemCategoryId });
          });
        }, 0);
        datas.forEach((e) => {
          e.evalStatus = headInfo.evalStatus;
          this.localLineNum.materLineNum = this.localLineNum.materLineNum + 1;
          e.localLineNum = this.localLineNum.materLineNum;
        });
      };
      // 考察小组
      if (!this.inspectTeamDataSet) {
        this.inspectTeamDataSet = new DataSet(inspectTeamDS(this.newEvalHeaderId, this.localLineNum, "MANAGE", this.readOnly));
      }
      this.inspectTeamDataSet.refresh();
      this.inspectTeamDataSet.events.afterQuery = (ds, datas) => {
        datas.forEach((e) => {
          e.evalStatus = headInfo.evalStatus;
          e.leaderFlagMeaning = e.leaderFlag ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
          e.leaderFlag = String(e.leaderFlag);// 如果是数字1、0，转为字符串；如果为null，展示空
          this.localLineNum.inspectTeamLineNum = this.localLineNum.inspectTeamLineNum + 1;
          e.localLineNum = this.localLineNum.inspectTeamLineNum;
        });
      };
      // 评分信息
      if (!this.scoreInfoDataSet) {
        this.scoreInfoDataSet = new DataSet(scoreInfoDataSet(this.newEvalHeaderId, true, false));
      } else {
        this.scoreInfoDataSet.refresh();
      }
      // 附件
      if (!this.attachmentDataSet) {
        this.attachmentDataSet = new DataSet(attachmentDS(this.newEvalHeaderId));
      }
      this.attachmentDataSet.refresh();
    },
    resetEditable(basicInfo) {
      let evalStatus = basicInfo.evalStatus;
      let evalType = basicInfo.evalType;
      let needFeedbackFlag = Number(basicInfo.needFeedbackFlag);

      this.editable.basicInfo = evalStatus === "NEW" || evalStatus === "FEEDBACK";
      this.editable.matercategory = evalStatus === "NEW" || evalStatus === "FEEDBACK";
      this.editable.inspectTeam = evalStatus === "NEW" || evalStatus === "FEEDBACK";
      this.editable.attachment = evalStatus === "NEW" || evalStatus === "FEEDBACK";
      this.editable.scoreInfo = evalStatus === "NEW" || evalStatus === "FEEDBACK";
      // eslint-disable-next-line no-extra-parens
      this.editable.inspectResults = [ "NEW", "FINAL_COLLECTED", "REJECTED" ].includes(evalStatus) || (evalType === "OFFLINE" && evalStatus === "FEEDBACK" && needFeedbackFlag);
    },
    showBasicInfoDetail() {
      this.basicInfoDetailFlag = true;
    },
    // 物料/品类
    reviewMaterialSaveAction() {
      this.localLineNum.materLineNum = 0;
      this.setFirstReponse(this.reviewMaterDataSet, false);
      if (this.reviewMaterDataSet.validate()) {
        this.$loading.show();
        this.reviewMaterDataSet.submitRecords(this.reviewMaterDataSet.records);
        this.$loading.hide();
      }
    },
    reviewMaterialEditAction() {
      this.setFirstReponse(this.reviewMaterDataSet, !this.reviewMaterDataSet.editFlag);
    },
    reviewMaterialCreatAction() {
      this.localLineNum.materLineNum = this.localLineNum.materLineNum + 1;
      this.reviewMaterDataSet.create({ localLineNum: this.localLineNum.materLineNum, evalStatus: this.basicInfo.evalStatus }, 0);
    },
    reviewMaterialCancelAction() {
      this.setFirstReponse(this.reviewMaterDataSet, false);
    },
    // 考察小组
    inspectTeamSaveAction() {
      this.setFirstReponse(this.inspectTeamDataSet, false);
      if (this.inspectTeamDataSet.validate()) {
        this.$loading.show();
        this.localLineNum.inspectTeamLineNum = 0;
        this.inspectTeamDataSet.submitRecords(this.inspectTeamDataSet.records);
        this.$loading.hide();
      }
    },
    inspectTeamEditAction() {
      this.setFirstReponse(this.inspectTeamDataSet, !this.inspectTeamDataSet.editFlag);
    },
    inspectTeamCreatAction() {
      this.localLineNum.inspectTeamLineNum = this.localLineNum.inspectTeamLineNum + 1;
      this.inspectTeamDataSet.create({ localLineNum: this.localLineNum.inspectTeamLineNum, evalStatus: this.basicInfo.evalStatus }, 0);
    },
    inspectTeamCancelAction() {
      this.setFirstReponse(this.inspectTeamDataSet, false);
    },
    // 评分人维护
    scorerEditAction() {
      this.setFirstReponse(this.scoreInfoDataSet, true);
    },
    scorerEditCancelAction() {
      this.setFirstReponse(this.scoreInfoDataSet, false);
    },
    getNoChildScoreInfoIds(scoreInfo) {
      let ids = [];
      if (scoreInfo.children && scoreInfo.children.length) {
        scoreInfo.children.forEach((element) => {
          let subIds = this.getNoChildScoreInfoIds(element);
          ids.push(...subIds);
        });
      } else {
        ids.push(scoreInfo.evalLineId);
      }
      return ids;
    },
    toCompleteDetail(record) {
      // 创建评分完成情况ds
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
          dataSet={this.scorerCompleteDataSet}
          customize-code="SMBL.SITE_INVESTIGATE_REPORT.SCORE_INFO_STATUS"
        />,
      });
    },
    scorerInfoItemEdit(item) {
      this.scorerInfoIds = [ item.evalLineId ];
      this.targetLineId = item.evalLineId;
      this.scorerEditPopFlag = true;
    },
    maintainChildrenAction(item) {
      const editable = String(this.editable.scoreInfo) && !this.readOnly;
      if (editable) {
        this.$router.push({
          path: "/SiteInvestiogationScoreInfoChildren",
          query: {
            indicatorCode: item.indicatorCode,
            evalHeaderId: this.newEvalHeaderId,
            subIndicatorCode: item.indicatorCode,
            editable: String(this.editable.scoreInfo) && !this.readOnly,
            canAttEdit: "false",
            evalStatus: this.basicInfo.evalStatus,
          },
        });
      } else {
        this.$popup({
          title: this.$T("sslm.siteInvestigateReport.view.manage.viewChildren").$D("查看子级"),
          showHeader: true,
          showClose: false,
          position: "right",
          headerAlign: "start",
          showBack: true,
          content: <ScoreInfoChildren
            indicatorCode= {item.indicatorCode}
            evalHeaderId={this.newEvalHeaderId}
            subIndicatorCode={item.indicatorCode}
            editable={String(this.editable.scoreInfo) && !this.readOnly}
            canAttEdit={false}
            evalStatus={this.basicInfo.evalStatus}
          />,
        });
      }

    },
    // 附件
    attachmentEditAction() {
      this.setFirstReponse(this.attachmentDataSet, true);
    },
    attachmentCreatAction() {
      this.$attachment({
        attachments: [ { directory: "sslm-report", readonly:true } ],
        //监听文件变化
        onFileListChange: () => {
        },
        onFileUpload: (e) => {
          this.attachmentDataSet.create({
            localEditable: true,
            attachmentDesc: e.fileName + "." + e.extension,
            attachmentSize: e.fileSize,
            attachmentUrl: e.fileUrl,
            uploadDate: e.creationDate,
            uploadUserId: SrmUtil.getUserInfo().id,
            uploadUserName: SrmUtil.getUserInfo().realName,
            evalHeaderId: this.newEvalHeaderId,
            createdBy: SrmUtil.getUserInfo().id,
            lnEvalStatusMeaning: this.basicInfo.evalStatusMeaning,
            lnEvalStatus: this.basicInfo.evalStatus,
            insideFlag: "0",
            insideFlagMeaning: this.$T("smbl.common.view.no").$D("否"),
          }, 0);
        }
      });
    },
    attachmentCancelAction() {
      this.setFirstReponse(this.attachmentDataSet, false);
    },
    async saveAttachmentAction(item) {
      this.$loading.show();
      let res = await saveAttachmentApi([ item ]);
      if (!res.failed) {
        let newItem = res[0];
        // eslint-disable-next-line no-unused-vars
        for (let key in newItem) {
          item[key] = newItem[key];
        }
        if (newItem.insideFlag === 0 || newItem.insideFlag === 1 || newItem.insideFlag === "0" || newItem.insideFlag === "1") {
          item.insideFlag = String(newItem.insideFlag);
        } else {
          item.insideFlag = null;
        }
      }
      this.$loading.hide();
    },
    /*
     * 按钮状态变更
     * @param {string} btn - 指示是哪个按钮
     */
    getButtonStatus(btn) {
      let evalStatus = this.basicInfo.evalStatus;
      const obj = {
        save: {
          NEW: false,
          undefined: false,
          APPROVED: false,
          FINAL_COLLECTED: false,
          REJECTED: false,
          FEEDBACK: false,
        },
        score: {
          NEW: false,
        },
        sum: {
          MANUAL_COMPLETE: false,
          SYSTEM_COMPLETE: false,
        },
        destroy: {
          NEW: false,
          SYSTEM_PROCESSING: false,
          SYSTEM_COMPLETE: false,
          SYSTEM_FAIL: false,
          MANUAL_EVALUATING: false,
          MANUAL_COMPLETE: false,
          REJECTED: false,
        },
        results: {
          FINAL_COLLECTED: false,
          APPROVALING: false,
          APPROVED: false,
          REJECTED: false,
        },
        back: {
          FEEDBACK: false,
        },
      };
      return typeof obj[btn][evalStatus] === "undefined";
    },
    // 按钮操作事件大全
    async handleSaveAndExecute(name) {
      // 校验基本信息
      if (!this.basicDataSet.validate()) {
        this.validateFailed();
        return;
      }
      // 校验考察物料/品类
      if (!this.reviewMaterDataSet.validate()) {
        this.validateFailed();
        return;
      }
      // 校验考察小组
      if (!this.inspectTeamDataSet.validate()) {
        this.validateFailed();
        return;
      }
      let siteEvalItemCates = [];
      this.reviewMaterDataSet.records.forEach((record) => {
        siteEvalItemCates.push({
          ...record.data,
        });
      });
      let siteEvalGroups = [];
      this.inspectTeamDataSet.records.forEach((record) => {
        siteEvalGroups.push({
          ...record.data,
        });
      });
      let siteEvalAttLns = [];
      this.attachmentDataSet.records.forEach((record) => {
        let attData = {
          ...record.data,
        };
        if (attData.insideFlag !== 0 && attData.insideFlag !== "0" && attData.insideFlag !== 1 && attData.insideFlag !== "1") {
          attData.insideFlag = null;
        }
        siteEvalAttLns.push(attData);
      });
      // 处理平台供应商和本地供应商传值，当为平台供应商时传 supplierCompanyId，本地供应商传 supplierId
      let payload = {};
      if (this.basicInfo.supplierSource === "plate") {
        payload = {
          ...this.basicInfo,
          supplierId:"",
          siteEvalItemCates,
          siteEvalGroups,
          siteEvalAttLns,
        };
      } else {
        payload = {
          ...this.basicInfo,
          supplierCompanyId:"",
          siteEvalItemCates,
          siteEvalGroups,
          siteEvalAttLns,
        };
      }
      this.$loading.show();
      if (name === "save") {
        await saveAllApi(payload);
      } else if (name === "execute") {
        await performScoreApi(payload);
      } else if (name === "submitFeedback") {
        await submitFeedback(payload);
      } else if (name === "publish") {
        await publishReport(payload);
      } else if (name === "back") {
        await handleBack(payload);
      }
      this.$loading.hide();

      this.onRefresh();
    },
    async goToQualityRectification() {
      this.$loading.show();
      await queryProblemHeader([ this.newEvalHeaderId ]);
      this.$loading.hide();
      this.$router.back();
    },
    async handleSum() {
      this.$loading.show();
      await summaryStatistics({ evalHeaderId: this.newEvalHeaderId });
      this.$loading.hide();
      this.onRefresh();
    },
    async handleSubmit() {
      // 校验基本信息
      if (!this.basicDataSet.validate()) {
        this.validateFailed();
        return;
      }
      // 校验考察物料/品类
      if (!this.reviewMaterDataSet.validate()) {
        this.validateFailed();
        return;
      }
      // 校验考察小组
      if (!this.inspectTeamDataSet.validate()) {
        this.validateFailed();
        return;
      }
      let siteEvalItemCates = [];
      this.reviewMaterDataSet.records.forEach((record) => {
        siteEvalItemCates.push({
          ...record.data,
        });
      });
      let siteEvalGroups = [];
      this.inspectTeamDataSet.records.forEach((record) => {
        siteEvalGroups.push({
          ...record.data,
        });
      });
      let siteEvalAttLns = [];
      this.attachmentDataSet.records.forEach((record) => {
        let attData = {
          ...record.data,
        };
        if (attData.insideFlag !== 0 && attData.insideFlag !== "0" && attData.insideFlag !== 1 && attData.insideFlag !== "1") {
          attData.insideFlag = null;
        }
        siteEvalAttLns.push(attData);
      });
      // 处理平台供应商和本地供应商传值，当为平台供应商时传 supplierCompanyId，本地供应商传 supplierId
      let payload = {};
      if (this.basicInfo.supplierSource === "plate") {
        payload = {
          ...this.basicInfo,
          supplierId:"",
        };
      } else {
        payload = {
          ...this.basicInfo,
          supplierCompanyId:"",
        };
      }
      if (this.basicInfo.evalType !== "ONLINE") {
        payload.siteEvalItemCates = siteEvalItemCates;
        payload.siteEvalGroups = siteEvalGroups;
        payload.siteEvalAttLns = siteEvalAttLns;
      }
      if (this.basicInfo.evalType === "ONLINE" || this.basicInfo.evalType === "OFFLINE") {
        this.$loading.show();
        await submitApproval(payload);
        this.$loading.hide();
        this.onRefresh();
      } else {
        return null;
      }
    },
    async handleInvalid() {
      this.$dialog({
        content: this.$T("sslm.siteInvestigateReport.view.message.destroyConfirm").$D("确认作废？"),
        closable: false,
        onOk: () => {
          this.$loading.show();
          detailInvalid({ evalHeaderId: this.newEvalHeaderId }).then((res) => {
            if (!res.failed) {
              this.$router.back();
            }
          }).finally(() => {
            this.$loading.hide();
          });
        }
      });
    },
    async backScoreModal() {
      if (!this.backScoreDataSet) {
        this.backScoreDataSet = new DataSet(backScoreDS(this.newEvalHeaderId));
      }
      this.backScoreDataSet.refresh();
      this.backScorePopFlag = true;
    },
    validateFailed() {
      this.$notification.open({
        message: this.$T("sslm.siteInvestigateReport.view.message.perfectInfo").$D("请完善信息"),
        class: "notification"
      });
    },
    onRefresh() {
      // this.basicDataSet = null;
      // this.reviewMaterDataSet = null;
      // this.inspectTeamDataSet = null;
      // this.attachmentDataSet = null;
      // this.scoreInfoDataSet = null;

      this.localLineNum.materLineNum = 0;
      this.localLineNum.inspectTeamLineNum = 0;
      this.requestData();
    },
    async backScoreDoneAction() {
      let unChooseRecords = this.backScoreDataSet.records.filter((i) => !this.backScoreDataSet.selected.includes(i));
      let unChooseSiteEvalLineResps = [];
      unChooseRecords.forEach((record) => {
        unChooseSiteEvalLineResps.push({
          ...record.data,
        });
      });
      let siteEvalLineResps = [];
      this.backScoreDataSet.selected.forEach((record) => {
        siteEvalLineResps.push({
          ...record.data,
        });
      });
      let params = {
        evalHeaderId: this.newEvalHeaderId,
        tenantId: SrmUtil.getTenantId(),
        selectAllFlag: this.backScoreDataSet.totalCount === this.backScoreDataSet.selected.length ? 1 : 0,
        siteEvalLineResps,
        unChooseSiteEvalLineResps,
      };
      this.backScorePopFlag = false;
      this.$loading.show();
      await handleBackScore(params);
      this.$loading.hide();
      this.onRefresh();
      // const { dispatch } = this.props;
      // if (!isUndefined(this.backScore)) {
      //   return backScoreSave({
      //     dispatch,
      //     dataSet: this.backScore.dataSet,
      //     onRefresh: this.onRefresh,
      //     ...params,
      //   });
      // }
    },
    setFirstReponse(dataSet, editFlag) {
      this.reviewMaterDataSet.editFlag = this.reviewMaterDataSet === dataSet && editFlag;
      this.inspectTeamDataSet.editFlag = this.inspectTeamDataSet === dataSet && editFlag;
      this.scoreInfoDataSet.editFlag = this.scoreInfoDataSet === dataSet && editFlag;
      this.attachmentDataSet.editFlag = this.attachmentDataSet === dataSet && editFlag;
    }
  }
};
</script>

<style lang="stylus" scoped>
.site-investigation-report-detail-maintain {
  width: 100vw;
  height: 100vh;
}

.customize-card {
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: var(--background-color-empty);
}
.basic-more-button {
  border-top: 1px solid var(--split-line-color-primary);
  width: 100%;
  height: 44px;
  padding-right: 15px;
}
.review-material-buttons {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  .button {
    font-size: 20px;
    color: var(--font-color-disable);
    margin-left: 12px;
    >>> .srm-button-primary {
      color: var(--font-color-disable);
    }
  }
}

.bottom-space-view {
  height: 110px;
  height: calc(110px + constant(safe-area-inset-bottom));
  height: calc(110px + env(safe-area-inset-bottom));
}

.att-button {
  margin-left: 8px;
}
</style>
