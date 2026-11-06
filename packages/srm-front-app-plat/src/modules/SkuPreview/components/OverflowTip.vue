<template>
  <div class="overflow-container">
    <div ref="valueRef" class="value-wrap">
      <span class="value"> {{ title }} </span>
      <div v-if="isOverflow" class="popovers">
        <div class="top" />
        <srm-tooltip :title="toolTip" placement="top">
          <span v-if="isOverflow" class="srm-icon icon-info-circle" />
        </srm-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { SrmTooltip } from "srm-mobile-ui";
export default {
  name: "OverflowTip",
  components: { SrmTooltip },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isOverflow: false,
    };
  },
  computed: {
    toolTip() {
      return this.isOverflow ? this.title : null;
    },
  },
  mounted() {
    const { clientWidth, scrollWidth } = this.$refs.valueRef;
    if (scrollWidth > clientWidth) {
      this.isOverflow = true;
    }
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
.overflow-container {
  .value-wrap {
    text-align: left;
    position: relative;

    .popovers {
      position: absolute;
      top: 0px;
      right: 0px;
      display: flex;
      width: 100px;
      justify-content: flex-end;

      .top {
        height: 18.33px;
        flex: 1;
        background: linear-gradient(to right, var(--picker-view-gradient-to), var(--picker-view-gradient-from));
      }
    }
  }

  .srm-icon {
    background: #fff;
    color: var(--font-color-primary);
  }
}
</style>
