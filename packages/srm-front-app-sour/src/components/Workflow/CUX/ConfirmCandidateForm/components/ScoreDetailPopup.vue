<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.businessGroup').$D('商务组')">
        <srm-list
          :data-set="businessDs"
          :columns="getElementColumns()">
          <div slot="filter">
            <div class="sub-title">{{ $T('ssrc.inquiryHall.model.inquiryHall.totalScore').$D('总分') }}：{{ scoreData.businessTotal }}</div>
          </div>
        </srm-list>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.tab.technicalGroup').$D('技术组')">
        <srm-list
          :data-set="technicalDs"
          :columns="getElementColumns()">
          <div slot="filter">
            <div class="sub-title">{{ $T('ssrc.inquiryHall.model.inquiryHall.totalScore').$D('总分') }}：{{ scoreData.technologyTotal }}</div>
          </div>
        </srm-list>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { scoreElementDS } from "../datasource/yongxianglineDS";
import { fetchElementData } from "../api/yongxiang";
import { scoreIntervalRender } from "@/utils/renderer";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryQuotation", "ssrc.common", "ssrc.bidHall", "hzero.common" ],
  name: "ScoreDetailPopup",
  props: {
    evaluateSummaryId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      businessDs: new DataSet(scoreElementDS()),
      technicalDs: new DataSet(scoreElementDS()),
      scoreData: {}, // 要素数据
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$loading.show();
      fetchElementData({ evaluateSummaryId: this.evaluateSummaryId }).then((res) => {
        if (res && !res.failed) {
          this.scoreData = res;
          this.businessDs.setData(res.businessScoreLineList || []);
          this.technicalDs.setData(res.technologyScoreLineList || []);
        }
      }).finally(() => this.$loading.hide());
    },
    getElementColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "indicateName",
          render: (val, item) => // TODO
            item.remark ? `${item.indicateName}（${item.remark}）` : item.indicateName
        },
        {
          formRow: 20,
          fieldCode: "scoringInterval",
          render: (val, item) => // TODO
            item.indicateType !== "PASS" ?
              scoreIntervalRender(item.minScore, item.maxScore) :
              "-"
        },
        {
          formRow: 30,
          fieldCode: "indicScore",
          render: (val, item) => // TODO
            item.indicateType !== "PASS" ?
              val && val.toFixed(2) :
              item.passStatusMeaning ?
                typeof item.passStatusMeaning === "number" ?
                  item.passStatusMeaning.toFixed(2) :
                  item.passStatusMeaning :
                null
        },
        {
          formRow: 40,
          fieldCode: "weight",
          render: (val, item) => item.indicateType !== "PASS" ? val : "-",
        },
      ];
    },
  },
};
</script>
<style scoped lang="stylus">
.sub-title {
    padding: 12px 15px 16px;
    line-height: 16px;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid var(--color-border-default);
    color: var(--color-font-default);
}
</style>