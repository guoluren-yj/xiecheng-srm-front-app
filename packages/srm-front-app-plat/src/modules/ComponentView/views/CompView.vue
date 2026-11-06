<template>
  <div class="comp-view-detail-container">
    <component
      :is="currentCom"
      v-if="currentCom"
      ref="childComponent"
      style="background: var(--background-color-empty)"
      :parameters="formParameters"
      :top-height="topHeight"
      :change-req-id="changeReqId"
      :edit-flag="editFlag"/>
  </div>
</template>

<script>

import { remotes } from "../../../../remoteConfig";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "smbl.common" ],
  name: "CompView",
  data() {
    return {
      currentCom: null,
      formParameters: {},
      topHeight: 0,
      changeReqId: null,
      appKey:null,
      module:null,
      openFlag:true
    };
  },
  beforeMount() {
    let componentName = this.$route.query.componentName;
    componentName = this.getComponentName(componentName);
    let components = componentName.split("/");
    this.appKey = components[0];
    this.module = `./${components[1]}`;
    this.app = remotes[this.appKey];
  },
  mounted() {
    if (!this.app) {
      this.$dialog({
        type: "alert",
        title: this.$T("smbl.common.message.tips").$D("提示"),
        content: this.$T("smbl.common.view.param.error").$D("链接参数不完整或不合法，请联系配置人员"),
        onOk: () => {
        }
      });
      return;
    }
    let remoteUrl = this.app.replace(`${this.appKey}@`, "");
    console.info(this.appKey, "::", this.module, "::", this.app, "::", remoteUrl);
    SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(this.appKey, "default", this.module, remoteUrl)()).then((com) => {
      this.currentCom = com && com.default;
    });
  },
  methods: {
    /**
     *  解析componentName参数
     *  逻辑参考Approval/views/ApprovalDetail.vue
     * @param input
     * @returns {string}
     */
    getComponentName(input = "") {
      let componentName;
      let originComponentName = input;
      if (originComponentName.includes("?")) {
        originComponentName = originComponentName.split("?");
        let theRequest = {};
        if (originComponentName[1].includes("&")) {
          originComponentName[1].split("&").map((i) => {
            theRequest[i.split("=")[0]] = i.split("=")[1];
          });
        } else {
          theRequest[originComponentName[1].split("=")[0]] = originComponentName[1].split("=")[1];
        }
        let changeReqId = theRequest[originComponentName[1].split("=")[0]];
        componentName = originComponentName[0];
        componentName = componentName.startsWith("/") ? componentName.substr(1) : componentName;
        this.changeReqId = changeReqId;

        if (originComponentName[1].includes("&")) {
          let editFlag = Number(theRequest[originComponentName[1].split("&")[1].split("=")[0]]);
          if (/^\d+$/.test(editFlag)) {
            this.editFlag = editFlag;
          }
        }
        this.formParameters = theRequest;
      } else {
        originComponentName = originComponentName.split("/");
        let changeReqId = originComponentName.pop();

        originComponentName.shift();
        componentName = originComponentName.join("/");
        this.changeReqId = changeReqId;
      }
      return componentName;
    }
  }
};
</script>

<style lang="stylus" scoped>
.comp-view-detail-container {
  height 100vh;
  background: var(--background-color-empty-second);
}
</style>
