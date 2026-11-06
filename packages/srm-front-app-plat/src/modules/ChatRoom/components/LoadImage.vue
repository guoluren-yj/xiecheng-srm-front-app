<template>
  <div class="load-image"
       @click="onImageClick">
    <div class="image-mask" />
    <img :src="src"
         @load="onLoad"
         @error="onError">
    <div v-if="loadState !== 'loaded'"
         class="image-icon">
      <img :src="loadingIcon">
    </div>
  </div>
</template>
<script>
import { SrmUtil } from "srm-mobile-ui";

export default {
  name: "LoadImage",
  props: {
    src: {
      type: String,
      default: "",
    },
    previewFile: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loadState: "loading",
    };
  },
  computed: {
    loadingIcon() {
      const iconMap = {
        loading: require("@/assets/icon_image_loading.svg"),
        loadError: require("@/assets/icon_image_error.svg"),
      };
      return iconMap[this.loadState] || "";
    },
  },
  mounted() {},
  methods: {
    onLoad() {
      this.loadState = "loaded";
    },
    onError() {
      this.loadState = "loadError";
    },
    onImageClick() {
      if (this.loadState !== "loaded" || !this.previewFile) {
        return;
      }
      SrmUtil.previewFile(this.previewFile);
      this.$nextTick(() => {
        const doms = document.getElementsByClassName("srm-image-previewer-num");
        for (let i = 0; i < doms?.length; i++) {
          doms[i].style.display = "none";
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.load-image {
  position: relative;
  height: 100%;
  width: 100%;

  .image-mask {
    position: absolute;
    z-index: 99;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color: transparent;
  }

  > img {
    height: 100%;
    width: 100%;
  }

  .image-icon {
    position: absolute;
    z-index: 99;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;

    > img {
      height: 30px;
      width: 30px;
    }
  }
}
</style>
