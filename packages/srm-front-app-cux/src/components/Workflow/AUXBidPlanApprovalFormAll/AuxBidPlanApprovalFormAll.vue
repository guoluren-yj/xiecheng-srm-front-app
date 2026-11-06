<template>
  <div class="bid-plan-approval-form">
    <srm-scroll-tab class="content">
      <srm-scroll-tab-item class="infoContent" :label="$T('scux.view.title.detail.basicInfo').$D('基础信息')">
        <div class="baseInfo">
          <customize v-if="baseInfoColumns.length" :data-source="bidPlanDetailBaseInfo" :columns="baseInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item class="infoContent lineInfo" :label="$T('scux.material.view.title.lineInfos').$D('行信息')">
        <div v-if="!bidPlanDetailLineInfo || !bidPlanDetailLineInfo.length" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
        </div>
        <div v-for="(item, index) in bidPlanDetailLineInfo" :key="index" class="card-personalized">
          <div class="line line-border">
            <customize :columns="lineInfoColumns" :data-source="item" />
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getBidPlanDetailBase, getBidPlanDetailLine } from "./api/AuxApi.js";

export default {
  modules: [
    "hzero.common",
    "scux.acceptBench",
    "scux.tenderPlanSummary",
    "scux.view",
    "scux.tenderPlanReport",
    "scux.supplierReview",
    "scux.material",
    "hipspfm.common",
    "ssrc.common",
  ],
  name: "AuxBidPlanApprovalFormAll",
  props: {
    changeReqId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      planId: this.changeReqId,
      bidPlanDetailBaseInfo: {},
      bidPlanDetailLineInfo: [],
      baseInfoColumns: [],
      lineInfoColumns: [],
    };
  },
  mounted() {
    this.$emit("GetApprovalTitle", this.$T("scux.acceptBench.model.view.biddingApprovalAll").$D("招标计划汇总审批"));
    this.fetchDetailBaseInfo();
  },
  methods: {
    fetchDetailBaseInfo() {
      this.$loading.show();
      getBidPlanDetailBase(this.planId).then((res) => {
        if (res && !res.failed) {
          this.bidPlanDetailBaseInfo = res;
        }
      }).finally(() => {
        this.$loading.hide();
        this.baseInfoColumns = this.getBaseInfoColumns();
        this.fetchDetailLine();
      });
    },
    fetchDetailLine() {
      this.$loading.show();
      getBidPlanDetailLine(this.planId).then((res) => {
        if (res && !res.failed) {
          const { content = [] } = res || {};
          this.bidPlanDetailLineInfo = content;
        }
      }).finally(() => {
        this.$loading.hide();
        this.lineInfoColumns = this.getLineInfoColumns();
      });
    },
    getBaseInfoColumns() {
      return [
        {
          fieldName: this.$T("scux.acceptBench.model.view.purchaseOrgId").$D("采购组织"),
          fieldCode: "purOrganizationName",
          formRow: 1,
        },
        {
          fieldName: this.$T("scux.tenderPlanSummary.model.summary.planMonth").$D("计划月份"),
          fieldCode: "planMonth",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.acceptBench.model.view.creationName").$D("创建人"),
          fieldCode: "createdByName",
          formRow: 3,
        },
      ];
    },
    getLineInfoColumns() {
      return [
        {
          fieldName: this.$T("scux.material.model.icName").$D("项目名称"),
          fieldCode: "projectName",
          formRow: 1,
        },
        {
          fieldName: this.$T("hzero.common.model.common.type").$D("类型"),
          fieldCode: "biddingTypeMeaning",
          formRow: 2,
        },
        {
          fieldName: `${this.$T("scux.tenderPlanReport.model.report.estimatedAmount").$D("预估金额")}(${this.$T("ssrc.common.view.tenThousand").$D("万")})`,
          fieldCode: "budget",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.tenderPlanReport.model.report.planApprovalDate").$D("策划审批时间"),
          fieldCode: "planApprovalDate",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.tenderPlanReport.model.report.resultReportDate").$D("定标完成时间"),
          fieldCode: "resultReportDate",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.tenderPlanReport.model.report.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.tenderPlanReport.model.report.ouName").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.tenderPlanSummary.model.summary.planNum").$D("计划单号"),
          fieldCode: "planNum",
          formRow: 6,
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>
.bid-plan-approval-form {
  padding 16px;
  font-size 14px;
  background white;
}

.title-bold {
  margin-top 15px;
  color #333;
  font-weight 700;
  font-family: PingFangSC-Regular;
}

.content {
  .infoContent {
    h3 {
      padding: 20px 20px 12px;
      font-size: 18px;
      color: var(--color-font-default);
      line-height: 26.1px;
      font-weight: 700;
      background: var(--color-bg-default-b);
    }
  }

  .baseInfo {
    padding 12px 15px;
  }

  .lineInfo {
    ul {
      padding-left: 20px;

      li:nth-last-child(1) {
        padding-bottom: 11px;
        border-bottom: 1px solid var(--color-border-default);
      }

      li {
        display: flex;
        align-items: center;
        padding: 9px 20px 0 0;
        margin-bottom: 2px;

        span {
          flex: 1;
          // font-family: PingFangSC-Regular;
          font-size: 14px;
          color: var(--color-font-default, #1b1e2b);
          line-height: 22px;
        }
      }
    }
  }
}
.card-personalized {
  width: 100%;
  color: #666666;
  background: var(--color-bg-default);

  .card-first-single {
    text-align: left;
    font-size: 14px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 22px;
  }

  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 235px;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}
.noContent {
  height: 78px;
  padding-left: 20px;

  span {
    position: relative;
    top: 16px;
    // font-family: PingFangSC-Medium;
    font-size: 14px;
    color: var(--color-font-default-b);
    letter-spacing: 0;
    line-height: 22px;
  }
}
.line {
  padding 12px 15px;
  background-color: #F6F6F6;
  margin: 10px 0;
}
.line-border {
  border-bottom: 1px dashed black;
}

</style>
