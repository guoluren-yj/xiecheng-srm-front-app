<template>
  <div class="ssrc-bidding-hall-customize-title-wrap">
    <div class="ssrc-bidding-hall-customize-title-title">
      {{ title }}
    </div>
    <div v-if="leftRender" class="ssrc-bidding-hall-customize-title-right">
      <span class="ssrc-bidding-hall-customize-title-right-label">
        {{ leftLabel }}:
      </span>
      <span class="ssrc-bidding-hall-customize-title-right-value">
        {{ leftRender }}
      </span>
    </div>
  </div>
</template>

<script>

/**
 * 倒计时组件
 * */
export default {
  name: "SupplierPlatNum",
  modules: [ "ssrc.common", ],
  props: {
    label: {
      type: String || null,
      default: null,
    },
    left: {
      type: String || null,
      default: null,
    },
    leftTitle: {
      type: String || null,
      default: null,
    },
  },
  data() {
    return {
      title: "",
      leftRender: "",
      leftLabel: "",
    };
  },
  watch: {
    title(val) {
      this.title = val;
    },
    leftRender(val) {
      this.leftRender = val;
    },
    leftTitle(val) {
      this.leftLabel = val;
    },
    left(val) {
      this.leftRender = val;
    },
  },
  destroyed() {
  },
  deactivated() {
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const {
        label = "",
        left = "",
        leftTitle = ""
      } = this.$props || {};

      this.title = label;
      this.leftRender = left;
      this.leftLabel = leftTitle;
    },
  },
};
</script>

<style lang="stylus" scoped>
.ssrc-bidding-hall-customize-title-wrap {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: var(--background-color-empty-tab-title);
  color: var(--font-color-default);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  padding-left: 4vw;
  padding-right: 4vw;
  justify-content: space-between;
}

.ssrc-bidding-hall-customize-title-title {
  font-size: 14px;
  font-weight: 500 !important;
}

.ssrc-bidding-hall-customize-title-right {
  color: var(--color-info);
  font-size: 12px;
  font-weight: 400;
}

.ssrc-bidding-hall-customize-title-right-label {
  color: #868D9C;
}

.ssrc-bidding-hall-customize-title-right-value {
  color: var(--color-info);
  font-size: 12px;
  padding-left: 4px;
}

</style>

