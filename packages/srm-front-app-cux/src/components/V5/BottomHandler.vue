<template>
  <div :id="id" class="bottom-handler" :style="{ position }">
    <srm-tooltip v-if="btnArr.length > 3" :visible-arrow="false">
      <div class="more-icon">
        <img
          class="more-icon"
          :src="require('@/assets/4.0/Navigation bar_more_normal@3x.png')">
      </div>
      <srm-flex slot="content" direction="column">
        <srm-button
          v-for="(item, index) in btnArr.slice(2)"
          :key="index"
          plain
          rect
          :disabled="item.disabled"
          @click="!item.disabled && item.handler()">
          {{ item.title }}
        </srm-button>
      </srm-flex>
    </srm-tooltip>

    <div
      v-for="(item, index) in showBtn"
      :key="index"
      :style="{ color: item.color, background: item.background }"
      :class="[item.disabled ? 'btn-item noWrap disabled-class' :'btn-item noWrap']"
      @click="!item.disabled && item.handler()">
      {{ item.title }}
    </div>
  </div>
</template>
<script>
export default {
  name: "BottomHandler",
  props: {
    btnArr: {
      type: Array,
      default: () => [],
    },
    position: {
      type: String,
      default: "fixed",
    },
    id: {
      type: String,
      default: "FootButton",
    },
    height: {
      type: String | Number,
      default: "48",
    },
  },
  computed: {
    showBtn() {
      return this.btnArr.length > 3 ? this.btnArr.slice(0, 2) : this.btnArr;
    },
  },
};
</script>
<style lang="stylus" scoped>
.bottom-handler {
  width: 100%;
  padding-top: 12px;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 12px;
  padding-bottom: calc(12px+constant(safe-area-inset-bottom));
  padding-bottom: calc(12px+env(safe-area-inset-bottom));
  background: var(--color-bg-default);
  box-shadow: 0px -2px 6px 0px rgba(0,0,0,0.06);
  // opacity: 0.9;
  bottom: 0;
  display: flex  !important;
  align-items: center;
  justify-content space-between;

  .more-icon {
    width 40px;
    height 40px;
    img {
      width 40px;
      height 40px;
    }
  }

  .btn-item {
    flex: 1;
    font-weight: bold;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    text-align: center;
    padding 13px;

    display: inline-block;
    border-radius: 24px;
    background #eff3fe;
    line-height: 16px;
  }

  div {
    margin-right 20px;
    &:last-child {
      margin-right 0;
    }
  }
}
</style>
<style lang="stylus" scoped>
>>>.srm-button {
  padding 8px !important;
}
</style>
