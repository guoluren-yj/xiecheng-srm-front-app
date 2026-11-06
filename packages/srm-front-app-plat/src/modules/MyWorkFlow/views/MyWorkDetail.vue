<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ approvalTitle }}</div>
      <div slot="right" class="right-button">
        <srm-upload v-if="attachmentUuid" :attachment-uuid="attachmentUuid" />
        <!-- 多附件 -->
        <srm-upload v-if="fileArr.length > 0" :file-arr="fileArr" />
        <i @click="showOperationPop"><img class="image-black-default" src="@/assets/Operation_record@3x.png" alt ></i>
      </div>
    </hips-nav-bar>
    <!-- 操作记录弹窗 -->
    <operation-record v-model="operationPopup" :operation-arr="operationArr" :load-refresh="getOperatorType" />

    <!-- 附件弹窗 -->
    <attached-file v-model="lineFilePopup" :attachment-uuid="attachmentUUID" />

    <section v-if="processInstance" ref="headInfoHeight" class="headInfo">
      <li>
        <span>{{ `${processInstance.processName}(${processInstance.id})` }}</span>
      </li>
      <li>
        <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}:</span>
        <span>&nbsp;&nbsp;{{ `${processInstance.startUserName}(${processInstance.startUserId})` }}</span>
      </li>
      <li>
        <span>{{ $T('hwfp.common.model.apply.time').$D('申请时间') }}:</span>
        <span>&nbsp;&nbsp;{{ processInstance.startTime }}</span>
      </li>
    </section>

    <component
      :is="childComponent"
      v-if="currentCom"
      ref="childComponent"
      :change-req-id="changeReqId"
      :show-file-pop="showLineFilePop"
      :top-height="topHeight"
      :parameters="formParameters"
      @GetApprovalTitle="GetApprovalTitle"
      @GetAttachmentUuid="GetAttachmentUuid"
      @GetAttachmentFileArr="GetAttachmentFileArr"/>

    <!-- 底部按钮 -->
    <bottom-handler
      v-if="processType !== 'carbonCopy' && getBtnArr.length !== 0 "
      :btn-arr="openFlag?getBtnArr:null" />
  </hips-view>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { Exception } from "@/utils";
import { Input, NavBar, Popup, View } from "hips";
import BottomHandler from "@/components/BottomHandler";
import AttachedFile from "@/components/File/AttachedFile";
import OperationRecord from "@/components/NewOperationRecord";
import ToDoOperates from "@/components/ToDoOperates";
import { getTodoMenuToken } from "../../Approval/api";
import { getOperatorTypeApi, getReceiptRecallApi, getReceiptRemindApi, getReceiptRevokeApi } from "../api/index";
import { getmobileFormUrlApi } from "../api/index";
import { remotes } from "../../../../remoteConfig";

