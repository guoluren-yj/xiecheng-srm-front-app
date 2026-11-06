<template>
  <srm-popup
    :visible="visible" :title="$T('ssrc.inquiryHall.view.message.title.roundQuotation').$D('多轮报价')" @onClose="close">
    <div class="container font">
      <div v-for="(li, key) in roundQuotation" :key="key" class="line">
        {{ $T("ssrc.inquiryHall.view.cron.certain").$D("第") }} {{ li.quotationRoundNumber }} {{ $T("ssrc.bidHall.model.bidHall.roundNums").$D("轮") }}：<span v-if="li.totalRoundPrice">{{
          li.totalRoundPrice | CalcMicrometer
        }}</span><span v-else> - </span>（{{ currencyCodeMeaning }}）
      </div>
    </div>
  </srm-popup>
</template>
<script>

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.bidHall" ],
  name: "MoreRoundPop",
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    roundQuotation: {
      type: Array | String,
      default: () => [],
    },
    currencyCodeMeaning: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    close() {
      this.$emit("changeVisible", false);
    },
  },
};
</script>
<style lang="stylus" scoped>
.container {
  height: 400px;
  overflow: auto;
  padding-bottom: 16px;
  padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));

  .line {
    margin-left: 15px;
    padding: 16px 15px 16px 0;
    border-bottom: 1px solid var(--color-border-default);

    &:nth-child(1) {
      border-top: 1px solid var(--color-border-default);
    }
  }
}

.font {
  font-size: 16px;
  color: var(--color-font-default);
  line-height: 22px;
}
</style>
