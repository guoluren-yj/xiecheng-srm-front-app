<template>
  <div class="header">
    <div class="left">
      <slot v-if="hasLeftSlot"
            name="left" />
      <span v-else-if="showBack"
            class="srm-icon icon-arrow-left"
            @click="onBackClick" />
    </div>
    <div class="title">{{ title }}</div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
export default {
  modules: [],
  name: "BaseHeader",
  props: {
    title: {
      type: String,
      default: "",
    },
    showBack: {
      type: Boolean,
      default: false,
    },
    disableBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    hasLeftSlot() {
      return Boolean(this.$slots.left);
    },
  },
  mounted() {},
  methods: {
    onBackClick() {
      this.$emit("backClick");
      if (this.disableBack) {
        return;
      }
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
.header {
  position: relative;
  display: flex;
  height: 44px;
  width: 100%;
  font-weight: 400;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .title {
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .left, .right {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
  }

  .left {
    left: 20px;

    .icon-arrow-left {
      font-size: 24px;
    }
  }

  .right {
    right: 20px;
  }
}
</style>
