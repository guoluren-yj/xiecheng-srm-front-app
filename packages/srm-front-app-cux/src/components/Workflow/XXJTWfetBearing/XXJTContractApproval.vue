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
import { getSearchContractData } from "./api";
import { DataSet } from "srm-mobile-ui";
import { lineContractDs } from "./dataSource/lineDs";

export default {
  modules: [ "scux.xxjtWfetBearing", "hipspfm.workFlow" ],
  name: "XXJTContractApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfoDataSet: new DataSet(lineContractDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.title").$D("标题"),
          fieldCode: "title",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.status").$D("状态"),
          fieldCode: "statusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.contractReviewNum").$D("合同复核单号"),
          fieldCode: "contractReviewNum",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.biddingPlanNum").$D("招标计划单号"),
          fieldCode: "biddingPlanNum",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.associateNum").$D("关联单据号"),
          fieldCode: "associateNum",
          render: (val, record) => <a style="color:#276EF1;" onClick={() => this.handleJumpRfx(record)}
          >{ val }</a>,
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.tendereeMeaning").$D("招标经理"),
          fieldCode: "tendereeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.projectCompanyIdMeaning").$D("项目公司"),
          fieldCode: "projectCompanyIdMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.subjectName").$D("标的名称"),
          fieldCode: "subjectName",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.isSame").$D("合同与预中标结果一致"),
          fieldCode: "isSameMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.differenceDescription").$D("差异说明"),
          fieldCode: "differenceDescription",
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
      ];
    },
    lineColumns() {
      return [
        {
          fieldCode: "lineNum",
          render: (val, record, _, Record) => {
            const { index } = Record;
            const { pageSize, currentPage } = Record?.dataSet || {};
            return pageSize * currentPage + index + 1;
          },
        },
        {
          fieldCode: "bidWinner",
        },
        {
          fieldCode: "contractAmount",
        },
        {
          fieldCode: "pcNum",
        },
        {
          fieldCode: "isNoContract",
        },
        {
          fieldCode: "remarks",
        },
      ];
    },
  },
  async mounted() {
    this.headerInfo = await getSearchContractData({ id: this.changeReqId });
    this.lineInfoDataSet.addPathParameter("contractReviewId", this.changeReqId);
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