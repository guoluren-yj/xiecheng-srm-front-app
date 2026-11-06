<!-- 供应商评估工作台-评估报告详情页 -->
<template>
  <div class="srm-detail-maintain">
    <nav-head :title="navTitle"/>
    <div class="srm-wrap-header">
      <!-- 头信息 -->
      <srm-detail-head :data-source="basicInfo" :columns="getHeaderColumns">
        <srm-button
          v-if="viewScoreFlag"
          :loading="loading"
          type="primary"
          fill
          class="srm-header-button"
          :style="{marginRight: '5px'}"
          size="small"
          icon="icon-notes"
          bordered
          @click="handleViewScore(false)">
          {{ $T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分") }}
        </srm-button>
        <srm-button
          :loading="loading"
          class="srm-header-button"
          size="small"
          icon="icon-license"
          bordered
          @click="handleEvaluationPolicy">
          {{ $T("sslm.purchaserEvaluationDetail.button.header.viewEvaluationPolicy").$D("查看评估策略") }}
        </srm-button>
      </srm-detail-head>
      <!-- 评估阶段步骤条 -->
      <srm-step-progress v-if="stageList.length > 1" justify="start" :steps="stageList"/>
    </div>
    <!-- 内容区域 -->
    <div class="srm-detail-wrap-context">
      <srm-scroll-tab customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.TABS">
        <srm-scroll-tab-item code="basic" :label="$T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息')">
          <srm-list
            :customize-code="getCustomizeCode('basic', isEditList.basic && !isEditList.basicDisabledFlag)"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getBasicColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="company" :label="$T('sslm.purchaserEvaluationDetail.view.content.companyInfo').$D('公司信息')" >
          <srm-list
            :customize-code="getCustomizeCode('company', isEditList.basic && !isEditList.basicDisabledFlag)"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getCompanyColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item code="supplier" :label="$T('sslm.purchaserEvaluationDetail.view.content.supplierInfo').$D('供应商信息')" >
          <srm-list
            :customize-code="getCustomizeCode('supplier', isEditList.basic && !isEditList.basicDisabledFlag)"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getSupplierColumns"/>
        </srm-scroll-tab-item>
        <!-- 评估物料/品类 -->
        <srm-scroll-tab-item code="itemCategory" :label="$T('sslm.purchaserEvaluationDetail.view.content.itemCategoryInfo').$D('评估物料/品类')" style="position: relative;">
          <srm-flex v-if="isEditList.itemCategory && itemCategoryDs && !itemCategoryDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <em class="button srm-icon icon-save" @click="handleSave(tabType.itemCategory)"/>
            <em class="button srm-icon icon-edit" @click="handleEdit(tabType.itemCategory, true)"/>
            <em class="button srm-icon icon-plus" @click="handleCreate(tabType.itemCategory)"/>
          </srm-flex>
          <srm-flex v-if="isEditList.itemCategory && itemCategoryDs && itemCategoryDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <srm-button class="button" style="font-size: 16px;" plain @click="handleEdit(tabType.itemCategory, false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          </srm-flex>
          <srm-list
            v-if="itemCategoryDs"
            :customize-code="getCustomizeCode('itemCategory', isEditList.itemCategory)"
            :data-set="itemCategoryDs"
            :scrollable="false"
            :columns="getItemCategoryColumns"
            :show-bottom-bar="false"/>
        </srm-scroll-tab-item>
        <!-- 评估小组 -->
        <srm-scroll-tab-item code="assessmentPanel" :label="$T('sslm.purchaserEvaluationDetail.view.content.assessmentPanel').$D('评估小组')" style="position: relative;">
          <srm-flex v-if="isEditList.assessmentPanel && assessmentPanelDs && !assessmentPanelDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <em v-if="assessmentPanelBtnCuz.save && assessmentPanelBtnCuz.save.visible !== 0" class="button srm-icon icon-save" @click="handleSave(tabType.assessmentPanel)"/>
            <em v-if="assessmentPanelBtnCuz.edit && assessmentPanelBtnCuz.edit.visible !== 0" class="button srm-icon icon-edit" @click="handleEdit(tabType.assessmentPanel, true)"/>
            <em v-if="assessmentPanelBtnCuz.creat && assessmentPanelBtnCuz.creat.visible !== 0" class="button srm-icon icon-plus" @click="handleCreate(tabType.assessmentPanel)"/>
          </srm-flex>
          <srm-flex v-if="isEditList.assessmentPanel && assessmentPanelDs && assessmentPanelDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <srm-button class="button" style="font-size: 16px;" plain @click="handleEdit(tabType.assessmentPanel, false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          </srm-flex>
          <srm-list
            v-if="assessmentPanelDs"
            :customize-code="getCustomizeCode('assessmentPanel', isEditList.assessmentPanel)"
            :data-set="assessmentPanelDs"
            :scrollable="false"
            :columns="getAssessmentPanelColumns"
            :show-bottom-bar="false" />
        </srm-scroll-tab-item>
        <!-- 评估信息 -->
        <srm-scroll-tab-item code="assessment" :label="$T('sslm.purchaserEvaluationDetail.view.content.assessmentInfo').$D('评估信息')" style="position: relative;">
          <srm-flex v-if="isEditList.assessment && assessmentDs && !assessmentDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <em class="button srm-icon icon-save" @click="handleSave(tabType.assessment)"/>
            <em class="button srm-icon icon-edit" @click="handleEdit(tabType.assessment, true)"/>
          </srm-flex>
          <srm-flex v-if="isEditList.assessment && assessmentDs && assessmentDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <srm-button class="button" style="font-size: 16px;" plain @click="handleEdit(tabType.assessment, false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          </srm-flex>
          <srm-list
            v-if="assessmentDs"
            :customize-code="getCustomizeCode('assessment')"
            :data-set="assessmentDs"
            :scrollable="false"
            :columns="getAssessmentColumns"
            :show-bottom-bar="false" />
        </srm-scroll-tab-item>
        <!-- 评估结果 -->
        <srm-scroll-tab-item v-if="showResultsFlag" code="results" :label="$T('sslm.purchaserEvaluationDetail.form.label.resultsFlag').$D('评估结果')">
          <srm-list
            :customize-code="getCustomizeCode('results', isEditList.results)"
            :scrollable="false"
            :data-set="basicDs"
            :columns="getResultsColumns"/>
        </srm-scroll-tab-item>
        <!-- 质量整改 -->
        <srm-scroll-tab-item v-if="showResultsFlag" code="reform" :label="$T('sslm.purchaserEvaluationDetail.view.content.reformContent').$D('质量整改')" style="position: relative;">
          <srm-flex v-if="isEditList.reform && reformDs && !reformDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <em class="button srm-icon icon-edit" @click="handleEdit(tabType.reform, true)"/>
            <em class="button srm-icon icon-plus" @click="handleCreate(tabType.reform)"/>
          </srm-flex>
          <srm-flex v-if="isEditList.reform && reformDs && reformDs.editFlag" justify="end" class="srm-detail-tab-item-buttons">
            <srm-button class="button" style="font-size: 16px;" plain @click="handleEdit(tabType.reform, false)">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          </srm-flex>
          <srm-list
            :customize-code="getCustomizeCode('reform', isEditList.reformIsView)"
            :scrollable="false"
            :data-set="reformDs"
            :columns="getReformColumns"/>
        </srm-scroll-tab-item>
        <!-- 附件 -->
        <srm-scroll-tab-item v-if="basicInfo" code="attachment" :label="$T('sslm.purchaserEvaluationDetail.view.feedback.content.externalAttachment').$D('附件信息')" >
          <div>
            <srm-flex justify="between" class="srm-attachment-flex">
              <srm-flex-item>
                <em class="srm-icon icon-folder"/>
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.form.label.PurchaseAccessoriesAttachment").$D("采购方附件") }}</span>
              </srm-flex-item>
              <srm-flex-item>
                <srm-button
                  type="success"
                  rect
                  @click="handleAttachment({attUuid:internalAttachmentUuid, readonly: !isEditList.attachment})">
                  {{ $T("sslm.purchaserEvaluationDetail.view.content.internalAttachment").$D("内部附件") }} ({{ attachmentAllAmount.internalAmount }})
                </srm-button>
                <em class="srm-icon icon-chevron-right srm-attachment-title" @click="handleAttachment({attUuid:internalAttachmentUuid, readonly: !isEditList.attachment})"/>
              </srm-flex-item>
            </srm-flex>
            <div class="srm-attachment-division"/>
            <srm-flex justify="between" class="srm-attachment-flex">
              <srm-flex-item>
                <em class="srm-icon icon-folder" />
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.form.label.PurchaseAccessoriesAttachment").$D("采购方附件") }}</span>
              </srm-flex-item>
              <srm-flex-item>
                <srm-button
                  type="danger"
                  rect
                  @click="handleAttachment({attUuid:externalAttachmentUuid, readonly: !isEditList.attachment})">
                  {{ $T("sslm.purchaserEvaluationDetail.view.content.externalAttachment").$D("外部附件") }} ({{ attachmentAllAmount.externalAmount }})
                </srm-button>
                <em class="srm-icon icon-chevron-right srm-attachment-title" @click="handleAttachment({attUuid:externalAttachmentUuid, readonly: !isEditList.attachment})"/>
              </srm-flex-item>
            </srm-flex>
            <div class="srm-attachment-division"/>
            <srm-flex justify="between" class="srm-attachment-flex">
              <srm-flex-item>
                <em class="srm-icon icon-folder" />
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.form.label.supplierAccessoriesAttachment").$D("供应商附件") }}</span>
              </srm-flex-item>
              <srm-flex-item>
                <srm-button
                  type="danger"
                  rect
                  @click="handleAttachment({attUuid:basicInfo.selfEvalAttachmentUuid, readonly: true})">
                  {{ $T("sslm.purchaserEvaluationDetail.view.content.externalAttachment").$D("外部附件") }} ({{ attachmentAllAmount.selfEvalAmount }})
                </srm-button>
                <em class="srm-icon icon-chevron-right srm-attachment-title" @click="handleAttachment({attUuid:basicInfo.selfEvalAttachmentUuid, readonly: true})"/>
              </srm-flex-item>
            </srm-flex>
          </div>
        </srm-scroll-tab-item>
        <!-- 操作记录 -->
        <srm-scroll-tab-item v-if="!showApproveHistoryFlag" code="operation" :label="$T('sslm.common.button.operationRecords').$D('审批记录')">
          <history-record-tiled
            :action-data="historicList"
            operator-field-name="realName"
            operation-meaning-field-name="operationMeaning"
            process-date-field-name="operatedDate"
            process-remark-field-name="remark" />
          <!-- 解决包含头的列表 -->
          <!-- <div class="srm-have-top-header" /> -->
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <srm-list-bottom-bar v-if="itemCategoryDs" style="height: 72px" :data-set="itemCategoryDs" :buttons="srmListButtons(tabType.itemCategory)"/>
    <srm-list-bottom-bar v-if="assessmentPanelDs" style="height: 72px" :data-set="assessmentPanelDs" :buttons="srmListButtons(tabType.assessmentPanel)"/>
    <srm-list-bottom-bar v-if="assessmentDs" style="height: 72px" :data-set="assessmentDs" :buttons="srmListButtons(tabType.assessment)"/>
    <srm-list-bottom-bar v-if="reformDs" style="height: 72px" :data-set="reformDs" :buttons="srmListButtons(tabType.reform)"/>
    <!-- 退回自评 -->
    <text-area-pop
      :visible="backAssessmentFlag"
      :title="$T('sslm.purchaserEvaluationDetail.button.header.executiveScoring.returnSelfAssessment').$D('退回自评')"
      :text-area-label="$T('sslm.purchaserEvaluationDetail.form.label.backReason').$D('退回原因')"
      :placeholder="$T('sslm.purchaserEvaluationDetail.form.label.pleaseInput.backReason').$D('请输入退回原因')"
      required
      @submit="handleBack"
      @changeVisible="changeVisible"/>
    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="bottomBtn.length > 0" :btn-arr="bottomBtn"/>
    <!-- 基础信息详情弹框 -->
    <srm-popup :visible.sync="basePopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getBasicDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.BASIC_DETAIL"/>
    </srm-popup>
    <!-- 公司信息详情弹框 -->
    <srm-popup :visible.sync="companyPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getCompanyDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.COMPANY_DETAIL"/>
    </srm-popup>
    <!-- 供应商信息详情弹框 -->
    <srm-popup :visible.sync="supplierPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <srm-form customize-type="detail" :columns="getSupplierDetailColumns" :data-set="basicDs" customize-code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.SUPPLIER_DETAIL"/>
    </srm-popup>
    <!-- 评估物料、品类信息详情弹框 -->
    <srm-popup :visible.sync="itemCategoryPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <customize-detail ref="itemCategoryRef" style="padding: 0 15px" :need-padding="true" :columns="getItemCategoryDetailColumns(itemCategoryDetail)" :data-source="itemCategoryDetail" code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ITEM_DETAIL"/>
    </srm-popup>
    <!-- 评估小组信息详情弹框 -->
    <srm-popup :visible.sync="assessmentPanelPopupFlag" position="right" :title="$T('smbl.common.view.detail').$D('详情')" :show-back="true" :show-close="false" width="100%">
      <customize-detail ref="assessmentPanelRef" style="padding: 0 15px" :need-padding="true" :columns="getAssePanelDetailColumns(assessmentPanelDetail)" :data-source="assessmentPanelDetail" code="SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASS_PANEL_DETAIL"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { head, isEmpty, forEach, uniqBy } from "lodash";
import {
  getBasicInfoApi,
  getEvalReportStageApi,
  getHistoricApi,
  detailInvalidApi,
  backApi,
  saveAllApi,
  executiveScoreApi,
  detailDeleteApi,
  summaryStatisticsApi,
  backScoreApi,
  submitApprovalApi,
  releaseApi,
  handleFeedBackApi,
  saveAssessmentApi,
  getRectificationItemsApi,
  getAttachedFile,
  queryCustomizeApi,
} from "../api";
import manageDetailMix from "../mixins/manageDetailMix";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import EvaluationPolicy from "../component/EvaluationPolicy.vue";
import PurEvaluationScoreDetail from "@/modules/PurEvaluationWorkbench/views/PurEvaluationScoreDetail.vue";
import TextAreaPop from "../component/TextAreaPop.vue";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { basicDS, itemCategoryDS, assessmentPanelDS, assessmentDS, backScoreDS, reformDS } from "../datasource/detailDs";

export default {
  modules: [ "sslm.purchaserEvaluationDetail", "smbl.common", "sslm.common", "sslm.commonApplication", "hzero.common", "smbl.small", "sslm.evaluationStrategyDetail", "ssrc.inquiryHall", "sslm.purchaserEvaluation", "sslm.siteInvestigateReport", "hipspfm.common", "sslm.supplierDocManage" ],
  name: "PurEvaluationManageDetail",
  // eslint-disable-next-line vue/no-unused-components
  components: { HistoryRecordTiled, EvaluationPolicy, TextAreaPop, PurEvaluationScoreDetail },
  mixins: [ manageDetailMix ],
  props:{
    newEvalHeaderId:{
      type: String | Number,
      default: null,
    },
    newStatus:{
      type: String,
      default: null,
    },
  },
  data() {
    const evalHeaderId = ((this.$route || {}).query || {}).evalHeaderId || this.newEvalHeaderId;
    const status = ((this.$route || {}).query || {}).status || this.newStatus;
    return {
      backScoreModalRef: null,
      isCreate: false,
      // 各页签编辑状态不一致分开判断
      isEditList: {
        basic: status !== "view" || true,
        itemCategory: status !== "view" || true,
        assessmentPanel: status !== "view" || true,
        assessment: status !== "view" || true,
        attachment: status !== "view" || true,
        results: status !== "view" || true,
        reform: status !== "view" || true,
      },
      readOnly: status === "view" || false,
      navTitle: null,
      loading: false,
      preStepFlag: false,
      hideResultsFlag: false, // 评估结果标识
      resultConfirm: false, // 结果确认开启
      viewScoreFlag: false, // 查看评分按钮
      viewScoreNextFlag: false, // 查看评分后显示提交按钮
      showApproveHistoryFlag: false, // 操作记录显示标识
      evalHeaderId: evalHeaderId, // 单据头id
      basicInfo:{}, // 基础信息
      progressStatus: "", // 当前单据阶段
      stageList:[], // 阶段信息
      historicList: [],
      basicDs: new DataSet(basicDS({ evalHeaderId: evalHeaderId })),
      itemCategoryDs: new DataSet(itemCategoryDS({ evalHeaderId: evalHeaderId })),
      assessmentPanelDs: new DataSet(assessmentPanelDS({ evalHeaderId: evalHeaderId })),
      assessmentDs: new DataSet(assessmentDS({ evalHeaderId: evalHeaderId })),
      backScoreDs: new DataSet(backScoreDS({ evalHeaderId })),
      reformDs: new DataSet(reformDS({ evalHeaderId })),
      backAssessmentFlag: false, //退回自评弹窗
      internalAttachmentUuid: "", // 采购方-内部附件
      externalAttachmentUuid: "", // 采购方-内部附件
      attachmentAllAmount: {
        internalAmount: 0,
        externalAmount: 0,
        selfEvalAmount: 0,
      },
      // tab页编码
      tabType: {
        itemCategory: "itemCategory",
        assessmentPanel: "assessmentPanel",
        assessment: "assessment",
        reform: "reform",
      },
      basePopupFlag: false,
      companyPopupFlag: false,
      supplierPopupFlag: false,
      itemCategoryPopupFlag: false,
      assessmentPanelPopupFlag: false,
      scorePopupFlag: false,
      itemCategoryDetail: {},
      assessmentPanelDetail: {},
      assessmentPanelBtnCuz: {}, // 评估小组按钮个性化配置
    };
  },
  computed: {
    showResultsFlag() {
      return !this.hideResultsFlag || this.resultConfirm;
    },
    // 底部按钮
    bottomBtn() {
      const { reportStatus, progressStatus, evalType, needFeedbackFlag, approvalMethod } = this.basicInfo || {};
      const isOnLine = evalType === "ONLINE";
      // 线下【提交审批】按钮显隐
      const submitBtnFlag = needFeedbackFlag ? reportStatus === "FEEDBACK" : reportStatus === "NEW" && this.resultConfirm;
      // 评估准备
      const evaluationPrepare = progressStatus === "EVAL_PREPARE";
      // 评估准备-审批中
      const newApprovaling = evaluationPrepare && reportStatus === "APPROVALING";
      // 评估准备-审批通过
      const newApprovaled = evaluationPrepare && reportStatus === "APPROVED";
      // 供应商自评(采购方发起)
      const supplierEvaluation = progressStatus === "SUPPLIER_EVAL";
      // 供应商自评-审批中
      const supplierApprovaling = supplierEvaluation && reportStatus === "APPROVALING";
      // 供应商自评-审批通过
      const supplierApprovaled = supplierEvaluation && reportStatus === "APPROVED";
      // 供应商自评-审批拒绝
      const supplierRejected = supplierEvaluation && reportStatus === "REJECTED";
      // 评估结果确认
      const resultConfirm = progressStatus === "EVAL_RESULT";
      // 评估结果确认-审批中
      const resultApprovaling = resultConfirm && reportStatus === "APPROVALING";
      // 评估结果确认-审批拒绝
      const resultRejected = resultConfirm && reportStatus === "REJECTED";
      // 评估完成-审批通过
      const completeApprovaled = progressStatus === "EVAL_COMPLETE" && reportStatus === "APPROVED";
      // const readOnly = !this.isEdit;

      // 废弃按钮
      const hiddenDiscard = this.readOnly || !(
        [
          "NEW",
          "SYSTEM_PROCESSING",
          "SYSTEM_COMPLETE",
          "SYSTEM_FAIL",
          "MANUAL_EVALUATING",
          "MANUAL_COMPLETE",
          "FINAL_COLLECTED",
          "REJECTED",
          "WAITINGREJECTED",
          "FEEDBACK",
          "BACK",
        ].includes(reportStatus) || newApprovaled || supplierApprovaled
      );

      // 退回自评按钮
      const hiddenReturnSelfAssessment = this.readOnly || isOnLine ?
        !((supplierRejected || [ "FEEDBACK" ].includes(reportStatus)) && needFeedbackFlag === 1) :
        !(needFeedbackFlag === 1 && (resultRejected || [ "FEEDBACK" ].includes(reportStatus)));

      // 保存按钮
      const hiddenSave = this.readOnly || [
        "SYSTEM_PROCESSING",
        "SYSTEM_FAIL",
        "MANUAL_EVALUATING",
        "MANUAL_COMPLETE",
        "PUBLISHED",
        "DISCARDED",
        "WAITINGREJECTED",
        "BACK",
      ].includes(reportStatus) || newApprovaling || resultApprovaling || supplierApprovaling || completeApprovaled;

      // 【结果确认】按钮显隐
      const resultBtnFlag = needFeedbackFlag ? reportStatus === "FEEDBACK" : reportStatus === "NEW";

      // 执行评分
      const hideExeScore = this.readOnly ||
            !(isOnLine && (needFeedbackFlag ?
              reportStatus === "FEEDBACK" && approvalMethod === "SELF" || supplierApprovaled :
              reportStatus === "NEW" && approvalMethod === "SELF" || newApprovaled)
            );
      // 删除按钮
      const hideDelete = this.readOnly || ![ "NEW" ].includes(reportStatus);
      // 退回评分
      const hideBackScore = this.readOnly || !(([ "MANUAL_EVALUATING", "MANUAL_COMPLETE", "FINAL_COLLECTED" ].includes(reportStatus) || resultRejected) && evalType === "ONLINE");
      // 汇总统计
      const hiddenSummary = this.readOnly || !(isOnLine && [ "MANUAL_COMPLETE", "SYSTEM_COMPLETE" ].includes(reportStatus));
      // 提交审批
      const finalHide = [ "FINAL_COLLECTED" ].includes(reportStatus) && !this.viewScoreNextFlag; // 汇总完成需要先查看评分
      const hideSubmitApproval = finalHide || this.readOnly || !([ "FINAL_COLLECTED", "REJECTED" ].includes(reportStatus) || (isOnLine ? [ "FEEDBACK", "NEW" ].includes(reportStatus) && approvalMethod !== "SELF" : submitBtnFlag));
      // 查看评分
      const hideViewScore = !this.viewScoreFlag;
      // 发布
      const hiddenPublish = this.readOnly || !completeApprovaled;
      // 执行自评
      const hideExecutiveSelf = this.readOnly || (isOnLine ? !(needFeedbackFlag && (reportStatus === "NEW" && approvalMethod === "SELF" || newApprovaled)) : !(reportStatus === "NEW" && needFeedbackFlag));
      // 结果确认
      const hideResultConfirm = this.readOnly || isOnLine || !resultBtnFlag || this.preStepFlag;
      return [
        !hideViewScore && !hiddenPublish && {
          key: "viewScore",
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分"),
          handler: () => this.handleViewScore(true),
        },
        !hiddenPublish && {
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.publish").$D("发布"),
          handler: () => this.handleRelease(),
        },
        !hiddenSave && {
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("hzero.common.button.save").$D("保存"),
          handler: () => this.handleSaveAll(),
        },
        !hideResultConfirm && {
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.resultConfirmation").$D("结果确认"),
          handler: () => this.handleResultConfirm(),
        },
        !hideExecutiveSelf && {
          key: "submitApproval",
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.executiveSelfEvaluation").$D("执行自评"),
          handler: () => this.handleFeedBack(),
        },
        !hideSubmitApproval && {
          key: "submitApproval",
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.submitApproval").$D("提交审批"),
          handler: () => this.handleSubmit(),
        },
        !hideViewScore && hiddenPublish && {
          key: "viewScore",
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分"),
          handler: () => this.handleViewScore(true),
        },
        !hideExeScore && {
          type: "primary",
          fill: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.executiveScoring").$D("执行评分"),
          handler: () => this.handleExecutiveScoring(),
        },
        !hideBackScore && {
          key: "backScore",
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("sslm.common.view.button.backScore").$D("退回评分"),
          handler: () => {
            this.showBackScorePop();
          },
        },
        !hiddenSummary && {
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.summaryStatistics").$D("汇总统计"),
          handler: () => {
            const { hasCancelFlag } = this.basicInfo || {};
            const that = this;
            if (hasCancelFlag) {
              this.$dialog({
                title: this.$T("hzero.common.message.confirm.title").$D("提示"),
                content: this.$T("sslm.siteInvestigateReport.view.message.handleSumConfirm").$D("存在评分人放弃评分，请确认是否继续汇总？"),
                onOk() {
                  that.handleScoreSum();
                }
              });
            } else {
              that.handleScoreSum();
            }
          },
        },
        !hiddenDiscard && {
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("sslm.common.button.discard").$D("废弃"),
          handler: () => this.handleInvalid(),
        },
        !hiddenReturnSelfAssessment && {
          type: "primary",
          fill: false,
          bordered: true,
          title: this.$T("sslm.purchaserEvaluationDetail.button.header.executiveScoring.returnSelfAssessment").$D("退回自评"),
          handler: () => {
            this.backAssessmentFlag = true;
          },
        },
        !hideDelete && {
          type: "danger",
          fill: false,
          bordered: true,
          title: this.$T("hzero.common.button.delete").$D("删除"),
          handler: () => {
            // this.$dialog中，this的指向非当前页上下文，需要赋别名
            const that = this;
            this.$dialog({
              title: this.$T("hzero.common.message.confirm.title").$D("提示"),
              content: this.$T("sslm.purchaserEvaluationDetail.view.message.deleteConfirm").$D("确认删除？？"),
              onOk() {
                that.handleDeleteAll();
              }
            });
          },
        },
      ].filter(Boolean);
    },
  },
  async mounted() {
    this.$loading.show();
    try {
      await this.init();
    } catch (err) {
      this.$loading.hide();
    }
    this.$loading.hide();
  },
  methods: {
    // 个性化编码
    getCustomizeCode(tabCode, isEdit = true) {
      const customizeCodeList = {
        basic: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.BASIC" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.BASIC_VIEW",
        company: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.COMPANY" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.COMPANY_VIEW",
        supplier: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.SUPPLIER" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.SUPPLIER_VIEW",
        itemCategory: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ITEM" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ITEM_VIEW",
        assessmentPanel: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASS_PANEL" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASS_PANEL_VIEW",
        assessment: "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASSESSMENT",
        results: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.RESULTS" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.RESULTS_VIEW",
        reform: isEdit ? "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.REFORM" : "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.REFORM_VIEW",
      };
      return customizeCodeList[tabCode];
    },
    // 退回自评弹窗关闭回调
    changeVisible(visible) {
      this.backAssessmentFlag = visible;
    },
    // 质量整改跳转
    async toReformDetail(record, type = "view") {
      let toUrl;
      // 环境域名
      const environmentUrl = window.location.origin;
      // const environmentUrl = "https://mobile.dev.isrm.going-link.com";
      if (type === "view") {
        const { externalOrderId } = record;
        // 构造跳转地址
        const detailUrl = `/appCpra/#/QIReportInitiatedDetail?problemHeaderId=${externalOrderId}`;
        toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
      } else {
        this.$loading.show();
        await getRectificationItemsApi(record).then((reformRes) => {
          if (reformRes && !reformRes.failed) {
            const { externalOrderId } = reformRes || {};
            // 构造跳转地址
            const detailUrl = `/appCpra/#/QIReportCreationDetail?problemHeaderId=${externalOrderId}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
      if (toUrl) {
        this.detailPopup = this.$popup({
          title: this.$T("smbl.common.view.detail").$D("详情"),
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
        if (type !== "view") {
          this.reformDs.refresh();
        }
      }
    },
    // 退回自评回调
    async handleBack(reason) {
      const payload = await this.getSaveParams();
      if (payload) {
        backApi({
          ...payload,
          backReason: reason,
        }).then((res) => {
          if (res && !res.failed) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            this.basicDs.refresh();
          }
        });
      }
    },
    // 退回评分底部按钮
    getBackScoreButtons() {
      return [
        {
          text: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          fill: false,
          bordered: true,
          callback: () => this.backScoreModalRef.closePopup(),
        },
        {
          text: this.$T("smbl.common.button.confirm").$D("确定"),
          type: "primary",
          fill: true,
          disabled: (selected) => selected.length === 0,
          callback: async (selected) => {
            const { evalHeaderId } = this.basicInfo || {};
            // 是否跨页全选
            const checkAll = 0;
            // 获取勾选数据
            const checkData = selected.map((record) => record?.data);
            const payload = {
              evalHeaderId,
              // userId,
              // indicatorId,
              tenantId: SrmUtil.getTenantId(),
              selectAllFlag: checkAll ? 1 : 0,
              siteEvalLineResps: checkAll ? [] : checkData,
              // unChooseSiteEvalLineResps: unCheckData,
            };
            if (!isEmpty(checkData)) {
              await backScoreApi({ ...payload }).then((res) => {
                if (res && !res.failed) {
                  // this.init(true);
                  this.backScoreModalRef.closePopup();
                  this.$notification.open({
                    message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                    description: "",
                    class: "notification"
                  });
                  setTimeout(() => {
                    this.$router.push({
                      name: "PurEvaluationList",
                    });
                  }, 600);
                }
              });
            }
          },
        },
      ];
    },
    // 退回评分回调
    async showBackScorePop() {
      this.$loading.show();
      this.backScoreDs.reset();
      await this.backScoreDs.query();
      this.backScoreModalRef = this.$popup({
        title: this.$T("sslm.common.view.button.backScore").$D("退回评分"),
        showHeader: true,
        showClose: false,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <div>
          <srm-list
            scrollable
            dataSet={this.backScoreDs}
            columns={this.getBackScoreColumns}/>
          <div style={{ marginBottom:"70px" }} />
          <srm-list-bottom-bar dataSet={this.backScoreDs} buttons={this.getBackScoreButtons()}/>
        </div>
      });
      this.$loading.hide();
    },
    // ds校验具体报错
    getValidateErrorsDetail(dataSet, type) {
      let errorList = [];
      const validateErrors = dataSet.getValidateErrors();
      if (type === "FORM") {
        errorList = head(validateErrors)[1];
      } else if (type === "LIST") {
        const newList = [];
        forEach(validateErrors, (errors) => {
          forEach(errors[1], (err) => {
            newList.push(err);
          });
        });
        errorList = uniqBy(newList, "fieldCode");
      }
      const message = [];
      forEach(errorList, (err) => {
        message.push(err.fieldName);
      });
      this.$notification.open({
        message: this.$T("sslm.common.view.message.pleaseEnter").$D("请输入") + message.join("、"),
      });
      return false;
    },
    // 获取参数
    getSaveParams() {
      if (!this.basicDs.validate()) {
        return this.getValidateErrorsDetail(this.basicDs, "FORM");
      }
      if (!this.itemCategoryDs.validate()) {
        return this.getValidateErrorsDetail(this.itemCategoryDs, "LIST");
      }
      if (!this.assessmentPanelDs.validate()) {
        return this.getValidateErrorsDetail(this.assessmentPanelDs, "LIST");
      }
      if (!this.assessmentDs.validate()) {
        return this.getValidateErrorsDetail(this.assessmentDs, "LIST");
      }
      // 评估物料/品类信息
      const siteEvalItemCates = this.itemCategoryDs?.data || [];
      // 评估小组信息
      const siteEvalGroups = this.assessmentPanelDs?.data || [];
      // 评估信息
      const siteEvalLineList = this.assessmentDs?.records?.filter((filterItem) => filterItem.dirty).map((mapItem) => mapItem.data) || [];
      const saveHeaderData = this.basicDs?.current?.toData() || {};
      // 质量整改
      const siteEvalExternalOrders = this.reformDs?.data || [];
      const customizeUnitCode = [
        "SSLM.PURCHASER_ASSESS_DETAIL.EX_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.IN_ATT_FORM",
        "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATION_INFORMATION",
        "SSLM.PURCHASER_ASSESS_DETAIL.SCORE_INFORMATION",
        "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_TEAM",
        "SSLM.PURCHASER_ASSESS_DETAIL.ASSESSMENT_RESULT",
        "SSLM.PURCHASER_ASSESS_DETAIL.BASICINFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.COMPANY_INFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.SUPPLIER_INFO",
        "SSLM.PURCHASER_ASSESS_DETAIL.EVALUATE_MATERIALS_TABLE",
        "SSLM.PURCHASER_ASSESS_DETAIL.BTN_GROUP",
      ].join(",");
      return {
        ...saveHeaderData,
        siteEvalItemCates,
        siteEvalGroups,
        customizeUnitCode,
        internalAttachmentUuid: this.internalAttachmentUuid, // 采购方-内部附件
        externalAttachmentUuid: this.externalAttachmentUuid, // 采购方-内部附件
        siteEvalLineList,
        siteEvalExternalOrders,
      };
    },
    // 汇总统计回调
    handleScoreSum() {
      this.$loading.show();
      const { evalHeaderId } = this.basicInfo || {};
      summaryStatisticsApi({ evalHeaderId }).then((res) => {
        if (res && !res.failed) {
          this.init(true);
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 废弃回调
    handleInvalid() {
      this.$dialog({
        title: this.$T("hipspfm.common.message.tips").$D("提示"),
        content: this.$T("sslm.purchaserEvaluationDetail.view.message.destroyConfirm").$D("提示"),
        okText: this.$T("hipspfm.common.button.ok").$D("确认作废？"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk: () => {
          const { evalHeaderId } = this.basicInfo || {};
          detailInvalidApi({ evalHeaderId }).then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                description: "",
                class: "notification"
              });
              this.$router.push({
                name: "PurEvaluationList",
              });
            }
          });
        },
      });
    },
    // 删除单据回调
    handleDeleteAll() {
      const { evalHeaderId } = this.basicInfo || {};
      detailDeleteApi({ evalHeaderId }).then((res) => {
        if (res) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.$router.push({
            name: "PurEvaluationList",
          });
        }
      });
    },
    // 提交审批
    async handleSubmit() {
      const payload = await this.getSaveParams();
      if (payload) {
        this.$loading.show();
        return submitApprovalApi(payload)
          .then((res) => {
            if (res && !res.failed) {
              this.init(true);
              this.$notification.open({
                message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                description: "",
                class: "notification"
              });
              if (this.viewScoreRef) {
                this.viewScoreRef.closePopup();
              }
            }
          })
          .finally(() => {
            this.$loading.hide();
          });
      }
    },
    // 查看评分回调
    handleViewScore(btnFlag) {
      const { evalHeaderId, scorerId, scorerName } = this.basicInfo || {};
      if (btnFlag) {
        this.viewScoreNextFlag = true;
      }
      this.viewScoreRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <div >
          <PurEvaluationScoreDetail
            propEvalHeaderId={evalHeaderId}
            propStatus="view"
            propSource="manage"
            propScorerName={scorerName}
            propScorerId={String(scorerId)}
          />
          {btnFlag && <srm-bottom-handler btnArr={this.bottomBtn.filter((e) => [ "submitApproval", "backScore" ].includes(e.key)).reverse()}/>}
        </div>
      });
    },
    // 发布
    async handleRelease() {
      const payload = await this.getSaveParams();
      if (payload) {
        this.$loading.show();
        releaseApi(payload).then((res) => {
          if (res && !res.failed) {
            this.init(true);
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    // 执行自评回调
    async handleFeedBack() {
      const payload = await this.getSaveParams();
      if (payload) {
        this.$loading.show();
        handleFeedBackApi(payload).then((res) => {
          if (res && !res.failed) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
          }
        }).finally(() => {
          this.init(true);
          this.$loading.hide();
        });
      }
    },
    // 结果确认
    handleResultConfirm() {
      this.resultConfirm = true;
      this.preStepFlag = true;
    },
    // 全部保存回调
    async handleSaveAll() {
      const payload = await this.getSaveParams();
      if (payload) {
        this.$loading.show();
        saveAllApi(payload).then((res) => {
          if (res && !res.failed) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
          }
        }).finally(() => {
          this.init(true);
          this.$loading.hide();
        });
      }
    },
    // 执行评分回调
    async handleExecutiveScoring() {
      const payload = await this.getSaveParams();
      if (payload) {
        this.$loading.show();
        return executiveScoreApi(payload).then((res) => {
          if (res && !res.failed) {
            // this.init(true);
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              description: "",
              class: "notification"
            });
            this.$router.push({
              name: "PurEvaluationList",
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    // 刷新数据
    refreshDs() {
      this.basicDs.refresh();
      this.itemCategoryDs.refresh();
      this.assessmentPanelDs.refresh();
      this.assessmentDs.refresh();
      this.reformDs.refresh();
    },
    //初始化页面，获取基础信息、评估阶段
    async init(refreshAll = false) {
      let resInternalAttachmentUuid = null;
      let resExternalAttachmentUuid = null;
      let resSelfEvalAttachmentUuid = null;
      // 基本信息
      await getBasicInfoApi(this.evalHeaderId).then((res) => {
        if (res && !res.failed) {
          const { progressStatus, reportStatus, evalType } = res || {};
          const isOnLine = evalType === "ONLINE";
          const resultFlag = [ "EVAL_RESULT", "EVAL_PREPARE" ].includes(progressStatus);
          // 编辑标识
          this.isEditList = {
            basic: !this.readOnly && [ "EVAL_PREPARE", "EVAL_RESULT" ].includes(progressStatus) && [ "NEW", "REJECTED", "FINAL_COLLECTED" ].includes(reportStatus),
            basicDisabledFlag: [ "EVAL_RESULT" ].includes(progressStatus) && [ "FINAL_COLLECTED" ].includes(reportStatus),
            itemCategory: !this.readOnly && [ "EVAL_PREPARE" ].includes(progressStatus) && [ "NEW", "REJECTED", "APPROVED" ].includes(reportStatus),
            assessmentPanel: !this.readOnly && (isOnLine ?
              [ "NEW", "FEEDBACK", "APPROVED", "REJECTED", "FINAL_COLLECTED" ].includes(reportStatus) && [ "EVAL_PREPARE", "SUPPLIER_EVAL", "EVAL_RESULT" ].includes(progressStatus) || [ "SYSTEM_FAIL" ].includes(reportStatus) :
              [ "NEW" ].includes(reportStatus)
            ),
            assessment: !this.readOnly && [ "EVAL_PREPARE", "SUPPLIER_EVAL" ].includes(progressStatus) && [ "NEW", "REJECTED", "APPROVED", "FEEDBACK" ].includes(reportStatus),
            attachment: !this.readOnly && [ "NEW", "REJECTED", "APPROVED", "FEEDBACK", "FINAL_COLLECTED" ].includes(reportStatus) && progressStatus !== "EVAL_COMPLETE",
            results: !this.readOnly && ([ "NEW", "REJECTED", "FEEDBACK", "FINAL_COLLECTED" ].includes(reportStatus) || reportStatus === "APPROVED" && progressStatus !== "EVAL_COMPLETE"),
            reform: !this.readOnly && resultFlag && reportStatus !== "APPROVALING",
            reformIsView: !this.readOnly && resultFlag,
          };
          // 查看评分是否显示[汇总完成、评估完成阶段-审批通过、已发布 状态显示]
          this.viewScoreFlag = [ "FINAL_COLLECTED", "PUBLISHED" ].includes(reportStatus) || reportStatus === "APPROVED" && progressStatus === "EVAL_COMPLETE" && isOnLine;
          // 评估结果
          if ([ "EVAL_RESULT", "EVAL_COMPLETE" ].includes(progressStatus)) {
            if (evalType === "ONLINE") {
              this.hideResultsFlag = ![
                "FINAL_COLLECTED",
                "APPROVALING",
                "REJECTED",
                "APPROVED",
                "PUBLISHED",
                "FEEDBACK",
              ].includes(reportStatus);
            }
          } else {
            this.hideResultsFlag = true;
          }
          this.progressStatus = progressStatus;
          this.basicInfo = res;
          resInternalAttachmentUuid = res.internalAttachmentUuid;
          resExternalAttachmentUuid = res.externalAttachmentUuid;
          resSelfEvalAttachmentUuid = res.selfEvalAttachmentUuid;
          this.internalAttachmentUuid = resInternalAttachmentUuid || uuid();
          this.externalAttachmentUuid = resExternalAttachmentUuid || uuid();
          const { evalHeaderId } = (this.$route || {}).query;
          if (evalHeaderId) {
            this.evalHeaderId = evalHeaderId;
          }
        }
      });
      // 获取附件数量
      if (resInternalAttachmentUuid) {
        this.attachmentAllAmount.internalAmount = await this.getAttachmentNum(resInternalAttachmentUuid);
      }
      if (resExternalAttachmentUuid) {
        this.attachmentAllAmount.externalAmount = await this.getAttachmentNum(resExternalAttachmentUuid);
      }
      if (resSelfEvalAttachmentUuid) {
        this.attachmentAllAmount.selfEvalAmount = await this.getAttachmentNum(resSelfEvalAttachmentUuid);
      }
      // 单据阶段
      await getEvalReportStageApi().then((stepsRes) => {
        if (stepsRes && !stepsRes.failed) {
          const { needFeedbackFlag, evalType } = this.basicInfo || {};
          const resultStepsRes = stepsRes.map((i) => {
            if (i.progressStatus === "SUPPLIER_EVAL") {
              return { ...i, hidden: !needFeedbackFlag };
            }
            if (i.progressStatus === "INTERNAL_EVAL") {
              return { ...i, hidden: evalType !== "ONLINE" };
            }
            return { ...i, hidden: false };
          }).filter((n) => !n.hidden);
          const currentStepIndex = resultStepsRes.findIndex((i) => i.progressStatus === this.progressStatus);
          this.stageList = resultStepsRes.map((e, index) => ({
            nodeSeq: index + 1, // 节点序号
            nodeDes: e.progressStatusMeaning, // 节点描述
            nodeState: currentStepIndex === index ? 0 : index < currentStepIndex ? -1 : 1, // 节点状态
            // forbiddenState: index > currentStepIndex, // 节点禁用
            forbiddenState: true, // 节点禁用
          }));
        }
      });
      // 操作记录
      await getHistoricApi(this.evalHeaderId).then((res) => {
        if (res && !res.failed) {
          this.historicList = res.content || [];
        }
      });
      // 获取个性化单元信息,评估小组按钮个性化
      const unitCode = [ "SMBL.PUR_EVALUATION_WORKBENCH.MANAGE.DETAIL.ASS_PANEL_DETAIL.BTN" ];
      queryCustomizeApi(unitCode).then(async (res) => {
        if (res && !res.failed) {
          const btnCustomizeProperty = this.getFieldProperty(res, unitCode);
          this.assessmentPanelBtnCuz = btnCustomizeProperty;
        }
      });
      if (refreshAll) {
        this.refreshDs();
      }
    },
    /**
     * 获取个性化字段配置信息
     * data: 个性化数据
     * unitCode：单元编码
     */
    getFieldProperty(data, unitCode) {
      let property = {};
      if (data && data[unitCode]) {
        const unitCodeData = data[unitCode];
        forEach(unitCodeData.fields || [], (fiel) => {
          property[`${fiel.fieldCode}`] = fiel;
        });
      }
      return property;
    },
    async getAttachmentNum(attachmentUuid) {
      let attachmentAmount = 0;
      const params = {
        attachmentUuid: attachmentUuid,
        bucketName: SrmUtil.getDefaultBucketName(),
      };
      await getAttachedFile(params).then((res) => {
        if (res && !res.failed) {
          attachmentAmount = res.length;
        }
      });
      return attachmentAmount;
    },
    // 考察物料编辑按钮
    srmListButtons(type) {
      const { evalHeaderId } = this.basicInfo || {};
      switch (type) {
      case this.tabType.itemCategory:
      case this.tabType.assessmentPanel:
      case this.tabType.reform:
        return [ {
          text: this.$T("smbl.common.button.delete").$D("删除"),
          type: "danger",
          bordered: true,
          size: "small",
          visible: true,
          disabled: (records) => !records.length,
          callback: () => {
            this.handleDelete(type);
            this.handleEdit(this.tabType[`${type}`], false);
          }
        }, ];
      case this.tabType.assessment:
        return [ {
          text: this.$T("sslm.purchaserEvaluationDetail.button.header.assignRatersInBulk").$D("批量分配评分人"),
          type: "primary",
          bordered: true,
          size: "small",
          visible: true,
          disabled: (records) => !records.length,
          callback: () => {
            this.openAssignedRater({ evalHeaderId }, true);
          }
        }, ];
      default:
        break;
      }
    },
    // 附件回调
    handleAttachment(params) {
      const { attUuid, readonly } = params || {};
      this.$attachment({
        attachments: [
          {
            attachmentUuid: attUuid,
            title: this.$T("smbl.common.message.title.viewAttachment").$D("查看附件"),
            readonly: readonly, // 隐藏删除按钮
            showInfo: true,
            uploadButton: readonly ? "none" : "default", // 上传按钮
          },
        ],
        onFileUpload: () => {
          this.refreshDs();
        }
      });
    },
    // 新建回调
    handleCreate(type) {
      const { evalHeaderId } = this.basicInfo || {};
      switch (type) {
      case this.tabType.itemCategory:
        this.itemCategoryDs.create({
          evalHeaderId:evalHeaderId,
        }, 0);
        break;
      case this.tabType.assessmentPanel:
        this.assessmentPanelDs.create({
          evalHeaderId:evalHeaderId,
          userType:"PURCHASER",
          userTypeMeaning: this.$T("sslm.purchaserEvaluationDetail.view.message.purchaser").$D("采购方"),
        }, 0);
        break;
      case this.tabType.reform:
        this.reformDs.create({
          orderSource: "reportEval",
        }, 0);
        break;
      default:
        break;
      }
    },
    // 删除回调
    handleDelete(type) {
      switch (type) {
      case this.tabType.itemCategory:
        this.itemCategoryDs.removeSelect();
        break;
      case this.tabType.assessmentPanel:
        this.assessmentPanelDs.removeSelect().finally(() => {
          this.assessmentDs.refresh();
        });
        break;
      case this.tabType.reform:
        this.reformDs.removeSelect().finally(() => {
          this.reformDs.refresh();
        });
        break;
      default:
        break;
      }
    },
    // 页签保存回调
    handleSave(type) {
      this.handleEdit(this.tabType.type, false);
      switch (type) {
      case this.tabType.itemCategory:
        if (this.itemCategoryDs.validate()) {
          this.$loading.show();
          this.itemCategoryDs.submitRecords(this.itemCategoryDs.records);
          this.$loading.hide();
        }
        break;
      case this.tabType.assessmentPanel:
        if (this.assessmentPanelDs.validate()) {
          this.$loading.show();
          this.assessmentPanelDs.submitRecords(this.assessmentPanelDs.records).finally(() => {
            this.assessmentDs.refresh();
          });
          this.$loading.hide();
        }
        break;
      case this.tabType.assessment:
        this.saveAssessment();
        break;
      default:
        break;
      }
    },
    // 编辑回调
    handleEdit(type, editFlag) {
      switch (type) {
      case this.tabType.itemCategory:
        this.itemCategoryDs.editFlag = editFlag;
        break;
      case this.tabType.assessmentPanel:
        this.assessmentPanelDs.editFlag = editFlag;
        break;
      case this.tabType.assessment:
        this.assessmentDs.editFlag = editFlag;
        break;
      case this.tabType.reform:
        this.reformDs.editFlag = editFlag;
        break;
      default:
        break;
      }
    },
    // 评估信息保存回调
    saveAssessment() {
      const headerInfo = this.basicDs.current.data;
      const assessmentList = this.assessmentDs?.records?.filter((filterItem) => filterItem.dirty).map((mapItem) => mapItem.data);
      const params = {
        ...headerInfo,
        siteEvalLineList: assessmentList,
      };
      this.$loading.show();
      saveAssessmentApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          this.assessmentDs.refresh();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 查看评估策略
    handleEvaluationPolicy() {
      const { strategyId } = this.basicInfo || {};
      this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.button.header.viewEvaluationPolicy").$D("查看评估策略"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <EvaluationPolicy strategyId={String(strategyId)}/>,
      });

    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-detail-maintain {
  width: 100vw;
  height: 100vh;
  .srm-detail-wrap-header {}
  .srm-detail-wrap-context {
    .srm-detail-tab-item-buttons {
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
  }
}

.srm-attachment-flex {
  height: 60px;
  padding: 0 15px;
  .srm-attachment-title {
    margin-left: 16px;
  }
}
.srm-attachment-division {
  height: 1px;
  width: 100%;
  border: 1px solid #F6F6F6;
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

.srm-have-top-header {
  height: 150px;
}

</style>
