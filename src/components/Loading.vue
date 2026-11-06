<template>
  <div
    class="srmu-loading"
    :style="{
      height: newSize,
      width: newSize,
    }"/>
</template>
<script>
export default {
  name: "Loading",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "",
    },
    otherColor: {
      type: String,
      default: "#F6F6F6",
    },
    size: {
      type: Number,
      default: 18,
    },
  },
  computed: {
    newSize() {
      return Number(this.size) * 2 ? Number(this.size) + "px" : "18px";
    },
    // borderColor() {
    //   return (
    //     ((this.otherColor || "#F6F6F6") + " ").repeat(3) + this.color ||
    //     "#F6F6F6"
    //   ); // 默认主题色
    // },
    // border() {
    //   return `${Math.round(Number(this.size || 18) / 10)}px solid`; // 浏览器只识别整数的 1.8也算1px 所以计算四舍五入
    // },
  },
};
</script>

<style lang="stylus" scoped>
.srmu-loading {
  display: inline-block;
  vertical-align: middle;
  background: 0 0;
  border-radius: 50%;
  border: 1.8px solid #F6F6F6;
  border-top-color: var(--color-primary);
  animation: tui-rotate 0.8s linear infinite;
}

@keyframes tui-rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes tui-rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
