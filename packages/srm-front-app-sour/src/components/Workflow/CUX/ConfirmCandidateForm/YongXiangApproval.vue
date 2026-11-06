<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.basicInfos').$D('基础信息')">
        <srm-form :data-set="headerDs"
                  :columns="getFormColumns()" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.comprehensiveOption').$D('综合评标意见')">
        <div class="option-container">{{ $T('ssrc.inquiryHall.view.message.panel.comprehensiveOption').$D('综合评标意见') }}：{{ headerDs.data[0] && headerDs.data[0].attributeLongtext4 }}</div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.businessOption').$D('商务评标意见')">
        <div class="option-container">{{ $T('ssrc.inquiryHall.view.message.panel.businessOption').$D('商务评标意见') }}：{{ headerDs.data[0] && headerDs.data[0].attributeLongtext3 }}</div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.techOption').$D('技术评标意见')">
        <div class="option-container">{{ $T('ssrc.inquiryHall.view.message.panel.techOption').$D('技术评标意见') }}：{{ headerDs.data[0] && headerDs.data[0].attributeLongtext2 }}</div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.panel.preScaleResults').$D('预定标结果')" >
        <div class="attachment-content">
          <div class="sub-title">{{ $T('hzero.common.view.title.attachment').$D('附件') }}</div>
          <div class="attach-line">
            <div>{{ $T('hzero.common.button.viewAttachment').$D('查看附件') }}：</div>
            <srm-upload :attachment-uuid="lineData.preAttachmentUuid"
                        :desc-title="$T('hzero.button.button.look').$D('查看')"
                        :show-icon="false"/>
          </div>
        </div>
        <srm-list
          :data-set="lineDs"
          :columns="getLineColumns()">
          <div slot="filter">
            <div class="sub-title">{{ $T('ssrc.inquiryHall.model.inquiryHall.tempKey').$D('供应商') }}</div>
          </div>
        </srm-list>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { $T, DataSet, SrmListHeader, SrmUtil } from "srm-mobile-ui";
