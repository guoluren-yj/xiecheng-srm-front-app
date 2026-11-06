<template>
  <srm-popup width="100%" :title="title || $T('hzero.common.view.title.preFile').$D('附件预览')" position="right" :show-close="false" show-back :visible="value||visible" @onClose="closePop">
    <iframe
      v-if="typeof preUrl === 'string'"
      :src="preUrl"
      class="srm-pre-file-content" />
    <div v-else id="pdfWrap" class="srm-pre-file-content"/>
    <div v-if="showDownbtn" class="srm-pre-file-bottom">
      <srm-button fill size="large" full-width type="primary" @click="downloadlFileHandler">
        {{ $T("hipspfm.disposeInvite.view.button.download").$D("下载") }}
      </srm-button>
    </div>
  </srm-popup>
</template>

<script>

// import Pdfh5 from "pdfh5";
// import SrmPopup from "@/components/SrmPopup";

import { jsBridge } from "srm-mobile-ui";
// import SrmButton from "@/components/SrmButton";
export default {
  modules: [ "hzero.common", "hipspfm.disposeInvite" ],
  name: "PreFilePop",
  components: {
    // SrmButton,
    // SrmPopup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    preUrl: {
      type: String | Object,
      default: "",
    },
    downloadUrl: {
      type: String,
      default: "",
    },
    showDownbtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    preUrl:{
      handler(val) {
        if (typeof val === "object") {
          this.$nextTick(() => {
            this.$previewFile({
              preUrl: val,
            });
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    closePop() {
      this.visible = false;
      this.$emit("input", false);
    },
    downloadlFileHandler() {
      const downloadUrl = this.downloadUrl;
      try {
        jsBridge.downloadFile(downloadUrl);
      } catch (e) {
        this.$router.push({
          path: `downLoad?downLoadUrl=${encodeURIComponent(downloadUrl)}`,
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-pre-file-content {
    width 100%;
    height 100%;
}
.srm-pre-file-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 8px 15px;
}
</style>
