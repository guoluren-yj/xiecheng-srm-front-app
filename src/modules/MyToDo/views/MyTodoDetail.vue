<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ approvalTitle || processInstance.processDefinitionName }}</div>
      <div slot="right" class="right-button">
        <srm-upload v-if="attachmentUuid" :attachment-uuid="attachmentUuid" :can-preview-flag="attachmentCanPreviewFlag" :more-info-flag="attachmentMoreInfoFlag" :can-delete="attachmentCanDelete" />
        <!-- 多附件 -->
        <srm-upload v-if="fileArr.length > 0" :file-arr="fileArr" />
        <i @click="showOperationPop"><img class="image-black-default" src="@/assets/Operation_record@3x.png" alt ></i>
      </div>
    </hips-nav-bar>
    <!-- 操作记录弹窗 -->
    <operation-record v-model="operationPopup" :operation-arr="operationArr" :load-refresh="getOperatorType" />

    <!-- 附件弹窗 -->
    <attached-file v-model="lineFilePopup" :attachment-uuid="attachmentUUID" />

    <!-- 多附件弹窗 -->
    <attached-files v-model="lineFileArrPopup" :file-arr="lineFileArr"/>

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
      :is="childComponent"
      v-if="currentCom"
      ref="childComponent"
      :parameters="formParameters"
      :top-height="topHeight"
      :show-file-pop="showLineFilePop"
      :show-line-file-arr-pop="showLineFileArrPop"
      :change-req-id="changeReqId"
      :edit-flag="editFlag"
      @GetAttachmentUuid="GetAttachmentUuid"
      @SettingAttachmentUI="SettingAttachmentUI"
      @GetAttachmentFileArr="GetAttachmentFileArr"
      @GetApprovalTitle="GetApprovalTitle"
      @GetformHeaderData="GetformHeaderData"/>
    <!-- 底部按钮 -->
    <bottom-handler :btn-arr="openFlag?getBtnArr:null" />
    <to-do-operates
      v-model="operatesPop"
      :type="operateType"
      :task-id="taskId"
      :next-node-approver="nextNodeApprover"
      :comments-required="commentsRequired"
      :reject-required="rejectRequired"
      :form-header-data="formHeaderData"
      :task-data="taskInfo"
      :edit-flag="editFlag" />
  </hips-view>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { Input, NavBar, Popup, View } from "hips";
