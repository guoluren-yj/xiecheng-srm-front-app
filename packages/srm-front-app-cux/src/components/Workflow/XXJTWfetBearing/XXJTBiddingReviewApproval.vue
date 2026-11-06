<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtBiddingReivw.view.title.baseInfo').$D('基础信息')">
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
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getBiddingReviewData } from "./api";

export default {
  modules: [ "scux.xxjtBiddingReivw", "hipspfm.workFlow" ],
  name: "XXJTBiddingReviewApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidReviewNum").$D("招标复核单号"),
          fieldCode: "bidReviewNum",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.associateNum").$D("关联单据号"),
          fieldCode: "associateNum",
          render: (val, record) => <a style="color:#276EF1;" onClick={() => this.handleJumpRfx(record)}
          >{ val }</a>,
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.title").$D("标题"),
          fieldCode: "title",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.statusMeaning").$D("状态"),
          fieldCode: "statusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.biddingPlanNum").$D("招标计划单号"),
          fieldCode: "biddingPlanNum",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.projectCompanyIdMeaning").$D("项目公司"),
          fieldCode: "projectCompanyIdMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.subjectName").$D("标的名称"),
          fieldCode: "subjectName",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.budgetAmount").$D("预算金额(元)"),
          fieldCode: "budgetAmount",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.attributeVarchar15").$D("预算金额来源"),
          fieldCode: "attributeVarchar15Meaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidType").$D("招标类型"),
          fieldCode: "bidTypeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidMethod").$D("招议标方式"),
          fieldCode: "bidMethodMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.infrastructureOperation").$D("基建/运营"),
          fieldCode: "infrastructureOperationMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.sector").$D("所属板块"),
          fieldCode: "sectorMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidOpenPlace").$D("开标地点"),
          fieldCode: "bidOpenPlaceMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.tenderee").$D("招标经理"),
          fieldCode: "tendereeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationDeadline",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidFee").$D("标书费(元)"),
          fieldCode: "bidFee",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.earnestMoney").$D("保证金(元)"),
          fieldCode: "earnestMoney",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.planType").$D("计划类型"),
          fieldCode: "planTypeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.commercialAttachments").$D("招议标文件"),
          fieldCode: "commercialAttachments",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.commercialAttachments}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.xxjtBiddingReivw.model.commercialAttachments").$D("招议标文件")}
            desc-title={this.$T("scux.xxjtBiddingReivw.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.technicalAttachments").$D("其他内部支撑性文件"),
          fieldCode: "technicalAttachments",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.technicalAttachments}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.xxjtBiddingReivw.model.technicalAttachments").$D("其他内部支撑性文件")}
            desc-title={this.$T("scux.xxjtBiddingReivw.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.supportingAttachments").$D("招标公司支撑性文件"),
          fieldCode: "supportingAttachments",
          render: (val, record) => val && <srm-upload
            attachment-uuid={record.supportingAttachments}
            show-count={true}
            show-icon={false}
            title={this.$T("scux.xxjtBiddingReivw.model.supportingAttachments").$D("招标公司支撑性文件")}
            desc-title={this.$T("scux.xxjtBiddingReivw.model.check").$D(
              "查看"
            )}
          />,
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidCompanyNum").$D("招标公司"),
          fieldCode: "bidCompanyNumMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.bidFileReviewComments").$D("招标文件评审意见"),
          fieldCode: "bidFileReviewComments",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.supplierReviewComments").$D("供应商审查意见"),
          fieldCode: "supplierReviewComments",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.reviewComments").$D("评审审查意见"),
          fieldCode: "reviewComments",
        },
        {
          fieldName: this.$T("scux.xxjtBiddingReivw.model.projectDesc").$D("项目说明"),
          fieldCode: "projectDesc",
        },
      ];
    },
  },
  async mounted() {
    this.headerInfo = await getBiddingReviewData({ id: this.changeReqId });
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