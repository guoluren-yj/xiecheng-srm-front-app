<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="protocol-approval">
    <div class="smart-wrapper">
      <srm-button v-if="baseInfo.smartTaskId" type="info">
        <srm-list-header class="smart-tips">
          <img class="srm-icon-diff" src="@/assets/ai.svg" >
          {{ $T('spcm.common.view.title.sour.successAI').$D('AI提取成功') }}
          <img class="srm-icon-diff" src="@/assets/greyAi.svg" >
          {{ $T('spcm.common.view.title.sour.failureAI1').$D('AI提取失败') }}
          <img class="srm-icon-diff" src="@/assets/editor.svg" >
          {{ $T('spcm.common.view.title.sour.differentAI1').$D('AI提取结果与实际不一致') }}
          <span slot="right" @click="showSmartTips">{{ $T('smbl.common.view.button.viewMore').$D('查看更多') }}<span class="srm-icon icon-chevron-right" /></span>
        </srm-list-header>
      </srm-button>
    </div>
    <srm-scroll-tab class="base-info-list">
      <srm-scroll-tab-item v-if="supplementFlag" :label="$T('spcm.purchaseContractView.title.change.contractContent').$D('协议变更内容')">
        <change-content :pc-header-id="parameters.pcHeaderId" :base-info="baseInfo"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('spcm.common.view.message.title.basicInformation').$D('基础信息')">
        <div class="card" @click="showBaseInfoDetail">
          <customize :need-padding="true" :columns="getBaseInfoColumns" :data-source="baseInfo" type="list" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('spcm.purchaseContractView.contractDetail').$D('协议详情')">
        <div v-for="(item, index) in costDetailLines" :key="index">
          <div class="card" @click="showLineDetail(item)">
            <customize :need-padding="true" :columns="getProtocolLineColumns(item)" :data-source="item" type="list" />
            <div class="cutting-line" />
          </div>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!showApproveHistoryFlag" :label="$T('smbl.common.button.taskDetail.record').$D('审批记录')">
        <history-record-tiled
          :action-data="historicList"
          operator-field-name="assigneeName"
          operation-meaning-field-name="name"
          process-date-field-name="endTime"
          process-remark-field-name="comment" />
      </srm-scroll-tab-item>
      <!-- 适配iPhoneX -->
      <div class="bottom-space-view" />
    </srm-scroll-tab>
    <!-- 基础信息详情弹框 -->
    <srm-popup :visible.sync="baseInfoPopupFlag" class="base-info-popup" position="right" :title="$T('spcm.common.view.message.title.basicInformation').$D('基础信息')" :show-back="true" :show-close="false" width="100%">
      <div style="margin-top: 8px; background: var(--background-color-empty);">
        <customize-detail :need-padding="true" :columns="getBaseInfoDetailColumns" :data-source="baseInfo" />
      </div>
    </srm-popup>
    <!-- 协议行详情弹框 -->
    <srm-popup :visible.sync="lineDetailPopupFlag" class="line-detail-popup" position="right" :title="displayLineItem.pcNum" :show-back="true" :show-close="false" width="100%" >
      <div style="margin-top: 8px; background: var(--background-color-empty);">
        <customize-detail :need-padding="true" :columns="getLineDetailColumns(displayLineItem)" :data-source="displayLineItem" />
      </div>
    </srm-popup>
    <!-- 查看标的详情弹框 -->
    <srm-popup :visible.sync="subjectListPopupFlag" class="subject-list-popup" position="right" :title="$T('smbl.common.view.title.object').$D('标的')" :show-back="true" :show-close="false" width="100%" >
      <srm-list v-if="subjectDataSet" :data-set="subjectDataSet" :columns="getSubjectListColumns" />
    </srm-popup>
    <!-- 合同累计金额列表 -->
    <srm-popup :visible.sync="approvedAmountFlag" class="amount-list-popup" position="right" :title="(costDetailLines[0] || {}).pcNum" :show-back="true" :show-close="false" width="100%" >
      <srm-list v-if="approvedAmountDataSet" :data-set="approvedAmountDataSet" :columns="getApprovedAmountColumns" />
    </srm-popup>
    <!-- 中标详情弹框 -->
    <srm-popup :visible.sync="successfulPopupFlag" class="successful-popup" position="right" :title="$T('smbl.common.view.title.sourceDetail').$D('寻源详情')" :show-back="true" :show-close="false" width="100%" >
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.tab.inquiryRfq').$D('询价单RFQ')">
          <div v-for="(item, index) in rfqListInfo" :key="index" class="card">
            <srm-blank size="small" theme="fill"/>
            <div class="srm-header-title">{{ item.document.sourceNum }}-{{ item.document.sourceTitle }}</div>
            <srm-blank size="small" theme="fill"/>
            <div v-for="(record, index2) in item.rfxListInfo" :key="index2">
              <customize :need-padding="true" :columns="getInquiryColumns" :data-source="record" type="list" />
              <srm-blank size="small" theme="fill"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.tab.inquiryRfp').$D('询价单RFP')">
          <div v-for="(item, index) in rfpListInfo" :key="index" class="card">
            <srm-blank size="small" theme="fill"/>
            <div class="srm-header-title">{{ item.document.sourceNum }}-{{ item.document.sourceTitle }}</div>
            <srm-blank size="small" theme="fill"/>
            <div v-for="(record, index2) in item.rfxListInfo" :key="index2">
              <customize :need-padding="true" :columns="getInquiryColumns" :data-source="record" type="list" />
              <srm-blank size="small" theme="fill"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.tab.inquiryRfi').$D('询价单RFI')">
          <div v-for="(item, index) in rfiListInfo" :key="index" class="card">
            <srm-blank size="small" theme="fill"/>
            <div class="srm-header-title">{{ item.document.sourceNum }}-{{ item.document.sourceTitle }}</div>
            <srm-blank size="small" theme="fill"/>
            <div v-for="(record, index2) in item.rfxListInfo" :key="index2">
              <customize :need-padding="true" :columns="getInquiryColumns" :data-source="record" type="list" />
              <srm-blank size="small" theme="fill"/>
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </srm-popup>
    <!-- 智能审查弹框 -->
    <srm-popup :visible.sync="smartPopupFlag" class="successful-popup" position="right" :title="$T('smbl.common.view.title.smart').$D('智能审查')" :show-back="true" :show-close="false" width="100%" >
      <smart-review :header-info="currentSmartItem" />
    </srm-popup>
    <!-- 查看供应商评估结果 -->
    <srm-popup :visible.sync="evaluationPopupFlag" class="successful-popup" position="right" :title="evaluationContractCode" :show-back="true" :show-close="false" width="100%" >
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.supplierVendorList').$D('供应商维度')">
          <srm-list
            v-if="supplierScoreResDS"
            :data-set="supplierScoreResDS"
            :columns="getSupplierScoreColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spcm.contractApproval.starbucks.view.factoryVendorList').$D('工厂维度')">
          <div v-for="(item, index) in supplierFactoryScoreRes" :key="index" class="card">
            <srm-blank size="small" theme="fill"/>
            <div class="factory-header-title">{{ item.factoryName }}</div>
            <div class="contract-category"><srm-text-field><span slot="left" style="margin-right: 12px">{{ $T('spcm.purchaseContractView.view.form.ContractClassification').$D('合同品类') }}:</span>{{ item.itemCategory }}</srm-text-field></div>
            <div v-for="(record, index2) in item.list" :key="index2">
              <customize :style="{paddingBottom: item.list.length - 1 === index2 ? '10px': '0px'}" :need-padding="true" :columns="supplierFactoryScoreColumns" :data-source="record" type="list" />
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </srm-popup>
    <!-- 更多信息弹框 -->
    <srm-popup :visible.sync="moreInfoPopupFlag" class="more-info-popup" position="bottom" :title="moreInfoTitle" height="40%" rounded>
      <div style="padding: 15px 15px 0 15px;">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div style="whiteSpace: pre-line;" v-html="moreInfoContent" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getBaseInfoApi,
  getProtocolDetailApi,
  getRfxDetailApi,
  getProjectQuoteLinesApi,
  getSupplierFactoryScoreResApi,
  getContractApprovalApi,
} from "./api/index";
import uuid from "uuid";
import moment from "moment";
import { isObject, isNil } from "lodash";
import { DataSet, SrmUtil, SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ChangeContent from "./components/ChangeContent";
import { subjectDatasource, supplierScoreResDS } from "./dataSource/SubjectDatasource";
import { amountDatasource } from "./dataSource/AmountDatasource";
// import { rfxDetailSuppliersDS } from "./dataSource/RfxDetailSuppliersDS";
import SmartReview from "@/components/SmartContract/SmartReview";

export default {
  modules: [ "smbl.common", "spcm.common", "spcm.contractApproval", "spcm.contractmoney", "spcm.purchaseContractView", "hipspfm.order", "ssrc.inquiryHall", "sprm.common", "hipspfm.common", "ssrc.bidHall", "scux.supplierOpenAccount", "spcm.starbucks", "hzero.common", "smbl.workFlow", "hwfp.common", "entity.roles", "entity.company", "entity.business", "entity.organization", "entity.supplier" ],
  name: "StarBucksContractApproval",
  components: { HistoryRecordTiled, ChangeContent, SmartReview },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
    showApproveHistoryFlag: {
      type: Boolean,
      default: false,
    },
    historicTaskList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      baseInfo: {},
      costDetailLines: [],
      displayLineItem: {},
      baseInfoPopupFlag: false,
      supplementFlag: false,
      attributeVarchar31: null,
      lineDetailPopupFlag: false,
      // 标的
      subjectListPopupFlag: false,
      subjectDataSet: null, // 标的
      // 合同累计金额列表
      approvedAmountFlag: false,
      approvedAmountDataSet: null,
      // 中标详情
      rfxSuplliersDataSet: null,
      successfulLineItem: {},
      successfulPopupFlag: false,
      // 更多信息弹框（补充说明等）5种
      moreInfoPopupFlag: false,
      moreInfoContent: "",
      moreInfoTitle: "",
      rfqListInfo:[],
      rfpListInfo:[],
      rfiListInfo:[],
      // 供应商评估结果
      evaluationContractCode: null,
      evaluationPopupFlag: false,
      supplierScoreResDS: null,
      supplierFactoryScoreRes: [],
      historicList: [],
      smartPopupFlag:false,
      currentSmartItem:{}
    };
  },
  computed: {
    getInquiryColumns() {
      return [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) => <srm-list-header show-open-tag={false}>
            <span>{ record.projectQuotesName }</span>
            <span slot="right">{record.summaryScore} {record.summaryScore ? this.$T("smbl.common.view.message.points").$D("分") : ""}</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("smbl.common.view.message.requestForProposals").$D("征询方案"),
          fieldType: "TEXT",
          fieldCode: "requestForProposal",
          render:(val, record) => {
            if (record.sourceFrom === "RFP" || record.sourceFrom === "RFX") {
              let businessAttachmentUuid = record.businessAttachmentUuid || uuid();
              let techAttachmentUuid = record.techAttachmentUuid || uuid();
              return <SrmUpload
                isTab={true}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
                fileArr={[
                  {
                    title: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
                    attachmentUuid: businessAttachmentUuid,
                    readOnly: true
                  },
                  {
                    title: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
                    attachmentUuid: techAttachmentUuid,
                    readOnly: true
                  },
                ]}/>;
            }
            let quotationAttachment = record.quotationAttachment_rf || uuid();
            return <SrmUpload
              color="blue"
              attachmentUuid={quotationAttachment}
              canUpload={true}
              showIcon={false}
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />;
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierTotalAmount").$D("报价总价"),
          fieldType: "TEXT",
          fieldCode: "quotationAmount",
        },
        {
          fieldName: this.$T("spcm.common.model.bidPriceAmount").$D("中标总价"),
          fieldType: "TEXT",
          fieldCode: "bidAmount",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.rankings").$D("排名"),
          fieldType: "TEXT",
          fieldCode: "summaryRank",
        },

      ].filter(Boolean);
    },
    getBaseInfoColumns() {
      return [
         this.parameters?.isCheck && !this.isArchive && {
          fieldName: this.$T("smbl.common.view.title.smart").$D("智能审查"),
          fieldType: "TEXT",
          fieldCode: "smartCheck",
          render: (_, record) => isNil(record.reviewTemplateId) ? null :
            <div style="color: var(--color-success);" onClick={ (e) => {
              this.smartPopupFlag = true;
              // console.log("record",record.pcHeaderId)
              this.currentSmartItem = {
                pcHeaderId: this.parameters.pcHeaderId
              };
              e.stopPropagation();
            } }>
              {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
            </div>
          ,
        },
         {
           fieldName: this.$T("spcm.contractmoney.PartyA").$D("甲方"),
           fieldType: "TEXT",
           fieldCode: "companyName",
           render: (val, record) => <srm-flex justify="between" class="card-title-container">
             <div class="title">{this.showIntelIcon("companyName", record)}{val}</div>
             <div class="arrow-icon srm-icon icon-chevron-right"></div>
           </srm-flex>,
           // valueBefore: (record) => this.showIntelIcon("companyName", record)
         }, {
           fieldName: this.$T("spcm.contractmoney.PartyB").$D("乙方"),
           fieldType: "TEXT",
           fieldCode: "supplierCompanyName",
           render: (val, record) => <srm-flex class="card-title-container">
             <div class="title">{this.showIntelIcon("supplierCompanyName", record)}{val}</div>
             { !record.isOracle ? <div class="more-info-icon srm-icon icon-help" onClick={
               (e) => {
                 e.stopPropagation();
                 this.moreInfoContent = this.$T("spcm.contractmoney.newSupplier").$D("新供商");
                 this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                 this.moreInfoPopupFlag = true;
               }}/> : <span />}
           </srm-flex>,
         }, {
           fieldName: this.$T("spcm.purchaseContractView.model.majorityName").$D("需求部门"),
           fieldType: "TEXT",
           fieldCode: "majorityName",
         }, {
           fieldName: this.$T("spcm.purchaseContractView.model.purchaseDemandCreated").$D("需求人"),
           fieldType: "TEXT",
           fieldCode: "purchaseDemandCreated",
         }, {
           fieldName: this.supplementFlag ? this.$T("spcm.purchaseContractView.pb.original.contractGoal").$D("原协议目的") : this.$T("spcm.purchaseContractView.pb.contractGoal").$D("协议目的"),
           fieldType: "TEXT",
           fieldCode: "attributeLongtext10",
         }, {
           fieldName: this.supplementFlag ? this.$T("spcm.purchaseContractView.pb.original.contractSubject").$D("原协议标的简述") : this.$T("spcm.purchaseContractView.pb.contractSubject").$D("合同标的"),
           fieldType: "TEXT",
           fieldCode: "attributeVarchar17",
         }, {
           fieldName: this.supplementFlag ? this.$T("spcm.contractmoney.model.AmountOfOriginalAgreement").$D("原协议金额") : this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal4",
           render: (val) => <div>
             <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
             <span class="more-info-icon srm-icon icon-help" onClick={
               (e) => {
                 e.stopPropagation();
                 this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountOfThisAgreement").$D("本次协议的合作金额");
                 this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                 this.moreInfoPopupFlag = true;
               }
             }/>
           </div>,
         }, !this.supplementFlag3 && {
           fieldName: this.$T("spcm.contractmoney.model.totalApprovedContractAmount").$D("累积已审批合同金额"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal3",
           render: (val, record) => <div>
             <span style={val > 0 ? "color: var(--color-success);" : ""} onClick={(e) => {
               e.stopPropagation();
               val > 0 && this.showApprovedAmountList(record);
             }}>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
             <span class="more-info-icon srm-icon icon-help" onClick={
               (e) => {
                 e.stopPropagation();
                 this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.CumulativeApprovedContractAmount").$D("除本协议外，本财年已累计审批的合同金额");
                 this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                 this.moreInfoPopupFlag = true;
               }
             }/>
           </div>,
         }, this.attributeVarchar31 === "1" ? {
           fieldName: this.$T("spcm.contractmoney.approvalAmount1").$D("本次合同金额增量"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal14",
           render: (val) => <div style={{ color: "red" }}>
             <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
           </div>
         } : null,
         this.supplementFlag ? {
           fieldName: this.$T("spcm.starbucks.incrementalContractAmount").$D("合同金额增量"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal9",
           render: (val) => <div>
             <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
           </div>
         } : null,
         this.isArchive ? {
           fieldName: this.$T("spcm.common.attachmentUuid").$D("归档文件"),
           fieldType: "TEXT",
           fieldCode: "archiveAttachmentUuid",
           render: (val) =>
             <SrmUpload
               isTab={false}
               showIcon={false}
               descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
               fileArr={[
                 {
                   title: this.$T("spcm.common.attachmentUuid").$D("归档文件"),
                   attachmentUuid: val,
                   readOnly: true
                 },
               ]}/>
         } : null,
         // {
         //   fieldName: this.$T("spcm.contractmoney.model.totalEstimateAmountOfYear").$D("财年预估合同签订总金额"),
         //   fieldType: "TEXT",
         //   fieldCode: "attributeDecimal2",
         //   render: (val) => <div>
         //     <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
         //     <span class="more-info-icon srm-icon icon-help" onClick={
         //       (e) => {
         //         e.stopPropagation();
         //         this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.EstimatedTotalSignedFiscalYear").$D("本财年预计与该供应商签订的协议总金额");
         //         this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
         //         this.moreInfoPopupFlag = true;
         //       }
         //     }/>
         //   </div>,
         // },
         this.attributeVarchar31 === "1" || !this.supplementFlag ? {
           fieldName: this.$T("spcm.contractmoney.approvalAmount").$D("本次审批金额"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal6",
           render: (val, record) => {
             const targetValue = (record?.pcTypeCode === "CONTYPE702" ? record?.terminatedAttributeDecimal6 : val) || "-"; // 终止协议类型
             const isRed = record.attributeDecimal4 < targetValue && record.attributeDecimal4 < 1000000;
             return <div>
               <span style={{ color: isRed && "red" }}>
                 {targetValue === null || typeof targetValue === "undefined" || targetValue === "-" ? targetValue : SrmMath.toFormat(targetValue, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}
               </span>
               {
                 !isRed &&
                <span class="more-info-icon srm-icon icon-help" onClick={
                  (e) => {
                    e.stopPropagation();
                    // if (isRed) {
                    //   this.moreInfoContent = this.$T("spcm.starbucks.msg.AmountApprovedThisTime").$D("本协议审批金额已涉及累积审批，或协议申请人维护了较大的财年预估签订总金额");
                    // } else {
                    this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountApprovedThisTime").$D("本合同走审批流程的金额 <br/>（1）如本次协议金额+累积已审批合同金额<前一份合同审批金额时，本次审批金额=本次协议金额<br/>（2）如本次协议金额+累积已审批合同金额>前一份合同审批金额时，本次审批金额=财年预估签订总金额");
                    // }
                    this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                    this.moreInfoPopupFlag = true;
                  }
                } />
               }
             </div>;
           }
         } : null,
         {
           fieldName: this.$T("spcm.purchaseContractView.model.attributeTinyint11").$D("是否适用全部法人公司"),
           fieldType: "TEXT",
           fieldCode: "attributeTinyint11",
           render: (val, record) => val && Number(val) ? <span>{this.showIntelIcon("attributeTinyint11Meaning", record)}{this.$T("smbl.common.view.yes").$D("是")}</span> : <span>{this.showIntelIcon("attributeTinyint11Meaning", record)}{this.$T("smbl.common.view.no").$D("否")}</span>
         },
         {
           fieldName: this.$T("spcm.purchaseContractView.model.attributeVarchar11").$D("适用法人公司"),
           fieldType: "TEXT",
           fieldCode: "attributeVarchar11Meaning",
           render: (val, record) => val && isObject(val) ? <span>{this.showIntelIcon("attributeVarchar11Meaning", record)}{Object.values(val).join(",")}</span> : <span>{this.showIntelIcon("attributeVarchar11Meaning", record)}{val}</span>,
         },
         !this.supplementFlag ? {
           fieldName: this.$T("spcm.purchaseContractView.model.contractRemark").$D("合同说明"),
           fieldType: "TEXT",
           fieldCode: "remark",
           render: (val, record) => {
             const targetValue = record?.pcTypeCode === "CONTYPE702" ? record?.terminatedRemark : val;
             return targetValue || "-";
           },
         } : null,
         !this.supplementFlag ? {
           fieldName: this.$T("spcm.purchaseContractView.model.contractCuxRemark").$D("终止协议说明"),
           fieldType: "TEXT",
           fieldCode: "cuxRemark",
           render: (val, record) => {
             const remark = record?.remark || "_";
             return remark;
           },
         } : null,
         this.supplementFlag ? {
           fieldName: this.$T("spcm.purchaseContractView.model.DescriptionAgreementChange").$D("协议变更说明"),
           fieldType: "TEXT",
           fieldCode: "attribute7",
         } : null,
         {
           fieldName: this.$T("spcm.contractmoney.model.attributeVarchar13").$D("付款条款（NET）"),
           fieldType: "TEXT",
           fieldCode: "attributeVarchar13",
         }, {
           fieldName: this.$T("spcm.contractmoney.model.attributeVarchar1").$D("是否包含预付款"),
           fieldType: "TEXT",
           fieldCode: "attributeVarchar1",
           render: (val) => val && Number(val) ? <span>{this.$T("smbl.common.view.yes").$D("是")}</span> : <span>{this.$T("smbl.common.view.no").$D("否")}</span>
           // eslint-disable-next-line eqeqeq
         }, this.baseInfo.attributeVarchar1 == 1 ? {
           fieldName: this.$T("spcm.contractmoney.model.attributeDecimal1").$D("预付款比例（%）"),
           fieldType: "TEXT",
           fieldCode: "attributeDecimal1",
         } : null,
         {
           fieldName: this.$T("spcm.starbucks.includeDiscountsFlag").$D("折扣返利条款"),
           fieldType: "TEXT",
           fieldCode: "attributeVarchar16Meaning",
         },
         {
           fieldName: this.$T("spcm.starbucks.discountDesc").$D("折扣说明"),
           fieldType: "TEXT",
           fieldCode: "attributeLongtext3",
         },
      ].filter(Boolean);
    },
    getBaseInfoDetailColumns() {
      return [ {
        fieldName: this.$T("spcm.contractmoney.PartyA").$D("甲方"),
        fieldType: "TEXT",
        fieldCode: "companyName",
      }, {
        fieldName: this.$T("spcm.contractmoney.PartyB").$D("乙方"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
        render: (val, record) => <div>
          <span>{val}</span>
          { !record.isOracle ? <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.contractmoney.newSupplier").$D("新供商");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/> : <span />}
        </div>,
      }, {
        fieldName: this.$T("spcm.purchaseContractView.model.majorityName").$D("需求部门"),
        fieldType: "TEXT",
        fieldCode: "majorityName",
      }, {
        fieldName: this.$T("spcm.purchaseContractView.model.purchaseDemandCreated").$D("需求人"),
        fieldType: "TEXT",
        fieldCode: "purchaseDemandCreated",
      }, {
        fieldName: this.supplementFlag ? this.$T("spcm.purchaseContractView.pb.original.contractGoal").$D("原协议目的") : this.$T("spcm.purchaseContractView.pb.contractGoal").$D("协议目的"),
        fieldType: "TEXT",
        fieldCode: "attributeLongtext10",
      }, {
        fieldName: this.supplementFlag ? this.$T("spcm.purchaseContractView.pb.original.contractSubject").$D("原协议标的简述") : this.$T("spcm.purchaseContractView.pb.contractSubject").$D("合同标的"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar17",
      }, {
        fieldName: this.supplementFlag ? this.$T("spcm.contractmoney.model.AmountOfOriginalAgreement").$D("原协议金额") : this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal4",
        render: (val) => <div>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountOfThisAgreement").$D("本次协议的合作金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      }, !this.supplementFlag3 && {
        fieldName: this.$T("spcm.contractmoney.model.totalApprovedContractAmount").$D("累积已审批合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal3",
        render: (val, record) => <div>
          <span style={val > 0 ? "color: var(--color-success);" : ""} onClick={(e) => {
            e.stopPropagation();
            val > 0 && this.showApprovedAmountList(record);
          }}>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.CumulativeApprovedContractAmount").$D("除本协议外，本财年已累计审批的合同金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      },
      this.attributeVarchar31 === "1" ? {
        fieldName: this.$T("spcm.contractmoney.approvalAmount1").$D("本次合同金额增量"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal14",
        render: (val) => <div style={{ color: "red" }}>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
        </div>
      } : null,
      this.supplementFlag ? {
        fieldName: this.$T("spcm.starbucks.incrementalContractAmount").$D("合同金额增量"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal9",
        render: (val) => <div>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
        </div>
      } : null,
      // {
      //   fieldName: this.$T("spcm.contractmoney.model.totalEstimateAmountOfYear").$D("财年预估合同签订总金额"),
      //   fieldType: "TEXT",
      //   fieldCode: "attributeDecimal2",
      //   render: (val) => <div>
      //     <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
      //     <span class="more-info-icon srm-icon icon-help" onClick={
      //       (e) => {
      //         e.stopPropagation();
      //         this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.EstimatedTotalSignedFiscalYear").$D("本财年预计与该供应商签订的协议总金额");
      //         this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
      //         this.moreInfoPopupFlag = true;
      //       }
      //     }/>
      //   </div>,
      // },
      this.attributeVarchar31 === "1" || !this.supplementFlag ? {
        fieldName: this.$T("spcm.contractmoney.approvalAmount").$D("本次审批金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal6",
        render: (val, record) => {
          const targetValue = (record?.pcTypeCode === "CONTYPE702" ? record?.terminatedAttributeDecimal6 : val) || "-"; // 终止协议类型
          const isRed = record.attributeDecimal4 < targetValue && record.attributeDecimal4 < 1000000;
          console.log("targetValue", targetValue);
          return <div>
            <span style={{ color: isRed && "red" }}>
              {targetValue === null || typeof targetValue === "undefined" || targetValue === "" ? targetValue : SrmMath.toFormat(targetValue, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}
            </span>
            {
              !isRed &&
              <span class="more-info-icon srm-icon icon-help" onClick={
                (e) => {
                  e.stopPropagation();
                  // if (isRed) {
                  //   this.moreInfoContent = this.$T("spcm.starbucks.msg.AmountApprovedThisTime").$D("本协议审批金额已涉及累积审批，或协议申请人维护了较大的财年预估签订总金额");
                  // } else {
                  this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountApprovedThisTime").$D("本合同走审批流程的金额 <br/>（1）如本次协议金额+累积已审批合同金额<前一份合同审批金额时，本次审批金额=本次协议金额<br/>（2）如本次协议金额+累积已审批合同金额>前一份合同审批金额时，本次审批金额=财年预估签订总金额");
                  // }
                  this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                  this.moreInfoPopupFlag = true;
                }
              } />
            }
          </div>;
        },
      } : null, !this.supplementFlag ? {
        fieldName: "Contract Saving",
        fieldType: "TEXT",
        fieldCode: "attributeVarchar19",
      } : null, !this.supplementFlag ? {
        fieldName: "Cost Avoidance",
        fieldType: "TEXT",
        fieldCode: "attributeVarchar20",
      } : null, this.baseInfo.attributeVarchar2 !== "Indirect" ? { // 间采不展示
        fieldName: "AOP Margin %",
        fieldType: "TEXT",
        fieldCode: "attributeVarchar21",
      } : null, this.baseInfo.attributeVarchar2 !== "Indirect" && !this.supplementFlag ? { // 间采不展示
        fieldName: "Actual Margin %",
        fieldType: "TEXT",
        fieldCode: "attributeVarchar22",
      } : null, this.baseInfo.attributeVarchar2 !== "Indirect" && !this.supplementFlag ? { // 间采不展示
        fieldName: "Avg Margin of Last Year %",
        fieldType: "TEXT",
        fieldCode: "attributeVarchar23",
      } : null,
      !this.supplementFlag ? {
        fieldName: this.$T("spcm.purchaseContractView.model.contractRemark").$D("合同说明"),
        fieldType: "TEXT",
        fieldCode: "remark",
        render: (val, record) => {
          const targetValue = record?.pcTypeCode === "CONTYPE702" ? record?.terminatedRemark : val;
          return targetValue || "-";
        },
      } : null,
      !this.supplementFlag ? {
        fieldName: this.$T("spcm.purchaseContractView.model.contractCuxRemark").$D("终止协议说明"),
        fieldType: "TEXT",
        fieldCode: "cuxRemark",
        render: (val, record) => {
          const remark = record?.remark || "_";
          return remark;
        },
      } : null,
      this.supplementFlag ? {
        fieldName: this.$T("spcm.purchaseContractView.model.DescriptionAgreementChange").$D("协议变更说明"),
        fieldType: "TEXT",
        fieldCode: "attribute7",
      } : null,
      {
        fieldName: this.$T("spcm.starbucks.includeDiscountsFlag").$D("折扣返利条款"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar16Meaning",
      },
      {
        fieldName: this.$T("spcm.starbucks.discountDesc").$D("折扣说明"),
        fieldType: "TEXT",
        fieldCode: "attributeLongtext3",
      }, ];
    },
    getSubjectListColumns() {
      return [ {
        fieldName: "name",
        fieldType: "EMPTY",
        fieldCode: "itemName",
        formRow: 10,
        render: (val, record) => <SrmFlex justify="between">
          <span style="fontSize: 14px; fontWeight: bold;">
            {this.showIntelIcon("itemName", record)}
            {this.changeRender(`${record.lineNum ? record.lineNum + "-" : ""}${val}`, record, "itemName")}
          </span>
          {this.renderChangeHeader(val, record)}
        </SrmFlex>,
      }, {
        fieldName: this.$T("spcm.contractmoney.purchaseType").$D("品类"),
        fieldType: "TEXT",
        fieldCode: "categoryName",
        formRow: 20,
        formCol: 10,
        render: (val, record) => {
          this.changeRender(val, record, "categoryName");
        },
      }, {
        fieldName: this.$T("spcm.contractmoney.unitOfMeasurement").$D("计量单位"),
        fieldType: "TEXT",
        fieldCode: "uomName",
        formRow: 30,
        formCol: 10,
        render: (val, record) => <span>{this.showIntelIcon("uomName", record)}{this.changeRender(val, record, "uomName")}</span>,
      }, {
        fieldName: this.$T("spcm.common.model.common.taxNum").$D("税率"),
        fieldType: "TEXT",
        fieldCode: "taxRate",
        formRow: 40,
        formCol: 10,
        render: (val, record) => <span>{this.showIntelIcon("taxRate", record)}{this.changeRender(val, record, "taxRate")}</span>,
      }, {
        fieldName: this.$T("spcm.contractmoney.model.TaxInclusivePrice").$D("含税价格(元)"),
        // fieldType: "INPUT_NUMBER",
        // editor: false,
        fieldCode: "taxIncludedUnitPrice",
        formRow: 40,
        formCol: 20,
        render: (val, record) => <span>{this.showIntelIcon("taxIncludedUnitPrice", record)}{ this.changeRender(val ? SrmUtil.getNumberLocalized(val) : val, record, "taxIncludedUnitPrice")}</span>,
      }, ];
    },
    // 合同累计金额列表
    getApprovedAmountColumns() {
      return [
        {
          fieldName: this.$T("spcm.common.model.common.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
          fieldType: "TEXT",
          render: (val, item) => <srm-flex justify="between" class="card-title-container">
            <srm-flex class="bold-title">
              <div>{val}</div>
              <div class="attachment-icon srm-icon icon-paperclip" onClick={(e) => {
                e.stopPropagation();
                this.previewContractFile(item);
              }}/>
            </srm-flex>
          </srm-flex>,
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcName").$D("协议名称"),
          fieldCode: "pcName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("spcm.common.model.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
          fieldType: "TEXT",
        },
        this.attributeVarchar31 === "1" || !this.supplementFlag ? {
          fieldName: this.$T("spcm.starbucks.AmountApprovedThisTime").$D("本次审批金额"),
          fieldCode: "executeApprovalAmount",
          fieldType: "TEXT",
          render: (val) => <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
        } : null,
        {
          fieldName: this.$T("spcm.contractmoney.srfounder").$D("采购申请创建人"),
          fieldCode: "srCreateByRealName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("spcm.contractmoney.contractCreator").$D("协议创建人"),
          fieldCode: "createByRealName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("hzero.common.status").$D("状态"),
          fieldCode: "pcStatusCodeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldCode: "startDateActive",
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldType: "TEXT",
          valueBefore: (record) => this.showIntelIcon("startDateActive", record)
        },
        {
          fieldCode: "endDateActive",
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldType: "TEXT",
          valueBefore: (record) => this.showIntelIcon("endDateActive", record)
        },
        {
          fieldCode: "oneSourceName",
          fieldName: this.$T("spcm.contractmoney.model.oneSourceName").$D("协议寻源方式"),
          fieldType: "TEXT",
        },
      ];
    },
    getSuccessfulDetailColumns() {
      let columns = [ {
        fieldName: this.$T("spcm.common.pb.companyName").$D("公司"),
        fieldType: "EMPTY",
        fieldCode: "supplierCompanyName",
        render: (val, record) => <div>
          <span style={{
            background: record.suggestedFlag ? "var(--color-success)" : "#475866",
            color: "var(--font-color-white)",
            padding: "0px 3px",
            borderRadius: "2px",
            fontSize: "10px",
            marginRight: "4px",
            lineHeight: "18px",
          }}>{record.suggestedFlag ? this.$T("smbl.common.model.advanceWinning").$D("预中标") : this.$T("smbl.common.model.bidFailed").$D("未中标")}</span>
          <span style="fontSize: 14px; fontWeight: bold;">{val}</span>
        </div>,
      }, {
        fieldName: this.$T("spcm.contractmoney.totalOffer").$D("报价总额"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "taxTotalAmount",
      }, {
        fieldName: this.$T("smbl.common.model.supplyScore").$D("供应商分数"),
        fieldType: "TEXT",
        fieldCode: "scoreTotal",
      }, {
        fieldName: this.$T("smbl.common.model.rfxNum").$D("RFX编号"),
        fieldType: "TEXT",
        fieldCode: "rfxNum",
        visible: (val, record) => record.suggestedFlag,
      } ];
      return columns;
    },
    getSupplierScoreColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "supplierCompanyName",
          formRow: 1,
        },
        {
          formRow: 2,
          fieldCode: "ecAssessmentResultsMeaning",
          render: (value, record) => {
            const ecAssessmentResults = record.ecAssessmentResults;
            return <span style={{ color: ecAssessmentResults }}>{value}</span>;
          },
        },
        {
          formRow: 3,
          fieldCode: "ecComment",
        },
        {
          formRow: 4,
          fieldCode: "rating",
        },
        {
          formRow: 5,
          fieldCode: "finComment",
        },
      ];
    },
    supplierFactoryScoreColumns() {
      return [
        {
          formRow: 2,
          formCol: 1,
          fieldName: this.$T("spcm.purchaseContractView.view.form.assessmentElements").$D("评估要素"),
          fieldType: "TEXT",
          fieldCode: "assessmentElements",
        },
        {
          formRow: 2,
          formCol: 2,
          fieldName: this.$T("spcm.purchaseContractView.view.form.assessmentResult").$D("评估结果"),
          fieldType: "TEXT",
          fieldCode: "assessmentResult",
        },
        {
          formRow: 3,
          fieldName: this.$T("spcm.purchaseContractView.view.form.validityPeriod").$D("有效期至"),
          fieldType: "TEXT",
          fieldCode: "validityPeriod",
          render: (val) => {
            if (!val) {
              return val;
            }
            let list = val.split(" ");
            if (list.length > 0) {
              return list[0];
            }
            return val;
          },
        },
      ];
    },
  },
  mounted() {
    this.requestData();
  },
  methods: {
    showSmartTips() {
      this.$popup({
        title: this.$T("spcm.common.view.title.sour.smartTips").$D("智能提取说明"),
        showHeader: true,
        showClose: true,
        position: "right",
        showBack: true,
        content: <div class="smart-tips-pop">
          <div class="smart-tips-item">
            <div class="smart-tips-item-icon"><img class="srm-icon-diff" src={require("@/assets/ai.svg")} /></div>
            <div class="smart-tips-item-content">{this.$T("spcm.common.view.title.sour.successAI").$D("AI提取成功")}</div>
          </div>
          <div class="smart-tips-item">
            <div class="smart-tips-item-icon"><img class="srm-icon-diff" src={require("@/assets/greyAi.svg")} /></div>
            <div class="smart-tips-item-content">
              <div>{this.$T("spcm.common.view.title.sour.failureAI2").$D("AI提取失败，请手工选择或填写")}</div>
              <div>{this.$T("spcm.common.view.title.sour.failureAI3").$D("AI提取成功，但写入失败，例如合同文本中的供应商在系统中【不存在】")}</div>
            </div>
          </div>
          <div class="smart-tips-item">
            <div class="smart-tips-item-icon"><img class="srm-icon-diff" src={require("@/assets/editor.svg")} /></div>
            <div class="smart-tips-item-content">
              <div>{this.$T("spcm.common.view.title.sour.differentAI1").$D("AI提取结果与实际不一致")}</div>
              <div>{this.$T("spcm.common.view.title.sour.differentAI2").$D("AI提取的数据与系统维护数据不一致")}</div>
            </div>
          </div>
        </div>
      });
    },
    showIntelIcon(name, record) {
      // console.log('a',this.parameters?.isCheck)
      if (this.parameters?.isCheck) {
        const diffFlag = record?.[`${name}DiffFlag`];
        const diffValue = record?.[`${name}DiffValue`];
        const title = `${diffValue}`;
        // return (
        //     <srm-tooltip title={title} placement="top">
        //       <img class="srm-icon-diff" src={require("@/assets/greyAi.svg")} />
        //     </srm-tooltip>
        //   );
        switch (diffFlag) {
        case 1:
          return (
            <srm-tooltip title={title} placement="top">
              <img class="srm-icon-diff" src={require("@/assets/greyAi.svg")} />
            </srm-tooltip>
          );
        case 2:
          return (
            <srm-tooltip title={title} placement="top">
              <img class="srm-icon-diff" src={require("@/assets/editor.svg")} />
            </srm-tooltip>
          );
        case 3:
          return (
            <srm-tooltip title={title} placement="top">
              <img class="srm-icon-diff" src={require("@/assets/ai.svg")} />
            </srm-tooltip>
          );
        default:
          return null;
        }
      }
    },
    async transformHistoryData(pcHeaderId) {
      // 只有high level需要查询
      if (!this.showApproveHistoryFlag) {
        // 合同审批记录
        await getContractApprovalApi(pcHeaderId).then((res) => {
          this.historicList = res?.content || [];
        });

        // PB审批记录
        await getContractApprovalApi(pcHeaderId, true).then((res) => {
          this.historicList = this.historicList.concat(res?.content || []);
        });
        this.historicTaskList.forEach((item) => {
          const { actType } = item;
          if ([ "startEvent", "endEvent" ].includes(actType)) {
            item.action = "null";
          }
          item.nodeName = null;
        });
        this.historicList = this.historicList.concat(this.historicTaskList);
        // eslint-disable-next-line
        this.historicList = this.historicList.filter((his) => his.action !== "null" && his.comment !== "自动审批"); // 不显示自动审批和或签
        this.historicList.sort((pre, next) => new Date(next?.endTime?.replace(/-/g, "/")) - new Date(pre?.endTime?.replace(/-/g, "/")));
      }
    },
    changeRender(val, record, name) {
      if (record[`${name}Flag`]) {
        return (
          <span style={{ color: "red" }}>{val}</span>
        );
      } else if (record.attributeTinyint11 === 1) {
        return (
          <span class="change-invalid">{val}</span>
        );
      }
      return val;
    },
    renderChangeHeader(val, record) {
      if (this.attributeVarchar31 === "5") {
        if (record.attributeTinyint11 === 1) {
          return <span class="change-invalid">{this.$T("spcm.common.starbucks.view.changeCode.invalid").$D("失效")}</span>;
        } else if (!record.attributeTinyint13) {
          return <span style="color:red">{this.$T("spcm.common.starbucks.view.changeCode.add").$D("新增")}</span>;
        } else if (
          record?.itemNameFlag ||
          record?.specificationsFlag ||
          record?.taxRateFlag
        ) {
          return <span style="color:red">{this.$T("spcm.common.starbucks.view.changeCode.update").$D("修改")}</span>;
        }
      }
    },
    getProtocolLineColumns(lineItem) {
      let isMPA = lineItem.pcKindCode === "CONGROUP002" || lineItem.pcKindCode === "CONGROUP001";
      // 协议时长<732天 (终止日期-起始日期)  需求src-6892
      const afterStartDate = moment(lineItem.startDateActive).add(732, "d");
      const startTime = Date.parse(moment(afterStartDate).format("YYYY-MM-DD"));
      const endTime = Date.parse(moment(lineItem.endDateActive).format("YYYY-MM-DD"));
      const effectDurationFlag = startTime > endTime; // 起始日期+732 > 终止日期则为true
      // a)协议有效时长<732
      // b)单家门店  attribute13
      // c)协议类型为垃圾清运合同
      // d)是否用户确认符合Legal的授权条款  attribute14
      let isLegalApproval = lineItem.attribute13 === "1" && lineItem.pcTypeCode === "CONTYPE801" && effectDurationFlag;
      let columns = [
          this.parameters?.isCheck && !this.isArchive && {
          fieldName: this.$T("smbl.common.view.title.smart").$D("智能审查"),
          fieldType: "TEXT",
          fieldCode: "smartCheck",
          render: (_val, record) => isNil(record.reviewTemplateId) ? null :
            <div style="color: var(--color-success);" onClick={ (e) => {
              this.smartPopupFlag = true;
              // console.log("record",record.pcHeaderId)
              this.currentSmartItem = {
                pcHeaderId: record.pcHeaderId,
              };
              e.stopPropagation();
            } }>
              {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
            </div>
          ,
        },
          {
            fieldName: "",
            fieldType: "EMPTY",
            fieldCode: "pcNum",
            render: (val, item) => <srm-flex justify="between" class="card-title-container">
              <srm-flex class="bold-title">
                <div>{val}</div>
                <div class="attachment-icon srm-icon icon-paperclip" onClick={(e) => {
                  e.stopPropagation();
                  this.previewContractFile(item);
                }}>
                  <span style="fontSize: 14px; fontWeight: normal">{this.$T("spcm.common.model.common.agreementText").$D("(协议文本)")}</span>
                </div>
              </srm-flex>
              {isMPA ? null : <div class="arrow-icon srm-icon icon-chevron-right"></div>}
            </srm-flex>,
          }, {
            fieldName: this.$T("spcm.common.model.common.pcName").$D("协议名称"),
            fieldType: "TEXT",
            fieldCode: "pcName",
          }, {
            fieldName: this.$T("spcm.purchaseContractView.view.form.supplierCompanyName").$D("供应商"),
            fieldType: "TEXT",
            fieldCode: "supplierCompanyName",
          }, {
            fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
            fieldCode: "pcTypeName",
            fieldType: "TEXT",
          }, isLegalApproval && {
            fieldName: this.$T("spcm.common.model.isLegalApproval").$D("符合授权条件，无需法务审批"),
            fieldCode: "attribute14",
            fieldType: "TEXT",
            render: (val) => <div>
              {val && Number(val) ? <span style={"color: red"}>{this.$T("smbl.common.view.yes").$D("是")}</span> : <span>{this.$T("smbl.common.view.no").$D("否")}</span>}
              <span class="more-info-icon srm-icon icon-help" onClick={
                (e) => {
                  e.stopPropagation();
                  this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.isLegalApproval").$D("如垃圾清运合同符合以下条件时，授权业务部门可自行处理协议：（1）垃圾清运合同为一次性制式合同；（2）此协议只适用于单家门店；（3）本协议有效期不超过两年；（4）Line Director及以上审批本份合同");
                  this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                  this.moreInfoPopupFlag = true;
                }
              }/>
            </div>,
          }, !this.supplementFlag ? {
            fieldName: this.$T("spcm.common.model.common.contractInfo").$D("协议情况"),
            fieldType: "TEXT",
            fieldCode: "contractSituation",
          } : null, !this.supplementFlag ? {
            fieldName: this.$T("hzero.common.status").$D("状态"),
            fieldCode: "pcStatusCodeMeaning",
            fieldType: "TEXT",
          } : null, !this.supplementFlag ? {
            fieldName: this.$T("smbl.common.model.standardContractTemplate").$D("是否标准合同模板"),
            fieldType: "TEXT",
            fieldCode: "isTemplate",
            render: (val, record) => {
              if (val !== "N") {
                return val ? this.$T("smbl.common.view.yes").$D("是") : "-";
              // return this.$T("smbl.common.view.yes").$D("是");
              }
              return <srm-flex style="color: var(--color-danger);">
                <span>{this.$T("smbl.common.view.no").$D("否")}</span>
                <div class="more-info-icon srm-icon icon-help" onClick={
                  (e) => {
                    e.stopPropagation();
                    this.moreInfoContent = record.attributeLongtext9;
                    this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                    this.moreInfoPopupFlag = true;
                  }
                }/>
              </srm-flex>;
            },
          } : null,
      ].filter(Boolean);
      // 根据需要展示后面的字段
      if (isMPA) {
        return columns;
      }
      columns = columns.concat([ !this.supplementFlag ? {
        fieldName: this.supplementFlag ? this.$T("spcm.contractmoney.model.AmountOfOriginalAgreement").$D("原协议金额") : this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal4",
        render: (val) => <div>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountOfThisAgreement").$D("本次协议的合作金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      } : null, !this.supplementFlag3 && {
        fieldName: this.$T("spcm.contractmoney.model.totalApprovedContractAmount").$D("累积已审批合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal3",
        render: (val, record) => <div>
          <span style={val > 0 ? "color: var(--color-success);" : ""} onClick={(e) => {
            e.stopPropagation();
            val > 0 && this.showApprovedAmountList(record);
          }}>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.CumulativeApprovedContractAmount").$D("除本协议外，本财年已累计审批的合同金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      }, this.attributeVarchar31 === "1" ? {
        fieldName: this.$T("spcm.contractmoney.approvalAmount1").$D("本次合同金额增量"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal14",
        render: (val) => <div style={{ color: "red" }}>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
        </div>
      } : null, {
      // {
      //   fieldName: this.$T("spcm.contractmoney.model.totalEstimateAmountOfYear").$D("财年预估合同签订总金额"),
      //   fieldType: "TEXT",
      //   fieldCode: "attributeDecimal2",
      //   render: (val) => <div>
      //     <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
      //     <span class="more-info-icon srm-icon icon-help" onClick={
      //       (e) => {
      //         e.stopPropagation();
      //         this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.EstimatedTotalSignedFiscalYear").$D("本财年预计与该供应商签订的协议总金额");
      //         this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
      //         this.moreInfoPopupFlag = true;
      //       }
      //     }/>
      //   </div>,
      // },
        fieldName: this.$T("spcm.common.model.common.validityDateFrom").$D("有效期从"),
        fieldType: "TEXT",
        fieldCode: "startDateActive",
        render: (val, record) => {
          if (!val) {
            return <span>{this.showIntelIcon("startDateActive", record)}{val}</span>;
          }
          let list = val.split(" ");
          const { supplierSynergy = [] } = this.baseInfo;
          const newVal = list.length > 0 ? list[0] : val;
          return supplierSynergy.includes("BACKDATING_CONTRACT") ? <srm-flex>
            <span style="color: var(--color-danger);">{this.showIntelIcon("startDateActive", record)}{newVal}</span>
            <div class="more-info-icon srm-icon icon-help" onClick={
              (e) => {
                e.stopPropagation();
                this.moreInfoContent = this.$T("spcm.common.contractApproval.starbucks.view.reverseContract").$D("倒签合同");
                this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                this.moreInfoPopupFlag = true;
              }
            }/>
          </srm-flex> : <span>{this.showIntelIcon("startDateActive", record)}{newVal}</span>;
        },
      }, {
        fieldName: this.$T("spcm.common.model.common.validityDateTo").$D("有效期至"),
        fieldType: "TEXT",
        fieldCode: "endDateActive",
        render: (val, record) => {
          if (!val) {
            return <span>{this.showIntelIcon("endDateActive", record)}{ this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.longTermFlag").$D("长期")}</span>;
          }
          let list = val.split(" ");
          if (list.length > 0) {
            return <span>{this.showIntelIcon("endDateActive", record)}{list[0]}</span>;
          }
          return <span>{this.showIntelIcon("endDateActive", record)}{list[0]}</span>;
        },
      }, {
        fieldName: this.$T("smbl.common.view.title.object").$D("标的"),
        fieldType: "TEXT",
        fieldCode: "",
        render: (_val, record) => <div style="color: var(--color-success);" onClick={ (e) => {
          e.stopPropagation();
          this.showSubjectMatterList(record);
        } }>
          {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
        </div>,
      }, {
        fieldName: this.$T("spcm.contractmoney.SourcingMethod").$D("寻源方式"),
        fieldType: "TEXT",
        fieldCode: "singleSourceFlag",
        render: (val, record) => {
          let singleSourceFlag = record.singleSourceFlag;
          if (!singleSourceFlag) {
            // return this.$T("smbl.common.view.no").$D("否");
            return record.starbucksSourceMethodMeaning;
          }
          // <span>{this.$T("smbl.common.view.yes").$D("是")}</span>
          return <srm-flex style="color: var(--color-danger);">
            <span style="color: red">{record.starbucksSourceMethodMeaning}</span>
            <div class="more-info-icon srm-icon icon-help" onClick={
              (e) => {
                e.stopPropagation();
                this.moreInfoContent = record.checkRemark;
                this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                this.moreInfoPopupFlag = true;
              }
            }/>
          </srm-flex>;
        },
      }, {
        fieldName: this.$T("spcm.purchaseContractView.SuccessfulDetail").$D("中标详情"),
        fieldType: "TEXT",
        fieldCode: "",
        render: (_val, record) => {
          if (record.pcSourceCode !== "SEARCH_SOURCE_RESULT") {
            return;
          }
          return <div style="color: var(--color-success);" onClick={ (e) => {
            e.stopPropagation();
            this.showSuccessfulDetail(record);
          }}>
            {this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
          </div>;
        },
      }, {
        fieldName: this.$T("spcm.purchaseContractView.EvaluationResult").$D("供应商评估结果"),
        fieldType: "TEXT",
        fieldCode: "",
        render: (_val, record) => {
          const isRed = record.ecAssessmentResults === "RED";
          return <div style={{ color:isRed ? "var(--color-danger)" : "var(--color-success)" }} onClick={(e) => {
            e.stopPropagation();
            this.showEvaluationDetail(record);
          }}>
            {isRed ? this.$T("spcm.common.view.viewHighRisk").$D("查看（高风险）") : this.$T("spcm.common.view.seeAgreementStage").$D("查看")}
          </div>;
        },
      } ]);
      return columns;
    },
    getLineDetailColumns(lineItem) {
      let isMPA = lineItem.pcKindCode === "CONGROUP002" || lineItem.pcKindCode === "CONGROUP001";
      // 协议时长<732天 (终止日期-起始日期)  需求src-6892
      const afterStartDate = moment(lineItem.startDateActive).add(732, "d");
      const startTime = Date.parse(moment(afterStartDate).format("YYYY-MM-DD"));
      const endTime = Date.parse(moment(lineItem.endDateActive).format("YYYY-MM-DD"));
      const effectDurationFlag = startTime > endTime; // 起始日期+732 > 终止日期则为true
      // a)协议有效时长<732
      // b)单家门店  attribute13
      // c)协议类型为垃圾清运合同
      // d)是否用户确认符合Legal的授权条款  attribute14
      let isLegalApproval = lineItem.attribute13 === "1" && lineItem.pcTypeCode === "CONTYPE801" && effectDurationFlag;
      let columns = [ {
        fieldName: this.$T("spcm.common.model.common.pcName").$D("协议名称"),
        fieldType: "TEXT",
        fieldCode: "pcName",
      }, {
        fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
        fieldCode: "pcTypeName",
        fieldType: "TEXT",
      }, isLegalApproval && {
        fieldName: this.$T("spcm.common.model.isLegalApproval").$D("符合授权条件，无需法务审批"),
        fieldCode: "attribute14",
        fieldType: "TEXT",
        render: (val) => <div>
          {val && Number(val) ? <span style={"color: red"}>{this.$T("smbl.common.view.yes").$D("是")}</span> : <span>{this.$T("smbl.common.view.no").$D("否")}</span>}
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.isLegalApproval").$D("如垃圾清运合同符合以下条件时，授权业务部门可自行处理协议：（1）垃圾清运合同为一次性制式合同；（2）此协议只适用于单家门店；（3）本协议有效期不超过两年；（4）Line Director及以上审批本份合同");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      }, !isMPA ? {
        fieldName: "MPA/MSA",
        fieldType: "TEXT",
        fieldCode: "mpaMsa",
        valueBefore: (record) => this.showIntelIcon("mpaMsa", record)
      } : null, !this.supplementFlag ? {
        fieldName: this.$T("spcm.common.model.common.contractInfo").$D("协议情况"),
        fieldType: "TEXT",
        fieldCode: "contractSituation",
      } : null, !this.supplementFlag ? {
        fieldName: this.$T("hzero.common.status").$D("状态"),
        fieldCode: "pcStatusCodeMeaning",
        fieldType: "TEXT",
      } : null, !this.supplementFlag ? {
        fieldName: this.$T("smbl.common.model.standardContractTemplate").$D("是否标准合同模板"),
        fieldType: "TEXT",
        fieldCode: "isTemplate",
        render: (val, record) => {
          if (val !== "N") {
            return val ? this.$T("smbl.common.view.yes").$D("是") : "-";
          }
          return <srm-flex style="color: var(--color-danger);">
            <span>{this.$T("smbl.common.view.no").$D("否")}</span>
            <div class="more-info-icon srm-icon icon-help" onClick={
              (e) => {
                e.stopPropagation();
                this.moreInfoContent = record.attributeLongtext9;
                this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                this.moreInfoPopupFlag = true;
              }
            }/>
          </srm-flex>;
        },
      } : null, ];
      // 根据需要展示后面的字段
      if (isMPA) {
        return columns;
      }
      columns = columns.concat([ !this.supplementFlag ? {
        fieldName: this.supplementFlag ? this.$T("spcm.contractmoney.model.AmountOfOriginalAgreement").$D("原协议金额") : this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal4",
        render: (val) => <div>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountOfThisAgreement").$D("本次协议的合作金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      } : null, !this.supplementFlag3 && {
        fieldName: this.$T("spcm.contractmoney.model.totalApprovedContractAmount").$D("累积已审批合同金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal3",
        render: (val, record) => <div>
          <span style={val > 0 ? "color: var(--color-success);" : ""} onClick={(e) => {
            e.stopPropagation();
            val > 0 && this.showApprovedAmountList(record);
          }}>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
          <span class="more-info-icon srm-icon icon-help" onClick={
            (e) => {
              e.stopPropagation();
              this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.CumulativeApprovedContractAmount").$D("除本协议外，本财年已累计审批的合同金额");
              this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
              this.moreInfoPopupFlag = true;
            }
          }/>
        </div>,
      }, {
        fieldName: this.$T("spcm.contractmoney.model.attributeVarchar13").$D("付款条款（NET）"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar13",
      }, {
        fieldName: this.$T("spcm.contractmoney.model.attributeVarchar1").$D("是否包含预付款"),
        fieldType: "TEXT",
        fieldCode: "attributeVarchar1",
        render: (val) => val && Number(val) ? <span>{this.$T("smbl.common.view.yes").$D("是")}</span> : <span>{this.$T("smbl.common.view.no").$D("否")}</span>
      // eslint-disable-next-line eqeqeq
      }, lineItem.attributeVarchar1 == 1 ? {
        fieldName: this.$T("spcm.contractmoney.model.attributeDecimal1").$D("预付款比例（%）"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal1",
      } : null, this.attributeVarchar31 === "1" ? {
        fieldName: this.$T("spcm.contractmoney.approvalAmount1").$D("本次合同金额增量"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal14",
        render: (val) => <div style={{ color: "red" }}>
          <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
        </div>
      } : null, {
      // {
      //   fieldName: this.$T("spcm.contractmoney.model.totalEstimateAmountOfYear").$D("财年预估合同签订总金额"),
      //   fieldType: "TEXT",
      //   fieldCode: "attributeDecimal2",
      //   render: (val) => <div>
      //     <span>{val === null || typeof val === "undefined" || val === "" ? val : SrmUtil.getNumberLocalized(val) + " " + "CNY"}</span>
      //     <span class="more-info-icon srm-icon icon-help" onClick={
      //       (e) => {
      //         e.stopPropagation();
      //         this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.EstimatedTotalSignedFiscalYear").$D("本财年预计与该供应商签订的协议总金额");
      //         this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
      //         this.moreInfoPopupFlag = true;
      //       }
      //     }/>
      //   </div>,
      // },{
        fieldName: this.$T("spcm.common.model.common.validityDateFrom").$D("有效期从"),
        fieldType: "TEXT",
        fieldCode: "startDateActive",
        render: (val) => {
          if (!val) {
            return <span>{val}</span>;
          }
          let list = val.split(" ");
          if (list.length > 0) {
            return <span>{list[0]}</span>;
          }
          return <span>{val}</span>;
        },
      }, {
        fieldName: this.$T("spcm.common.model.common.validityDateTo").$D("有效期至"),
        fieldType: "TEXT",
        fieldCode: "endDateActive",
        render: (val) => {
          if (!val) {
            return <span>{this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.longTermFlag").$D("长期")}</span>;
          }
          let list = val.split(" ");
          if (list.length > 0) {
            return <span>{list[0]}</span>;
          }
          return <span>{val}</span>;
        },
      }, ]);
      return columns;
    },
    async getProjectQuoteLinesInfo(sourceProjectId) {
      this.rfqListInfo = [];
      this.rfpListInfo = [];
      this.rfiListInfo = [];
      let projectQuoteLines = await getProjectQuoteLinesApi(sourceProjectId);
      let projectQuotes = projectQuoteLines.projectQuotes || [];
      projectQuotes.forEach((record) => {
        if (record.document.sourceFrom === "RFI") {
          let listInfo = [];
          // eslint-disable-next-line no-unused-vars
          for (let key in record) {
            if (key !== "document" && key !== "sourceDetail") {
              let itemObj = {};
              //截取公司名称
              itemObj.projectQuotesName = key.substr(key.indexOf("_") + 1, key.length);
              itemObj.sourceFrom = "RFI";
              record[key].forEach((val) => {
                if (val.detailKey === "quotationAttachment_rf") {
                  // 1、征询方案附件
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.rfiAttachmentUuid : uuid();
                } else if (val.detailKey === "quotationAmount") {
                  // 2、报价总价
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.quotationAmount : "";
                } else if (val.detailKey === "bidAmount") {
                  // 3、中标总价
                  let currencyCode = val.detailValue !== null && typeof val.detailValue.currencyCode !== "undefined" && val.detailValue.currencyCode !== null ? val.detailValue.currencyCode : "";
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.bidAmount + " " + currencyCode : "";
                } else if (val.detailKey === "summaryScore") {
                  // 4、评分
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                } else if (val.detailKey === "summaryRank") {
                  // 5、排名
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                }
              });
              listInfo.push(itemObj);
            }
          }
          let currentRecord = record || [];
          //排序处理:summaryRank
          listInfo.sort(function(a, b) {
            let aVaule = a.summaryRank === "" ? 1000 : a.summaryRank;
            let bVaule = b.summaryRank === "" ? 1000 : b.summaryRank;
            a.summaryRank === "" ? 1000 : a;
            b.summaryRank === "" ? 1000 : b;
            return aVaule - bVaule;
          });
          currentRecord.rfxListInfo = listInfo;
          this.rfiListInfo.push(currentRecord);
        } else if (record.document.sourceFrom === "RFP") {
          let listInfo = [];
          // eslint-disable-next-line no-unused-vars
          for (let key in record) {
            if (key !== "document" && key !== "sourceDetail") {
              let itemObj = {};
              //截取公司名称
              itemObj.projectQuotesName = key.substr(key.indexOf("_") + 1, key.length);
              itemObj.sourceFrom = "RFP";
              record[key].forEach((val) => {
                if (val.detailKey === "quotationAttachment_rf") {
                  // 1、征询方案附件
                  itemObj["businessAttachmentUuid"] = val.detailValue !== null ? val.detailValue.businessAttachmentUuid : uuid();
                  itemObj["techAttachmentUuid"] = val.detailValue !== null ? val.detailValue.techAttachmentUuid : uuid();
                } else if (val.detailKey === "quotationAmount") {
                  // 2、报价总价
                  let currencyCode = val.detailValue !== null && typeof val.detailValue.currencyCode !== "undefined" && val.detailValue.currencyCode !== null ? val.detailValue.currencyCode : "";
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.quotationAmount + " " + currencyCode : "";
                } else if (val.detailKey === "bidAmount") {
                  // 3、中标总价
                  let currencyCode = val.detailValue !== null && typeof val.detailValue.currencyCode !== "undefined" && val.detailValue.currencyCode !== null ? val.detailValue.currencyCode : "";
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.bidAmount + " " + currencyCode : "";
                } else if (val.detailKey === "summaryScore") {
                  // 4、评分
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                } else if (val.detailKey === "summaryRank") {
                  // 5、排名
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                }
              });
              listInfo.push(itemObj);
            }
          }
          let currentRecord = record || [];
          //排序处理:summaryRank
          listInfo.sort(function(a, b) {
            let aVaule = a.summaryRank === "" ? 1000 : a.summaryRank;
            let bVaule = b.summaryRank === "" ? 1000 : b.summaryRank;
            a.summaryRank === "" ? 1000 : a;
            b.summaryRank === "" ? 1000 : b;
            return aVaule - bVaule;
          });
          currentRecord.rfxListInfo = listInfo;
          this.rfpListInfo.push(currentRecord);
        } else if (record.document.sourceFrom === "RFX") {
          let listInfo = [];
          // eslint-disable-next-line no-unused-vars
          for (let key in record) {
            if (key !== "document" && key !== "sourceDetail") {
              let itemObj = {};
              //截取公司名称
              itemObj.projectQuotesName = key.substr(key.indexOf("_") + 1, key.length);
              itemObj.sourceFrom = "RFX";
              record[key].forEach((val) => {
                if (val.detailKey === "quotationAttachment") {
                  // 1、征询方案附件
                  itemObj["businessAttachmentUuid"] = val.detailValue !== null ? val.detailValue.businessAttachmentUuid : uuid();
                  itemObj["techAttachmentUuid"] = val.detailValue !== null ? val.detailValue.techAttachmentUuid : uuid();
                } else if (val.detailKey === "quotationAmount") {
                  // 2、报价总价
                  let currencyCode = val.detailValue !== null && typeof val.detailValue.currencyCode !== "undefined" && val.detailValue.currencyCode !== null ? val.detailValue.currencyCode : "";
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.quotationAmount + " " + currencyCode : "";
                } else if (val.detailKey === "bidAmount") {
                  // 3、中标总价
                  let currencyCode = val.detailValue !== null && typeof val.detailValue.currencyCode !== "undefined" && val.detailValue.currencyCode !== null ? val.detailValue.currencyCode : "";
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue.bidAmount + " " + currencyCode : "";
                } else if (val.detailKey === "summaryScore") {
                  // 4、评分
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                } else if (val.detailKey === "summaryRank") {
                  // 5、排名
                  itemObj[val.detailKey] = val.detailValue !== null ? val.detailValue : "";
                }
              });
              listInfo.push(itemObj);
            }
          }
          let currentRecord = record || [];
          //排序处理:summaryRank
          listInfo.sort(function(a, b) {
            let aVaule = a.summaryRank === "" ? 1000 : a.summaryRank;
            let bVaule = b.summaryRank === "" ? 1000 : b.summaryRank;
            a.summaryRank === "" ? 1000 : a;
            b.summaryRank === "" ? 1000 : b;
            return aVaule - bVaule;
          });
          currentRecord.rfxListInfo = listInfo;
          this.rfqListInfo.push(currentRecord);
        }
      });
      // console.log("rfiListInfo:", this.rfiListInfo);
      // console.log("rfpListInfo:", this.rfpListInfo);
      // console.log("rfqListInfo:", this.rfqListInfo);
      // console.log("projectQuoteLines:", projectQuoteLines);
    },
    async requestData() {
      this.$loading.show();
      let pcHeaderId = this.parameters.pcHeaderId;
      let isTermination = this.parameters.isTermination;
      let baseInfoRes = await getBaseInfoApi(pcHeaderId, {
        isTermination,
        customizeUnitCode: "SPCM.PURCHASE_CONTRACT_MAINTAIN.DETAIL.READONLY",
      });
      let costDetailsRes = await getProtocolDetailApi(pcHeaderId, { isTermination });
      let costDetails = costDetailsRes.content || [];
      for (let index = 0; index < costDetails.length; index++) {
        let item = costDetails[index];
        let isMPA = item.pcKindCode === "CONGROUP002" || item.pcKindCode === "CONGROUP001";
        if (!isMPA) {
          // 寻源详情-总结果（列表）
          let rfxDetailsRes = await getRfxDetailApi(item.pcHeaderId);
          // 对应item的寻源详情包，遍历列表防止数据出现多个时错乱
          let currentRfxDetailBag = {};
          rfxDetailsRes = rfxDetailsRes || [];
          rfxDetailsRes.forEach((i) => {
            if (i.pcNum === item.pcNum) {
              currentRfxDetailBag = i;
            }
          });
          // 对应item的寻源详情列表
          let currentRfxDetailList = currentRfxDetailBag.rfxQuotationSummaryDTOS || [];
          // 获取“是否单一供应商”和“单一供应商理由”
          if (currentRfxDetailList.length) {
            item.rfxDetail = currentRfxDetailBag;
            let rfxDetail = currentRfxDetailList[0];
            // item.singleSourceFlag = rfxDetail.singleSourceFlag;
            item.singleSourceFlag = rfxDetail.starbucksSourceMethod === "single";
            // 寻源方式
            item.starbucksSourceMethod = rfxDetail.starbucksSourceMethod;
            item.starbucksSourceMethodMeaning = rfxDetail.starbucksSourceMethodMeaning;
            item.checkRemark = rfxDetail.checkRemark;
          }

          // 获取供应商维度信息
          const supplierScoreResDs = new DataSet(supplierScoreResDS(item.pcHeaderId));
          await supplierScoreResDs.refresh();
          // E&C评估结果
          if (supplierScoreResDs?.current?.data) {
            const { ecAssessmentResults } = supplierScoreResDs.current.data;
            // 保存评估结果
            item.ecAssessmentResults = ecAssessmentResults;
          }
        }
      }
      this.transformHistoryData(pcHeaderId);
      this.baseInfo = baseInfoRes;
      this.supplementFlag = this.baseInfo?.supplementFlag === 1;
      this.attributeVarchar31 = this.baseInfo?.attributeVarchar31;
      /* 协议条款变更: attributeVarchar31=null，supplementFlag=1,
        关联公司/经销商变更: attributeVarchar31=3,
        合同到期日变更: attributeVarchar31=4 */
      // 三种变更标识
      this.supplementFlag3 = [ "3", "4" ].includes(this.attributeVarchar31) || this.supplementFlag && !this.attributeVarchar31;
      this.costDetailLines = costDetails;
      this.isArchive = this.parameters?.type === "archive"; // 判断是否是归档流程
      this.$emit("getCostAttachment", this.baseInfo.purchaserAttachmentUuid); // 暂时没有合同附件功能
      this.$loading.hide();
    },
    // 查看基础信息详情
    showBaseInfoDetail() {
      this.baseInfoPopupFlag = true;
    },
    // 查看行信息详情
    showLineDetail(item) {
      let isMPA = item.pcKindCode === "CONGROUP002" || item.pcKindCode === "CONGROUP001";
      if (isMPA) { // MPA不允许进入详情页
        return;
      }
      this.displayLineItem = item;
      this.lineDetailPopupFlag = true;
    },
    // 查看标的详情
    showSubjectMatterList(record) {
      this.subjectListPopupFlag = true;
      this.subjectDataSet = new DataSet(subjectDatasource(record));
      this.subjectDataSet.refresh();
      if (record?.attributeVarchar31 === "5") {
        this.subjectDataSet.events.afterQuery = (ds, datas) => {
          const { content = [], totalElements = 0 } = datas?.[0]?.newSubjects || {};
          // 修正是否有下一页
          this.$nextTick(() => {
            ds.totalCount = totalElements;
            ds.hasMore = totalElements > ds.records.length;
            ds.paging = true;
            ds.isList = true;
          });
          return content;
        };
      }
    },
    // 合同累计金额列表
    showApprovedAmountList(record) {
      this.approvedAmountFlag = true;
      this.approvedAmountDataSet = new DataSet(amountDatasource(record));
      this.approvedAmountDataSet.refresh();
    },
    // 查看中标详情
    async showSuccessfulDetail(item) {
      // // 获取寻源详情的编号
      // let rfxNum = item.rfxDetail.rfxNum;
      // // 选中当前的item
      // this.successfulLineItem = item;
      // // 构造新的DataSet
      // this.rfxSuplliersDataSet = new DataSet(rfxDetailSuppliersDS(item.pcHeaderId, rfxNum));
      // // 弹起寻源详情框
      // this.successfulPopupFlag = true;
      // // 刷新数据
      // this.rfxSuplliersDataSet.refresh();
      this.getProjectQuoteLinesInfo(item.rfxDetail.sourceProjectId);
      // 弹起寻源详情框
      this.successfulPopupFlag = !this.successfulPopupFlag;
    },
    showEvaluationDetail(record) {
      this.evaluationContractCode = record.pcNum;
      this.evaluationPopupFlag = !this.evaluationPopupFlag;
      this.supplierScoreResDS = new DataSet(supplierScoreResDS(record.pcHeaderId));
      this.supplierScoreResDS.refresh();
      getSupplierFactoryScoreResApi(record.pcHeaderId).then((res) => {
        const newList = [];
        (res.content || []).forEach((r) => {
          const existIndex = newList.findIndex((l) => l.itemCategory === r.itemCategory && l.factoryName === r.factoryName);
          if (existIndex > -1) {
            newList[existIndex].list.push(r);
          } else {
            newList.push({ itemCategory: r.itemCategory, factoryName: r.factoryName, list: [ { ...r } ] });
          }
        });
        this.supplierFactoryScoreRes = newList;
      });
    },
    // 多供应商补充说明
    showSupplierExplain() {
      if (!this.successfulLineItem) {
        return;
      }
      this.moreInfoContent = this.successfulLineItem.checkRemark;
      this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
      this.moreInfoPopupFlag = true;
    },
    // 预览合同文本
    async previewContractFile(contractItem) {
      const { attributeBigint21, attributeTinyint6, attributeVarchar31, supplementFlag } = contractItem;
      const isMsaOrMpa = attributeTinyint6 === 1 && !this.isArchive;
      // 合同条款变更（attributeVarchar31=3）或法人变更（attributeVarchar31为空且supplementFlag=1）：审批表单的合同文本不取附件上传按钮里面的协议附件
      const isTeLegChange = attributeVarchar31 === "3" || !attributeVarchar31 && supplementFlag;
      const attachmentFlag = isMsaOrMpa && !isTeLegChange;
      if (attributeBigint21 === 1 || attachmentFlag) {
        if (!attachmentFlag) {
          this.$attachment({
            attachments: [
              {
                attachmentUuid: contractItem.attributeLongtext8,
                title: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
                readonly: true,
                showInfo: true,
                uploadButton: "none",
              },
            ],
          });
        } else {
          this.$attachment({
            attachments: [
              {
                attachmentUuid: contractItem.attachmentUuid,
                title: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
                readonly: true,
                showInfo: true,
                uploadButton: "none",
              },
            ],
          });
        }
      } else {
        let fileUrl = contractItem.attributeLongtext1;
        if (!fileUrl) {
          this.$notification.open({
            message: this.$T("smbl.common.view.message.getContractFileFailed").$D("获取合同文本失败"),
          });
          return;
        }
        SrmUtil.previewFile({
          bucketName: SrmUtil.getDefaultBucketName(),
          creationDate: contractItem.creationDate,
          fileName: "contract.pdf",
          fileUrl: fileUrl,
        });
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card-head-left {
  max-width: 80% !important;
}

.protocol-approval {
  .card {
    padding-top: 10px;
  }
  .card-title-container {
    overflow: hidden;
    .title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .bold-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .cutting-line {
    margin: 0px 15px;
    height: 1px;
    background: var(--split-line-color-primary);
  }
  >>> .icon-info-circle {
    color: var(--font-color-disable);
  }
}
.base-info-list {
  >>>.srm-scroll-tab-bar-box span:nth-child(3) {
    color: #006341;
  }
}

>>> .srm-popup-content {
  background: var(--background-color-empty-second);
}
.more-info-popup {
  >>> .srm-popup-content {
    background: var(--background-color-empty);
  }
}
.more-info-icon {
  color: var(--font-color-disable);
  margin-left: 6px;
}
.arrow-icon {
  width: 16px;
  height: 16px;
  background-color: var(--color-ghost-success);
  border-radius: 8px;
  line-height: 16px;
  font-size: 14px;
  color: var(--color-success);
  text-align: center;
  flex-shrink: 0;
}
.attachment-icon {
  padding: 0px 6px;
  color: var(--color-success);
}
.subject-card {
  padding: 6px 15px 16px 15px;
  border-top: 1px solid var(--split-line-color-primary);
  background: var(--background-color-empty);
}
.bottom-space-view {
  height: 0px;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
.factory-header-title {
  padding: 10px 15px;
}
.srm-header-title {
  padding: 10px 15px;
  font-size: 12px;
}
.contract-category {
  padding-left: 15px;
  font-size: 12px;
}
.change-invalid {
  color:var(--color-font-default-b);
}
.smart-wrapper {
  padding: 8px 16px;
  .smart-tips {
    font-weight: normal;
    >>> &.srm-list-item-card-head {
      .srm-list-item-card-head-left {
        font-weight: normal;
        font-size: 3.1vw;
        color: var(--font-color-field2);
      }
      .srm-list-item-card-head-right {
        font-weight: normal;
        font-size: 3.2vw;
      }
    }
  }
}
.srm-icon-diff {
  vertical-align: middle;
}
.smart-tips-pop {
  padding: 0px 10px 15px
  font-size: 14px;
  .smart-tips-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border-default);
  }
  .smart-tips-item-icon {
    margin-right: 10px;
  }
  .smart-tips-item-content {
    div:nth-child(1) {
    margin-bottom: 10px;
  }
  }
}
</style>