import { isEmpty, Exception } from "@/utils/index";
import { getmobileFormUrlApi, getOperatorTypeApi, getTodoListApi } from "../api/index";
import { getTodoMenuToken } from "../../Approval/api";
import BottomHandler from "@/components/BottomHandler";
import AttachedFile from "@/components/File/AttachedFile";
import AttachedFiles from "@/components/File/AttachedFiles";
import ToDoOperates from "@/components/ToDoOperates";
import OperationRecord from "@/components/NewOperationRecord";
import { remotes } from "../../../../remoteConfig";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "smbl.common", "hwfp.common" ],
  name: "MyTodoDetail",
  components: {
    ToDoOperates,
    AttachedFile,
    AttachedFiles,
    BottomHandler,
    OperationRecord,
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
      description:"",
      approvalTitle: "", ///单据标题
      operationArr: [], //操作记录
      operateTypeArr: [],
      fileList: [],
      changeReqId: "",
      editFlag:"",
      moreArr: [],
      attachmentUuid: "",
      fileArr:[],
      lineFileArr:[],
      operateType: "",
      operatesPop: false,
      operationPopup: false,
      lineFilePopup: false,
      lineFileArrPopup:false,
      taskId: "",
      processName: "",
      processInstance: {},
      processInstanceId : null,
      commentsRequired: false, // 审批意见是否必输
      rejectRequired: false, //拒绝意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      formHeaderData:{}, //表单头数据
      finishLoad: false,
      currentCom: null,
      attachmentUUID: "", //行附件uuid
      topHeight: 0,
      taskInfo: {},
      mountedFlag: false,
      //操作按钮，返回按钮控制，外部系统直接进入
      openFlag:false,
      formParameters: {},
      attachmentMoreInfoFlag: false,
      attachmentCanPreviewFlag: true,
      attachmentCanDelete: false,
    };
  },
  computed: {
    getBtnArr() {
      // eslint-disable-next-line consistent-this
      const self = this;
      const owner = (this.taskInfo || {}).owner || "";
      const isAddSign = owner.startsWith("AddSign") || owner.startsWith("ApproveAndAddSign");

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
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
            this.commentsRequired = false;
          }
        }
      ];

      this.operateTypeArr.map((item) => {
        if (item === "ACTION_DELEGATE") {
          let tempObj = {
            text: self.$T("hipspfm.common.action.delegate").$D("转交"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "transfer";
              self.operatesPop = true;
              self.commentsRequired = true;
            }
          };

          this.moreArr.push(tempObj);
        }
        if (item === "ACTION_ADD_SIGN" && !isAddSign) {
          let tempObjA = {
            text: self.$T("hipspfm.common.action.addSign").$D("加签"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "signature";
              self.operatesPop = true;
              self.commentsRequired = true;
            }
          };
          let tempObjB = {
            text: self.$T("hipspfm.common.action.approveAndAddSign").$D("同意并加签"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "approvelSignature";
              self.operatesPop = true;
              self.commentsRequired = true;
            }
          };

          this.moreArr.push(tempObjA, tempObjB);
        }
      });
      //当isAddSign为true时不显示除审批通过审批拒绝以外其他按钮
      if (this.moreArr.length > 0 && !isAddSign) {
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
    this.taskId = this.$route.query.taskId;
    this.processInstanceId = this.$route.query.processInstanceId;
    await getTodoMenuToken();
    const exists = await this.checkTaskExists(this.processInstanceId);

    if (!exists) {
      this.$router.replace({ path: "/MyTodoApproved" });
      return;
    }
    await this.getOperatorType();
    if (this.taskInfo.id) {
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
    }
    this.mountedFlag = true;
  },
  async mounted() {
    //获取顶部高度
    setTimeout(() => {
      this.topHeight = this.$refs.headInfoHeight && this.$refs.headInfoHeight.offsetHeight;
    }, 1000);
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
                "请前往PC端进行操作!"
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
                mobileFormUrl[1].split("&").map((i) => {
                  theRequest[i.split("=")[0]] = i.split("=")[1];
                });
              } else {
                theRequest[mobileFormUrl[1].split("=")[0]] = mobileFormUrl[1].split("=")[1];
              }
              let changeReqId = theRequest[mobileFormUrl[1].split("=")[0]];

              // if (/^\d+$/.test(changeReqId)) {
              componentName = mobileFormUrl[0];
              componentName = componentName.startsWith("/") ? componentName.substr(1) : componentName;
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
      if (!this.openFlag) {
        // eslint-disable-next-line new-cap
        Exception(this, this.$T("smbl.common.view.not.config.form").$D("移动端未同步该审批，请到电脑端办理"), []);
      }
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
      }).finally(() => {
        this.$loading.hide();
      });
      return exists;
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    showLineFilePop(attachmentUUID) {
      if (isEmpty(attachmentUUID)) {
        // eslint-disable-next-line no-param-reassign
        attachmentUUID = uuid();
      }
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      this.lineFilePopup = !this.lineFilePopup;
    },
    showLineFileArrPop(lineFileArr) {
      console.log("lineFileArr...", lineFileArr);
      this.lineFileArr = lineFileArr;
      this.lineFileArrPopup = !this.lineFileArrPopup;
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
        /**
         * 该字段传必输 Y，则不默认填充 “审批拒绝”，校验字段必输
         * 该字段传非必输N，保持现状，自动填充 “审批拒绝”
         * 不传该字段 ，则不默认填充 “审批拒绝”，校验字段必输
         */
        this.rejectRequired = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_REFUSED_OPINION_FLAG"
        )[0] || {}).name === "N";
        this.nextNodeApprover = res.nextNodeApprover || [];
      });
    },
    // 获取附件id
    GetAttachmentUuid(val) {
      this.attachmentUuid = val;
    },
    // 设置附件列表样式
    SettingAttachmentUI(moreInfoFlag, canPreviewFlag, canDelete) {
      this.attachmentMoreInfoFlag = moreInfoFlag;
      this.attachmentCanPreviewFlag = canPreviewFlag;
      this.attachmentCanDelete = canDelete;
    },
    // 获取附件数组信息
    GetAttachmentFileArr(val) {
      this.fileArr = val;
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
      // eslint-disable-next-line consistent-this
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
