<template>
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <!-- 加载组件 -->
      <component
        :is="currentCom"
        v-if="currentCom"
        ref="childComponent"
        :parameters="formParameters"
        :top-height="topHeight"
        :change-req-id="changeReqId"
        :edit-flag="editFlag"/>
      <!-- 空白页 -->
      <NoContent
        v-else
        :title="`移动端未同步该审批，请到电脑端办理`"
        img-src="NoResult@3x.png"
        @click.native="back"/>
    </div>
  </div>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { Input, NavBar, Popup, View } from "hips";
import { Exception } from "../../../../utils";
import NoContent from "../../../../components/NoContent";
import { remotes } from "../../../../../remoteConfig";

export default {
  modules: [ "hipspfm.workFlow","hipspfm.common","smbl.common" ],
  name: "SinicService_Approval",
  components: {
    NoContent,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  provide: {
    scrollMarginBottom: 60
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs && this.$refs.childComponent && this.$refs.childComponent.beforeRouteLeave) {
      this.$refs.childComponent.beforeRouteLeave(to,from,next);
    } else {
      next();
    }
  },
  data() {
    return {
      changeReqId: "",
      editFlag:"",
      currentCom: null,
      topHeight: 0,
      mountedFlag: false,
      //操作按钮，返回按钮控制，外部系统直接进入
      openFlag:false,
      // mobileFormUrl: ''
      formParameters: {},
    };
  },
  async beforeMount() {
    const formUrl = this.$route.query && this.$route.query.formUrl ? decodeURIComponent(this.$route.query.formUrl) : "";
    const componentName = await this.getComponentName(formUrl);
    if (componentName) {
      // this.currentCom = () => SrmUtil.quietlyImportComponent(import(componentName));
      let components = componentName.split("/");
      let remote = components[0];
      let module = `./${components[1]}`;
      let remoteUrl = remotes[remote].replace(`${remote}@`, "");
      this.currentCom = SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(remote, "default", module, remoteUrl)());
    }
    this.mountedFlag = true;
  },
  async mounted() {
    //获取顶部高度
    setTimeout(()=>{
      this.topHeight = 0;
    },1000);
  },
  methods: {
    async getComponentName(url) {
      let mobileFormUrl = url;
      let componentName = null;

      if (mobileFormUrl) {
        if (mobileFormUrl === "PC_ONLY") {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.common.message.tips").$D("提示"),
            content: this.$T("hipspfm.workFlow.validation.message.goToPC").$D(
              "请前往PC端进行操作" + "!"
            ),
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
            onOk() {}
          });
        } else {
          //存在可在移动查看的表单，按钮释放
          this.openFlag = true;
          // 区分新表单和旧表单，保证旧表单可以点击进入
          if (mobileFormUrl.includes("?")) {
            mobileFormUrl = mobileFormUrl.split("?");
            // eslint-disable-next-line no-new-object
            let theRequest = new Object();

            if (mobileFormUrl[1].includes("&")) {
              mobileFormUrl[1].split("&").map((i)=>{
                theRequest[i.split("=")[0]] = i.split("=")[1];
              });
            } else {
              theRequest[mobileFormUrl[1].split("=")[0]] = mobileFormUrl[1].split("=")[1];
            }
            let changeReqId = theRequest[mobileFormUrl[1].split("=")[0]];

            // if (/^\d+$/.test(changeReqId)) {
            componentName = mobileFormUrl[0].substr(1);
            this.changeReqId = changeReqId;
            // }
            // 当链接中有多个参数时，取第二个参数值为可编辑类型参数，具体值含义可以根据情况来定义
            // 此处为白家发票审核工作流定义值（0：只读页面，1：第一个节点可编辑页面，2：最后一个节点可编辑页面）
            if (mobileFormUrl[1].includes("&")) {
              let editFlag = Number(theRequest[mobileFormUrl[1].split("&")[1].split("=")[0]]);

              if (/^\d+$/.test(editFlag)) {
                this.editFlag = editFlag;
              }
            }
            this.formParameters = theRequest;
          } else {
            // 旧单据
            mobileFormUrl = mobileFormUrl.split("/");
            let changeReqId = mobileFormUrl.pop();

            // 因加密取消验证是否为数字
            // if (/^\d+$/.test(changeReqId)) {
            mobileFormUrl.shift();
            componentName = mobileFormUrl.join("/");
            this.changeReqId = changeReqId;
            // }
          }
        }
      }
      if (!this.openFlag) {
        // eslint-disable-next-line new-cap
        Exception(this,this.$T("smbl.common.view.not.config.form").$D("移动端未同步该审批，请到电脑端办理"),[]);
      }
      return componentName;
    },
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
}
</style>
