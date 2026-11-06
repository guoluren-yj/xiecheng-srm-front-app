<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtBidding.view.title.baseInfo').$D('招标计划信息')">
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
import { getSearchData } from "./api";

export default {
  modules: [ "scux.xxjtBidding", "hipspfm.workFlow" ],
  name: "XXJTBidding",
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
          fieldName: this.$T("scux.xxjtBidding.model.biddingNum").$D("招标计划单号"),
          fieldCode: "biddingNum",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.ouName").$D("项目公司"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.subjectName").$D("标的名称"),
          fieldCode: "subjectName",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.biddStatusMeaning").$D("状态"),
          fieldCode: "biddStatusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.sectorMeaning").$D("所属板块"),
          fieldCode: "sectorMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.opeOrInfMeaning").$D("运营/基建"),
          fieldCode: "opeOrInfMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.bidCatMeaning").$D("招议标方式"),
          fieldCode: "bidCatMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.targetTypeMeaning").$D("招标类型"),
          fieldCode: "targetTypeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.biddingPlanTime").$D("计划开标时间"),
          fieldCode: "biddingPlanTime",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.budgetAmout").$D("预算金额（万元）"),
          fieldCode: "budgetAmout",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.budgetSourceMeaning").$D("预算金额来源"),
          fieldCode: "budgetSourceMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.createdByMeaning").$D("创建人"),
          fieldCode: "createdByMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.projectManager").$D("经办人"),
          fieldCode: "projectManager",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.bidPlaceMeaning").$D("招标地点"),
          fieldCode: "bidPlaceMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.bidCompanyMeaning").$D("招标公司"),
          fieldCode: "bidCompanyMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.planMonth").$D("计划月份"),
          fieldCode: "planMonth",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.planTypeMeaning").$D("计划类型"),
          fieldCode: "planTypeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.displayPrNumsMeaning").$D("关联采购申请"),
          fieldCode: "displayPrNumsMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtBidding.model.remark").$D("备注"),
          fieldCode: "remark",
        },
      ];
    },
  },
  async mounted() {
    this.headerInfo = await getSearchData({ id: this.changeReqId });
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