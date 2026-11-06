<template>
  <srm-button
    rect
    plain
    :style="style"
    class="srm-list-item-header-right-btn"
    :type="type">
    {{ text }}
  </srm-button>
</template>
<script>
export const tagTypeObj = {
  success: "success",
  warn: "warn",
  error: "danger",
  info: "info",
  danger: "danger",
};
const { info } = tagTypeObj;
export default {
  name: "StatusTag",
  props: {
    text: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: info,
    },
  },
  data() {
    return {
      style: { fontWeight: "bold" },
      type: info,
    };
  },
  created() {
    const { color } = this;
    if (color.startsWith("#")) {
      this.style.color = color;
    } else {
      this.type = tagTypeObj[color] || info;
    }
  },
};
</script>