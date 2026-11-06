<template>
  <srm-scroll-tab content-scroll customize-code="SMBL.WORKFLOW.RELATED_FORM.TABS">
    <srm-scroll-tab-item code="investigate" :label="$T('sslm.common.view.title.investigate').$D('调查表')">
      <srm-list :scrollable="false"
                :data-set="investigateDataSet"
                :columns="getInvestigateColumns()"
                @itemClick="onInvestigateItemClick"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="sample" :label="$T('sslm.common.view.title.sample').$D('送样申请')">
      <srm-list :scrollable="false"
                :data-set="sampleSendReqDataSet"
                :columns="getSampleSendReqColumns()"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="siteInspection" :label="$T('sslm.common.view.title.siteInspection').$D('现场考察')">
      <srm-list :scrollable="false"
                :data-set="siteEvalDataSet"
                :columns="getSiteEvalColumns()"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="evaluation" :label="$T('sslm.common.view.title.evaluation').$D('绩效考评')">
      <srm-list :scrollable="false"
                :data-set="evaluationDataSet"
                :columns="getEvaluationColumns()"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="supplierEvaluationReport" :label="$T('sslm.common.view.title.supplierEvaluationReport').$D('供应商评估')">
      <srm-list :scrollable="false"
                :data-set="assessmentDataSet"
                :columns="getAssessmentColumns()"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="agreement" :label="$T('sslm.common.view.title.agreement').$D('协议')">
      <srm-list :scrollable="false"
                :data-set="purchaseContractDataSet"
                :columns="getPcColumns()"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="inquiry" :label="$T('sslm.common.view.title.inquiry').$D('询价单')">
      <srm-list :scrollable="false"
                :data-set="inquiryDataSet"
                :columns="getInquiryColumns()"
                @itemClick="onInquiryItemClick"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="bid" :label="$T('sslm.common.view.title.bid').$D('招投标')">
      <srm-list :scrollable="false"
                :data-set="bidDataSet"
                :columns="getBidColumns()"
                @itemClick="onBidItemClick"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="rectify" :label="$T('sslm.common.view.title.rectify').$D('整改单')">
      <srm-list :scrollable="false"
                :data-set="rectifyDataSet"
                :columns="getRectifyColumns()"
                @itemClick="onRectifyItemClick"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="material" :label="$T('sslm.common.view.title.material').$D('物料认证')">
      <srm-list :scrollable="false"
                :data-set="materialDataSet"
                :columns="getMaterialColumns()"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import ContractForm from "../../modules/Contract/views/ContractDetail";
import RfxHallForm from "@/modules/RfxHall/views/RfxDetail.vue";
import BidHallForm from "@/modules/NewBidHall/views/HallDetail.vue";
import InvestigateForm from "./InvestigateForm";
import EvaluationForm from "../../modules/EvaluateArchives/views/EvaluateArchivesManageDetail";
import SiteEvalForm from "../../modules/SiteInvestigationReport/views/SiteInvestigationReportDetailMaintain";
import PurEvaluationManageDetail from "../../modules/PurEvaluationWorkbench/views/PurEvaluationManageDetail";
import investigateDS from "./datasource/investigateDS";
import sampleSendReqDS from "./datasource/sampleSendReqDS";
import siteEvalDS from "./datasource/siteEvalDS";
import purchaseContractDS from "./datasource/purchaseContractDS";
import pcStageDS from "./datasource/pcStageDS";
import pcReceiptDS from "./datasource/pcReceiptDS";
import evaluationDS from "./datasource/evaluationDS";
import assessmentDS from "./datasource/assessmentDS";
import inquiryDS from "./datasource/inquiryDS";
import bidDS from "./datasource/bidDS";
import { rectifyDS, rectifyReportDS } from "./datasource/rectifyDS";
import materialDS from "./datasource/materialDS";
import { evaluationStatusMap, inquiryStatusMap, rectifyStatusMap, materialStatusMap } from "./utils";