export default {
  modules: [ "hwfp.common", "hipspfm.common", "hipspfm.workFlow", "smbl.common" ],
  name: "TestMyWorkDetail",
  components: {
    AttachedFile,
    BottomHandler,
    ToDoOperates,
    OperationRecord,
    [View.name]: View,
    [Popup.name]: Popup,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs && this.$refs.childComponent && this.$refs.childComponent.beforeRouteLeave) {
      this.$refs.childComponent.beforeRouteLeave(to, from, next);
    } else {
      next();
    }
  },
  data() {
    return {
      childComponent: () => ({
        component: this.currentCom,
      }),
      recall: false,
      approvalTitle: "", // 单据头标题
      operationArr: [], //操作记录
      fileList: [],
      processType: "",
      processInstance: { suspended: true },
      ouInfoPop: false,
      changeReqId: "",
      moreArr: [],
      attachmentUuid: "",
      operateType: "",
      operatesPop: false,
      operationPopup: false,
      lineFilePopup: false,
      processInstanceId: "",
      startUserId: "",
      currentCom: null,
      attachmentUUID: "", // 行附件uuid
      topHeight:0,
      //释放按钮标示
      openFlag:false,
      fileArr: [],
      formParameters: {},
    };
  },
  computed: {
    getBtnArr() {
      let BtnArr = [];
      const urge = {
        title: this.$T("hwfp.common.view.message.remind").$D("催办"),
        color: "var(--color-other-default-b)",
        handler: () => {
          this.urgeFunc();
        }
      };
      const recall = {
        title: this.$T("hwfp.common.view.message.recall").$D("撤回"),
        color: "var(--color-other-default-b)",
        handler: () => {
          this.recallFunc();
        }
      };
      const revoke = {
        title: this.$T("hwfp.common.view.message.revoke").$D("撤销"),
        color: "var(--color-other-default)",
        handler: () => {
          this.revokeFunc();
        }
      };

      if (this.processInstance && this.processType === "startedBy") {
        const { historicTaskList = [] } = this.processInstance;

        if (this.processInstance.remind) {
          BtnArr.push(urge);
        }
        if (!this.processInstance.suspended && !this.processInstance.endTime && !historicTaskList.some((i) => i.action === "Approved")) {
          BtnArr.push(revoke);
        }
      } else if (this.recall && this.processType === "involved") {
        BtnArr.push(recall);
      }
      return BtnArr.reverse();
    }
  },
  async beforeMount() {
    this.processType = this.$route.query.processType;
    this.processInstanceId = this.$route.query.processInstanceId;
    await getTodoMenuToken();
    await this.getOperatorType();

    const componentName = await this.getComponentName();

    if (componentName) {
      // if (componentName.indexOf("modules") > -1) {
      //   this.currentCom = SrmUtil.quietlyImportComponent(import(`@/modules/${componentName.replace("modules/", "")}.vue`));
      // } else {
      // this.currentCom = SrmUtil.quietlyImportComponent(import(componentName));
      let components = componentName.split("/");
      let appKey = components[0];
      let module = `./${components[1]}`;
      let app = remotes[appKey];
      if (!app) {
        console.warn("服务不存在:", appKey, componentName);
        return;
      }
      let remoteUrl = app.replace(`${appKey}@`, "");
      console.info("remoteUrl:", remoteUrl, remotes);
      this.currentCom = SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(appKey, "default", module, remoteUrl)());
      // }
    }
  },
  async mounted() {
    //获取顶部高度
    setTimeout(() => {
      this.topHeight = this.$refs.headInfoHeight && this.$refs.headInfoHeight.offsetHeight || 0;
    }, 1000);
  },
  methods: {
    async getComponentName() {
      let componentName = null;

      await getmobileFormUrlApi(this.processInstanceId).then((res) => {
        let mobileFormUrl = res;

        if (mobileFormUrl) {
          if (mobileFormUrl === "PC_ONLY") {
            this.$hips.dialog.alert({
              title: this.$T("hipspfm.common.message.tips").$D("提示"),
              content: this.$T("hipspfm.workFlow.validation.message.goToPC").$D(
                "请前往PC端进行操作!"
              ),
              okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
              onOk() {}
            });
          } else {
            //存在可在移动查看的表单，按钮释放
            this.openFlag = true;
            if (mobileFormUrl.includes("?")) {
              mobileFormUrl = mobileFormUrl.split("?");
              // eslint-disable-next-line no-new-object
              let theRequest = new Object();

              if (mobileFormUrl[1].includes("&")) {
                mobileFormUrl[1].split("&").map((i) => {
                  theRequest[i.split("=")[0]] = i.split("=")[1];
                });
              } else {
                theRequest[mobileFormUrl[1].split("=")[0]] = mobileFormUrl[1].split("=")[1];
              }
              let changeReqId = theRequest[mobileFormUrl[1].split("=")[0]];

              // 因加密取消验证是否为数字
              // if (/^\d+$/.test(changeReqId)) {
              componentName = mobileFormUrl[0];
              componentName = componentName.startsWith("/") ? componentName.substr(1) : componentName;
              this.changeReqId = changeReqId;
              // }
              this.formParameters = theRequest;
            } else {
              mobileFormUrl = mobileFormUrl.split("/");
              let changeReqId = mobileFormUrl.pop();

              // if (/^\d+$/.test(changeReqId)) {
              mobileFormUrl.shift();
              componentName = mobileFormUrl.join("/");
              this.changeReqId = changeReqId;
            // }
            }
          }
        }
      });
      if (!this.openFlag) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("smbl.common.view.not.config.form").$D("移动端未同步该审批，请到电脑端办理"), []);
      }
      return componentName;
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 获取附件id
    GetAttachmentUuid(val) {
      this.attachmentUuid = val;
    },
    // 获取附件数组信息
    GetAttachmentFileArr(val) {
      this.fileArr = val;
    },
    // 获取单据标题
    GetApprovalTitle(val) {
      this.approvalTitle = val;
    },
    showLineFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      this.lineFilePopup = !this.lineFilePopup;
    },
    //获取审批操作
    getOperatorType() {
      let flag = true;

      getOperatorTypeApi(this.processInstanceId, flag, this.processType).then(
        (res) => {
          this.processInstance = res;
          this.operationArr = res.historicTaskList;
          this.recall = res.recall;
        }
      );
    },
    // 催办
    urgeFunc() {
      this.$notification.open({
        message: this.$T("hipspfm.workFlow.validation.message.underRemind").$D(
          "正在催办中"
        ),
        description: "",
        // eslint-disable-next-line no-undef
        key,
        class: "notification",
        duration: 3
      });
      getReceiptRemindApi(this.processInstanceId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.remindFailed").$D("催办失败"),
            description: res.message,
            key,
            class: "notification",
            duration: 2
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.remindSuccess").$D("催办成功"),
            key,
            class: "notification",
            duration: 2
          });
          this.$router.push("HytWorkFlowList");
        }
      });
    },
    // 撤回
    recallFunc() {
      this.$notification.open({
        message: this.$T("hipspfm.workFlow.validation.message.underRecall").$D("正在撤回中"),
        description: "",
        key,
        class: "notification"
      });
      getReceiptRecallApi(this.processInstanceId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.recallFailed").$D("撤回失败"),
            description: res.message,
            key,
            class: "notification",
            duration: 2
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.recallSuccess").$D("撤回成功"),
            key,
            class: "notification",
            duration: 2
          });
          this.$router.push("HytWorkFlowList");
        }
      });
    },
    // 撤销
    revokeFunc() {
      this.$notification.open({
        message: this.$T("hipspfm.workFlow.validation.message.underRevoke").$D("正在撤销中"),
        description: "",
        key,
        class: "notification",
        duration: 3
      });
      getReceiptRevokeApi(this.processInstanceId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.revokeFailed").$D("撤销失败"),
            description: res.message,
            key,
            class: "notification",
            duration: 2
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.revikeSuccess").$D("撤销成功"),
            key,
            class: "notification",
            duration: 2
          });
          this.$router.push("HytWorkFlowList");
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.headInfo {
  padding: 10px 20px 16px 20px;
  border-bottom: solid 8px var(--color-border-default);
  font-weight: bold;

  li {
    display: flex;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0px;
    }

    span {
      line-height: 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
    }
  }
}
</style>
