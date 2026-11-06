<template>
  <div class="pricing-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :show-title="true" :label="$T('ssrc.inquiryHall.view.tab.allDetails').$D('基本信息')">
        <!-- @click="showBaseDetail() -->
        <div>
          <customize
            style="padding: 15px"
            :columns="getHeaderInfoColumns()"
            :data-source="headInfo" type="list" :need-padding="false"
            code="SMBL.WORKFLOW.EXPERT_SCORE_MANAGE.HEADER_BASE"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.supplierCompanyRank').$D('供应商排名')">
        <srm-list :data-set="dataSet"
                  :clickable="false"
                  :columns="getLineInfoColumns()" :scrollable="false" height="auto" style="height: auto"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.model.inquiryHall.sectionAttachmentUuid').$D('附件')">
        <div>
          <customize
            :data-set="basicDs"
            :columns="getAttachmentColumns"
            :scrollable="false"
            :row-col-to-seq="true"
            type="list"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 基础信息详情弹窗 -->
    <srm-popup
      :visible.sync="scoreInfoPop"
      height="100%"
      position="right"
      :title="$T('ssrc.inquiryHall.model.inquiryHall.scoringView').$D('评分查看')">
      <div class="detail">
        <div v-if="scoreDetailInfo.sourceRuleType === 'DIFF'">
          <srm-tab-bar
            display="justify"
            :tabs="[$T('ssrc.inquiryHall.model.inquiryHall.businessScore').$D('商务评分'), $T('ssrc.inquiryHall.model.inquiryHall.technologyScore').$D('技术评分'),]"
            @indexChange="onIndexChange"/>
        </div>
        <srm-list
          :data-set="showScoreListDs"
          :clickable="false"
          :columns="getScoreInfoColumns()" :scrollable="false" height="auto" style="height: auto"/>
        <div class="summary">{{ $T('ssrc.inquiryHall.model.inquiryHall.summaryScore').$D('汇总') }}</div>
        <div class="score">
          <span style="color: var(--font-color-field2)">{{ $T('ssrc.inquiryHall.model.inquiryHall.supplierScore').$D('供应商分数') + ': ' }}</span>
          <span>{{ summaryScore }}</span>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
