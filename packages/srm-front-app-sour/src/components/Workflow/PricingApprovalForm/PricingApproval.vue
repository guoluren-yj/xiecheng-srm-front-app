<template>
  <div class="pricing-approval">
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.PRICING_APPROVAL.TABS">
      <div v-if="projectSection.length" class="tab" :style="{whiteSpace: showAllTabs ? 'normal' : 'nowrap'}">
        <div class="tab-container">
          <div v-for="(section, index) in projectSection" :key="index" class="tab-item-box">
            <touch-feedback active-class-name="tab-item-active">
              <span :class="['tab-item', {
                'tab-item-active': index === tabIndex
              }]" @click="changeTab(section, index)">
                {{ section.sectionName }}
              </span>
            </touch-feedback>
          </div>
        </div>
        <touch-feedback active-class-name="tab-trigger-active">
          <div class="tab-trigger" @click="triggerTab">
            <em class="srm-icon icon-grid"/>
          </div>
        </touch-feedback>
      </div>
      <srm-scroll-tab-item code="rfxTitle" :show-title="true" :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
        <div @click="showBaseDetail()">
          <customize
            style="padding: 16px 15px"
            :columns="getHeaderInfoColumns()"
            :data-source="headInfo" type="list" :need-padding="false"
            code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_INFO"
            :class="['header-info-class', {
              'weilong-header-info-class': getTenantNum === 'SRM-WEILONG'
            }]"/>
        </div>
        <div v-if="getTenantNum === 'SRM-WEILONG'">
          <div v-for="(item, index) in weilongFileList" :key="index">
            <img :src="item" style="width: 100%" @click="$previewImage(weilongFileList,{ index: index })">
          </div>
        </div>
        <!-- <div class="header-box" @click="showHeaderDetail()">
          <srm-flex justify="between">
            <span class="title-bold">{{ headInfo.rfxNum }}
              <srm-tag size="small">{{ $T("ssrc.inquiryHall.bargain.roundNumber").$D("轮次") }}：{{ headInfo.roundNumber }}</srm-tag>
            </span>
            <span style="color: #276EF1; font-size: 10px" @click.stop="showFileList">{{ $T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件") }}</span>
          </srm-flex>
          <srm-flex justify="between" align="end">
            <span class="rfx-title" style="flex:1">
              {{ headInfo.rfxTitle }}
            </span>
            <srm-upload :show-icon="false"
                        :show-count="false"
                        :desc-title="$T('ssrc.inquiryHall.model.inquiryHall.checkAttachment').$D('核价附件')"
                        :attachment-uuid="headInfo.checkAttachmentUuid"
                        type="primary"
                        style="color: #276EF1;
                          font-size: 10px;
                          flex: 1;
                          display: flex;
                          justify-content: flex-end;
                          align-items: center;
                          margin-right: 0px;"/>
          </srm-flex>
        </div> -->
        <!-- 基于标准二开, 和记黄埔，src-11533 -->
        <div v-if="getTenantNum==='SRM-HUTCHMED'">
          <div class="pricing-approval-attachment-sum" style="marginTop: 16px;marginBottom: 2px">
            <div class="pricing-approval-attachment-sum-header"/>
            <div class="pricing-approval-attachment-sum-word">  {{ $T('hipspfm.pricingApproval.model.pricingApproval.executiveSummary').$D('寻源过程及结果摘要（Executive Summary）') }} </div>
          </div>
          <srm-attachment class="pricing-approving" :attachment-uuid="headInfo.attributeVarchar2" readonly bucket-name="private-bucket" />
          <div class="pricing-approval-attachment-sum" style="marginTop: 16px;marginBottom: 6px">
            <div class="pricing-approval-attachment-sum-header"/>
            <div class="pricing-approval-attachment-sum-word">{{ $T('hipspfm.pricingApproval.model.pricingApproval.SRF').$D('寻源详情附件（SRF)') }}</div>
          </div>
          <srm-attachment class="pricing-approving" :attachment-uuid="headInfo.checkAttachmentUuid" readonly bucket-name="private-bucket" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="costRemark" :show-title="true" :label="getHeaderCostRemarkName()">
        <customize
          style="padding: 16px 15px"
          :columns="getHeaderCostInfoColumns()"
          :data-source="headInfo" type="list" :need-padding="false"
          code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_COST_DETAIL_INFO" />
      </srm-scroll-tab-item>
      <!-- 基于标准二开，【三生制药】新增专家评分tab srm-118116 -->
      <srm-scroll-tab-item v-if="isSanSheng" :label="$T('ssrc.inquiryHall.model.inquiryHall.expertEvaluation').$D('专家评分')">
        <div v-for="(item, index) in experLinesInfo" :key="index">
          <srm-flex justify="between" class="srm-flex-score-header" style="padding: 10px 15px">
            <!-- openBidOrderMeaning -->
            <srm-flex-item :flex="3" style="overflow: hidden; white-space: nowrap; text-overflow:ellipsis;">
              <span> {{ item.supplierCompanyName }} </span>
            </srm-flex-item>
            <!-- <srm-flex-item :flex="1" style="padding: 0 5px">
              <span class="srm-flex-score-button">{{ item.scoreDetails[0]["summaryRank"] }} {{ item.scoreDetails[0]["businessRank"] }} {{ item.scoreDetails[0]["technologyRank"] }}</span>
            </srm-flex-item> -->
            <srm-flex-item :flex="1"> {{ $T('ssrc.inquiryHall.model.inquiryHall.totalScore').$D('总分') }} ：{{ item.summaryScore }} </srm-flex-item>
          </srm-flex>
          <srm-flex style="padding: 0 15px">
            <span class="srm-flex-score-button">{{ item.scoreDetails[0]["summaryRank"] }} {{ item.scoreDetails[0]["businessRank"] }} {{ item.scoreDetails[0]["technologyRank"] }}</span>
          </srm-flex>
          <div v-for="(itemScore, indexScore) in item.scoreDetails" :key="indexScore">
            <srm-flex justify="between" class="srm-flex-score-line" style="padding: 10px 15px">
              <!-- BUSINESS：商务组 | TECHNOLOGY：技术组 -->
              <srm-flex-item :flex="2">
                {{ itemScore.team === "BUSINESS" ? $T('ssrc.inquiryHall.model.inquiryHall.businessTeam').$D('商务组') : $T('ssrc.inquiryHall.model.inquiryHall.technologyTeam').$D('技术组') }} - {{ itemScore.expertName }}
              </srm-flex-item>
              <srm-flex-item :flex="1">
                <srm-attachment-button :attachments="getAttachments(itemScore.attachmentUuid)" show-total :title="$T('ssrc.inquiryHall.model.attachmentUuid').$D('附件')"/>
              </srm-flex-item>
              <srm-flex-item :flex="1" style="text-align: right; padding-right: 10px"> {{ itemScore.sumScore }} </srm-flex-item>
            </srm-flex>
            <srm-blank size="1px" theme="fill"/>
          </div>
          <srm-blank size="mid" theme="fill"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="lineItem" :label="$T('ssrc.inquiryHall.model.inquiryHall.lineInfo').$D('标的物信息')">
        <srm-list :data-set="dataSet"
                  :clickable="false"
                  :columns="getLineInfoColumns()" :scrollable="false" height="auto" style="height: auto"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 基础信息详情弹窗 -->
    <srm-popup
      :visible.sync="basePop"
      height="100%"
      position="right"
      :title="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
      <div style="height: 100%; overflow: auto">
        <customize-detail
          :need-padding="true"
          :data-source="headDetailInfo"
          code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL_INFO"
          :columns="getHeaderBaseDetailInfoColumns()"/>
      </div>
    </srm-popup>

    <!-- 阶梯报价 -->
    <srm-popup height="100%" :visible.sync="pricingPop" :show-header="false">
      <div v-if="ladderLevelPop">
        <ul style="padding: 16px 0 12px 15px">
          <customize
            :data-source="ladderLevels"
            :columns="getLadderLevelColumns"
            code="SMBL.WORKFLOW.PRICING_APPROVAL.PRICE_LADDER_LEVEL_HEAD_INFO"
            type="list"
            :need-padding="false"/>
        </ul>
        <srm-blank size="mid" theme="fill" />
        <srm-list :scrollable="false"
                  height="auto"
                  customize-code="SMBL.WORKFLOW.PRICING_APPROVAL.PRICE_LADDER_LEVEL_LINE_INFO"
                  style="height: auto"
                  :data-set="ladderLevelDetailData"
                  :columns="getLadderLevelDetailColumns"/>
      </div>
    </srm-popup>

    <!-- 附件 -->
    <history-record
      v-model="fileListFlag"
      :show-file-btn="true"
      :action-data="fileListData"
      :title="getTitle()"
      operator-field-name="realName"
      process-date-field-name="creationDate"
      operation-meaning-field-name="nodeMeaning" />
    <!-- <srm-popup
      :visible.sync="visible"
      height="100%"
      position="right"
      :title="$T('ssrc.inquiryHall.view.details').$D('详情')">
      <component
        :is="childComponent"
        v-if="currentCom"
        ref="childComponent"
        style="background: var(--background-color-empty)"
        :parameters="formParameters"/>
    </srm-popup> -->
  </div>
</template>

<script>
import uuid from "uuid";
// import { remotes } from "../../../../remoteConfig";
import { queryDoubleUnit } from "@/utils/utils";
import { DataSet, SrmUtil, SrmTooltip, SrmTextarea } from "srm-mobile-ui";
import CompleteMethod from "../../../modules/CUX_PART/Method/CompleteMethod";
import { getProjectSection, getRfxHeader, getRfxItemLinesCheck, getProcessFileApi, getRfxScoreApi, getPurchaseApi } from "./api/index.js";
import rfxItemsDS from "./datasource/items";
import ladderLevelDetailDs from "./datasource/ladderLevelDetailDs";
import HistoryRecord from "@/components/HistoryRecord";
import QuotationDetail from "@/components/QuotationDetailNew/Detail/index.vue";
import { getDocumentTypeName, getCheckPriceName, getQuotationName, } from "./utils/globalVariable";
import { getPriceName, getNetPriceName, getAvailableQtyName, getLadderFrom, getLadderTo } from "@/utils/doubleUnit";
import { getFileList } from "./api";
import IsOverFlow from "./component/IsOverflow.vue";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.pricingApproval", "ssrc.common", "hipspfm.common", "smbl.common", "spfm.dashboard", "hzero.button", "ssrc.queryQuotation" ],
  name: "PricingApproval",
  components: {
    HistoryRecord,
  },
  extends: CompleteMethod,
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    topHeight: {
      type: Number,
      default: 0,
    },
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      bidFlag: false,
      headInfo: {},
      itemLines: [], //供应商分类信息
      // experInfo:{}, // 专家评分
      experLinesInfo:[], // 专家评分信息
      tabIndex: 0,
      projectSection: [],
      uuid: uuid(),
      showAllTabs: false,
      dataSet: new DataSet(rfxItemsDS({
        // bidFlagJudge: this?.bidFlagJudge,
      })),
      //fileListDataSet: new DataSet(fileListDs(this.sourceHeaderId)),
      sourceHeaderId: null,
      headPopupVisible: false,
      sourceProject: {},
      multipleLanguage: {
        taxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncluded").$D("含税"),
        nonTaxIncluded: this.$T("ssrc.inquiryHall.model.inquiryHall.noTaxRate").$D("不含税"),
      },
      showDetailValue: {},
      fileListFlag: false,
      fileListData: [],
      fileListNum:0,
      basePop:false, // 基础信息pop
      headDetailInfo:{},
      weilongFileList: [],
      doubleUnitFlag: false, // 判断是否开启双单位
      // visible: false,
      // childComponent: () => ({
      //   component: this.currentCom,
      // }),
      // currentCom:null,
      // formParameters:{}
      ladderLevelPop: false, //阶梯报价弹窗
      ladderLevelDetailData: new DataSet(), //阶梯报价明细信息
      ladderLevels: {}, //阶梯报价基础信息
      pricingPop: false, //报价弹窗
    };
  },
  computed: {
    // 圣和药业基于标准二开，核价审批查看采购申请详情（srm-125914 2022/5/7）
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    // 当寻源模板=ST000002，ST000004， ST000005， ST000006， ST000007 显示专家评分页签,询价单标题，显示为：项目标题
    isSanSheng() {
      return SrmUtil.getTenantNum() === "SRM-3SBIO" && [ "ST000002", "ST000004", "ST000005", "ST000006", "ST000007" ].includes(this.headInfo.templateNum);
    },
    //阶梯报价基础信息
    getLadderLevelColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "supplierCompanyName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
        },
        {
          formRow: 20,
          fieldCode: "itemCode",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码")
        },
        {
          formRow: 20,
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称"),
        },
      ].filter(Boolean);
    },
    //阶梯报价行信息
    getLadderLevelDetailColumns() {
      return [
        {
          fieldCode: "rfxLadderLineNum",
          fieldType: "EMPTY",
          formRow: 10,
          render: (val) =>
            <span style="font-weight: bold">
              {this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}{val}
            </span>
        },
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "secondaryLadderFrom",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderFrom").$D("数量从"),
        } : null,
        this.doubleUnitFlag ? {
          formRow: 20,
          fieldCode: "secondaryLadderTo",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.ladderTo").$D("数量至"),
        } : null,
        {
          formRow: 30,
          fieldCode: "ladderFrom",
          fieldName:getLadderFrom(this.doubleUnitFlag),
        },
        {
          formRow: 30,
          fieldCode: "ladderTo",
          fieldName: getLadderTo(this.doubleUnitFlag),
        },
        this.doubleUnitFlag ? {
          formRow: 40,
          fieldCode: "validLadderSecPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
        } : null,
        this.doubleUnitFlag ? {
          formRow: 50,
          fieldCode: "validNetLadderSecPrice",
          fieldName: this.$T("ssrc.queryQuotation.model.queryQuotation.netPrice").$D("单价(不含税)"),
        } : null,
        {
          formRow: 60,
          fieldCode: "validLadderPrice",
          fieldName: getPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 70,
          fieldCode: "validNetLadderPrice",
          fieldName: getNetPriceName(this.doubleUnitFlag),
        },
        {
          formRow: 80,
          fieldCode: "cumulativeFlag",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.isCumulativeFlag").$D("是否累计阶梯"),
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow: 90,
          fieldCode: "validBargainPrice",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validBargainPrice").$D("有效还价单价"),
        },
        {
          formRow: 100,
          fieldCode: "remark",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
        },
      ].filter(Boolean);
    },
  },
  beforeMount() {
    this.initRfxBid();
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        this.doubleUnitFlag = await queryDoubleUnit({
          businessModule: "RFX",
        });
        await this.getProjectSection();
        await this.getPricingOrderHead(this.sourceHeaderId);
        await this.getLineCheckInfo(this.sourceHeaderId);
        await this.getProcessFile(this.sourceHeaderId);
        if (this.isSanSheng) {
          await this.getRfxScoreInfo(this.sourceHeaderId);
        }
        if (this.getTenantNum === "SRM-WEILONG") {
          getFileList({ uuid: this.headInfo.attributeVarchar10 }).then((r) => {
            if (Array.isArray(r) && r.length > 0) {
              this.weilongFileList = r.map((item) => item.fileUrl);
            }
          });
        }
        this.dataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
        this.dataSet.addQueryParameter("rfxHeaderId", this.sourceHeaderId);
        this.dataSet.refresh();
      } finally {
        this.$loading.hide();
      }
    }

    this.$emit("GetApprovalTitle", this.approvalTitle());
  },
  methods: {
    getHeaderCostRemarkName() {
      if (this.over$getHeaderCostRemarkName && typeof this.over$getHeaderCostRemarkName === "function") {
        return this.over$getHeaderCostRemarkName();
      }
      return this.$T("ssrc.inquiryHall.model.inquiryHall.headerCostRemark").$D("成本备注");
    },
    approvalTitle() {
      const title = !this.bidFlag ?
        this.$T("hipspfm.pricingApproval.view.message.title.checkPriceApproval").$D("寻源核价审批") :
        this.$T("hipspfm.pricingApproval.view.title.bidNewPriceApproval").$D("招标书定标审批");
      return title;
    },
    // 初始判定询价/新招标 多语言等
    initRfxBid() {
      this.bidFlag = this.bidFlagJudge();
    },
    bidFlagJudge() {
      const { secondarySourceCategory = null, } = this.parameters || {};
      let bidFlag = false;

      if (secondarySourceCategory === "NEW_BID") {
        bidFlag = true; // 页面是
      }

      return bidFlag;
    },
    getAttachments(attachmentUuid) {
      return [ {
        attachmentUuid: attachmentUuid,
        title: this.$T("ssrc.inquiryHall.model.attachmentUuid").$D("附件"),
        readonly:true,
        // uploadButton: "default",
        // showInfo: false,
      } ];
    },
    // 获取专家评分信息
    getRfxScoreInfo(rfxHeadId) {
      getRfxScoreApi(rfxHeadId).then((res) => {
        if (res) {
          // this.experInfo = res;
          this.experLinesInfo = res.supplierList;
        }
      });
    },
    getTitle() {
      return this.$T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件");
    },
    showBaseDetail() {
      this.headDetailInfo = this.headInfo;
      this.basePop = !this.basePop;
    },
    // showHeaderDetail() {
    //   this.detailPopup = this.$popup({
    //     title: this.$T("ssrc.inquiryHall.model.inquiryHall.headerInfoDetail").$D("详情"),
    //     showHeader: true,
    //     showClose: true,
    //     position: "bottom",
    //     height: "80%",
    //     rounded:true,
    //     content:
    //       <div class="header-detail-box">
    //         <div class="title"> {this.$T("ssrc.inquiryHall.model.inquiryHall.headerBaseInfo").$D("基础信息")}</div>
    //         <customize data-source={this.headInfo} columns={this.getHeaderBaseInfoColumns()}
    //           code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL"/>
    //         <div class="title">{ this.$T("ssrc.inquiryHall.model.inquiryHall.headerCostRemark").$D("成本备注") }</div>
    //         <customize data-source={this.headInfo} columns={this.getHeaderCostInfoColumns()}
    //           code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_COST_DETAIL"/>
    //       </div>
    //   });
    // },
    triggerTab() {
      this.showAllTabs = !this.showAllTabs;
    },
    async changeTab(data, index) {
      this.tabIndex = index;
      this.sourceHeaderId = data.sourceHeaderId;
      this.$loading.show();
      this.dataSet.addQueryParameter("rfxHeaderId", data.sourceHeaderId);
      this.dataSet.refresh();
      await this.getLineCheckInfo(this.sourceHeaderId);
      this.getPricingOrderHead(data.sourceHeaderId).finally(() => {
        this.$loading.hide();
      });
    },
    async getProjectSection() {
      return await getProjectSection(this.changeReqId).then((res) => {
        if (res) {
          this.projectSection = res.projectLineSectionList || [];
          this.sourceProject = res.sourceProject || [];
          if (!SrmUtil.isEmpty(res.projectLineSectionList)) {
            this.sourceHeaderId = res.projectLineSectionList[0].sourceHeaderId;
          }
          this.sourceHeaderId = this.sourceHeaderId || this.changeReqId;
        }
      });
    },
    // 获取核价单头信息
    async getPricingOrderHead(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getRfxHeader(rfxHeaderId).then((res) => {
        this.headInfo = res;
        this.$emit("GetAttachmentFileArr", [ {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          attachmentUuid: res.techAttachmentUuid || this.uuid,
          readOnly: true
        }, {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          attachmentUuid: res.businessAttachmentUuid || this.uuid,
          readOnly: true
        }, {
          title: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          attachmentUuid: res.pretrialUuid || this.uuid,
          readOnly: true
        } ]);
      });
    },
    async getLineCheckInfo(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getRfxItemLinesCheck(rfxHeaderId).then((res) => {
        if (res && !res.failed) {
          this.itemLines = res.content || [];
        }
      });
    },
    getLineInfoColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            const tags = [];
            const lines = this.itemLines.filter((e) => e.rfxLineItemId === item.rfxLineItemId);
            // lines.forEach((element) => {
            //   element.attachmentUuid = item.attachmentUuid;
            // });
            if (this.doubleUnitFlag) {
              tags.push(item.secondaryQuantity + item.secondaryUomName);
            } else {
              tags.push(item.rfxQuantity + item.uomName);
            }
            tags.push(item.taxIncludedFlag ? this.multipleLanguage.taxIncluded : this.multipleLanguage.nonTaxIncluded);
            tags.push(item.selectionStrategyMeaning);
            return <SrmFlex direction="column">
              <SrmFlex justify="between" nativeOnClick={() => {
                this.$set(this.showDetailValue, item.rfxLineItemId, !this.showDetailValue[item.rfxLineItemId]);
              }}>
                <IsOverFlow style={{ width: "80%" }}>
                  <template slot='title'>
                    <span class="title-bold">
                      {`${item.itemCode ? item.itemCode + "-" : ""}${item.itemName}`}
                    </span>
                  </template>
                  <template slot='tooltip'>
                    <SrmTooltip title={`${item.itemCode ? item.itemCode + "-" : ""}${item.itemName}`} placement="top" nativeOnClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <span style={{ color: "#276ef1" }} class='srm-icon icon-info-circle' />
                    </SrmTooltip>
                  </template>
                </IsOverFlow>
                <span>{this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号")}：{item.rfxLineItemNum}</span>
              </SrmFlex>
              <SrmFlex nativeOnClick={() => {
                this.$set(this.showDetailValue, item.rfxLineItemId, !this.showDetailValue[item.rfxLineItemId]);
              }}><SrmTagGroup tags={tags} type="info"/></SrmFlex>
              <srm-blank v-show={!this.showDetailValue[item.rfxLineItemId]} style="margin: 10px 0;" size="1px" theme="fill"/>
              <SrmFlex v-show={!this.showDetailValue[item.rfxLineItemId]} direction="column">
                {
                  lines.map((line, index) =>
                    <Customize
                      code="SMBL.WORKFLOW.PRICING_APPROVAL.LINE_CHECK_INFO"
                      dataSource={line}
                      style={ index === 0 ? "" : "margin-top: 16px;" }
                      columns={this.getLineInfoCheckColumns()}
                    />)
                }
              </SrmFlex>
            </SrmFlex>;
          },
          formRow: 0,
        },
      ];
    },
    getLineInfoCheckColumns() {
      return [
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>
              {item.suggestedFlag ?
                <SrmTag
                  type="success"
                  fill>
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用")}
                </SrmTag> :
                <SrmTag
                  type="info">
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedNoFlag").$D("不选用")}
                </SrmTag>
              }
              {item.companyName}
            </span>
          </SrmListHeader>,
          formRow: 0,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costPrice").$D("成本单价"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludedFlag").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxRate").$D("税率（%）"),
          fieldCode: "taxRate",
          // fieldType: "INPUT_NUMBER",
          // editor: false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStatus", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}状态"),
          fieldCode: "quotationLineStatusMeaning",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.taxIncludePrice").$D("含税单价"),
          fieldCode: "validQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validNetPrice").$D("未税单价"),
          fieldCode: "validNetSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getPriceName(this.doubleUnitFlag),
          fieldCode: "validQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: getNetPriceName(this.doubleUnitFlag),
          fieldCode: "validNetPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          fieldCode: "validQuotationSecQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getAvailableQtyName(this.doubleUnitFlag),
          fieldCode: "validQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.LineSum").$D("行金额"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDetail").$D("报价明细"),
          fieldCode: "quotationDetailFlag",
          render: (val, record) => <QuotationDetail rowData={record} />,
        },
        {
          fieldCode: "ladderQuotationBtn",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{this.$T("ssrc.inquiryHall.model.inquiryHall.ladderInquiry").$D("阶梯报价")}：</span>
            {
              item.ladderInquiryFlag === 1 ? <span style="color: var(--color-other-default-b);fontWeight: bold;"
                on-click={(e) => {
                  e.stopPropagation();
                  this.getLadderLevelInfo(item);
                }}>
                { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
              </span> : "-"
            }
          </SrmFlex>,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.suggestedRemark").$D("选用理由"),
          fieldCode: "suggestedRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonQuotationDescription", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}说明"),
          fieldCode: "validQuotationRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.attachmentUuid").$D("附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
        },
        // 圣和药业，基于标准二开字段
        this.getTenantNum === "SRM-SANHOME" && {
          fieldName: this.$T("smbl.common.message.link.prNum").$D("申请编号"),
          fieldCode: "prNum",
          render:(val, record) => <srm-flex>
            <srm-button type="primary" plain rect onClick={() => this.toDetail(record)}>{ val }</srm-button>
          </srm-flex>
        },
      ];
    },
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldName: "rfxNum",
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, record) => <srm-list-header show-open-tag={true}>
            <span>{ record.rfxNum }</span>
            <div slot="right">
              <span class="status2">{this.$T("ssrc.inquiryHall.model.inquiryHall.round").$D("轮次")}：{record.quotationRoundNumber || 1}</span>
            </div>
          </srm-list-header>,
        },
        {
          fieldName: this.isSanSheng ? this.$T("smbl.common.message.projectTitle").$D("项目标题") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryTitleRFX", [ getDocumentTypeName(this.bidFlag) ]).$D("{documentTypeName}标题"),
          fieldCode: "rfxTitle",
          render: (val) => this.getTenantNum === "SRM-HUTCHMED" ? <SrmTextarea editor={false} autoSize={{ minRows: 5, maxRows: 10 }} value={val} /> : val,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        // {
        //   fieldName: this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountTaxIn").$D("中标金额(含税)"),
        //   fieldCode: "suggestedTaxAmount",
        //   fieldType: "INPUT_NUMBER",
        //   editor: false,
        // },
        // {
        //   fieldName: this.$T("ssrc.queryQuotation.model.queryQuotation.successfulBidAmountNet").$D("中标金额(不含税)"),
        //   fieldCode: "suggestedNetAmount",
        //   fieldType: "INPUT_NUMBER",
        //   editor: false,
        // },
        {
          fieldName: this.$T("ssrc.common.view.message.title.downloadAttachments").$D("过程附件"),
          fieldCode: "processAttachment",
          render:() => <srm-button type="primary" plain rect onClick={() => this.showFileList()}>{this.$T("smbl.common.button.viewAttachments").$D("查看附件")}({this.fileListNum})</srm-button>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonPricingAttachment", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}附件"),
          fieldCode: "checkAttachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
        },
        this.getTenantNum === "SRM-WEILONG" ?
          {
            fieldName: "",
            fieldCode: "checkRemarkStr",
            render: (val, record) =>
              <div>
                <div>{this.$T("ssrc.inquiryHall.model.inquiryHall.commonCheckRemark", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}备注")}:</div>
                <div
                  class='check-remark-str'
                  onClick={(e) => this.previewRemarkImg(e)}
                  ref="richTextContent"
                  // eslint-disable-next-line
                  domPropsInnerHTML={record.checkRemark || ''} />
              </div>
            ,
          } :
          {
          // fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注"),
            fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonCheckRemark", [ getCheckPriceName(this.bidFlag) ]).$D("{checkPriceName}备注"),
            fieldCode: "checkRemark",
            render: (val) => <SrmTextarea editor={false} autoSize={{ minRows: 1, maxRows: 10 }} value={val} />,
          },
      ];
    },
    // 基础信息详情
    getHeaderBaseDetailInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
          render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStartTime", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonqQotationDeadline", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceAnnouncementFlag").$D("创建寻源公告"),
          fieldCode: "sourceAnnouncementFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemRemark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
          fieldCode: "pretrailRemark",
        },
      ];
    },
    // getHeaderBaseInfoColumns() {
    //   return [
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
    //       fieldCode: "templateName",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
    //       fieldCode: "sourceCategoryMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
    //       fieldCode: "purOrganizationName",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
    //       fieldCode: "companyName",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
    //       fieldCode: "sourceMethodMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
    //       fieldCode: "quotationTypeMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
    //       fieldCode: "auctionDirectionMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
    //       fieldCode: "budgetAmount",
    //       fieldType: "INPUT_NUMBER",
    //       editor: false,
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
    //       fieldCode: "currencyCodeMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
    //       fieldCode: "exchangeRate",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
    //       fieldCode: "creationDate",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
    //       fieldCode: "quotationStartDate",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
    //       fieldCode: "quotationEndDate",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
    //       fieldCode: "sourceTypeMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerms").$D("付款方式"),
    //       fieldCode: "paymentTypeName",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型"),
    //       fieldCode: "priceCategoryMeaning",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceAnnouncementFlag").$D("创建寻源公告"),
    //       fieldCode: "sourceAnnouncementFlag",
    //       render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemRemark").$D("备注"),
    //       fieldCode: "rfxRemark",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
    //       fieldCode: "pretrailRemark",
    //     },
    //   ];
    // },
    getHeaderCostInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalCost").$D("总成本"),
          fieldCode: "totalCost",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceProjectTotalAmount").$D("寻源项目总金额"),
          fieldCode: "sourceProject",
          render: () => this.$options.filters.calcMultipleDelimiter(this.sourceProject.projectCost)
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxSectionTotalPrice").$D("标段总金额"),
          fieldCode: "totalPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostFlag").$D("是否超成本"),
          fieldCode: "overCostFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostPrice").$D("超成本金额"),
          fieldCode: "overCostPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.overCostScale").$D("超成本百分比"),
          fieldCode: "overCostScale",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.costRemark").$D("成本备注"),
          fieldCode: "costRemark",
        },
      ];
    },
    // 查看附件
    showFileList() {
      // this.fileListDataSet = new DataSet(fileListDs(this.sourceHeaderId));
      this.fileListFlag = true;
    },
    getProcessFile(rfxHeadId) {
      getProcessFileApi(rfxHeadId).then((res) => {
        this.fileListData = res.content || [];
        // 过程附件数量
        this.fileListNum = 0;
        if (this.fileListData.length > 0) {
          this.fileListData.forEach((e) => {
            this.fileListNum = this.fileListNum + e.rfxProcessAttachmentDTOS.length;
          });
        }
      });
    },
    // 获取附件
    getFileListColumns() {
      return [
        {
          fieldName: this.$T("ssrc.common.model.common.node").$D("节点"),
          fieldCode: "nodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.uploadBy").$D("上传人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.creationDate").$D("上传时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.attachmentType").$D("附件类型"),
          fieldCode: "fileType",
          render: (val, record) => <SrmUpload
            type="primary"
            showIcon={false}
            showCount={false}
            descTitle={record.type}
            attachmentUuid={record.rfxProcessAttachmentDTOS} />
        },
      ];
    },
    // 跳转采购申请工作台详情页
    async toDetail(record) {
      // 环境域名
      const environmentUrl = window.location.origin;
      const params = {
        multiSelectHeaderAndLineNums:record.prNum,
        customizeUnitCode: "SPRM.PURCHASE_PLAFORM_EXECUTION.FLATSEARCHBAR,SPRM.PURCHASE_PLAFORM_EXECUTION.LIST"
      };
      this.$loading.show();
      await getPurchaseApi(params).then((res) => {
        if (res.content && res.content.length === 1) {
          // 获取headerId
          const prHeaderId = res.content[0].prHeaderId;
          this.formParameters = {
            prHeaderId,
            type: "readOnly",
          };
          const detailUrl = `/PurchaseReqWorkbench/#/PurchaseReqWorkbenchDetail?prHeaderId=${prHeaderId}&type=readOnly`;
          const toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          this.detailPopup = this.$popup({
            title: this.$T("ssrc.inquiryHall.view.details").$D("详情"),
            showHeader: true,
            showBack: true,
            content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.prNumDocError").$D("单据不唯一或不存在"),
            duration: 2000
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    previewRemarkImg(e) {
      // 清除文本选择
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      } else if (document && document.selection) {
        document.selection.empty()
      }
      if (e.target.src) {
        const imageArr = e.currentTarget.getElementsByTagName("img");
        let imageSrcArr = [];
        for (let i = 0; i < imageArr.length; i++) {
          if (imageArr[i]?.src) {
            imageSrcArr.push(imageArr[i]?.src);
          }
        }
        const indexSrc = imageSrcArr.findIndex((item) => item === e.target.src) || 0;
        this.$previewImage(imageSrcArr, { index: indexSrc, showClose: true, });
      }
      e.stopPropagation();
    },
    // 富文本语音播放
    handlePlayPause() {
      const synth = window.speechSynthesis;
      if (!synth) {
        alert('当前浏览器不支持语音朗读');
        return;
      }

      // 提取纯文本
      const text = this.$refs.richTextContent.innerText;
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // 朗读中文
      utterance.rate = 1; // 语速 (0.1 - 10)
      utterance.pitch = 1; // 音调 (0 - 2)

      synth.speak(utterance);
    },
    //获取阶梯报价信息
    getLadderLevelInfo(item) {
      this.ladderLevelPop = false;
      // eslint-disable-next-line no-unused-vars
      this.ladderLevelDetailData = new DataSet(ladderLevelDetailDs(item.quotationLineId));
      this.ladderLevelDetailData.refresh();
      this.ladderLevels = item;
      this.pricingPop = true;
      this.ladderLevelPop = true;
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl"

.srm-flex-score-header{
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
}

.srm-flex-score-line{
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}

.srm-flex-score-button{
  font-size: 10px;
  color: #FFFFFF;
  line-height: 12px;
  font-weight: 500;
  background: #FFBE00;
  border: 1px solid #FFBE00;
  border-radius: 2px;
}

.srm-flex-score-attachment{
  font-size: 16px;
  color: #276EF1;
  line-height: 22px;
  font-weight: 600;
}

.pricing-approval {
  background #fff;

  .header-box {
    padding: 16px;
    font-size: 14px;

    .rfx-title {
      display block;
      margin-top 10px;
    }
  }

  .tab {
    position relative;
    display block;
    width 100%;
    border-bottom #f5f5f5 solid 1px;
    font-size 14px;

    .tab-container {
      width calc(100% - 46px);
      overflow-x scroll;
      -webkit-overflow-scrolling: touch;
      padding 0 5px;

      .tab-item-box {
        margin 8px;
        display inline-block;

        .tab-item {
          color #333;
          font-size 12px;
          height 24px;
          display inline-flex;
          align-items center;
          justify-content: center;
          padding 0 8px;
          border-radius 12px;
          font-family: PingFangSC-Medium;
          line-height: 16px;
          min-width 50px;
        }

        .tab-item-active {
          color $srm-theme-color-primary;
          background $srm-theme-color-primary-fill;
        }
      }
    }

    .tab-trigger {
      position absolute;
      height 40px;
      width 46px;
      right 0;
      top 0;
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.06);
      font-size 16px;
      display flex;
      align-items center;
      justify-content center;
      background white;
    }

    .tab-trigger-active {
      background #f5f5f5;
    }
  }
}

.header-detail-box {
  padding: 16px;
  font-size 14px;

  .title {
    color #333;
    font-weight 700;
    font-family: PingFangSC-Regular;
    margin-top 10px;
  }
}

.is-first-line-supplier {
  margin-top: 16px;
}

.title-bold {
  width: 89%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

>>> .srm-list-item-card-head-left {
  max-width: 80%;
  white-space nowrap
  overflow hidden;
  word-break all;
  text-overflow: ellipsis;
  margin-left 0 !important;

  .srm-tag {
    margin-right 5px;
  }
}

.pricing-approval-attachment-sum{
  display: flex;
  height: 10vw;
}

.pricing-approval-attachment-sum-header{
    width: 1.867vw;
    height: 2.667vw;
    background: #D20078;
}

.pricing-approval-attachment-sum-word{
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #D20078;
  line-height: 4.8vw;
  font-weight: 600;
  margin-left: 7px;
}

.pricing-approving {
  >>> .no-content{
    height: calc(100vh-500px) !important
    padding-bottom: 0

    img{
      width: 80px;
      height: 80px;
    }
  }
}

.weilong-header-info-class{
  >>> .customize-item:last-child{
    .srm-field-left-label{
      display: none;
    }
  }
  .check-remark-str{
    white-space: normal;
    -webkit-touch-callout: default !important;
    user-select: auto !important;
    >>> img{
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
    >>> *:not(img) {
      -webkit-touch-callout: default !important;
      user-select: auto !important; 
    }
  }
}

</style>
