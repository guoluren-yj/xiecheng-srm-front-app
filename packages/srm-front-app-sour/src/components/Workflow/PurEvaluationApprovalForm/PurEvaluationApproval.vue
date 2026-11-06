
<template>
  <!-- 内容区域 -->
  <div class="srm-detail-wrap-context">
    <srm-scroll-tab>
      <!-- 评估结果 -->
      <srm-scroll-tab-item v-if="showResultsFlag" key="results" :label="$T('sslm.purchaserEvaluationDetail.form.label.resultsFlag').$D('评估结果')">
        <srm-list :scrollable="false" :data-set="basicDs" :columns="getResultsColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="basicInfo" :label="$T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息')" >
        <srm-list :scrollable="false" :data-set="basicDs" :columns="getBasicColumns" @itemClick="(record) => handleToDetail(record, 'basic')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="companyInfo" :label="$T('sslm.purchaserEvaluationDetail.view.content.companyInfo').$D('公司信息')" >
        <srm-list :scrollable="false" :data-set="basicDs" :columns="getCompanyColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item key="supplierInfo" :label="$T('sslm.purchaserEvaluationDetail.view.content.supplierInfo').$D('供应商信息')" >
        <srm-list :scrollable="false" :data-set="basicDs" :columns="getSupplierColumns" />
      </srm-scroll-tab-item>
      <!-- 评估物料/品类 -->
      <srm-scroll-tab-item key="itemCategoryInfo" :label="$T('sslm.purchaserEvaluationDetail.view.content.itemCategoryInfo').$D('评估物料/品类')">
        <srm-list v-if="itemCategoryDs" :data-set="itemCategoryDs" :scrollable="false" :columns="getItemCategoryColumns"/>
      </srm-scroll-tab-item>
      <!-- 评估小组 -->
      <srm-scroll-tab-item key="assessmentPanel" :label="$T('sslm.purchaserEvaluationDetail.view.content.assessmentPanel').$D('评估小组')">
        <srm-list v-if="assessmentPanelDs" :data-set="assessmentPanelDs" :scrollable="false" :columns="getAssessmentPanelColumns" />
      </srm-scroll-tab-item>
      <!-- 评估信息 -->
      <srm-scroll-tab-item v-if="isOnLine" key="assessmentInfo" :label="$T('sslm.purchaserEvaluationDetail.view.content.assessmentInfo').$D('评估信息')">
        <srm-list v-if="assessmentDs" :data-set="assessmentDs" :scrollable="false" :columns="getAssessmentColumns" :show-bottom-bar="false" />
      </srm-scroll-tab-item>
      <!-- 质量整改 -->
      <srm-scroll-tab-item v-if="showResultsFlag" key="reformContent" :label="$T('sslm.purchaserEvaluationDetail.view.content.reformContent').$D('质量整改')">
        <srm-list :scrollable="false" :data-set="reformDs" :columns="getReformColumns"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item v-if="basicInfo" key="externalAttachment" :label="$T('sslm.purchaserEvaluationDetail.view.feedback.content.externalAttachment').$D('附件信息')" >
        <div>
          <srm-flex justify="between" class="srm-attachment-flex" >
            <srm-flex-item>
              <div class="srm-attachment-flex-item" @click="handleAttachment({attUuid:basicInfo.internalAttachmentUuid, readonly: true })">
                <em class="srm-icon icon-other"/>
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.view.attachment.purchaseInternalAttachment").$D("内部附件-采购方附件") }}（{{ attachmentAllAmount.internalAmount }}）</span>
                <span class="srm-icon icon-chevron-right" />
              </div>
            </srm-flex-item>
          </srm-flex>
          <div class="srm-attachment-division"/>
          <srm-flex justify="between" class="srm-attachment-flex">
            <srm-flex-item>
              <div class="srm-attachment-flex-item" @click="handleAttachment({attUuid:basicInfo.externalAttachmentUuid, readonly: true})">
                <em class="srm-icon icon-other"/>
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.view.attachment.purchaseExternalAttachment").$D("外部附件-采购方附件") }}（{{ attachmentAllAmount.externalAmount }}）</span>
                <span class="srm-icon icon-chevron-right" />
              </div>
            </srm-flex-item>
          </srm-flex>
          <div class="srm-attachment-division"/>
          <srm-flex justify="between" class="srm-attachment-flex">
            <srm-flex-item>
              <div class="srm-attachment-flex-item" @click="handleAttachment({attUuid:basicInfo.selfEvalAttachmentUuid, readonly: true})">
                <em class="srm-icon icon-other"/>
                <span class="srm-attachment-title">{{ $T("sslm.purchaserEvaluationDetail.view.attachment.supplierExternalAttachment").$D("外部附件-供应商附件") }}（{{ attachmentAllAmount.selfEvalAmount }}）</span>
                <span class="srm-icon icon-chevron-right" />
              </div>
            </srm-flex-item>
          </srm-flex>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { yesOrNoRender } from "@/utils/sslmUtils.js";
