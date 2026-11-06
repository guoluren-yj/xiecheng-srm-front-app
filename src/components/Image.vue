<template>
  <img
    :src="imgSrc"
    :width="width"
    :height="height"
    @error="onError"
    @click.stop="click">
</template>

<script>
import empty from "@/assets/empty.svg";
export default {
  name: "CommonImage",
  props: {
    src: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      imgSrc: !this.src || this.src === "noImages" ? empty : this.src,
    };
  },
  methods: {
    onError(e) {
      e.target.src = empty;
    },
    click() {
      // 预览图片
      this.$previewImage([this.imgSrc || empty]);
    },
  },
};
</script>

<style lang="stylus" scoped></style>
