<template>
  <srm-tag
    size="mid"
    :style="style"
    :type="type">
    {{ text }}
  </srm-tag>
</template>
<script>
export const tagTypeObj = {
  success: "success",
  warn: "warn",
  error: "danger",
  info: "info",
  primary: "primary",
  danger: "danger",
  green: "success",
  yellow: "warn",
  red: "danger",
  gray: "info",
  blue: "primary",
};
const { info } = tagTypeObj;
export default {
  name: "StatusTag",
  props: {
    text: "",
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