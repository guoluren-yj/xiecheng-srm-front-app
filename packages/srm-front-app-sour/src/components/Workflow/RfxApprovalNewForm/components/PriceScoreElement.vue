<template>
  <ul v-if="getTenantNum() === 'SRM-XXJT' && bidFlag && ( headInfo && headInfo.bidRuleType === 'DIFF' && headInfo.templateScoreType === 'SCORE' && Number(headInfo.attributeTinyint6) ) && ( dataSet && dataSet.data && dataSet.data.length > 0 )">
    <h2>{{ `${$T("ssrc.inquiryHall.view.message.tab.scoringElements").$D("评分要素")}-${$T("ssrc.inquiryHall.view.message.tab.priceGroup").$D("价格组")}: ${dataSet.data[0] && dataSet.data[0].attributeDecimal1}%` }}</h2>
    <srm-list :scrollable="false"
              height="auto"
              style="height: auto"
              :data-set="dataSet"
              :columns="columns" />
  </ul>
</template>
<script>

export default {
  name: "PriceScoreElement",
  modules: [ "ssrc.common", "hipspfm.common", "ssrc.inquiryHall" ],
  props: {
    dataSet: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    headInfo: {
      type: Object,
      default: () => {},
    },
    bidFlag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getTenantNum() {
      // 协鑫基于标准二开，价格要素（srm-37210）
      return window.localStorage.getItem("tenantNum");
    },
  },
};
</script>

<style>

</style>