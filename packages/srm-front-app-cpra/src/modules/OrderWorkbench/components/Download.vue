<template>
  <div v-show="show" class="srm-download-view">
    <srm-button type="primary" @click="copyCode">
      {{ $T("smbl.common.view.copy.toDownload").$D("点击按钮复制链接，在浏览器中打开即可下载") }}
    </srm-button>
  </div>
</template>

<script>
// import SrmButton from "../srm-button";
import { SrmButton } from "srm-mobile-ui";
// import { downloadFile } from "../../src/utils";

export default {
  modules: [ "smbl.common" ],
  name: "DownLoad",
  components: {
    SrmButton
  },
  props: {
    downloadUrl: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      show: false,
      url: "",
    };
  },
  mounted() {
    let downLoadUrl = this.downloadUrl;
    this.url = decodeURIComponent(downLoadUrl);
    let downFlag = this.$downloadFile(this.url);
    this.show = !downFlag;
    // if (dectOS() === "WECHAT") {
    //   console.log("微信浏览器");
    //   this.show = true;
    // } else {
    //   console.log("原生浏览器,");
    //   let aDom = document.createElement("a");
    //   aDom.style.display = "none";
    //   aDom.href = decodeURIComponent(downLoadUrl);
    //   document.body.appendChild(aDom);
    //   aDom.click();
    //   document.body.removeChild(aDom);
    // }
  },
  methods: {
    copyCode() {
      this.$copyText(`${this.url}`).then(() => {
        this.$notification.open({ message: this.$T("smbl.common.view.copy.success").$D("复制成功") });
      }, () => {
        this.$notification.open({ message: this.$T("smbl.common.view.copy.error").$D("复制失败") });
      });
    },
  },
};
</script>

<style>
.srm-download-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
