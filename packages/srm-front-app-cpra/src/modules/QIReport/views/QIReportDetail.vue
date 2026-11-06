<template>
  <div>
    <srm-scroll-tab :customize-code="mblUnitCodeMap.scrollTab" :class="bottomButtons.length > 0 ? 'detail-container-tab ' : ''">
      <srm-scroll-tab-item code="basicInfo" :label="tlsMap.basic" class="tab-item">
        <basic-info />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="problemDesc" :label="tlsMap.problemDesc">
        <srm-form :data-set="headerDs" :columns="getProblemDescColumns()" :customize-code="mblUnitCodeMap.problemDesc" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="groupMember" :label="tlsMap.groupMember" class="tab-item">
        <tab-item-btns
          v-if="isPageMap.creation || auditEditFlag"
          :data-set="groupMemberDs"
          @addItem="groupMemberDs.create({})"
          @deleteSelected="deleteSelectedLines('groupMember')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getGroupMemberColumns()"
          :data-set="groupMemberDs"
          :customize-code="mblUnitCodeMap.groupMember" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="continueProvide" :label="tlsMap.continueProvide" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="continueProvideDs"
          @addItem="continueProvideDs.create({})"
          @deleteSelected="deleteSelectedLines('continueProvide')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getContinueProvideColumns()"
          :data-set="continueProvideDs"
          :customize-code="mblUnitCodeMap.continueProvide" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="shortMeature" :label="tlsMap.shortMeature" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="shortMeatureDs"
          @addItem="shortMeatureDs.create({})"
          @deleteSelected="deleteSelectedLines('shortMeature')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getShortMeatureColumns()"
          :data-set="shortMeatureDs"
          :customize-code="mblUnitCodeMap.shortMeature"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="reasonAnalyze" :label="tlsMap.reasonAnalyze" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="reasonAnalyzeDs"
          @addItem="reasonAnalyzeDs.create({})"
          @deleteSelected="deleteSelectedLines('reasonAnalyze')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getReasonAnalyzeColumns()"
          :data-set="reasonAnalyzeDs"
          :customize-code="mblUnitCodeMap.reasonAnalyze"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="correctMeature" :label="tlsMap.correctMeature" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="correctMeatureDs"
          @addItem="correctMeatureDs.create({})"
          @deleteSelected="deleteSelectedLines('correctMeature')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getCorrectMeatureColumns()"
          :data-set="correctMeatureDs"
          :customize-code="mblUnitCodeMap.correctMeature"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="applyItem" :label="tlsMap.applyItem" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="applyItemDs"
          @addItem="applyItemDs.create({})"
          @deleteSelected="deleteSelectedLines('applyItem')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getApplyItemColumns()"
          :data-set="applyItemDs"
          :customize-code="mblUnitCodeMap.applyItem"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="standard" :label="tlsMap.standard" class="tab-item">
        <tab-item-btns
          v-if="fillTabsBtnVisible"
          :data-set="standardDs"
          @addItem="standardDs.create({})"
          @deleteSelected="deleteSelectedLines('standard')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="getStandardColumns()"
          :data-set="standardDs"
          :customize-code="mblUnitCodeMap.standard"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible" code="congratulation" :label="tlsMap.congratulation">
        <srm-form :data-set="congratulationDs" :columns="getCongratulationColumns()" :customize-code="mblUnitCodeMap.congratulation"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="fillTabsVisible && effectTrackVisible" code="effectTrack" :label="tlsMap.effectTrack">
        <srm-form :data-set="headerDs" :columns="getEffectTrackColumns()" :customize-code="mblUnitCodeMap.congratulation"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!createFlag" code="otherInfo" :label="tlsMap.otherInfo" class="tab-item">
        <tab-item-btns
          v-if="isPageMap.creation || auditEditFlag"
          :data-set="otherInfoDs"
          @addItem="otherInfoDs.create({})"
          @deleteSelected="deleteSelectedLines('otherInfo')" />
        <srm-list
          :scrollable="false"
          :show-bottom-bar="false"
          :columns="[]"
          :data-set="otherInfoDs"
          :customize-code="mblUnitCodeMap.otherInfo"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="customFormA" label="FORM_A">
        <srm-form :data-set="headerDs" :columns="[]" :customize-code="mblUnitCodeMap.customFormA" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="customFormB" label="FORM_B">
        <srm-form :data-set="headerDs" :columns="[]" :customize-code="mblUnitCodeMap.customFormB" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="customFormC" label="FORM_C">
        <srm-form :data-set="headerDs" :columns="[]" :customize-code="mblUnitCodeMap.customFormC" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!createFlag" code="attchmentInfo" :label="tlsMap.attchmentInfo">
        <attachment-info />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!createFlag" code="operationRecord" :label="tlsMap.operationRecord">
        <history-record-tiled
          :action-data="operationData"
          operation-meaning-field-name="operationActionCodeMeaning"
          process-remark-field-name="operatedRemark"
          operator-field-name="createdName"
          process-date-field-name="operatedDate"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!createFlag && approvalData.length > 0" code="approvalRecord" :label="tlsMap.approvalRecord">
        <history-record-tiled
          :action-data="approvalData"
          operator-field-name="assigneeName"
          operation-meaning-field-name="action"
          process-date-field-name="endTime"
          process-remark-field-name="comment" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-bottom-handler
      v-if="bottomButtons.length > 0"
      class="bottom-button-wrapper"
      :btn-arr="bottomButtons"
      type="tooltip"/>
    <srm-popup
      height="100%"
      position="right"
      :show-header="false"
      :visible.sync="detailPopupVisible">
      <srm-form
        v-if="detailPopupVisible"
        customize-type="detail"
        :data-set="detailPopupDataSet"
        :columns="getDetailPupupColumns(true)"
        :customize-code="detailPopupUnitCode"/>
    </srm-popup>
  </div>
