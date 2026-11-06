<template>
  <div class="import-wrapper">
    <srm-import
      :template-code="templateCode"
      :service-path="servicePath"
      :upload-params="uploadParams"
      @imported="onImported"
      @importError="onImportError"/>
    <div v-show="showCloseTip" class="import-close-tip">
      {{ $T("smbl.purchaseRobot.close.window.tip").$D("上传成功，请手动关闭此页面，在对话界面即可使用SRM采购助手") }}
    </div>
  </div>
</template>

<script>

import { decode } from "js-base64";

export default {
  modules: [ "smbl.common", "smbl.workFlow", "smbl.purchaseRobot" ],
  data() {
    return {
      showCloseTip: false,
      templateCode: null,
      servicePath: null,
      uploadParams: {},
    };
  },
  beforeMount() {
    const { servicePath, templateCode, uploadParams } = this.$route.query;
    this.servicePath = servicePath;
    this.templateCode = templateCode;
    if (uploadParams) {
      this.uploadParams = JSON.parse(decode(decodeURIComponent(uploadParams)));
    }
  },
  async mounted() {
  },
  methods: {
    onImported() {
      this.showCloseTip = true;
    },
    onImportError() {

    },
    initParam() {
      this.uploading = false;
      this.showCloseTip = false;
      this.progress = 0;
    },
    closeWindow() {
      if (typeof parent.srmCloseWebWindow === "function") {
        parent.srmCloseWebWindow();
      } else {
        window.close();
      }
      setTimeout(() => {
        this.showCloseTip = true;
      }, 200);
    },
  }
};
</script>

<style lang="stylus" scoped>
.import-wrapper {
  height: 100%;
  width: 100%;
  padding-top 10%;

  .import-close-tip {
    margin-top 16px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #000000;
    line-height: 24px;
    font-weight: 400;
    padding 16px;
    text-align center;
  }
}

</style>