import { renderPhone } from "@/utils/sslmUtils";
import IndicatorMaintain from "./component/IndicatorMaintain.vue";
import {
  getBasicInfoApi,
  getAttachedFile,
} from "./api";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import PurEvaluationScoreDetail from "@/modules/PurEvaluationWorkbench/views/PurEvaluationScoreDetail.vue";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { basicDS, itemCategoryDS, assessmentPanelDS, assessmentDS, reformDS, commonDs } from "./datasource";

export default {
  modules: [ "sslm.purchaserEvaluationDetail", "smbl.common", "sslm.common", "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluation", "hzero.common", "hipspfm.common", "sslm.siteInvestigateReport", "hzero.button" ],
  name: "PurEvaluationApproval",
  // eslint-disable-next-line vue/no-unused-components
  components: { HistoryRecordTiled, IndicatorMaintain, PurEvaluationScoreDetail },
  props: {
    parameters: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    const { evalHeaderId, type } = this.parameters || {};
    const isEvaluationResult = type === "evaluationResult";
    return {
      loading: false,
      evalHeaderId: evalHeaderId, // 单据头id
      isOnLine: false,
      evaluationResultFlag: isEvaluationResult, // 评估结果审批表单
      basicInfo:{}, // 基础信息
      basicDs: new DataSet(basicDS({ evalHeaderId })),
      itemCategoryDs: new DataSet(itemCategoryDS({ evalHeaderId })),
      assessmentPanelDs: new DataSet(assessmentPanelDS({ evalHeaderId })),
      assessmentDs: new DataSet(assessmentDS({ evalHeaderId })),
      reformDs: new DataSet(reformDS({ evalHeaderId })),
      attachmentAllAmount: {
        internalAmount: 0,
        externalAmount: 0,
        selfEvalAmount: 0,
      },
      hideResultsFlag: true, // 评估结果标识
      showViewScore: false, // 查看评分
    };
  },
  computed: {
    showResultsFlag() {
      return !this.hideResultsFlag || this.evaluationResultFlag;
    },
    // 基础信息
    getBasicColumns() {
      const columns = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
          render: (val) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize:"16px", color:"var(--color-font-default)" }}/>
          </SrmListHeader>,
        },
        {
          fieldCode: "evalNum",
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalNum").$D("评估报告编号"),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
          fieldCode: "strategyName",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.assessType").$D("评估类型"),
          fieldCode: "assessTypeMeaning",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.investigationType").$D("考察方式"),
          fieldCode: "investigationTypeMeaning",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalRemark").$D("评估说明"),
          fieldCode: "evalRemark",
        },
        this.showViewScore && {
          fieldName: $T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分"),
          fieldCode: "viewScore",
          render:() => <a style="color: var(--color-other-default-b);" onClick={(e) => this.handleViewScore(e)}>
            {this.$T("hzero.button.button.look").$D("查看")}
          </a>
        },
      ].filter(Boolean);
      return columns;
    },
    // 基础信息-详情
    getBasicDetailColumns() {
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDescription").$D("评估报告描述"),
          fieldCode: "evalDescription",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalNum").$D("评估报告编号"),
          fieldCode: "evalNum",
        },
        {
          fieldName: $T("hzero.common.status").$D("状态"),
          fieldCode: "reportStatusMeaning",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationType").$D("创建方式"),
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.documentOrigin").$D("来源单据"),
          fieldCode: "evalPlanNum",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.realName").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.unitName").$D("创建人部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.strategyName").$D("评估策略"),
          fieldCode: "strategyId",
          render: (val, record) => record.strategyName,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalTpl").$D("评分模板"),
          fieldCode: "evalTplId",
          render: (val, record) => record.evalTplName,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateFrom").$D("评估日期从"),
          fieldCode: "evalDateFrom",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalDateTo").$D("评估日期至"),
          fieldCode: "evalDateTo",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.investigationType").$D("考察方式"),
          fieldCode: "investigationType",
          render: (val, record) => record.investigationTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalRemark").$D("评估说明"),
          fieldCode: "evalRemark",
        },
      ];
      return columns;
    },
    // 公司信息
    getCompanyColumns() {
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.groupFlag").$D("是否集团级"),
          fieldCode: "groupFlag",
          render: (val) => yesOrNoRender(val),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.companyName").$D("公司"),
          fieldCode: "companyId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.companyName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.ouName").$D("业务实体"),
          fieldCode: "ouId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.ouName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.invOrganization").$D("库存组织"),
          fieldCode: "invOrganizationId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.organizationName
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.inventory").$D("库房"),
          fieldCode: "inventoryId",
          visible: (val, record) => record.strategyId ? Boolean(!Number(record.groupFlag)) : false,
          render: (val, record) => record.inventoryName
        },
      ];
      return columns;
    },
    // 供应商信息
    getSupplierColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "supplierCompanyId",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{record.supplierName}</span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierType").$D("供应商类型"),
          fieldCode: "supplierType",
          render: (val, record) => record.supplierTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierContactor",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "supplierContactPhone",
          render: (val, record) => renderPhone(record, val),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierEmail").$D("供应商联系邮箱"),
          fieldCode: "supplierContactMail",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierAddress").$D("供应商注册地址"),
          fieldCode: "supplierRegisteredAddress",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.supplierOverview").$D("供应商概况"),
          fieldCode: "supplierOverview",
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.evalAddress").$D("实际考察地址"),
          fieldCode: "evalAddress",
        },
      ];
      return columns;
    },
    // 评估物料/品类信息
    getItemCategoryColumns() {
      const columns = [
        {
          formRow: 10,
          fieldCode: "itemCode",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemCode").$D("物料编码"),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.itemName").$D("物料名称"),
          fieldCode: "itemName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldCode: "itemCategoryCode",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryCode").$D("品类编码"),
          formRow: 30,
          formCol: 10,
          disabled: (val, record) => record.itemCategoryCode,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.categoryName").$D("品类名称"),
          fieldCode: "itemCategoryName",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.brand").$D("品牌"),
          fieldCode: "brand",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 50,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 评估小组Columns
    getAssessmentPanelColumns() {
      const columns = [
        {
          formRow: 10,
          fieldCode: "userType",
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.userType").$D("代表方"),
          render: (val, record) => record.userTypeMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.supplierContacts").$D("供应商联系人"),
          fieldCode: "supplierUserId",
          formRow: 20,
          formCol: 10,
          render: (val, record) => record.member,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户"),
          fieldCode: "userId",
          formRow: 30,
          formCol: 10,
          render: (val, record) => record.loginName,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称"),
          fieldCode: "member",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.department").$D("部门"),
          fieldCode: "department",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.station").$D("岗位"),
          fieldCode: "post",
          formRow: 40,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.supplierTelephone").$D("供应商联系电话"),
          fieldCode: "phone",
          formRow: 50,
          formCol: 10,
          render: (val, record) => renderPhone(record, val),
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.email").$D("邮箱"),
          fieldCode: "email",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.isLeader").$D("是否组长"),
          fieldCode: "leaderFlag",
          render: (val) => yesOrNoRender(val),
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evaluationIndex").$D("评估指标"),
          fieldCode: "scoreStatus",
          formRow: 80,
          formCol: 20,
          render: (value, record) => {
            if (value) {
              return <a style="color: var(--color-other-default-b);" onClick={() => this.onEvaluationClick(record)}>
                {this.$T("hzero.button.button.look").$D("查看")}
              </a>;
            }
            return "-";
          },
        },
      ];
      return columns;
    },
    // 评估信息Columns
    getAssessmentColumns() {
      const { needFeedbackFlag, progressStatus, evalType, selfIndicatorType } = this.basicInfo || {};
      // 评估策略为勾选‘按照指标类型自评’，‘供应商自评’且为线上打分，显示字段
      const showSelfEvaluation = evalType === "ONLINE" && needFeedbackFlag && selfIndicatorType;
      const columns = [
        {
          fieldCode: "indicatorName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            {this.showResultsFlag && <span slot="right">
              <SrmTag type="success">
                {$T("sslm.common.model.archiveFilled.score").$D("得分")}:{record.finalScore}
              </SrmTag>
            </span>}
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码"),
          fieldCode: "indicatorCode",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.scoreType").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorType").$D("评估项目类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evalStandard").$D("评分标准"),
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
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.evalWeight").$D("指标权重"),
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
            return flag ? "-" : <a style="color: var(--color-other-default-b);" onClick={(e) => {
              e.stopPropagation();
              this.viewIndicatorStatus(record, false);
            }}>
              { this.$T("smbl.common.view.button.view").$D("查看") }
            </a>;
          }
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.chidrenMaintain").$D("下级指标"),
          fieldCode: "chidrenMaintain",
          fieldType: "TEXT",
          formRow: 130,
          formCol: 10,
          render: (val, record) => <a
            style="color: var(--color-other-default-b);"
            onClick={() => {
              this.maintainChildrenAction(record);
            }}>
            {this.$T("smbl.common.view.button.view").$D("查看")}
          </a>,
        }
      ];
      return columns;
    },
    // 评估结果
    getResultsColumns() {
      const columns = [
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.finalScore").$D("最后得分"),
          fieldCode: "finalScore",
          formRow: 10,
          formCol: 10,
        },
        SrmUtil.getTenantNum() === "SRM-ZMC" && {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.approvedProduct").$D("准入产品"),
          fieldCode: "attributeLongtext1",
          formRow: 15,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.level").$D("等级"),
          fieldCode: "grade",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultsFlag").$D("评估结果"),
          fieldCode: "resultsFlag",
          formRow: 20,
          formCol: 20,
          render: (val, record) => record.resultsFlagMeaning,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.opinion").$D("综合意见"),
          fieldCode: "opinion",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.common.model.field.ratersSynthesizeOpinions").$D("评分人综合意见"),
          fieldCode: "respUserRemarks",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.sendTo").$D("抄送"),
          fieldCode: "sendTo",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.form.label.resultLinkAtt").$D("审查结果附件"),
          fieldCode: "resultLinkUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          formRow: 60,
          formCol: 10,
        },
      ];
      return columns;
    },
    // 质量整改
    getReformColumns() {
      const columns = [
        // {
        //   fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemStatusMeaning").$D("单据状态"),
        //   fieldCode: "problemStatusMeaning",
        // },
        // {
        //   fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemNum").$D("整改报告编号"),
        //   fieldCode: "problemNum",
        //   render: (val, record) => {
        //     if (val) {
        //       return <srm-button plain={true} onClick={(e) => {
        //         e.stopPropagation();
        //         this.toReformDetail(record);
        //       }}>
        //         { val }
        //       </srm-button>;
        //     }
        //     return "-";
        //   }
        // },
        // {
        //   fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.problemTitle").$D("整改报告标题"),
        //   fieldCode: "problemTitle",
        // },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.scoreTable.label.reformContent").$D("整改内容"),
          fieldCode: "reformContent",
        },
      ];
      return columns;
    },
    // 评估指标pop信息Columns
    getEvaluationColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            <span slot="right">
              <SrmTag type="success">{record.completeFlagMeaning}</SrmTag>
            </span>
          </SrmListHeader>,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.respWeight").$D("评分人权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
          render: (val) => `${val}%`
        },
        {
          fieldName: $T("sslm.common.model.archiveFilled.score").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
      ];
      return columns;
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
    //初始化页面
    async init() {
      let resInternalAttachmentUuid = null;
      let resExternalAttachmentUuid = null;
      let resSelfEvalAttachmentUuid = null;
      // 基本信息
      await getBasicInfoApi(this.evalHeaderId).then((res) => {
        if (res && !res.failed) {
          const { progressStatus, reportStatus, evalType } = res || {};
          this.isOnLine = evalType === "ONLINE";
          // 查看评分显示标识
          this.showViewScore = reportStatus === "APPROVALING" && progressStatus === "EVAL_RESULT" && evalType === "ONLINE";
          // 编辑标识
          this.basicInfo = res;
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
            } else {
              this.hideResultsFlag = false;
            }
          } else {
            this.hideResultsFlag = true;
          }
          resInternalAttachmentUuid = res.internalAttachmentUuid;
          resExternalAttachmentUuid = res.externalAttachmentUuid;
          resSelfEvalAttachmentUuid = res.selfEvalAttachmentUuid;
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
    },
    // 查看评分回调
    handleViewScore(e) {
      e.stopPropagation();
      const { evalHeaderId, scorerId, scorerName } = this.basicInfo || {};
      this.viewScoreRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.button.header.viewScore").$D("查看评分"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content:
          <PurEvaluationScoreDetail
            propEvalHeaderId={evalHeaderId}
            propStatus="view"
            propSource="manage"
            propScorerName={scorerName}
            propScorerId={String(scorerId)}
          />
      });
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
    // 质量整改跳转
    async toReformDetail(record) {
      let toUrl;
      // 环境域名
      const environmentUrl = window.location.origin;
      const { externalOrderId } = record;
      // 构造跳转地址
      const detailUrl = `/appCpra/#/QIReportInitiatedDetail?problemHeaderId=${externalOrderId}`;
      toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
      if (toUrl) {
        this.detailPopup = this.$popup({
          title: this.$T("smbl.common.view.detail").$D("详情"),
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
      }
    },
    // 跳转详情页
    handleToDetail(recordData, tabType) {
      const record = recordData.data;
      let columns = [];
      switch (tabType) {
      case "basic":
        columns = this.getBasicDetailColumns;
        break;
      default:
        return false;
      }
      const params = {
        dataSet: record,
        columns: columns,
      };
      this.goToDetail(params);
    },
    // 更多详情
    goToDetail(params) {
      const { customizeCode = "", dataSet, columns } = params || {};
      this.$popup({
        showHeader: false,
        position: "right",
        content: <customize-detail
          style="padding: 0 15px"
          code={customizeCode}
          columns={columns}
          dataSource={dataSet}/>
      });
    },
    // 评估指标回调
    onEvaluationClick(record) {
      const evaluationDataSet = new DataSet(commonDs());
      const { siteEvalLineResps, loginName, member } = record || {};
      evaluationDataSet.setData(siteEvalLineResps || []);
      this.$popup({
        title: $T("sslm.purchaserEvaluationDetail.view.content.assessmentPanel").$D("评估小组"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <div class="srm-assessment-panel">
          <customize
            need-padding
            dataSource={{ loginName, member }}
            columns={[
              {
                fieldCode:"loginName",
                formRow:10,
                formCol:1,
                fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.Account").$D("账户")
              },
              {
                fieldCode:"member",
                formRow:10,
                formCol:2,
                fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.member").$D("名称")
              },
            ]}/>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            columns={this.getEvaluationColumns}
            dataSet={evaluationDataSet}/>
        </div>,
      });
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
            columns={[
              {
                fieldCode:"indicatorCode",
                formRow:10,
                formCol:1,
                fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorCode").$D("评估项目代码")
              },
              {
                fieldCode:"indicatorName",
                formRow:10,
                formCol:2,
                fieldName: $T("sslm.purchaserEvaluationDetail.table.column.label.indicatorName").$D("评估项目名称")
              },
            ]}/>
          <div class="srm-assessment-panel-division"/>
          <srm-list
            columns={this.getIndicatorColumns}
            dataSet={indicatorDataSet}/>
        </div>,
      });
    },
    // 下级指标
    maintainChildrenAction(record, editFlag) {
      this.maintainPopRef = this.$popup({
        title: this.$T("sslm.purchaserEvaluationDetail.view.content.assessmentInfo").$D("评估信息"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <IndicatorMaintain
          indicatorInfo={record}
          basicDs={this.basicDs}
          editFlag={editFlag}
          on-closeIndicatorMaintainPop={() => {
            this.maintainPopRef?.closePopup();
            this.assessmentDs.refresh();
            this.assessmentPanelDs.refresh();
          }}/>,
      });
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
  display: flex;
  >>> .srm-flex-item{
    flex:1;
  }
  .srm-attachment-flex-item{
    height: 60px;
    display: flex;
    align-items: center;
    .srm-icon.icon-other{
      color: #febf43;
      font-size: 28px;
    }
    .srm-attachment-title{
      font-size:14px;
      margin-left:8px;
    }
    .srm-icon.icon-chevron-right{
      margin-left:auto;
    }
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