import { headerDS, lineDS } from "./datasource/yongxianglineDS";
import { fetchLineData } from "./api/yongxiang";
import ScoreDetailPopup from "./components/ScoreDetailPopup";
import TenderDetailPopup from "./components/TenderDetailPopup";
export default {
  modules: [ "ssrc.inquiryHall", "hzero.common", "hzero.button", "ssrc.receiptWorkbench", "ssrc.queryQuotation", "ssrc.common", "ssrc.bidHall" ],
  props: {
    changeReqId: {
      type: String | Number,
      default: "91890960796981421"
    },
  },
  data() {
    return {
      rfxHeaderId: this.changeReqId,
      headerDs: new DataSet(headerDS({ rfxHeaderId: this.changeReqId })),
      lineDs: new DataSet(lineDS()),
      lineData: {}, // 行数据
    };
  },
  mounted() {
    if (this.changeReqId) {
      this.fetchLineData();
    }
  },
  methods: {
    fetchLineData() {
      const queryParams = {
        rfxHeaderId: this.rfxHeaderId,
        sourceFrom: "RFX",
      };
      this.$loading.show();
      fetchLineData(queryParams)
        .then((res) => {
          if (res && !res.failed) {
            this.lineData = res;
            this.lineDs.setData(res.evaluateSummaryMap[" "] || []);
          }
        })
        .finally(() => this.$loading.hide());
    },
    getFormColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span style="color: #276EF1" onclick={() => this.goToDetail(item)}>{val}</span>
            <span slot="right">{$T("ssrc.inquiryHall.model.inquiryHall.quotationRoundNumber").$D("轮次")}：{item.quotationRoundNumber ? item.quotationRoundNumber : 1}</span>
          </SrmListHeader>
        },
        {
          formRow: 20,
          fieldCode: "rfxTitle",
        },
        {
          formRow: 30,
          fieldCode: "realName",
        },
        {
          formRow: 40,
          fieldCode: "companyName",
        },
        {
          formRow: 50,
          fieldCode: "sourceMethod",
          seq: 10,
        },
        {
          formRow: 50,
          fieldCode: "attributeVarchar2",
          seq: 20,
        },
        {
          formRow: 60,
          fieldCode: "attributeVarchar35",
        },
        {
          formRow: 70,
          fieldCode: "rfxRemark",
        },
      ];
    },
    getLineColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          render: (val, item) => <div style="width: 100%">
            {item.candidateFlag ? <SrmTag type="success" fill size="small" style="margin-right: 4px">{$T("ssrc.inquiryHall.model.inquiryHall.recommend").$D("推荐")}</SrmTag> : ""}
            <span style="font-weight: 600">{val}</span><span style="float: right">{$T("ssrc.inquiryHall.model.inquiryHall.scoreRank").$D("排名")}：{item.scoreRank}</span></div>
        },
        {
          formRow: 20,
          fieldCode: "totalAmount",
          render: (val, item) =>
            <span style={item.redPrice === "TOTAL" ? { color: "#f5222d" } : {}}>
              {val}
            </span>
          ,
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "businessScore",
          fieldName:
          <span>
            {$T("ssrc.inquiryHall.model.inquiryHall.businessScore").$D("商务评分")}
            {this.lineData.businessWeight ? `(${this.lineData.businessWeight}%)` : "(0%)"}
          </span>,
          render: (val) => Number(val)?.toFixed?.(2),
        },
        {
          formRow: 30,
          seq: 20,
          fieldCode: "attributeBigint1",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "technologyScore",
          fieldName:
          <span>
            {$T("ssrc.inquiryHall.model.inquiryHall.technologyScore").$D("技术评分")}
            {this.lineData.technologyWeight ? `(${this.lineData.technologyWeight}%)` : "(0%)"}
          </span>,
          render: (val) => Number(val)?.toFixed?.(2),
        },
        {
          formRow: 40,
          seq: 20,
          fieldCode: "attributeBigint2",
        },
        {
          formRow: 50,
          fieldCode: "score",
          // render: (val, item) => <a style="color: #276EF1" onClick={() => this.openScoreDetailPopup(item)}>{val}</a>, 因为二级要素和通过制未确认，暂时先不放开此链接
        },
        {
          formRow: 60,
          fieldCode: "candidateSuggestion",
        },
        {
          formRow: 70,
          fieldCode: "bidDetail",
          render: (_, item) => <a style="color: #276EF1" onClick={() => this.goToTenderDetails(item)}>{$T("hzero.button.button.look").$D("查看")}</a>,
        },
      ];
    },
    // 跳转详情页
    goToDetail() {
      const environmentUrl = window.location.origin;
      // 构造跳转地址
      const detailUrl = `/NewBidHall/#/HallDetail?rfxHeaderId=${this.rfxHeaderId}&documentType=BID`;
      const toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;

      this.detailPopup = this.$popup({
        title: this.$T("ssrc.inquiryHall.view.details").$D("详情"),
        showHeader: true,
        showBack: true,
        content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
      });
    },
    // 打开投标详情页
    goToTenderDetails(item) {
      this.$popup({
        showHeader: false,
        showClose: false,
        position: "bottom",
        showBack: true,
        content: <TenderDetailPopup rfxHeaderId={this.rfxHeaderId} supplierCompanyId={this.headerDs.data?.[0]?.companyId} quotationHeaderId={item.quotationHeaderId} />
      });
    },
    // 打开评分详情弹框
    openScoreDetailPopup(item) {
      this.$popup({
        title: this.$T("ssrc.inquiryHall.view.title.approvalWorkPlace").$D("审批工作台"),
        showHeader: false,
        showClose: false,
        position: "bottom",
        showBack: true,
        content: <ScoreDetailPopup evaluateSummaryId={item.evaluateSummaryId} />
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.option-container {
    padding: 12px 15px 16px;
    line-height: 20px;
    word-break: break-all;
    font-size: 14px;
    color: var(--color-font-default);
}
.sub-title {
    padding: 12px 15px 16px;
    font-size: 12px;
    line-height: 16px;
    border-bottom: 1px solid var(--color-border-default);
    color: var(--color-font-default);
}
.attachment-content {
    border-bottom: 8px solid var(--background-color-empty-second);
.attach-line {
  display: flex;
   padding: 12px 15px 16px;
   font-size: 14px;
  color: var(--color-font-default);
}
}
</style>

