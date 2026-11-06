<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtWfetBearing.view.title.baseInfo').$D('基础信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtWfetBearing.view.title.successfulBidder').$D('中标信息')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getSearchData } from "./api";
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/lineDs";

export default {
  modules: [ "scux.xxjtWfetBearing", "hipspfm.workFlow" ],
  name: "XXJTWfetBearing",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidPreWinReviewNum").$D("预中标复核单号"),
          fieldCode: "bidPreWinReviewNum",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.associateNum").$D("关联单据号"),
          fieldCode: "associateNum",
          render: (val, record) => <a style="color:#276EF1;" onClick={() => this.handleJumpRfx(record)}
          >{ val }</a>,
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.title").$D("标题"),
          fieldCode: "title",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.statusMeaning").$D("状态"),
          fieldCode: "statusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.biddingPlanNum").$D("招标计划单号"),
          fieldCode: "biddingPlanNum",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.tenderee").$D("招标经理"),
          fieldCode: "tendereeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.actualBidOpenDate").$D("实际开标日期"),
          fieldCode: "actualBidOpenDate",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.subjectName").$D("标的名称"),
          fieldCode: "subjectName",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.biddingPlanTime").$D("计划开标时间"),
          fieldCode: "biddingPlanTime",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.projectCompanyIdMeaning").$D("项目公司"),
          fieldCode: "projectCompanyIdMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidPreWinReviewInstructions").$D("复核说明"),
          fieldCode: "bidPreWinReviewInstructions",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.oneTimeChargeFlag").$D("是否一次性收费"),
          fieldCode: "oneTimeChargeFlagMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.attachmentUuid").$D("附件"),
          fieldCode: "attachmentUuid",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.attachmentUuid}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.xxjtWfetBearing.model.attachmentUuid").$D("附件")}
            desc-title={this.$T("scux.xxjtWfetBearing.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.remarks").$D("备注"),
          fieldCode: "notes",
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.lineNum").$D("序号"),
          fieldCode: "lineNum",
          // render: (val) => <srm-list-header show-open-tag={true}>
          //   <span>{ val }</span>
          // </srm-list-header>
          render: (val, record, _, Record) => {
            const { index } = Record;
            const { pageSize, currentPage } = Record?.dataSet || {};
            return pageSize * currentPage + index + 1;
          },
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.bidWinner").$D("中标单位"),
          fieldCode: "bidWinner",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.bidAmount").$D("中标金额(元)"),
          fieldCode: "bidAmount",
        },
        [ 1, "1" ].includes(this.headerInfo.oneTimeChargeFlag) && {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.oneTimeCharge").$D("服务费金额(元)"),
          fieldCode: "oneTimeCharge",
        },
        ![ 1, "1" ].includes(this.headerInfo.oneTimeChargeFlag) && {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.prepayServiceFee").$D("预收框架服务费金额(元)"),
          fieldCode: "prepayServiceFee",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.supBidApplication.remarks").$D("备注"),
          fieldCode: "remarks",
        },
      ].filter(Boolean);
    },
  },
  async mounted() {
    this.headerInfo = await getSearchData({ id: this.changeReqId });
    this.lineInfoDataSet.addPathParameter("bidPreWinReviewId", this.changeReqId);
    this.lineInfoDataSet.refresh();
  },
  methods: {
    handleJumpRfx(record) {
      const { associateNum, associateId } = record;
      if (associateNum === "RFX") {
        this.$router.push({ path: "/appSour/RfxHallDetail", query: { rfxHeaderId: associateId, documentType: "RFX", } });
      } else {
        this.$router.push({ path: "/appSour/BidHallDetail", query: { documentType: "BID", rfxHeaderId: associateId } });
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>