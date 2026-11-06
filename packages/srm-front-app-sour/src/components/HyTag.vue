
<template>
  <div class="hy-tag">
    <div class="linebar" :style="{color: color, background:bgColor}">{{ title }}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "HyTag",
  props: {
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#fff"
    },
    bgColor: {
      type: String,
      default: "var(--color-other-default-b)"
    }
  }
};
</script>
<style lang="stylus" scoped>
.hy-tag {
  width: 64px;
  height: 64px;
  overflow: hidden;

  .linebar {
    height: 23px;
    width: 90px;
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    transform-origin: 0 0;
    transform: rotate(45deg) translateY(-23px);
  }
}
</style>