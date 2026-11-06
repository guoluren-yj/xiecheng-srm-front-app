<template>
  <hips-nav-bar :have-border="false" class="detail-navbar" :class="customClass">
    <div slot="left" class="left-button" @click="goBack" v-show="showBackFlag">
      <span class="srm-icon icon-arrow-left"></span>
    </div>
    <span class="nav-title" slot="center">{{ title }}</span>
    <div slot="right" class="right-button" v-show="showClose">
      <span class="srm-icon icon-x" @click="goClose"></span>
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
    dark: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    showBackFlag: {
      type: Boolean,
      default: true,
    },
    class: {
      type: String,
      default: "",
    },
  },
  computed: {
    customClass() {
      return `${this.class} ${this.dark ? "dark" : "light"}`;
    },
  },
  methods: {
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
  transform: translateY(0.2px);

  &.dark {
    span.srm-icon, .nav-title {
      color: #fff;
    }
  }

  span.srm-icon {
    font-size: 24px;
    color: #333;
    font-weight: 400;
  }

  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;
  }

  .nav-title {
    font-weight: 600;
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);
  }
}
</style>
