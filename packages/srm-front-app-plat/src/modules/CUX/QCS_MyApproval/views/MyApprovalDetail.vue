<template>
  <hips-view v-show="mountedFlag">
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ approvalTitle }}</div>
      <div slot="right" class="right-button">
        <i v-if="attachmentUuid" @click="showFilePop"><img class="image-black-default" src="@/assets/attached_file@3x.png" alt ></i>
        <i @click="showOperationPop"><img class="image-black-default" src="@/assets/Operation_record@3x.png" alt ></i>
      </div>
    </hips-nav-bar>
    <!-- 操作记录弹窗 -->
    <operation-record v-model="operationPopup" :operation-arr="operationArr" :load-refresh="getOperatorType" />

    <!-- 附件弹窗 -->
    <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid"/>
    <attached-file v-model="lineFilePopup" :attachment-uuid="attachmentUUID" />

    <section ref="headInfoHeight" class="headInfo">
      <li>
        <span>{{ `${description}(${processInstance.id})` }}</span>
      </li>
      <li>
        <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}:</span>
        <span>&nbsp;&nbsp;{{ `${processInstance.startUserName}(${processInstance.startUserId})` }}</span>
      </li>
      <li>
        <span>{{ $T('hwfp.common.model.apply.time').$D('申请时间') }}:</span>
        <span>&nbsp;{{ processInstance.startTime }}</span>
      </li>
    </section>

    <component
      :is="currentCom"
      v-if="changeReqId"
      :lot-flag="lotFlag"
      :show-file-pop="showLineFilePop"
      :change-req-id="changeReqId"
      :edit-flag="editFlag"
      :top-height="topHeight"
      @GetAttachmentUuid="GetAttachmentUuid"
      @GetApprovalTitle="GetApprovalTitle"
      @GetformHeaderData="GetformHeaderData"/>
    <!-- 底部按钮 -->
    <bottom-handler :btn-arr="getBtnArr" />
    <to-do-operates
      v-model="operatesPop"
      :type="operateType"
      :task-id="taskId"
      :next-node-approver="nextNodeApprover"
      :comments-required="mCommentsRequired"
      :form-header-data="formHeaderData"
      :task-data="taskInfo"
      :edit-flag="editFlag"
      back-route-path="MyApprovalList"/>
  </hips-view>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { getmobileFormUrlApi, getOperatorTypeApi, } from "../api";
