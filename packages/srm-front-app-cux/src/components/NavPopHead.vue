<template>
  <hips-nav-bar
    v-if="showPopHeadFlag"
    :have-border="false"
    class="detail-navbar">
    <div slot="center" class="center-title">
      {{ title || $T("smbl.common.message.detailInfo").$D("明细信息详情") }}
    </div>
    <div slot="right" class="right-button">
      <span>
        <img
          class="image-black-default"
          src="@/assets/4.0/Navigation bar_delete_normal@3x.png"
          alt
          @click="goBack">
      </span>
    </div>
  </hips-nav-bar>
</template>

<script>
import { View, NavBar } from "hips";

export default {
  modules: [ "smbl.common" ],
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
  },
  props: {
    title: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    },
    showPopHeadFlag: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    goBack() {
      this.$emit("clickBack");
    },
  }
};
</script>

<style lang="stylus" scoped>
.detail-navbar {

  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;

    img {
      height: 12.7px;
      width: 15.3px;
      margin-right: 10.7px;
      margin-top: 4px;
    }
  }

  .center-title {
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      height: 32px;
      background: var(--color-bg-default);
      // border: 1px solid var(--color-border-default);
      border-radius: 18px;
    }

    img {
      height: 18px;
      width: 18px;
    }
  }
}
</style>
