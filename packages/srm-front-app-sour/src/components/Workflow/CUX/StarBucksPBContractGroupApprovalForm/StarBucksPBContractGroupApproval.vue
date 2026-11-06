<template>
  <div class="protocol-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('spcm.common.view.message.title.basicInformation').$D('基础信息')">
        <div class="card" @click="showBaseInfoDetail">
          <customize class="baseInfo" :need-padding="true" :columns="getBaseInfoColumns" :data-source="baseInfo" type="list" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('spcm.purchaseContractView.contractDetail').$D('协议详情')">
        <div v-for="(item, index) in costDetailLines" :key="index">
          <div class="card" @click="showLineDetail(item)">
            <customize :need-padding="true" :columns="getProtocolLineColumns(item)" :data-source="item" type="list" />
            <div class="cutting-line" />
          </div>
        </div>
        <!-- 适配iPhoneX -->
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>
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
    <!-- 合同累计金额列表 -->
    <srm-popup :visible.sync="approvedAmountFlag" class="amount-list-popup" position="right" :title="(costDetailLines[0] || {}).pcNum" :show-back="true" :show-close="false" width="100%" >
      <srm-list v-if="approvedAmountDataSet" :data-set="approvedAmountDataSet" :columns="getApprovedAmountColumns" />
    </srm-popup>
    <!-- 查看标的详情弹框 -->
    <srm-popup :visible.sync="subjectListPopupFlag" class="subject-list-popup" position="right" :title="$T('smbl.common.view.title.object').$D('标的')" :show-back="true" :show-close="false" width="100%" >
      <srm-list v-if="subjectDataSet" :data-set="subjectDataSet" :columns="getSubjectListColumns"/>
    </srm-popup>
    <!-- 中标详情弹框 -->
    <srm-popup :visible.sync="successfulPopupFlag" class="successful-popup" position="right" :title="$T('smbl.common.view.title.sourceDetail').$D('寻源详情')" :show-back="true" :show-close="false" width="100%" >
      <!-- <srm-flex :style="{
        'color': 'var(--font-color-default)',
        'padding': '0px 15px',
        'fontSize': '14px',
        'lineHeight': '53px',
        'background': 'var(--background-color-empty)',
        'border-bottom': '1px solid var(--split-line-color-primary)',
        'border-top': '8px solid var(--background-color-empty-second)',
      }">
        <span>{{ $T("spcm.purchaseContractView.view.form.supplierCompanyName").$D("供应商") }}：{{ successfulLineItem.singleSourceFlag ? $T("smbl.common.model.singleSupplier").$D("单一供应商") : $T("smbl.common.model.multipleSuppliers").$D("多个供应商") }}</span>
        <div v-if="successfulLineItem.singleSourceFlag" class="more-info-icon srm-icon icon-help" @click="showSupplierExplain"/>
      </srm-flex>
      <srm-list v-if="rfxSuplliersDataSet" :data-set="rfxSuplliersDataSet" :columns="getSuccessfulDetailColumns" /> -->
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
        <div style="whiteSpace: pre-line;" v-html="moreInfoContent" >
          {{ moreInfoContent }}
        </div>
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
} from "./api/index";
import uuid from "uuid";
import moment from "moment";
import { DataSet, SrmMath, SrmUtil } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { subjectDatasource, supplierScoreResDS } from "./dataSource/SubjectDatasource";
import { amountDatasource } from "./dataSource/AmountDatasource";
// import { rfxDetailSuppliersDS } from "./dataSource/RfxDetailSuppliersDS";
export default {
  modules: [ "smbl.common", "spcm.common", "spcm.contractApproval", "spcm.contractmoney", "spcm.purchaseContractView", "hipspfm.order", "ssrc.inquiryHall", "sprm.common", "hipspfm.common", "ssrc.bidHall", "scux.supplierOpenAccount", "hzero.common", "spcm.starbucks" ],
  name: "StarBucksPBContractGroupApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      baseInfo: {},
      costDetailLines: [],
      displayLineItem: {},
      baseInfoPopupFlag: false,
      lineDetailPopupFlag: false,
      supplierOracleMap: {},
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
      ];
    },
    getBaseInfoColumns() {
      return [
        {
          fieldName: this.$T("spcm.purchaseContractView.model.majorityName").$D("需求部门"),
          fieldType: "TEXT",
          fieldCode: "majorityName",
          render: (val) => val && val.map((v) => <div>{v}</div>),
        }, {
          fieldName: this.$T("spcm.purchaseContractView.pb.contractGoal").$D("协议目的"),
          fieldType: "TEXT",
          fieldCode: "contractPurpose",
          render: (val) => <srm-flex justify="between" class="card-title-container">
            <div class="title">{val}</div>
            <div class="arrow-icon srm-icon icon-chevron-right"></div>
          </srm-flex>,
        }, {
          fieldName: this.$T("spcm.purchaseContractView.pb.contractSubject").$D("合同标的"),
          fieldType: "TEXT",
          fieldCode: "contractSubject",
        }, {
          fieldName: this.$T("spcm.common.model.common.currentApprovalTotalAmount").$D("本次审批总金额"),
          fieldType: "TEXT",
          fieldCode: "totalApprovedAmount",
          render: (val) => {
            if (val === null || typeof val === "undefined" || val === "") {
              return val;
            }
            return SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY";
          }
        },
      ];
    },
    getBaseInfoDetailColumns() {
      return [ {
        fieldName: this.$T("spcm.contractmoney.PartyA").$D("甲方"),
        fieldType: "TEXT",
        fieldCode: "companyName",
        render: (val) => {
          if (val instanceof Array && val.length > 0) {
            return val.map((company) => <div>{company}</div>);
          }
          return null;
        },
      }, {
        fieldName: this.$T("spcm.contractmoney.PartyB").$D("乙方"),
        fieldType: "TEXT",
        fieldCode: "supplierCompanyName",
        render: (val) => {
          if (!(val instanceof Array)) {
            return <div />;
          }
          return <div>
            {
              val.map((company) => <div>
                <span>{company.supplierCompanyName}</span>
                { !company.isOracle ? <span class="more-info-icon srm-icon icon-help" onClick={ (e) => {
                  e.stopPropagation();
                  this.moreInfoContent = this.$T("spcm.contractmoney.newSupplier").$D("新供商");
                  this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                  this.moreInfoPopupFlag = true;
                }
                }/> : <span />
                }</div>)
            }
          </div>;
        },
      }, {
        fieldName: this.$T("spcm.purchaseContractView.model.majorityName").$D("需求部门"),
        fieldType: "TEXT",
        fieldCode: "majorityName",
        render: (val) => val && val.map((v) => <div>{v}</div>),
      }, {
        fieldName: this.$T("spcm.purchaseContractView.pb.contractGoal").$D("协议目的"),
        fieldType: "TEXT",
        fieldCode: "contractPurpose",
      }, {
        fieldName: this.$T("spcm.purchaseContractView.pb.contractSubject").$D("合同标的"),
        fieldType: "TEXT",
        fieldCode: "contractSubject",
      }, {
        fieldName: this.$T("hzero.common.remark").$D("备注"),
        fieldType: "TEXT",
        fieldCode: "remark",
      }, {
        fieldName: this.$T("spcm.common.model.common.currentApprovalTotalAmount").$D("本次审批总金额"),
        fieldType: "TEXT",
        fieldCode: "totalApprovedAmount",
        render: (val) => {
          if (val === null || typeof val === "undefined" || val === "") {
            return val;
          }
          return SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY";
        }
      }, {
        fieldName: "Target Margin%",
        fieldType: "TEXT",
        fieldCode: "aopMarkin",
      }, {
        fieldName: "Actual Margin%",
        fieldType: "TEXT",
        fieldCode: "actualMarkin",
        render: (val, item) => <span style={{
          "color": Number(val) < Number(item.aopMarkin) ? "var(--color-danger)" : "var(--font-color-default)",
        }}>{val || "-"}</span>,
      }, {
        fieldName: "Avg Margin of Last Year%",
        fieldType: "TEXT",
        fieldCode: "amofLastYear",
      }, {
        fieldName: this.$T("spcm.purchaseContractView.pb.annualizedAmount").$D("年化金额"),
        fieldType: "TEXT",
        fieldCode: "annualizedAmount",
        render: (val) => {
          if (val === null || typeof val === "undefined" || val === "") {
            return val;
          }
          return SrmUtil.getNumberLocalized(val) + " " + "CNY";
        }
      }, {
        fieldName: this.$T("spcm.purchaseContractView.pb.contractSaving").$D("Cost Saving"),
        fieldType: "TEXT",
        fieldCode: "contractSaving",
        render: (val) => {
          if (val === null || typeof val === "undefined" || val === "") {
            return val;
          }
          return SrmUtil.getNumberLocalized(val) + " " + "CNY";
        }
      }, {
        fieldName: this.$T("spcm.purchaseContractView.pb.contractAvoidance").$D("Cost Avoidence"),
        fieldType: "TEXT",
        fieldCode: "contractAvoidance",
        render: (val) => {
          if (val === null || typeof val === "undefined" || val === "") {
            return val;
          }
          return SrmUtil.getNumberLocalized(val) + " " + "CNY";
        }
      }, ];
    },
    getSubjectListColumns() {
      return [ {
        fieldName: "name",
        fieldType: "EMPTY",
        fieldCode: "itemName",
        formRow: 10,
        formCol: 10,
        render: (val, record) => <div style="color: var(--font-color-default); fontSize: 14px; fontWeight: bold;">
          {record.lineNum ? record.lineNum + "-" : ""}{val}
        </div>,
      }, {
        fieldName: this.$T("spcm.contractmoney.purchaseType").$D("品类"),
        fieldType: "TEXT",
        fieldCode: "categoryName",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("spcm.contractmoney.unitOfMeasurement").$D("计量单位"),
        fieldType: "TEXT",
        fieldCode: "uomName",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("spcm.common.model.common.taxNum").$D("税率"),
        fieldType: "TEXT",
        fieldCode: "taxRate",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("spcm.contractmoney.model.TaxInclusivePrice").$D("含税价格(元)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "taxIncludedUnitPrice",
        formRow: 40,
        formCol: 20,
      }, ];
    },
    // 合同累计金额列表
    getApprovedAmountColumns() {
      return [
        {
          fieldName: this.$T("spcm.common.model.common.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
          fieldType: "TEXT",
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
        {
          fieldName: this.$T("spcm.starbucks.AmountApprovedThisTime").$D("本次审批金额"),
          fieldCode: "executeApprovalAmount",
          fieldType: "TEXT",
        },
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
        },
        {
          fieldCode: "endDateActive",
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldType: "TEXT",
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
    // this.$emit("getCostAttachment", ""); // 暂时没有合同附件功能
    this.requestData();
  },
  methods: {
    getProtocolLineColumns(lineItem) {
      let isMPA = lineItem.pcKindCode === "CONGROUP002" || lineItem.pcKindCode === "CONGROUP001";
      let isPsOrSow = lineItem.pcKindCode === "CONGROUP005" || lineItem.pcKindCode === "CONGROUP006";
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
                <span style="fontSize: 14px;fontWeight: normal">{this.$T("spcm.common.model.common.agreementText").$D("(协议文本)")}</span>
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
          render: (val, record) => {
            let isOracle = this.supplierOracleMap[record.supplierCompanyNum || ""];
            if (isOracle === null || typeof isOracle === "undefined") {
              isOracle = 1;
            }
            return <srm-flex class="card-title-container">
              <div class="title">{val}</div>
              { !isOracle ? <div class="more-info-icon srm-icon icon-help" onClick={
                (e) => {
                  e.stopPropagation();
                  this.moreInfoContent = this.$T("spcm.contractmoney.newSupplier").$D("新供商");
                  this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                  this.moreInfoPopupFlag = true;
                }}/> : <span />}
            </srm-flex>;
          }
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
        }, {
          fieldName: this.$T("spcm.common.model.common.contractInfo").$D("协议情况"),
          fieldType: "TEXT",
          fieldCode: "contractSituation",
        }, {
          fieldName: this.$T("hzero.common.status").$D("状态"),
          fieldCode: "pcStatusCodeMeaning",
          fieldType: "TEXT",
        }, {
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
        },
      ];
      // 根据需要展示后面的字段
      if (isMPA) {
        return columns;
      }
      columns = columns.concat([ {
        fieldName: this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
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
      }, {
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
      isPsOrSow ? {
        fieldName: this.$T("spcm.contractmoney.approvalAmount").$D("本次审批金额"),
        fieldType: "TEXT",
        fieldCode: "attributeDecimal6",
        render: (val, record) => {
          const isRed = record.attributeDecimal4 < record.attributeDecimal6 && record.attributeDecimal4 < 1000000;
          return <div>
            <span style={{ color: isRed && "red" }}>{val === null || typeof val === "undefined" || val === "" ? val : SrmMath.toFormat(val, 2, BigNumber.ROUND_HALF_CEIL) + " " + "CNY"}</span>
            <span class="more-info-icon srm-icon icon-help" onClick={
              (e) => {
                e.stopPropagation();
                if (isRed) {
                  this.moreInfoContent = this.$T("spcm.starbucks.msg.AmountApprovedThisTime").$D("本协议审批金额已涉及累积审批，或协议申请人维护了较大的财年预估签订总金额");
                } else {
                  this.moreInfoContent = this.$T("spcm.purchaseContractView.pb.tips.AmountApprovedThisTime").$D("本合同走审批流程的金额 <br/>（1）如本次协议金额+累积已审批合同金额<前一份合同审批金额时，本次审批金额=本次协议金额<br/>（2）如本次协议金额+累积已审批合同金额>前一份合同审批金额时，本次审批金额=财年预估签订总金额");
                }
                this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                this.moreInfoPopupFlag = true;
              }
            }/>
          </div>;
        },
      } : null, {
        fieldName: this.$T("spcm.common.model.common.validityDateFrom").$D("有效期从"),
        fieldType: "TEXT",
        fieldCode: "startDateActive",
        render: (val, record) => {
          if (!val) {
            return val;
          }
          let list = val.split(" ");
          const newVal = list.length > 0 ? list[0] : val;
          return record.contractLabel.includes("BACKDATING_CONTRACT") ? <srm-flex>
            <span style="color: var(--color-danger);">{newVal}</span>
            <div class="more-info-icon srm-icon icon-help" onClick={
              (e) => {
                e.stopPropagation();
                this.moreInfoContent = this.$T("spcm.common.contractApproval.starbucks.view.reverseContract").$D("倒签合同");
                this.moreInfoTitle = this.$T("smbl.common.view.title.supplementaryExplanation").$D("补充说明");
                this.moreInfoPopupFlag = true;
              }
            }/>
          </srm-flex> : newVal;
        },
      }, {
        fieldName: this.$T("spcm.common.model.common.validityDateTo").$D("有效期至"),
        fieldType: "TEXT",
        fieldCode: "endDateActive",
        render: (val) => {
          if (!val) {
            return this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.longTermFlag").$D("长期");
          }
          let list = val.split(" ");
          if (list.length > 0) {
            return list[0];
          }
          return val;
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
          // let singleSourceFlag = record.rfxQuotationSummaryDTOS ? record.rfxQuotationSummaryDTOS.singleSourceFlag : record.singleSourceFlag;
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
      } : null, {
        fieldName: this.$T("spcm.common.model.common.contractInfo").$D("协议情况"),
        fieldType: "TEXT",
        fieldCode: "contractSituation",
      }, {
        fieldName: this.$T("hzero.common.status").$D("状态"),
        fieldCode: "pcStatusCodeMeaning",
        fieldType: "TEXT",
      }, {
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
      }, ];
      // 根据需要展示后面的字段
      if (isMPA) {
        return columns;
      }
      columns = columns.concat([ {
        fieldName: this.$T("spcm.contractmoney.model.contractAmount").$D("本次合同金额"),
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
      }, {
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
      {
        fieldName: this.$T("spcm.common.model.common.validityDateFrom").$D("有效期从"),
        fieldType: "TEXT",
        fieldCode: "startDateActive",
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
      }, {
        fieldName: this.$T("spcm.common.model.common.validityDateTo").$D("有效期至"),
        fieldType: "TEXT",
        fieldCode: "endDateActive",
        render: (val) => {
          if (!val) {
            return this.$T("scux.supplierOpenAccount.modal.supplierOpenAccount.longTermFlag").$D("长期");
          }
          let list = val.split(" ");
          if (list.length > 0) {
            return list[0];
          }
          return val;
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
      let pbContractId = this.parameters.pbContractId;
      let baseInfoRes = await getBaseInfoApi(pbContractId);
      let costDetailsRes = await getProtocolDetailApi(pbContractId);
      let costDetails = costDetailsRes.content || [];
      let rfxDetailsRes = await getRfxDetailApi(pbContractId);
      let rfxDetailsList = rfxDetailsRes.content || [];

      // 整合供应商标记
      let suppliersList = baseInfoRes.supplierCompanyName || [];
      suppliersList.map((item) => {
        this.supplierOracleMap[item.supplierCompanyNum] = item.isOracle === null ? 1 : item.isOracle;
      });

      // 寻源详情包-map
      let rfxDetailBagMap = {};
      rfxDetailsList.forEach((rfxBag) => {
        rfxDetailBagMap[rfxBag.pcNum] = rfxBag;
      });
      costDetails.forEach(async (costItem) => {
        let isMPA = costItem.pcKindCode === "CONGROUP002" || costItem.pcKindCode === "CONGROUP001";
        if (!isMPA) {
          // 获取对应的寻源详情包
          let rfxBag = rfxDetailBagMap[costItem.pcNum] || {};
          // 获取对应的寻源详情列表
          let rfxItemList = rfxBag.rfxQuotationSummaryDTOS || [];
          // 获取“是否单一供应商”和“单一供应商理由”
          if (rfxItemList.length) {
            costItem.rfxDetail = rfxBag;
            let rfxDetail = rfxItemList[0];
            // costItem.singleSourceFlag = rfxDetail.singleSourceFlag;
            costItem.singleSourceFlag = rfxDetail.starbucksSourceMethod === "single";
            // 寻源方式
            costItem.starbucksSourceMethod = rfxDetail.starbucksSourceMethod;
            costItem.starbucksSourceMethodMeaning = rfxDetail.starbucksSourceMethodMeaning;
            costItem.checkRemark = rfxDetail.checkRemark;
          }

          // 获取供应商维度信息
          const supplierScoreResDs = new DataSet(supplierScoreResDS(costItem.pcHeaderId));
          await supplierScoreResDs.refresh();
          // E&C评估结果
          if (supplierScoreResDs?.current?.data) {
            const { ecAssessmentResults } = supplierScoreResDs.current.data;
            // 保存评估结果
            costItem.ecAssessmentResults = ecAssessmentResults;
          }
        }
      });
      // loading
      this.baseInfo = baseInfoRes;
      this.costDetailLines = costDetails;
      this.$emit("getPbAttachment", this.baseInfo.attachment); // pb组合附件
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
      this.subjectDataSet = new DataSet(subjectDatasource(record.pcHeaderId));
      this.subjectDataSet.refresh();
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
      // let rfxNum = item.rfxDetail && item.rfxDetail.rfxNum;
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
      if (contractItem.attributeBigint21 === 1) {
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
      } else if ([ "CONTYPE204", "CONTYPE105" ].includes(contractItem.pcTypeCode)) {
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

>>> .srm-popup-content {
  background: var(--background-color-empty-second);
}
.more-info-popup {
  >>> .srm-popup-content {
    background: var(--background-color-empty);
  }
}
.baseInfo {
  >>> .customize-item:first-child {
    .srm-field-wrapper {
      align-items: flex-start
    }
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
.contract-category {
  padding-left: 15px;
  font-size: 12px;
}
.factory-header-title {
  padding: 10px 15px;
}
.srm-header-title {
  padding: 10px 15px;
  font-size: 12px;
}
</style>