</template>
<script>
import { computed } from "vue";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import moment from "moment";
import {
  fromPairs,
  isNil,
  isArray,
} from "lodash";
import {
  querySqlIdpData,
  queryMapIdpValue,
  queryIncomingSearch,
  queryOperationRecords,
  queryApprovalRecords,
  saveQIReport,
  releaseQIReport,
  recallQIReport,
  batchDeleteQIReport
} from "../api";
import {
  headerDS,
  relatedPurOrderDS,
  relatedQCDocDS,
  relatedQIReportDS,
  relatedQCAffairDS,
  siteVisitResultDS,
  appraisalReportDS,
  supEvaluationFileDS,
  groupMemberDS,
  continueProvideDS,
  shortMeatureDS,
  reasonAnalyzeDS,
  correctMeatureDS,
  applyItemDS,
  standardDS,
  congratulationDS,
  otherInfoDS,
} from "../datasource/detailDS";
import { PermissionCaller, formatColumns, approveNameRenderTemp, getMblUnitCodeMap } from "../utils";
import TabItemBtns from "../components/TabItemBtns";
import BasicInfo from "../components/BasicInfo";
import AttachmentInfo from "../components/AttachmentInfo";
import FilledInfoContent from "../components/FilledInfoContent";
import TimeAdjustContent from "../components/TimeAdjustContent";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
const frontEndChildNameMap = {
  groupMember: "edProblemTeamList",
  continueProvide: "edProblemSupplyActionList",
  shortMeature: "edProblemProduceActionList",
  reasonAnalyze: "edProblemRootCauseList",
  correctMeature: "edProblemPcaActionList",
  applyItem: "edProblemApplicableItemsList",
  standard: "edProblemRelevantStandardList",
  otherInfo: "lineList",
  relatedQCDoc: "incomingInspectionDTOS",
};
export default {
  modules: [ "sqam.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "hzero.common", "smbl.common", "sodr.sendOrder", "entity.order", "sodr.common", "sqam.quoteIncomingInspection", "sqam.createRectification", "sslm.siteInvestigateReport", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "sslm.evaluationQuery", "hipspfm.common", "entity.attachment" ],
  name: "QIReportDetail",
  components: {
    BasicInfo,
    TabItemBtns,
    AttachmentInfo,
    HistoryRecordTiled,
  },
  provide() {
    return {
      pageCode: computed(() => this.pageCode),
      problemHeaderId: computed(() => this.problemHeaderId),
      createFlag: computed(() => this.createFlag),
      isPageMap: computed(() => this.isPageMap),
      headerDs: computed(() => this.headerDs),
      relatedQIReportDs: computed(() => this.relatedQIReportDs),
      relatedPurOrderDs: computed(() => this.relatedPurOrderDs),
      relatedQCDocDs: computed(() => this.relatedQCDocDs),
      relatedQCAffairDs: computed(() => this.relatedQCAffairDs),
      siteVisitResultDs: computed(() => this.siteVisitResultDs),
      appraisalReportDs: computed(() => this.appraisalReportDs),
      supEvaluationFileDs: computed(() => this.supEvaluationFileDs),
      dataSetMap: computed(() => this.dataSetMap),
      mblUnitCodeMap: computed(() => this.mblUnitCodeMap),
      problemStatusColorMap: computed(() => this.problemStatusColorMap),
    };
  },
  props: {
    permissionCodeMap: {
      type: Object,
      default: () => ({})
    },
    pageCode: {
      type: String,
      default: "initiated",
      required: true
    }
  },
  data() {
    const { pageCode } = this;
    const { problemHeaderId } = this.$route.query;
    const createFlag = isNil(problemHeaderId);
    return {
      problemHeaderId,
      createFlag,
      isPageMap: {
        creation: pageCode === "creation",
        initiated: pageCode === "initiated",
        audit: pageCode === "audit",
      },
      auditEditFlag: false,
      fillTabsVisible: !createFlag,
      effectTrackVisible: false,
      fillTabsBtnVisible: false,
      headerDs: new DataSet(headerDS(problemHeaderId, pageCode)),
      relatedQIReportDs: new DataSet(relatedQIReportDS(problemHeaderId, pageCode)),
      relatedPurOrderDs: new DataSet(relatedPurOrderDS(problemHeaderId)),
      relatedQCDocDs: new DataSet(relatedQCDocDS(problemHeaderId, pageCode)),
      relatedQCAffairDs: new DataSet(relatedQCAffairDS(pageCode)),
      siteVisitResultDs: new DataSet(siteVisitResultDS()),
      appraisalReportDs: new DataSet(appraisalReportDS()),
      supEvaluationFileDs: new DataSet(supEvaluationFileDS(problemHeaderId)),
      groupMemberDs: new DataSet(groupMemberDS(problemHeaderId, pageCode)),
      continueProvideDs: new DataSet(continueProvideDS(problemHeaderId, pageCode)),
      shortMeatureDs: new DataSet(shortMeatureDS(problemHeaderId, pageCode)),
      reasonAnalyzeDs: new DataSet(reasonAnalyzeDS(problemHeaderId, pageCode)),
      correctMeatureDs: new DataSet(correctMeatureDS(problemHeaderId, pageCode)),
      applyItemDs: new DataSet(applyItemDS(problemHeaderId, pageCode)),
      standardDs: new DataSet(standardDS(problemHeaderId, pageCode)),
      congratulationDs: new DataSet(congratulationDS(pageCode)),
      otherInfoDs: new DataSet(otherInfoDS(pageCode)),
      permissionMap: new PermissionCaller(this.permissionCodeMap),
      problemStatusColorMap: {},
      problemStatusMeaningMap: {},
      problemSourceMeaningMap: {},
      approvalActionMeaningMap: {},
      campMeaningMap: {},
      activeBasicKey: "basicInfo",
      decisionResults: [],
      detailPopupVisible: false,
      detailPopupDataSet: new DataSet(),
      detailPopupUnitCode: null,
      getDetailPupupColumns: () => [],
      operationData: [],
      approvalData: [],
      mblUnitCodeMap: getMblUnitCodeMap(pageCode),
    };
  },
  computed: {
    tlsMap() {
      return {
        basic: this.$T("sqam.common.view.message.title.panel.basic").$D("基本信息"),
        problemDesc: this.$T("sqam.common.view.message.title.panel.question").$D("问题描述"),
        groupMember:  this.$T("sqam.common.view.message.title.panel.groupMember").$D("小组成员"),
        continueProvide: this.$T("sqam.common.view.message.title.panel.promiseMaintainProvide").$D("临时围堵措施—保证持续供货"),
        shortMeature: this.$T("sqam.common.view.message.title.panel.shortMeature").$D("短期措施"),
        reasonAnalyze: this.$T("sqam.common.view.message.title.panel.analyzeReason").$D("根本原因分析"),
        correctMeature: this.$T("sqam.common.view.message.title.panel.foreverDealSolution").$D("永久纠正措施"),
        applyItem: this.$T("sqam.common.view.message.title.panel.applyItem").$D("是否适用以下项目"),
        standard: this.$T("sqam.common.view.message.title.panel.standard").$D("相关标准化"),
        congratulation: this.$T("sqam.common.view.message.title.panel.congratulation").$D("小组祝贺"),
        otherInfo: this.$T("sqam.common.view.message.title.panel.otherInfo").$D("其他信息"),
        effectTrack: this.$T("sqam.common.view.message.title.panel.effectTrack").$D("成效追踪"),
        attchmentInfo: this.$T("entity.attachment.tag").$D("附件"),
        operationRecord: this.$T("hzero.common.view.message.operateHistory").$D("操作记录"),
        approvalRecord: this.$T("sqam.common.model.qualityRectification.approvalRecord").$D("审批记录"),
      };
    },
    dataSetMap() {
      return {
        basicInfo: this.headerDs,
        problemDesc: this.headerDs,
        relatedQIReport: this.relatedQIReportDs,
        relatedPurOrder: this.relatedPurOrderDs,
        relatedQCDoc: this.relatedQCDocDs,
        relatedQCAffair: this.relatedQCAffairDs,
        siteVisitResult: this.siteVisitResultDs,
        appraisalReport: this.appraisalReportDs,
        supEvaluationFile: this.supEvaluationFileDs,
        groupMember: this.groupMemberDs,
        continueProvide: this.continueProvideDs,
        shortMeature: this.shortMeatureDs,
        reasonAnalyze: this.reasonAnalyzeDs,
        correctMeature: this.correctMeatureDs,
        applyItem: this.applyItemDs,
        standard: this.standardDs,
        otherInfo: this.otherInfoDs,
        congratulation: this.congratulationDs,
      };
    },
    getColumnsFuncMap() {
      return {
        problemDesc: this.getProblemDescColumns,
        groupMember: this.getGroupMemberColumns,
        continueProvide: this.getContinueProvideColumns,
        shortMeature: this.getShortMeatureColumns,
        reasonAnalyze: this.getReasonAnalyzeColumns,
        correctMeature: this.getCorrectMeatureColumns,
        applyItem: this.getApplyItemColumns,
        standard: this.getStandardColumns,
        otherInfo: this.getOtherInfoColumns,
        congratulation: this.getCongratulationColumns,
        effectTrack: this.getEffectTrackColumns,
      };
    },
    bottomButtons() {
      const problemStatus = this.headerDs.current?.get("problemStatus");
      let allBtns = [];
      switch (this.pageCode) {
      case "creation":
        allBtns = [
          this.permissionMap.get("release") && {
            bordered: true,
            type: "primary",
            title: this.$T("hzero.common.button.release").$D("发布"),
            handler: this.handleRelease,
          },
          {
            fill: true,
            type: "primary",
            title: this.$T("hzero.common.button.save").$D("保存"),
            handler: this.handleSave,
          },
          !this.createFlag && this.permissionMap.get("foreverDelete") && {
            title: this.$T("sqam.common.button.deleteForever").$D("永久删除"),
            handler: this.handleDelete,
          },
          !this.createFlag && this.permissionMap.get("delete") && {
            title: this.$T("hzero.common.button.delete").$D("删除"),
            handler: () => this.handleDelete(1),
          },
        ];
        break;
      case "initiated":
        allBtns = [
          this.permissionMap.get("recall") && [ "PUBLISHED", "PUBLISH APPROVING" ].includes(problemStatus) && {
            fill: true,
            type: "primary",
            title: this.$T("hzero.common.button.callBack").$D("撤回"),
            handler: this.handleWithdraw,
          },
        ];
        break;
      case "audit":
        allBtns = [
          this.permissionMap.get("continuePCA") && ![ "PUBLISHED", "ICA_REJECTED", "PCA_FEEDBACKING", "PCA_REJECTED", "PCA_SUBMITTED" ].includes(problemStatus) && {
            bordered: true,
            title: this.$T("sqam.common.view.message.title.feedback.pca").$D("继续反馈PCA"),
            handler: () => this.openFillInfoPopup("auditContinuePCA"),
          },
          ![ "PUBLISHED", "ICA_REJECTED", "PCA_FEEDBACKING", "PCA_REJECTED" ].includes(problemStatus) && {
            bordered: true,
            title: this.$T("sqam.common.view.button.completeRectification").$D("完成整改"),
            handler: () => this.openFillInfoPopup("auditComplete"),
          },
          this.auditEditFlag && {
            bordered: true,
            title: this.$T("hzero.common.button.save").$D("保存"),
            handler: this.handleSave,
          },
          ![ "PUBLISHED", "ICA_REJECTED", "PCA_FEEDBACKING", "PCA_REJECTED" ].includes(problemStatus) && {
            bordered: true,
            title: this.$T("sqam.common.view.message.title.rejectAduit").$D("审核拒绝"),
            handler: () => this.openFillInfoPopup("auditReject"),
          },
          ![ "ICA_REJECTED", "PCA_FEEDBACKING", "PCA_REJECTED" ].includes(problemStatus) && {
            bordered: true,
            title: this.$T("hzero.common.button.cancel-sqam").$D("取消整改"),
            handler: () => this.openFillInfoPopup("auditCancel"),
          },
          this.permissionMap.get("timeAdjust") && [ "PUBLISHED", "ICA_SUBMITTED", "ICA_REJECTED", "PCA_FEEDBACKING" ].includes(problemStatus) && {
            bordered: true,
            title: this.$T("sqam.common.model.qualityRectification.timeAdjustment").$D("时间调整"),
            handler: this.handleTimeAdjust,
          },
        ];
        break;
      default:
      }
      const btns = allBtns.filter(Boolean);
      if (btns.length > 0) {
        btns[0].fill = true;
      }
      return btns;
    },
    listBottomBtns() {
      return (type) => {
        const ds = this.dataSetMap[type];
        return [
          {
            text: this.$T("hzero.common.button.delete").$D("删除"),
            type: "danger",
            bordered: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: async () => {
              await ds.removeSelect();
              if (type !== "otherInfo") {
                ds.refresh();
              }
            },
          },
        ];
      };
    },
    getProblemDescColumns() {
      const fieldsList = [
        { fieldCode: "problemTypeCode" },
        "problemDefectType",
        "problemImportanceCode",
        "problemUrgencyCode",
        "problemOccurredDate",
        "problemDiscoverBy",
        "problemOccurredSite",
        "problemIdentifyCauses",
        "problemIdentification",
        "problemDetail",
        "problemEmergencyAction"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        endRow: this.isPageMap.creation ? 10 : 7,
        editorFlag: this.isPageMap.creation,
        onItemClick: () => this.onClickItem("problemDesc"),
      });
    },
    getGroupMemberColumns() {
      const {
        companyId,
        supplierCompanyId
      } = this.headerDs.current?.toData() || {};
      const fieldsList = [
        "selectBox",
        "camp",
        "memberUserId",
        {
          fieldCode: "supplierContactId",
          disabled: (_, item) => item.camp === "PURCHASER" || isNil(supplierCompanyId) || isNil(companyId),
          options: {
            queryParams: { companyId, partnerCompanyId: supplierCompanyId },
          }
        },
        [ "memberName", "leaderFlag" ],
        "memberResp",
        "participantNode",
        "phone",
        "email",
        "emailFlag",
        "visibleFlag",
        "remark",
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        endRow: 9,
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("groupMember"),
      });
    },
    getContinueProvideColumns() {
      const fieldsList = [
        "selectBox",
        "inventoryCode",
        "effectFlag",
        "doubtfulQuantity",
        "badQuantity",
        "measures",
        "supplyChargeName",
        "suppliyEndDate",
        "supplyActionRemark"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        endRow: 8,
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("continueProvide"),
      });
    },
    getShortMeatureColumns() {
      const fieldsList = [
        "selectBox",
        "measuresDesc",
        "produceActionRemark",
        "produceChargeName",
        "produceEndDate"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("shortMeature"),
      });
    },
    getReasonAnalyzeColumns() {
      const fieldsList = [
        "selectBox",
        "rootCauseTypeCode",
        "occurCause",
        "flowOutCause",
        "preventCause"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("reasonAnalyze"),
      });
    },
    getCorrectMeatureColumns() {
      const fieldsList = [
        "selectBox",
        "pcaActionDesc",
        "pcaActionRemark",
        "pcaChangeName",
        "pcaActionEndDate"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("correctMeature"),
      });
    },
    getApplyItemColumns() {
      const fieldsList = [
        "selectBox",
        "applicationItemCode",
        "itemDesc",
        "handleFlag",
        "itemRemark"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("applyItem"),
      });
    },
    getStandardColumns() {
      const fieldsList = [
        "selectBox",
        "standardCode",
        "standardActionDesc",
        "handleFlag",
        "standardRemark"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.auditEditFlag,
        onItemClick: () => this.onClickItem("standard"),
      });
    },
    getCongratulationColumns() {
      const fieldsList = [
        { fieldCode: "tmcPerformance" },
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        editorFlag: this.isPageMap.creation || this.isPageMap.audit,
        onItemClick: () => this.onClickItem("congratulation"),
      });
    },
    getEffectTrackColumns() {
      const fieldsList = [
        { fieldCode: "validateResultFlag" },
        "validateAttachmentUuid",
        "validateRemark",
        "validateCount",
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        onItemClick: () => this.onClickItem("congratulation"),
      });
    }
  },
  async created() {
    await this.fetchLookupData();
    this.fetchIncomingSearch();
    this.initData();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        problemStatusMeaningMap: "SQAM.PROBLEM_STATUS",
        problemSourceMeaningMap: "SQAM.PROBLEM_SOURCE",
        approvalActionMeaningMap: "SQAM.PROBLEM_WORKFLOW_DEFINITION",
        campMeaningMap:"SQAM.EDPROBLEM.CAMP",
      }).catch((err) => {
        throw err;
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          if (key === "problemStatusMeaningMap") {
            this.problemStatusColorMap = fromPairs(
              data.map(({ value, tag } = {}) => [ value, tag ])
            );
          }
          this[key] = fromPairs(
            data.map(({ value, meaning } = {}) => [ value, meaning ])
          );
        });
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async fetchIncomingSearch() {
      const res = await queryIncomingSearch().catch((err) => {
        throw err;
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.decisionResults = res.map((item) => item.decisionResult).join();
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    bindCascadeDataSet() {
      const children = {
        groupMember: this.groupMemberDs,
        continueProvide: this.continueProvideDs,
        shortMeature: this.shortMeatureDs,
        reasonAnalyze: this.reasonAnalyzeDs,
        correctMeature: this.correctMeatureDs,
        applyItem: this.applyItemDs,
        standard: this.standardDs,
        otherInfo: this.otherInfoDs,
        relatedQCDoc: this.relatedQCDocDs,
      };
      this.headerDs.children = children;
      Object.values(children).forEach((ds) => {
        ds.parent = this.headerDs;
      });
    },
    async initData() {
      this.bindCascadeDataSet();
      if (this.createFlag) {
        // defaultValue无法初始化未显示的字段默认值
        this.headerDs.create({
          problemStatus: "NEW",
          sourceCode: "MANUAL",
          problemStatusMeaning: this.problemStatusMeaningMap.NEW,
          sourceCodeMeaning: this.problemSourceMeaningMap.MANUAL,
          createdName: SrmUtil.getRealName(),
          icaDemandDate: moment().add(1, "d").format("YYYY-MM-DD HH:mm:ss"),
          pcaDemandDate: moment().add(14, "d").format("YYYY-MM-DD HH:mm:ss"),
        });
        this.initGroupMember();
      } else {
        this.fetchOperationRecords();
        this.groupMemberDs.refresh();
        this.continueProvideDs.refresh();
        this.shortMeatureDs.refresh();
        this.reasonAnalyzeDs.refresh();
        this.correctMeatureDs.refresh();
        this.applyItemDs.refresh();
        this.standardDs.refresh();
        await this.headerDs.refresh();
        this.fetchApprovalRecords();
        const {
          sourceCode,
          rcvTrxLineIds,
          evalHeaderIds,
          lineList = [],
          edProblemAction = {},
          problemStatus,
          collaborativeMode,
          approvalProblemStatus,
        } = this.headerDs.current?.toData() || {};
        if (this.isPageMap.creation) {
          this.fillTabsBtnVisible = collaborativeMode === "SINGLE";
        }
        if (this.isPageMap.initiated) {
          this.fillTabsVisible = collaborativeMode === "SINGLE" || ![ "PUBLISH APPROVING", "PUBLISH_APPRVING" ].includes(problemStatus);
          this.effectTrackVisible = [ "VALIDATED", "TRACK_APPROVING" ].includes(problemStatus) ||
            [ "NEW", "ICA_SUBMITTED", "PCA_SUBMITTED", "COMPLETED", "VALIDATED" ].includes(problemStatus) &&
            [ "PUBULISH APPROVAE REJECT", "CANCEL FINISH APPROVAL REJECT", "TRACK APPROVAL REJECT", ].includes(approvalProblemStatus);
        }
        if (this.isPageMap.audit) {
          this.auditEditFlag = [ "PUBLISHED", "ICA_REJECTED" ].includes(problemStatus);
          this.fillTabsBtnVisible = this.auditEditFlag;
        }
        this.congratulationDs.create(edProblemAction || {});
        this.otherInfoDs.setData(lineList);
        if (sourceCode === "INCOMING_INSPECTION") {
          this.relatedQCDocDs.refresh();
        }
        if (sourceCode === "TRX_RCV_LINE") {
          this.relatedQCAffairDs.addQueryParameter("rcvTrxLineIds", rcvTrxLineIds?.join());
          this.relatedQCAffairDs.refresh();
        }
        if (sourceCode === "SITE_EVAL") {
          this.siteVisitResultDs.addQueryParameter("evalHeaderIds", evalHeaderIds?.join());
          this.siteVisitResultDs.refresh();
        }
        if (sourceCode === "REPORT_EVAL") {
          this.appraisalReportDs.addQueryParameter("evalHeaderIds", evalHeaderIds?.join());
          this.appraisalReportDs.refresh();
        }
        if (sourceCode === "KPI_EVAL") {
          this.supEvaluationFileDs.refresh();
        }
      }
    },
    async initGroupMember() {
      const res = await querySqlIdpData("SQAM.TENANT_USER", { userId: SrmUtil.getUserInfo().id }).catch((err) => {
        throw err;
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        if (isArray(res.content)) {
          const data = res.content.map((item) => ({
            camp: "PURCHASER",
            campMeaning: this.campMeaningMap.PURCHASER,
            memberUserId: item.id,
            memberLoginName: item.loginName,
            memberName: item.realName,
            email: item.email,
            leaderFlag: 1,
            phone: item.phone,
            internationalTelCode: "+86",
            internationalTelCodeMeaning: `${this.$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86`
          }));
          this.groupMemberDs.setData(data);
        }
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async fetchOperationRecords() {
      const res = await queryOperationRecords(this.problemHeaderId).catch(
        (err) => {
          throw err;
        }
      );
      if (res && !res.failed) {
        this.operationData = res;
      }
    },
    async fetchApprovalRecords() {
      const businessKey = this.headerDs.current?.get("businessKey");
      const res = await queryApprovalRecords({
        businessKey,
        needMerge: true,
      }).catch(
        (err) => {
          throw err;
        }
      );
      if (res && !res.failed) {
        this.approvalData = res
          .map((item) => (item.historicTaskExtList || [])
            .map((childItem) => {
              const { action } = childItem;
              const { actionText } = approveNameRenderTemp(action);
              Object.assign(childItem, {
                action: actionText,
              });
              return childItem;
            })
          )
          .flat()
          .reverse();
      }
    },
    async getFrontDataAndValidate(forceGetFlag = false) {
      if (!forceGetFlag) {
        const validteResult = await Promise.all([
          this.headerDs.validate(),
          ...Object.values(this.headerDs.children).map((ds) => ds.validate()),
        ]);
        if (validteResult.some((item) => !item)) {
          this.$notification.open({
            message: this.$T("sqam.common.view.message.existFieldValidErrorAndCheck").$D("存在未通过校验的字段，请检查"),
          });
          return false;
        }
      }
      const childrenUnitCodeList = [];
      const childrenDataMap = fromPairs(Object.entries(this.headerDs.children).map(([ key, ds ]) => {
        childrenUnitCodeList.push(ds.queryParameter.customizeUnitCode);
        if (key === "groupMember") {
          return [ frontEndChildNameMap[key], ds.toData().map((item) => ({ ...item, optcamp: "PURCHASER" })) ];
        }
        return [ frontEndChildNameMap[key], ds.toData() ];
      }));
      const congratulationData = this.congratulationDs.current?.toData() || {};
      const headerData = this.headerDs.current?.toData() || {};
      const {
        extSupplierId,
        supplierCompanyId
      } = headerData;
      const sendData = {
        ...headerData,
        ...childrenDataMap,
        edProblemAction: congratulationData,
        supplierQueryFlag: extSupplierId && supplierCompanyId ? 1 : extSupplierId && !supplierCompanyId ? 2 : 0,
        customizeUnitCode: [
          this.headerDs.queryParameter.customizeUnitCode,
          this.congratulationDs.queryParameter.customizeUnitCode,
          ...childrenUnitCodeList
        ].filter(Boolean).join(),
      };
      return sendData;
    },
    async handleSave() {
      const sendData = await this.getFrontDataAndValidate();
      if (!sendData) {
        return;
      }
      this.$loading.show();
      const saveRes = await saveQIReport(sendData).catch((err) => {
        this.$loading.hide();
        throw err;
      });
      this.$loading.hide();
      if (!saveRes) {
        return;
      }
      if (!saveRes.failed) {
        if (this.createFlag) {
          const { problemHeaderId } = saveRes;
          this.$router.replace({ name: "QIReportCreationDetail", query: { problemHeaderId } });
        }
        this.initData();
      } else {
        this.$notification.open({ message: saveRes.message });
      }
    },
    async handleRelease() {
      const sendData = await this.getFrontDataAndValidate();
      if (!sendData) {
        return;
      }
      this.$loading.show();
      const saveRes = await releaseQIReport(sendData).catch((err) => {
        this.$loading.hide();
        throw err;
      });
      this.$loading.hide();
      if (!saveRes) {
        return;
      }
      if (!saveRes.failed) {
        this.$router.back();
      } else {
        this.$notification.open({ message: saveRes.message });
      }
    },
    handleDelete(logicDelete = 0) {
      this.$dialog({
        closable: false,
        content: logicDelete === 1 ?
          this.$T("sqam.common.view.message.confirm.deleteRectification").$D("是否删除整改报告") :
          this.$T("sqam.common.view.message.confirm.deleteRectificationForever").$D("是否永久删除整改报告"),
        onOk: async () => {
          const headerData = this.headerDs.current?.toData() || {};
          this.$loading.show();
          const deleteRes = await batchDeleteQIReport([ { ...headerData, logicDelete } ]).catch((err) => {
            this.$loading.hide();
            throw err;
          });
          this.$loading.hide();
          if (!deleteRes) {
            return;
          }
          if (!deleteRes.failed) {
            this.$router.back();
          } else {
            this.$notification.open({ message: deleteRes.message });
          }
        },
      });
    },
    handleWithdraw() {
      this.$dialog({
        closable: false,
        content: this.$T("sqam.common.view.message.confirmRecall").$D("是否确认撤回?"),
        onOk: async () => {
          const headerData = this.headerDs.current?.toData() || {};
          this.$loading.show();
          const recallRes = await recallQIReport(headerData).catch((err) => {
            this.$loading.hide();
            throw err;
          });
          this.$loading.hide();
          if (!recallRes) {
            return;
          }
          if (!recallRes.failed) {
            this.$router.back();
          } else {
            this.$notification.open({ message: recallRes.message });
          }
        },
      });
    },
    openFillInfoPopup(action) {
      const filledInfoPopup = this.$popup({
        rounded: true,
        height: "70%",
        showClose: true,
        showHeader: true,
        title: action === "auditCancel" ?
          this.$T("sqam.common.view.cancleInfo").$D("取消信息") :
          this.$T("sqam.common.view.approveInfo").$D("审核信息"),
        content:
          <FilledInfoContent
            action={action}
            headerDs={this.headerDs}
            onClose={(backFlag) => {
              filledInfoPopup.onClose();
              if (backFlag) {
                this.$router.back();
              }
            }}
          />
      });
    },
    handleTimeAdjust() {
      const timeAdjustPopup = this.$popup({
        rounded: true,
        height: "70%",
        showClose: true,
        showHeader: true,
        title: this.$T("entity.attachment.timeAdjustment").$D("时间调整"),
        content:
          <TimeAdjustContent
            headerDs={this.headerDs}
            onClose={(refreshFlag) => {
              timeAdjustPopup.onClose();
              if (refreshFlag) {
                this.initData();
              }
            }}
          />
      });
    },
    async deleteSelectedLines(type) {
      const ds = this.dataSetMap[type];
      await ds.removeSelect();
      if (type !== "otherInfo") {
        ds.refresh();
      }
    },
    onClickItem(type) {
      this.detailPopupDataSet = this.dataSetMap[type];
      this.detailPopupUnitCode = this.mblUnitCodeMap[type];
      this.getDetailPupupColumns = this.getColumnsFuncMap[type];
      this.detailPopupVisible = true;
    },
  },
};
</script>
<style lang="stylus" scoped>
.form-more-button {
  border-top: 1px solid var(--split-line-color-primary);
  width: 100%;
  padding: 8px 15px 16px 0;
}

.tab-bar {
  ::v-deep {
    .tab-bar-button-active {
      stroke: var(--font-color-primary);
      background: var(--color-ghost-primary);
      color: var(--font-color-primary);
      border-radius: 12px;
      height: 24px;
      padding: 0 8px;

      &:first-child {
        margin-left: 15px;
      }

      &:last-child {
        margin-right: 15px;
      }
    }
  }
}

.detail-container-tab {
  >>> .srm-scroll-content {
    height: calc(100% - 72px - env(safe-area-inset-bottom));
   }
  }
.bottom-button-wrapper {
  height: calc(74px + env(safe-area-inset-bottom));
}
.tab-item {
  position: relative;
}
.tab-item-button {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  gap: 12px;

  .srm-icon {
    font-size: 20px;
    color: var(--font-color-disable);
  }
}
</style>