export default {
  modules: [ "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.common", "spcm.purchaseContractView", "spcm.contractTemplate", "spcm.purchaseContractType", "sslm.investigationCorrelation", "sslm.supplierDetail", "smbl.common", "sslm.evaluationQuery", "sslm.commonApplication", "sslm.supplierDocManage", "sslm.evaluationRecord", "sslm.supplierManage", "sslm.workbench", "sslm.evaluationTemplate", "ssrc.inquiryHall", "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "entity.roles", "hzero.common", "sslm.material", "hipspfm.common", "spcm.purchaseRequisitionCreation", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "small.common", "entity.attachment", "sqam.inquiryHall", "sagm.common", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "ssrc.queryRfq", "hipspfm.expertScoring", "hipspfm.workFlow", "hipspfm.invoiceBill", "ssrc.bidHall", "smbl.inquiryHall", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "smbl.small", "sslm.evaluationStrategyDetail" ],
  name: "SupplierRelatedForm",
  props: {
    supplierCompanyId: {
      type: String | Number,
      default: null
    },
    toStageId: {
      type: String | Number,
      default: null
    },
    requisitionId: {
      type: String | Number,
      default: null
    },
    // 判断是从360还是其他页面点击关联单据按钮
    isLifeCyclesSummaryFlag:{
      type: String | Number,
      default: 0
    },
    companyId:{
      type: String | Number,
      default: null
    },
    parentRouter:{
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      investigateDataSet: new DataSet(investigateDS()),
      sampleSendReqDataSet: new DataSet(sampleSendReqDS()),
      siteEvalDataSet: new DataSet(siteEvalDS()),
      purchaseContractDataSet: new DataSet(purchaseContractDS()),
      pcStageDataSet: new DataSet(pcStageDS()),
      pcReceiptDataSet: new DataSet(pcReceiptDS()),
      evaluationDataSet: new DataSet(evaluationDS()),
      assessmentDataSet: new DataSet(assessmentDS()),
      inquiryDataSet: new DataSet(inquiryDS()),
      bidDataSet: new DataSet(bidDS()),
      rectifyDataSet: new DataSet(rectifyDS()),
      materialDataSet: new DataSet(materialDS()),
      rectifyReportDataSet: new DataSet(rectifyReportDS()),
      statusColorMap: {
        NEW: "warn",
        RELEASE: "warn",
        SUBMIT: "warn",
        APPROVING: "warn",
        APPROVE: "success",
        REJECT: "danger",
        CANCEL: "info",
        FEEDBACKED: "warn", //待确认
        PUBLISHED: "warn", //待反馈
        RELEASE_APPROVING: "warn", //审批中
        APPROVED: "success",
        MANUAL_EVALUATING: "warn",
      }
    };
  },
  beforeMount() {
    this.investigateDataSet.addQueryParameter("partnerCompanyId", this.supplierCompanyId);
    this.sampleSendReqDataSet.addQueryParameter("supplierId", this.supplierCompanyId);
    this.siteEvalDataSet.addQueryParameter("supplierCompanyId", this.supplierCompanyId);
    this.purchaseContractDataSet.addQueryParameter("supplierCompanyId", this.supplierCompanyId);
    this.purchaseContractDataSet.addQueryParameter("toStageId", this.toStageId);
    this.purchaseContractDataSet.addQueryParameter("requisitionId", this.requisitionId);
    this.evaluationDataSet.setQueryParameter({
      companyId: this.companyId,
      isLifeCyclesSummaryFlag: this.isLifeCyclesSummaryFlag,
      pageEntryPoint: "CUSTOMER_OWNED",
      supplierId: this.supplierCompanyId,
    });
    this.assessmentDataSet.setQueryParameter({
      companyId: this.companyId,
      isLifeCyclesSummaryFlag: 1,
      supplierCompanyId: this.supplierCompanyId,
    });
    this.inquiryDataSet.setQueryParameter({
      companyId:this.companyId,
      supplierCompanyId: this.supplierCompanyId,
    });
    this.bidDataSet.setQueryParameter({
      companyId:this.companyId,
      supplierCompanyId: this.supplierCompanyId,
      secondarySourceCategory: "NEW_BID",
    });
    this.rectifyDataSet.setQueryParameter({
      companyId:this.companyId,
      supplierCompanyId: this.supplierCompanyId,
      pageEntryPoint: "CUSTOMER_OWNED",
    });
    this.materialDataSet.setQueryParameter({
      companyId:this.companyId,
      supplierCompanyId: this.supplierCompanyId,
    });
  },
  methods: {
    commonDs () {
      return {
        autoQuery: false,
        editable: false,
        enableQuery: false,
        selection: Infinity,
        transport: {
          read: {
            url: "",
            method: "",
          },
        },
      };
    },
    onViewClick(record) {
      const viewDetailDs = new DataSet(this.commonDs());
      viewDetailDs.setData(record || []);
      this.$popup({
        title: this.$T("ssrc.inquiryHall.model.inquiryHall.implementation").$D("执行情况"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmList
          style="padding: 0 15px;"
          customizeType="detail"
          customizeCode=""
          columns={this.getViewDetailColumns()}
          dataSet={viewDetailDs}/>
      });
    },
    onPcStageClick(val) {
      this.pcStageDataSet.addQueryParameter("pcHeaderId", val);
      this.$popup({
        title: this.$T("spcm.common.view.message.title.contractStage").$D("协议阶段"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <SrmList
          dataSet={this.pcStageDataSet}
          columns={this.getPcStageColumns()}/>,
      });
    },
    onPcReceiptClick(val) {
      this.pcReceiptDataSet.addQueryParameter("pcHeaderId", val);
      this.$popup({
        title: this.$T("spcm.common.model.common.contractAcceptListNum").$D("协议验收单据"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <SrmList
          dataSet={this.pcReceiptDataSet}
          columns={this.getPcReceiptColumns()}/>,
      });
    },
    onInvestigateItemClick() {
      this.$popup({
        title: this.$T("sslm.investigationCorrelation.view.message.detail.title").$D("调查表明细"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          customizeCode="SMBL.WORKFLOW.SUPPLIER_LIFECIRCLE.INVESTIGATE_DETAIL"
          columns={this.getInvestigateDetailColumns()}
          dataSet={this.investigateDataSet}/>,
      });
    },
    onInvestigateNumClick(item = {}) {
      const { investgHeaderId, investigateTemplateId, investgNumber } = item;
      this.$popup({
        title: `${this.$T("sslm.common.view.title.investigate").$D("调查表")}-${investgNumber}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <InvestigateForm
          investgHeaderId={investgHeaderId}
          investigateTemplateId={investigateTemplateId}/>,
      });
    },
    onEvaluationDetail(record) {
      const { evalHeaderId, evalGranularity } = record;
      this.$popup({
        title: `${this.$T("sslm.common.view.title.evaluationDetail").$D("绩效考评明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <EvaluationForm
          evalHeaderId={evalHeaderId}
          evalGranularity={evalGranularity}
          readOnly
        />,
      });
    },
    onAssessmentDetail(record) {
      const { evalHeaderId } = record;
      // eslint-disable-next-line vue/no-mutating-props
      this.$popup({
        title: `${this.$T("sslm.common.view.title.purEvaluation").$D("供应商评估明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <PurEvaluationManageDetail
          newStatus="view"
          newEvalHeaderId={evalHeaderId}
        />,
      });
    },
    onSiteEvalDetail(record) {
      const { evalNum, evalHeaderId } = record;
      this.$popup({
        title: `${this.$T("sslm.common.view.title.siteEvalDetail").$D("现场考察明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SiteEvalForm
          viewFlag
          evalNum={evalNum}
          evalHeaderId={evalHeaderId}
        />,
      });
    },
    onContractDetail(record) {
      const { pcHeaderId } = record;
      this.$popup({
        title: `${this.$T("sagm.common.view.workbenchTabKey.protocolDetail").$D("协议明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <ContractForm
          changeReqId={pcHeaderId}
        />,
      });
    },
    onInquiryDetail(record) {
      const { rfxHeaderId } = record;
      this.$popup({
        title: `${this.$T("ssrc.inquiryHall.view.message.title.RFQDetail").$D("询价单明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <RfxHallForm
          changeReqId={rfxHeaderId}
        />,
      });
    },
    onBidDetail(record) {
      const { rfxHeaderId } = record;
      this.$popup({
        title: `${this.$T("ssrc.inquiryHall.view.message.bidHallTitle").$D("招投标明细")}`,
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <BidHallForm
          changeReqId={rfxHeaderId}
          changeDocumentType= "BID"
        />,
      });
    },
    onInquiryItemClick() {
      this.$popup({
        title: this.$T("ssrc.inquiryHall.view.message.inquiryHallTitle").$D("询价单明细"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          customizeCode=""
          columns={this.getInquiryDetailColumns()}
          dataSet={this.inquiryDataSet}/>,
      });
    },
    onBidItemClick() {
      this.$popup({
        title: this.$T("ssrc.inquiryHall.view.message.bidHallTitle").$D("招投标明细"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          customizeCode=""
          columns={this.getBidDetailColumns()}
          dataSet={this.bidDataSet}/>,
      });
    },
    onRectifyItemClick() {
      this.$popup({
        title: this.$T("sqam.common.view.message.rectifyTitle").$D("整改单明细"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          customizeCode=""
          columns={this.getRectifyDetailColumns()}
          dataSet={this.rectifyDataSet}/>,
      });
    },
    onMaterialDetail(record) {
      if (this.parentRouter && this.parentRouter.push) {
        const {
          nodeCode,
          itemAuthReqHeaderId
        } = record;
        // eslint-disable-next-line vue/no-mutating-props
        this.parentRouter.push({
          path: "/appCpra/MaterialCertificationDetail",
          query: {
            node:nodeCode,
            itemAuthReqHeaderId,
          }
        });
      }
    },
    onRectifyReport(record) {
      this.rectifyReportDataSet.addPathParameter("problemHeaderId", record.problemHeaderId);
      this.rectifyReportDataSet.refresh();
      this.$popup({
        title: this.$T("sqam.common.model.qualityRectification.relatedRectification").$D("关联整改报告"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        height: "70vh",
        rounded: true,
        content: <SrmList
          scrollable={false}
          dataSet={this.rectifyReportDataSet}
          columns={this.getRectifyReportColumns()}
        />,
      });
    },
    getPcStageColumns() {
      return [ {
        formRow: 1,
        fieldCode: "stageName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false}>
          <span>{val}</span>
          <span slot="right">{data.stageCode}</span>
        </SrmListHeader>,
      }, {
        formRow: 2,
        fieldCode: "milestoneTime",
      }, {
        formRow: 3,
        fieldCode: "supplierCurrencyName",
      }, {
        formRow: 4,
        fieldCode: "purchaseCurrencyName",
      }, {
        formRow: 5,
        fieldCode: "exchangeRate",
      }, {
        formRow: 6,
        fieldCode: "costQuantity",
      }, {
        formRow: 7,
        fieldCode: "termName",
      }, {
        formRow: 8,
        fieldCode: "remark",
      }, {
        formRow: 9,
        fieldCode: "acceptStatusMeaning",
      }, {
        formRow: 10,
        fieldCode: "acceptListNum",
      }, ];
    },
    getPcReceiptColumns() {
      return [ {
        formRow: 1,
        fieldCode: "title",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false}>
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={this.statusColorMap[data.statusCode] || "primary"}>
            {data.statusCodeMeaning}
          </SrmButton>
        </SrmListHeader>,
      }, {
        formRow: 2,
        fieldCode: "lineNum",
      }, {
        formRow: 3,
        fieldCode: "acceptListNum",
      }, {
        formRow: 4,
        fieldCode: "acceptedQuantity",
      }, {
        formRow: 5,
        fieldCode: "acceptorName",
      }, {
        formRow: 6,
        fieldCode: "acceptDate",
      }, ];
    },
    getInvestigateDetailColumns() {
      return [ {
        fieldCode: "investgNumber",
      }, {
        fieldCode: "processStatusMeaning",
      }, {
        fieldCode: "companyNum",
      }, {
        fieldCode: "companyName",
      }, {
        fieldCode: "partnerCompanyNum",
      }, {
        fieldCode: "partnerCompanyName",
      }, {
        fieldCode: "processStatusMeaning",
      }, {
        fieldCode: "templateName",
      }, {
        fieldCode: "investigateTypeMeaning",
      }, {
        fieldCode: "investigateLevelMeaning",
      }, {
        fieldCode: "createUserName",
      }, {
        fieldCode: "releaseDate",
      }, {
        fieldCode: "createDate",
      }, ];
    },
    getInvestigateColumns() {
      return [ {
        formRow: 1,
        fieldCode: "templateName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader>
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={this.statusColorMap[data.processStatus] || "primary"}>
            {data.processStatusMeaning}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 2,
        fieldCode: "investgNumber",
        render: (val, item) => <SrmButton
          plain rect
          onClick={() => this.onInvestigateNumClick(item)}>{val}
        </SrmButton>,
      }, {
        formRow: 3,
        fieldCode: "companyNum",
        render: (val) => val || "-",
      }, {
        formRow: 4,
        fieldCode: "companyName",
        render: (val) => val || "-",
      }, {
        formRow: 5,
        fieldCode: "investigateTypeMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 5,
        fieldCode: "investigateLevelMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 6,
        fieldCode: "createUserName",
        render: (val) => val || "-",
      }, {
        formRow: 7,
        fieldCode: "createDate",
      }, {
        formRow: 8,
        fieldCode: "releaseDate",
      }, ];
    },
    getSampleSendReqColumns() {
      return [ {
        formRow: 1,
        fieldCode: "reqNum",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false}>
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={this.statusColorMap[data.reqStatus] || "primary"}>
            {data.reqStatusMeaning}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 2,
        fieldCode: "companyName",
        render: (val) => val || "-",
      }, {
        formRow: 3,
        fieldCode: "typeCodeMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 3,
        fieldCode: "urgencyDegreeMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 5,
        fieldCode: "originFactoryName",
        render: (val) => val || "-",
      }, {
        formRow: 6,
        fieldCode: "creationDate",
      }, {
        formRow: 7,
        fieldCode: "releaseDate",
      }, ];
    },
    getSiteEvalColumns() {
      return [ {
        formRow: 1,
        fieldCode: "evalTplName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false}>
          <span>{val || "-"}</span>
          <SrmButton slot="right" plain rect type={this.statusColorMap[data.evalStatus] || "primary"}>
            {data.evalStatusMeaning}
          </SrmButton>
        </SrmListHeader>,
      }, {
        formRow: 2,
        fieldCode: "evalNum",
        render: (val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.onSiteEvalDetail(record)}>{val}</a>,
      }, {
        formRow: 3,
        fieldCode: "evalDescription",
      }, {
        formRow: 4,
        fieldCode: "companyName",
      }, {
        formRow: 5,
        fieldCode: "evalTplName",
      }, {
        formRow: 6,
        fieldCode: "finalScore",
      }, {
        formRow: 6,
        fieldCode: "grade",
      }, {
        formRow: 8,
        fieldCode: "realName",
      }, {
        formRow: 9,
        fieldCode: "creationDate",
      }, ];
    },
    getEvaluationColumns() {
      return [ {
        formRow: 10,
        fieldCode: "evalTplName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false} >
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={evaluationStatusMap[data.evalStatus] || "warn"}>
            {data.evalStatusMeaning}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 20,
        fieldCode: "evalNum",
        render: (val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.onEvaluationDetail(record)}>{val}</a>,
      }, {
        formRow: 30,
        fieldCode: "evalName",
        render: (val) => val || "-",
      }, {
        formRow: 40,
        fieldCode: "kpiMethodMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 40,
        fieldCode: "evalCycleMeaning",
        render: (val) => val || "-",
      }, {
        formRow: 50,
        fieldCode: "evalDateFrom",
        render:(val) => SrmUtil.dateFormat(val, "yyyy-MM-dd"),
      }, {
        formRow: 60,
        fieldCode: "evalDateTo",
        render:(val) => SrmUtil.dateFormat(val, "yyyy-MM-dd"),
      }, {
        formRow: 70,
        fieldCode: "evalDimensionMeaning",
      },
      {
        formRow: 80,
        fieldCode: "evalDimensionValueMeaning",
      },
      {
        formRow: 90,
        fieldCode: "levelCodes",
      },
      {
        formRow: 100,
        fieldCode: "processUserName",
      },
      {
        formRow: 110,
        fieldCode: "creationDate",
      }, ];
    },
    getAssessmentColumns() {
      return [ {
        formRow: 10,
        fieldCode: "strategyName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false} >
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={evaluationStatusMap[data.evalStatus] || "warn"}>
            {data.reportStatusMeaning}
          </SrmButton>
        </SrmListHeader>
      }, {
        formRow: 20,
        fieldCode: "evalNum",
        render: (val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.onAssessmentDetail(record)}>{val}</a>,
      },
      {
        formRow: 30,
        fieldCode: "evalDescription",
      }, {
        formRow: 30,
        fieldCode: "groupFlag",
        render: (val) => <span>{val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否")}</span>,
      }, {
        formRow: 40,
        fieldCode: "companyName",
        visible:(val, record) => !record.groupFlag,
      }, {
        formRow: 50,
        fieldCode: "supplierCompanyName",
      }, {
        formRow: 60,
        fieldCode: "resultsFlagMeaning",
      }, {
        formRow: 60,
        fieldCode: "finalScore",
      },
      {
        formRow: 70,
        fieldCode: "grade",
      },
      {
        formRow: 80,
        fieldCode: "evalTplName",
      },
      {
        formRow: 90,
        fieldCode: "evalTypeMeaning",
      },
      {
        formRow: 90,
        fieldCode: "assessTypeMeaning",
      },
      {
        formRow: 100,
        fieldCode: "realName",
      },
      {
        formRow: 110,
        fieldCode: "creationDate",
      }, ];
    },
    getPcColumns() {
      return [ {
        formRow: 1,
        fieldCode: "pcName",
        fieldType: "EMPTY",
        render: (val, data) => <SrmListHeader showOpenTag={false}>
          <span>{val}</span>
          <SrmButton slot="right" plain rect type={this.statusColorMap[data.pcStatusCode] || "primary"}>
            {data.pcStatusCodeMeaning}
          </SrmButton>
        </SrmListHeader>,
      }, {
        formRow: 2,
        fieldCode: "pcNum",
        render: (val, item) => <SrmButton
          plain rect
          onClick={() => this.onContractDetail(item)}>{val}
        </SrmButton>,
      }, {
        formRow: 3,
        fieldCode: "supplierCompanyName",
      }, {
        formRow: 4,
        fieldCode: "companyName",
      }, {
        formRow: 5,
        fieldCode: "pcKindCodeMeaning",
      }, {
        formRow: 5,
        fieldCode: "pcTypeCode",
      }, {
        formRow: 6,
        fieldName: this.$T("spcm.common.model.common.contractAcceptListNum").$D("协议验收单据"),
        fieldCode: "pcHeaderId",
        render: (val) => <SrmButton plain rect onClick={() => this.onPcReceiptClick(val)}>
          {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
        </SrmButton>
      }, {
        formRow: 7,
        fieldName: this.$T("spcm.common.view.message.title.contractStage").$D("协议阶段"),
        fieldCode: "pcHeaderId",
        render: (val) => <SrmButton plain rect onClick={() => this.onPcStageClick(val)}>
          {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
        </SrmButton>
      }, {
        formRow: 7,
        fieldCode: "taxIncludeAmount",
      }, {
        formRow: 8,
        fieldCode: "createByRealName",
      }, {
        formRow: 9,
        fieldCode: "creationDate",
      } ];
    },
    getInquiryColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val, data) => <SrmListHeader >
            <SrmButton
              plain rect
              onClick={() => this.onInquiryDetail(data)}>{val}
            </SrmButton>
            <SrmButton slot="right" plain rect type={inquiryStatusMap[data.rfxStatus] || "warn"}>
              {data.rfxStatusMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "rfxTitle",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          fieldCode: "sourceCategoryMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          fieldCode: "sourceMethodMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          fieldCode: "sourceProjectName",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          fieldCode: "createdByName",
          fieldType: "TEXT",
        },
      ];
    },
    getInquiryDetailColumns() {
      return [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxStatusMeaning",
        },
        {
          fieldCode: "rfxTitle",
        },
        {
          fieldCode: "templateName",
        },
        {
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldCode: "sourceProjectName",
        },
        {
          fieldCode: "sectionName",
        },
        {
          fieldCode: "viewDetail",
        },
        {
          fieldCode: "quotationStartDate",
        },
        {
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "prequalEndDate",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "purOrganizationName",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "createdUnitName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    getViewDetailColumns() {
      return [
        {
          fieldCode: "employeeName",
          fieldType: "TEXT",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.implementation").$D("执行情况"),
        },
        {
          fieldCode: "approvalMessageMeaning",
          fieldType: "TEXT",
          fieldName: $T("hzero.common.button.action").$D("操作"),
        },
      ];
    },
    getBidColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val, data) => <SrmListHeader >
            <SrmButton
              plain rect
              onClick={() => this.onBidDetail(data)}>{val}
            </SrmButton>
            <SrmButton slot="right" plain rect type={inquiryStatusMap[data.rfxStatus] || "warn"}>
              {data.rfxStatusMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "rfxTitle",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          fieldCode: "viewDetail",
          fieldType: "TEXT",
          render: (val, record) => {
            let mean;
            const { progresses, rfxStatus, headerWorkFlows } = record || {};
            const currentProgress = progresses && progresses.find((item) => item.isCurrentFlag === 1);
            const currentWorkFlow = headerWorkFlows && headerWorkFlows[headerWorkFlows.length - 1];
            switch (rfxStatus) {
            case "SCORING":
              mean = <span>{currentProgress && currentProgress.progressNameMeaning}</span>;
              break;
            case "PAUSED":
              mean = $T("ssrc.inquiryHall.model.inquiryHall.pause").$D("暂停中");
              break;
            case "RELEASE_APPROVING": // 发布审批中
            case "PRE_EVALUATION_APPROVING": // 中标候选人审批中
            case "CHECK_APPROVING": // 核价审批中
            case "RELEASE_REJECTED": // 发布审批拒绝
            case "CHECK_REJECTED": // 核价审批拒绝
            case "PRE_EVALUATION_PENDING_REJECT": // 中标候选人拒绝
              mean = <SrmButton slot="right" plain rect onClick={() => this.onViewClick(record.headerWorkFlows)}>
                {currentWorkFlow.employeeName + (currentWorkFlow.approvalMessageMeaning || "-")}
              </SrmButton>;
              break;
            case "NEW": // 新建
            case "ROUNDED": // 再次询价
            case "CLOSED": // 关闭
            case "CANCELED": // 取消
              mean = "";
              break;
            default:
              break;
            }
            return mean;
          }
        },
        {
          formRow: 40,
          fieldCode: "quotationStartDate",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          fieldCode: "quotationEndDate",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          formRow: 70,
          fieldCode: "sourceCategoryMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 70,
          fieldCode: "sourceMethodMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 80,
          fieldCode: "createdByName",
          fieldType: "TEXT",
        },
      ];
    },
    getBidDetailColumns() {
      return [
        {
          fieldCode: "rfxStatusMeaning",
        },
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
        {
          fieldCode: "viewDetail",
        },
        {
          fieldCode: "approvalMessage",
        },
        {
          fieldCode: "quotationStartDate",
        },
        {
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "purOrganizationName",
        },
        {
          fieldCode: "prequalEndDate",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "createdUnitName",
        },
        {
          fieldCode: "templateName",
        },
        {
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldCode: "sourceProjectName",
        },
        {
          fieldCode: "sectionName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    getRectifyColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "problemNum",
          fieldType: "EMPTY",
          render: (val, data) => <SrmListHeader >
            <span>{val}</span>
            <SrmButton slot="right" plain rect type={rectifyStatusMap[data.problemStatus] || "warn"}>
              {data.problemStatusMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "problemTitle",
        },
        {
          formRow: 30,
          fieldCode: "associateProblemNums",
          render:(val, record) => record.associateNum ?
            <SrmButton
              plain rect
              onClick={() => this.onRectifyReport(record)}>
              {$T("hzero.button.button.look").$D("查看")}
            </SrmButton> :
            "-"
          ,
        },
        {
          formRow: 40,
          fieldCode: "supplierName",
        },
        {
          formRow: 50,
          fieldCode: "companyName",
        },
        {
          formRow: 60,
          fieldCode: "createdName",
        },
        {
          formRow: 70,
          fieldCode: "publishedName",
        },
      ];
    },
    getRectifyDetailColumns() {
      return [
        {
          fieldCode: "problemStatusMeaning",
        },
        {
          fieldCode: "problemNum",
        },
        {
          fieldCode: "problemTitle",
        },
        {
          fieldCode: "rectifyTypeCodeMeaning",
        },
        {
          fieldCode: "validateResultFlagMeaning",
        },
        {
          fieldCode: "problemTypeCodeMeaning",
        },
        {
          fieldCode: "supplierNum",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "problemImportanceCodeMeaning",
        },
        {
          fieldCode: "problemUrgencyCodeMeaning",
        },
        {
          fieldCode: "sourceCodeMeaning",
        },
        {
          fieldCode: "sourceNum",
        },
        {
          fieldCode: "claimFormNum",
        },
        {
          fieldCode: "createdName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "publishedDate",
        },
        {
          fieldCode: "publishedName",
        },
      ];
    },
    getRectifyReportColumns() {
      return [
        {
          fieldCode: "problemNum",
        },
        {
          fieldCode: "problemTitle",
        },
        {
          fieldCode: "createdName",
        },
      ];
    },
    getMaterialColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "reqHeaderNum",
          fieldType: "EMPTY",
          render: (val, data) => <SrmListHeader showOpenTag={false} >
            <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.onMaterialDetail(data)}>{val}</a>
            <SrmButton slot="right" plain rect type={materialStatusMap[data.authReqStatusCode] || "warn"}>
              {data.authReqStatusCodeMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "nodeCodeMeaning",
        },
        {
          formRow: 30,
          fieldCode: "categoryName",
        },
        {
          formRow: 40,
          fieldCode: "companyName",
        },
      ];
    }
  }
};
</script>

<style scoped lang="stylus">
.srm-list-item-card-head-right {
  .srm-button {
    font-weight: 600;
  }
}
</style>
