<template>
  <hips-nav-bar :have-border="false" class="detail-navbar">
    <div slot="left" class="left-button" @click="goBack">
      <img
        src="@/assets/icon_Navigation bar_left_default b@3x.png"
        class="image-black-default"
      />
    </div>
    <span class="nav-title" slot="center">{{ title }}</span>
    <div slot="right" class="right-button" v-show="showClose">
      <img
        class="image-black-default"
        src="@/assets/icon_navigationbars_off_normal@3x.png"
        alt
        @click="goClose"
      />
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
      default: "",
    },
    showClose: false,
    showBackFlag: true,
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
  },
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

  .nav-title {
    font-weight: 600;
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    img {
      height: 18px;
      width: 18px;
    }
  }
}
</style>
