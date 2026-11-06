<template>
  <ul v-if="bidFlag && ( headInfo && headInfo.bidRuleType === 'DIFF' && headInfo.templateScoreType === 'SCORE' && Number(headInfo.attributeTinyint6) ) && ( dataSet && dataSet.data && dataSet.data.length > 0 )"
      class="rfx-approval-border-space rfx-approval-ul-padding-top">
    <customize style="padding: 0px 15px 0px 15px;"
               :data-source="dataSet.data[0]"
               :columns="headColumns"
               type="list"
               :need-padding="false" />
    <srm-list :scrollable="false"
              height="auto"
              style="height: auto"
              :data-set="dataSet"
              :columns="columns" />
  </ul>
</template>

<script>
export default {
  name: "XxjtPriceScoreElement",
  modules: [ "ssrc.common", "hipspfm.common" ],
  props: {
    dataSet: {
      type: Object,
      default: () => {},
    },
    headColumns: {
      type: Array,
      default: () => [],
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
};
</script>

<style>
</style>