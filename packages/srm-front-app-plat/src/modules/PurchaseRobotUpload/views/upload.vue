<template>
  <div style="width: 100%;height: 100%">
    <srm-import v-if="templateCode" :template-code="templateCode" :service-path="servicePath" :upload-params="uploadParams"/>
  </div>
</template>

<script>
import { getRequestParameters } from "../../../utils";

import { getData } from "../api";

export default {
  modules: [ "smbl.common", "smbl.workFlow", "smbl.purchaseRobot" ],
  data() {
    return {
      templateCode:"",
      servicePath:"",
      uploadParams:{},
      closeTip:false
    };
  },
  beforeMount() {
    this.uuid = this.$route.query.uuid;
  },
  async mounted() {
    this.$loading.show();
    let result = await getData({ uuid:this.uuid });
    this.$loading.hide();
    const resultObj = JSON.parse(result.taskParam);
    const uploadArgs = { ...resultObj.uploadArgs };
    if (!uploadArgs) {
      this.$notification.open({ message: this.$T("smbl.common.param.lose").$D("参数缺失，请联系项目经理或确认单据"),
        class: "notification",
        duration: 3 });
    }
    // eslint-disable-next-line new-cap
    const urlParam = getRequestParameters(uploadArgs.urlPath);
    if (!urlParam) {
      this.$notification.open({ message: this.$T("smbl.common.param.lose").$D("参数缺失，请联系项目经理或确认单据"),
        class: "notification",
        duration: 3 });
    }
    this.templateCode = urlParam.templateCode;
    this.servicePath = urlParam.servicePath;
    this.uploadParams = uploadArgs.body && JSON.parse(uploadArgs.body.param);
    console.info(this.templateCode, ";", this.servicePath, ";", this.uploadParams);
  },
  methods:{
    closeWindow() {
      if (typeof parent.srmCloseWebWindow === "function") {
        parent.srmCloseWebWindow();
      } else {
        window.close();
      }
      setTimeout(() => {
        this.closeTip = true;
      }, 200);
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
