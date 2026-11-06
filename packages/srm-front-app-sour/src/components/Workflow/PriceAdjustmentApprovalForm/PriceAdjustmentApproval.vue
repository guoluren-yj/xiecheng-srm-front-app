<template>
  <!-- 调价单审批 -->
  <section>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basicInfoDataSet"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')" />
      </srm-scroll-tab-item>
      <!-- 调价单明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('lineInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="lineInfoDataSet"
                  :columns="getColumns('lineInfo')"
                  :customize-code="getCodeDefine('lineInfo')"
                  @itemClick="clicklineInfoDetailInfo"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" :show-header="false" position="right">
      <customize-detail
        v-if="visible"
        :need-padding="true"
        :data-source="popupData.data"
        :code="getCodeDefine(popupData.code)"
        :columns="getColumns(popupData.columns)"/>
    </srm-popup>
  </section>
</template>

<script>
import LadderQuotation from "./components/LadderQuotation";
import ViewScope from "./components/ViewScope";

import mixin from "./mixin/mixin";

export default {
  modules: [ "hipspfm.common", "ssrc.inquiryHall", "ssrc.priceAdjustmentWorkBench", "ssrc.priceLibraryNew", "ssrc.supplyInfoChange" ],
  name: "PriceAdjustmentApproval",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LadderQuotation,
    // eslint-disable-next-line vue/no-unused-components
    ViewScope,
  },
  mixins: [ mixin ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
};
</script>

<style scoped lang="stylus">
>>> .open-tag::before {
  display: none;
}
>>> .srm-list-item-card-head-left {
  max-width: 80% !important;
}
.srm-header-text {
  font-weight: normal;
}
</style>