// import { remotes } from "../../../../remoteConfig";
import { SrmUtil } from "srm-mobile-ui";
import { DataSet, SrmFlex } from "srm-mobile-ui";
import { getRfxHeader, getQuotationSupplierLine, fetchScoreDetail, getRfxApi } from "./api/index.js";
import { rfxItemsDS, basicDS } from "./datasource/items";
import { getDocumentTypeName, getQuotationName, getCategoryCode } from "./utils/globalVariable";
import { isEmpty } from "../../../utils/index.js";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.ConfirmCandidateApproval", "ssrc.common", "hipspfm.common", "smbl.common", "spfm.dashboard", "hzero.button" ],
  name: "ConfirmCandidateApproval",
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
      supplierQuotationLine: [],
      dataSet: new DataSet(rfxItemsDS({})),
      rfxHeaderId: this.parameters.sourceHeaderId,
      scoreInfoPop:false, // 评分信息pop
      currentIndex: 0, // 评分 当前激活tab
      scoreDetailInfo: {}, // 评分信息
      summaryScore: 0.00,
      readFlag: false, // 汇总是否标红
      businessScoreLineList: new DataSet(rfxItemsDS({})),
      technologyScoreLineList: new DataSet(rfxItemsDS({})),
      syncScoreLineList: new DataSet(rfxItemsDS({})),
      showScoreListDs: new DataSet(rfxItemsDS({})),
      attachmentUuid: "", // 附件
      basicDs: new DataSet(basicDS({})),
    };
  },
  computed: {
    // 圣和药业基于标准二开，核价审批查看采购申请详情（srm-125914 2022/5/7）
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    getAttachmentColumns() {
      return [ {
        fieldCode: "preAttachmentUuid",
        fieldType: "UPLOAD",
        showCount: true,
        fieldName: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
        bucketName: "private-bucket",
      } ];
    }
  },
  beforeMount() {
    this.initRfxBid();
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getHeadInfo(this.rfxHeaderId);
        await this.getQuotationLineInfo(this.rfxHeaderId);
      } finally {
        this.dataSet.setData(this.supplierQuotationLine);
        this.$loading.hide();
      }
    }

    this.$emit("GetApprovalTitle", this.approvalTitle());
  },
  methods: {
    approvalTitle() {
      const title = !this.bidFlag ?
        this.$T("hipspfm.ConfirmCandidateApproval.view.message.title.checkPriceApproval").$D("寻源预定标审批") :
        this.$T("hipspfm.ConfirmCandidateApproval.view.title.bidNewPriceApproval").$D("招标书预定标审批");
      return title;
    },
    // 初始判定询价/新招标 多语言等
    initRfxBid() {
      this.bidFlag = this.bidFlagJudge();
    },
    // 获取核价单头信息
    async getHeadInfo(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getRfxHeader(rfxHeaderId).then((res) => {
        this.headInfo = res;
      });
    },
    // 获取报价行信息
    async getQuotationLineInfo(rfxHeaderId) {
      if (!rfxHeaderId) {
        return;
      }
      await getQuotationSupplierLine(rfxHeaderId, "RFX").then((res) => {
        let result = [];
        this.basicDs.setData([ { attachmentUuid: res.preAttachmentUuid } ]);

        if (Object.keys(res.evaluateSummaryMap || {}).length) {
          Object.keys(res.evaluateSummaryMap).forEach((keys) => {
            result = [ ...result, ...res.evaluateSummaryMap[keys] ];
          });
        }
        this.supplierQuotationLine = result;
      });
    },
    bidFlagJudge() {
      const { secondarySourceCategory = null, } = this.headInfo || {};
      let bidFlag = false;
      if (secondarySourceCategory === "NEW_BID") {
        bidFlag = true; // 页面是
      }
      return bidFlag;
    },
    renderDataSource(dataSource) {
      if (isEmpty(dataSource)) {
        return;
      }
      let newDataSource = [];
      dataSource.forEach((item) => {
      // 有一级要素且存在二级要素
        if (item.detailEnabledFlag) {
          const { evaluateScoreLineDtlList = [], ...otherItems } = item;
          // 二级要素
          const newLine = evaluateScoreLineDtlList.map((lineItem) => ({
            ...lineItem,
            indicateName: lineItem.twoIndicateName,
            maxScore: lineItem.twoMaxScore,
            minScore: lineItem.twoMinScore,
            weight: lineItem.twoWeight,
            remark: lineItem.twoRemark,
            indicScore: lineItem.twoIndicateScore,
          }));
          newDataSource = [
            ...newDataSource,
            {
            // 一级要素
              ...otherItems,
              evaluateDetailId: uuid(),
            },
            ...newLine,
          ];
        } else {
        // 只有一级要素
          newDataSource = [ ...newDataSource, { ...item, evaluateDetailId: uuid() } ];
        }
      });
      return newDataSource;
    },
    async viewScore(record) {
      this.scoreInfoPop = !this.scoreInfoPop;
      const scoreDetailInfo = await fetchScoreDetail(record.evaluateSummaryId);
      if (isEmpty(scoreDetailInfo)) {
        return;
      }
      this.scoreDetailInfo = scoreDetailInfo;
      this.readFlag = this.getZeroTrue(scoreDetailInfo.approvedCount);
      if (scoreDetailInfo.sourceRuleType === "DIFF") {
        // 清空之前的数据
        if (this.businessScoreLineList.toData().length) {
          this.businessScoreLineList.reset();
        }
        if (this.technologyScoreLineList.toData().length) {
          this.technologyScoreLineList.reset();
        }
        this.businessScoreLineList.setData(this.renderDataSource(scoreDetailInfo.businessScoreLineList));
        this.technologyScoreLineList.setData(this.renderDataSource(scoreDetailInfo.technologyScoreLineList));
        this.showScoreListDs = this.currentIndex ? this.technologyScoreLineList : this.businessScoreLineList;
        this.summaryScore = this.currentIndex ? this.scoreDetailInfo.technologyPassStatus || this.scoreDetailInfo.technologyTotal.toFixed(2) : this.scoreDetailInfo.businessPassStatus || this.scoreDetailInfo.businessTotal.toFixed(2);
      } else {
        // 清空之前的数据
        if (this.syncScoreLineList.toData().length) {
          this.syncScoreLineList.reset();
        }
        this.syncScoreLineList.setData(this.renderDataSource(scoreDetailInfo.syncScoreLineList));
        this.showScoreListDs = this.syncScoreLineList;
        this.summaryScore = scoreDetailInfo.sumPassStatus || scoreDetailInfo.syncTotal.toFixed(2);
      }
    },
    onIndexChange(index) {
      this.currentIndex = index;
      if (index === 0) {
        this.showScoreListDs = this.businessScoreLineList;
        this.summaryScore = this.scoreDetailInfo.businessPassStatus || this.scoreDetailInfo.businessTotal.toFixed(2);
      } else {
        this.showScoreListDs = this.technologyScoreLineList;
        this.summaryScore = this.scoreDetailInfo.technologyPassStatus || this.scoreDetailInfo.technologyTotal.toFixed(2);
      }
    },
    getLineInfoColumns() {
      return [
        {
          fieldName: "supplierCompanyName",
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <div class="list-header">
              <srm-tooltip title={item.supplierCompanyName}>
                <div class="list-title">
                  {item.supplierCompanyName}
                </div>
              </srm-tooltip>
            </div>
            <div slot="right" class="list-right">
              {Boolean(item.candidateFlag) &&
                <srm-tooltip title={this.$T("ssrc.inquiryHall.dropdown.recommendation").$D("推荐供应商")}>
                  <srm-tag
                    type="primary"
                    style="margin-left: 8px; max-width: 75px;"
                  >
                    {this.$T("ssrc.inquiryHall.dropdown.recommendation").$D("推荐供应商")}
                  </srm-tag>
                </srm-tooltip>
              }
              <srm-tooltip title={this.$T("ssrc.inquiryHall.model.inquiryHall.rank").$D("排名:") + " " + item.scoreRank }>
                <SrmTag
                  type="primary"
                  style="margin-left: 8px; max-width: 55px"
                >
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.rank").$D("排名:")}{ item.scoreRank }
                </SrmTag>
              </srm-tooltip>
            </div>
          </srm-list-header>,
          formRow: 0,
        },
        {
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (_, record) => <SrmFlex direction="column">
            {
              <Customize
                code="SMBL.WORKFLOW.EXPERT_SCORE_MANAGE.QUOTATIONLINE"
                dataSource={record}
                columns={this.getLineInfoCheckColumns()}
              />
            }
          </SrmFlex>,
          formRow: 1,
        },
      ];
    },
    scoreIntervalRender(min, max) {
      return `[${min || min === 0 ? min : "-"}, ${max || max === 0 ? max : "-"}]`;
    },
    getZeroTrue(value) {
      if (value === null) {
        return false;
      }
      return Number(value) === 0;
    },
    renderExpertPass(record) {
      const { sumPassStatus = "", sumPassStatusMeaning = "", approvedCount = "", allExpertCount = "" } = record;
      if (!sumPassStatus) {
        return;
      }
      const All = sumPassStatus === "ALL_PASS";
      return (
        <span>
          {All ? sumPassStatusMeaning : `${sumPassStatusMeaning}${approvedCount}/${allExpertCount}`}
        </span>
      );
    },
    getScoreInfoColumns() {
      return [
        {
          fieldName:"indicateName",
          fieldType: "EMPTY",
          fieldCode: "indicateName",
          render: (val) => <div class="item-title">{this.$T("ssrc.inquiryHall.model.inquiryHall.indicateDetail").$D("要素细项") + ": " + val}</div>,
          formRow: 0,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.scoringInterval").$D("评分区间"),
          fieldCode: "scoringInterval",
          formRow: 1,
          render: (val, record) => {
            if (record.indicateLevel === "ONE" && record.detailEnabledFlag) {
              return this.scoreIntervalRender(record.minScore, record.maxScore);
            }
            return record.indicateType !== "PASS" ?
              this.scoreIntervalRender(record.minScore, record.maxScore) :
              "-";
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierScore").$D("供应商分数"),
          fieldCode: "indicScore",
          formRow: 1,
          render: (val, record) => {
            if (record.indicateLevel === "ONE" && record.detailEnabledFlag) {
              return val;
            }
            return record.indicateType !== "PASS" ?
              typeof val === "number" ?
                val && val.toFixed(2) :
                <span>{val}</span> :
              record.passStatusMeaning ?
                typeof record.passStatusMeaning === "number" ?
                  record.passStatusMeaning.toFixed(2) :
                  this.renderExpertPass(record) || record.passStatusMeaning :
                null;
          }
        },
        {
          fieldName: `${this.$T("ssrc.inquiryHall.model.inquiryHall.weight").$D("权重") + "%"}`,
          fieldCode: "weight",
          formRow: 2,
          render: (val, record) => record.indicateType !== "PASS" ? val : "-",
        },
      ];
    },
    getLineInfoCheckColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalAmount").$D("总价"),
          fieldCode: "totalAmount",
        },
        this.headInfo.bidRuleType === "DIFF" && {
          fieldName: `${this.$T("ssrc.inquiryHall.model.inquiryHall.businessScore").$D("商务评分") + (this.supplierQuotationLine && this.supplierQuotationLine[0].businessPassStatus ? "" : `${this.headInfo.businessWeight}%`) }`,
          fieldCode: "businessScore",
          render: (val, record) => <span style={{ color: this.getZeroTrue(record?.businessApprovedCount) ? "red" : "" }}> {record.businessPassStatus || val && val.toFixed(2)} </span>,
        },
        this.headInfo.bidRuleType === "DIFF" && {
          fieldName: `${this.$T("ssrc.inquiryHall.model.inquiryHall.technologyScore").$D("技术评分") + (this.supplierQuotationLine && this.supplierQuotationLine[0].technologyPassStatus ? "" : `${this.headInfo.technologyWeight}%`) }`,
          fieldCode: "technologyScore",
          render: (val, record) => <span style={{ color: this.getZeroTrue(record?.technologyApprovedCount) ? "red" : "" }}> {record.technologyPassStatus || val && val.toFixed(2)} </span>,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.totalScore").$D("总分"),
          fieldCode: "score",
          render: (val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.viewScore(record)}>{record.sumPassStatus || val && val.toFixed(2)}</a>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.recommend").$D("推荐"),
          fieldCode: "candidateFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.candidateSuggestion").$D("推荐意见"),
          fieldCode: "candidateSuggestion",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonInvalidQuotation", [ getQuotationName(this.bidFlag) ]).$D("无效{quotationName}"),
          fieldCode: "invalidFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
      ].filter(Boolean);
    },
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryTitleRFX", [ getDocumentTypeName(this.bidFlag) ]).$D("{documentTypeName}标题"),
          fieldCode: "rfxTitle",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={false}>{val}</srm-list-header>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonRFXNo", [ getCategoryCode(this.bidFlag) ]).$D("{categoryCode}单号"),
          fieldCode: "rfxNum",
          formRow: 2,
          render: (val, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={() => this.toDetail(record)}>{val}</a>
        },
      ];
    },
    // // 基础信息详情
    // getHeaderBaseDetailInfoColumns() {
    //   return [
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
    //       fieldCode: "templateName",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
    //       fieldCode: "sourceCategoryMeaning",
    //       render: (_, record) => record.secondarySourceCategoryMeaning || record.sourceCategoryMeaning || "-"
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
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonQuotationStartTime", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}开始时间"),
    //       fieldCode: "quotationStartDate",
    //     },
    //     {
    //       fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.commonqQotationDeadline", [ getQuotationName(this.bidFlag) ]).$D("{quotationName}截止时间"),
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
    async toDetail(record) {
      const environmentUrl = window.location.origin;
      let toUrl = "";
      let params = {};
      if (record.secondarySourceCategory === "NEW_BID") {
        params = {
          multiRfxNumOrTitle: record.rfxNum,
          customizeUnitCode: "SSRC.BID_HALL.NEW_LIST.ALL,SSRC.BID_HALL.NEW_LIST.FILTER_BAR",
          customizeOrderField:"creationDate:desc",
          secondarySourceCategory: record.secondarySourceCategory,
        };
      } else {
        params = {
          multiRfxNumOrTitle: record.rfxNum,
          customizeUnitCode: "SSRC.INQUIRY_HALL.NEW_LIST.ALL,SSRC.INQUIRY_HALL.NEW_LIST.FILTER_BAR",
          customizeOrderField:"creationDate:desc",
        };
      }
      this.$loading.show();
      await getRfxApi(params).then((res) => {
        if (res.content && res.content.length === 1) {
          // 获取headerId
          const rfxHeaderId = res.content[0].rfxHeaderId;
          // 构造跳转地址
          if (record.secondarySourceCategory === "NEW_BID") {
            const detailUrl = `/NewBidHall/#/HallDetail?rfxHeaderId=${rfxHeaderId}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          } else {
            const detailUrl = `/RfxHall/#/RfxHall?rfxHeaderId=${rfxHeaderId}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          }
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.sourceDocError").$D("来源单据不唯一或不存在"),
            duration: 2000
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });

      if (toUrl) {
        this.detailPopup = this.$popup({
          title: this.$T("ssrc.common.view.details").$D("详情"),
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
      }
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl"

.detail{
  background-color: var(--background-color-empty-second);
  height 100%;
  overflow auto;
}

.summary{
  border-top 8px solid var(--background-color-empty-second);
  font-size 12px;
  padding 16px;
  background-color #fff;
}

.score{
  border-top 1px solid var(--background-color-empty-second);
  border-bottom 1px solid var(--background-color-empty-second);
  font-size 12px;
  padding 15px 16px;
  background-color #fff;
}

.item-title{
  color #000;
  font-weight: 600;
}

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

.list-header{
  display: flex;
  flex-direction: row;
  .list-title{
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
  width 80%;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status2{
  color #333
}

.noContent {
  display: flex;
  justify-content: center;
  height: calc(100vh - 120px);
  padding:0 20px 0 0;

  div {
    margin-top: 70px;
    img {
      width: 240px;
      height: 240px;
      padding 30px;
    }

    p {
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default-e);
      letter-spacing: 0;
    }
  }
}
</style>
