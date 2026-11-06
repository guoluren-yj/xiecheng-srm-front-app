<template>
  <hips-nav-bar
    v-if="showBackFlag"
    :have-border="false"
    class="detail-navbar">
    <div slot="left" class="left-button" @click="goBack">
      <img
        src="@/assets/icon_Navigation bar_left_default b@3x.png"
        class="image-black-default">
      {{ title }}
    </div>
    <div slot="right" class="right-button">
      <span>
        <img
          class="image-black-default"
          src="@/assets/icon_Navbar_top_default_blank@3x.png"
          alt
          @click="goTop">
        <i>|</i>
        <img
          class="image-black-default"
          src="@/assets/icon_Navbar_closed_default_blank@3x.png"
          alt
          @click="goClose">
      </span>
    </div>
  </hips-nav-bar>
</template>

<script>
import { View, NavBar } from "hips";
export default {
  name: "NavHead",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    goTop() {
      this.$emit("goTop");
    },
    goClose() {
      this.$emit("goClose");
    },
    goBack() {
      this.$emit("goBack");
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

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      width: 77px;
      height: 32px;
      padding: 7px 10px;
      background: var(--color-bg-default);
      border: 1px solid var(--color-border-default);
      border-radius: 18px;

      i {
        margin: 0px 8px;
        position: relative;
        top: -1px;
      }
    }

    img {
      height: 18px;
      width: 18px;
    }
  }
}
</style>