import { Input, NavBar, Popup, View } from "hips";
import BottomHandler from "../../../../../src/components/BottomHandler";
import AttachedFile from "../../../../../src/components/File/AttachedFile";
import ToDoOperates from "../../../../../src/components/ToDoOperates";
import OperationRecord from "../../../../../src/components/NewOperationRecord";
import {remotes} from "../../../../../remoteConfig";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "hwfp.common", "smbl.workFlow", "smbl.common" ],
  name: "TestMyTodoDetail",
  components: {
    ToDoOperates,
    AttachedFile,
    BottomHandler,
    OperationRecord,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      description:"",
      approvalTitle: "", ///单据标题
      operationArr: [], //操作记录
      operateTypeArr: [],
      fileList: [],
      changeReqId: "",
      editFlag:"",
      moreArr: [],
      attachmentUuid: "",
      operateType: "",
      operatesPop: false,
      operationPopup: false,
      filePopup: false,
      lineFilePopup: false,
      taskId: "",
      processName: "",
      processInstance: {},
      processInstanceId : null,
      commentsRequired: false, // 审批意见是否必输
      mCommentsRequired: false, // 审批意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      formHeaderData:{}, //表单头数据
      finishLoad: false,
      currentCom: {},
      attachmentUUID: "", //行附件uuid
      topHeight: 0,
      taskInfo: {},
      lotFlag: "", //是否为二开
      mountedFlag: false
    };
  },
  computed: {
    getBtnArr() {
      const self = this;
      this.moreArr = [];// 防止脏数据
      let BtnArr = [
        {
          title: self
            .$T("hipspfm.workFlow.view.button.approvalPass")
            .$D("审批通过"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.operateType = "approvel";
            this.operatesPop = true;
            //审批通过时不必输，意见为空取默认值
            self.mCommentsRequired = false;
          }
        },
        {
          title: self
            .$T("hipspfm.workFlow.view.button.approvalReject")
            .$D("审批拒绝"),
          color: "var(--color-other-default)",
          handler: () => {
            this.operateType = "refuse";
            this.operatesPop = true;
            //审批通过时不必输，意见为空取默认值
            self.mCommentsRequired = false;
          }
        }
      ];
      this.operateTypeArr.map((item) => {
        if (item == "ACTION_DELEGATE") {
          let tempObj = {
            text: self.$T("hipspfm.common.action.delegate").$D("转交"),
            handler: (index) => {
              self.$hips.actionsheet.hide();
              self.operateType = "transfer";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };
          this.moreArr.push(tempObj);
        }
        if (item == "ACTION_ADD_SIGN") {
          let tempObjA = {
            text: self.$T("hipspfm.common.action.addSign").$D("加签"),
            handler: (index) => {
              self.$hips.actionsheet.hide();
              self.operateType = "signature";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };
          let tempObjB = {
            text: self.$T("hipspfm.common.action.approveAndAddSign").$D("同意并加签"),
            handler: (index) => {
              self.$hips.actionsheet.hide();
              self.operateType = "approvelSignature";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };
          this.moreArr.push(tempObjA, tempObjB);
        }
      });
      if (this.moreArr.length > 2) {
        BtnArr.push({
          title: self
            .$T("hipspfm.workFlow.view.button.moreOperations")
            .$D("更多操作"),
          color:"var(--color-font-default-b)",
          handler: self.openActionSheet
        });
      }
      return BtnArr.reverse();
    }
  },
  async beforeMount() {
    this.lotFlag = this.$route.query.lotFlag;
    this.taskId = this.$route.query.taskId;
    this.processInstanceId = this.$route.query.processInstanceId;
    // const exists = await this.checkTaskExists(this.processInstanceId);
    // if(!exists){
    //   this.$router.replace({path: "MyTodoApproved"})
    //   return;
    // }
    await this.getOperatorType();
    if (this.taskInfo.id) {
      const componentName = await this.getComponentName();
      if (componentName) {
        // this.currentCom = () => SrmUtil.quietlyImportComponent(import(componentName));
        let components = componentName.split("/");
        let remote = components[0];
        let module = `./${components[1]}`;
        let remoteUrl = remotes[remote].replace(`${remote}@`, "");
        this.currentCom = SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(remote, "default", module, remoteUrl)());
      }
    }
    this.mountedFlag = true;
  },
  async mounted() {
    //获取顶部高度
    setTimeout(() => {
      this.topHeight = this.$refs.headInfoHeight.offsetHeight;
    }, 10);
  },
  methods: {
    async getComponentName() {
      let params = {
        processDefinitionId: this.taskInfo.processDefinitionId,
        taskDefinitionKey: this.taskInfo.taskDefinitionKey,
        executionId: this.taskInfo.executionId
      };
      let componentName = null;
      await getmobileFormUrlApi(params).then((res) => {
        let mobileFormUrl = res;
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
            // 区分新表单和旧表单，保证旧表单可以点击进入
            if (mobileFormUrl.includes("?")) {
              mobileFormUrl = mobileFormUrl.split("?");
              let theRequest = new Object();
              if (mobileFormUrl[1].includes("&")) {
                mobileFormUrl[1].split("&").map((i) => {
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
            } else {
              // 旧单据
              mobileFormUrl = mobileFormUrl.split("/");
              let changeReqId = mobileFormUrl.pop();
              console.log("changeReqId2", changeReqId);
              // 因加密取消验证是否为数字
              // if (/^\d+$/.test(changeReqId)) {
              mobileFormUrl.shift();
              componentName = mobileFormUrl.join("/");
              this.changeReqId = changeReqId;
              // }
            }
          }
        }
      });
      return componentName;
    },
    async checkTaskExists(processInstanceId) {
      this.$loading.show();
      const params = {
        processInstanceId,
        page:0,
        size:10
      };
      let exists = false;
      await getTodoListApi({ ...params }).then((res) => {
        if (res.totalElements && res.totalElements > 0) {
          exists = true;
        }
      }).finally((res) => {
        this.$loading.hide();
      });
      return exists;
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    showLineFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      this.lineFilePopup = !this.lineFilePopup;
    },
    //获取审批操作
    async getOperatorType() {
      await getOperatorTypeApi(this.taskId).then((res) => {
        if (!res.id) {
          return;
        }
        this.taskInfo = res;
        this.description = res.description || "";
        this.processInstance = res.processInstance;
        this.processName = this.processInstance.processDefinitionName;
        const operateType = res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION"
        )[0].enumValues;
        this.operateTypeArr = operateType.map((item) => {
          if (item.name === "Y") {
            return item.id;
          }
        });
        this.operationArr = res.historicTaskList;
        this.commentsRequired = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_NEED_OPINION_FLAG"
        )[0] || {}).name === "Y";
        this.nextNodeApprover = res.nextNodeApprover || [];
      });
    },
    // 获取附件id
    GetAttachmentUuid(val) {
      this.attachmentUuid = val;
    },
    // 获取单据标题
    GetApprovalTitle(val) {
      this.approvalTitle = val;
    },
    // 获取单据头数据
    GetformHeaderData(val) {
      this.formHeaderData = val;
    },
    // 更多操作
    openActionSheet() {
      const self = this;
      this.$hips.actionsheet.show({
        theme: "android",
        title: "",
        subTitle: "",
        buttons: this.moreArr,
        cancel: {
          text: self.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            // console.log('Cancel')
          }
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
    word-break: break-all;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      line-height: 24px;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }
}
</style>
