<template>
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <srm-detail-head ref="headInfoHeight" class="detail-head" :columns="getHeaderColumns()" :data-source="processInstance">
        <srm-button class="approval-button" size="small" icon="icon-users" bordered fill @click="startGroupChat">
          {{ $T("smbl.common.view.button.beginChat").$D("发起群聊") }}
        </srm-button>
        <srm-button v-if="attachmentButtonFlag" class="approval-button" size="small" icon="icon-paperclip" bordered>
          <srm-upload :attachment-uuid="costAttachmentUuid"
                      :desc-title="$T('smbl.common.view.button.costAttachment').$D('合同附件')" :show-count="true"
                      :show-icon="false"
                      style="margin-right: 0;" />
        </srm-button>
        <srm-button v-if="isPbAttachment" class="approval-button" size="small" icon="icon-paperclip" bordered>
          <srm-upload :attachment-uuid="attachment"
                      :desc-title="$T('smbl.common.view.button.PbAttachment').$D('PB组合附件')" :show-count="true"
                      :show-icon="false"
                      style="margin-right: 0;" />
        </srm-button>
        <srm-button v-if="showApproveHistoryFlag" class="approval-button" size="small" icon="icon-clock" bordered @click="showHistoryRecord">
          {{ $T("smbl.workFlow.button.taskDetail.record").$D("审批记录") }}
        </srm-button>
        <srm-button
          class="approval-button"
          size="small"
          bordered
          style='marginLeft: 8px'
          @click="backToList">
          {{ $T("smbl.workFlow.button.backList").$D("返回审批列表") }}
        </srm-button>
      </srm-detail-head>
      <component
        :is="childComponent"
        v-if="currentCom"
        ref="childComponent"
        :parameters="formParameters"
        :top-height="topHeight"
        :change-req-id="changeReqId"
        :edit-flag="editFlag"
        :historic-task-list="historicTaskList"
        :show-approve-history-flag="showApproveHistoryFlag"
        @getCostAttachment="getCostAttachment"
        @getPbAttachment="getPbAttachment"
        @GetApprovalTitle="getApprovalTitle"/>
      <!-- <approval-loading v-else/> -->
      <div v-if="getBtnArr.length" class="approval-detail-bottom"/>
    </div>
    <!-- 操作记录弹窗 -->
    <history-record
      v-model="historyRecordPopup"
      operator-field-name="assigneeName"
      operation-meaning-field-name="nodeName"
      process-date-field-name="endTime"
      process-remark-field-name="comment"
      :action-data="historicTaskList"
      :load-refresh="getTaskInfo"/>
    <approval-history v-model="approvalHistoryPopup" :history-approval="approvalHistory"/>
    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="currentCom && getBtnArr.length" :limit="limit" :btn-arr="getBtnArr" type="action-sheet" />
    <approval-popup
      v-if="currentCom"
      ref="approvalPopup"
      :comments-required="commentsRequired"
      :reject-required="rejectRequired"
      :jump-list="jumpList"
      :reject-jump-config-rebut-flag="rejectJumpConfigRebutFlag"
      :reject-jump-config-refuse-flag="rejectJumpConfigRefuseFlag"
      :process-instance="processInstance"
      :attachment-uuid="attachmentUuid"
      :approval-action-title="approvalActionTitle"
      :next-node-approver="nextNodeApprover"
      show-other-actions/>
    <!-- 申请人信息弹框 -->
    <srm-popup :visible.sync="userInfoPopupFlag" class="user-info-popup" position="right" :title="$T('smbl.common.view.title.applicantInformation').$D('申请人信息')" :show-back="true" :show-close="false" width="100%">
      <srm-flex class="user-info-head" justify="center" direction="column">
        <div class="avatar">
          <img :src="processInstance.avatar" >
        </div>
        <div class="name">{{ processInstance.startUserName }}</div>
      </srm-flex>
      <div style="background-color: var(--background-color-empty); margin-top: 8px;">
        <customize-detail :need-padding="true" :columns="getUserInfoColumns()" :data-source="processInstance" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmUtil } from "srm-mobile-ui";
import {
  getProcessInstance,
  getTaskInfoApi,
  checkTaskExistsApi,
  taskApproveApi,
  getMobileFormUrlByInstanceIdApi,
  getTaskApprovalHistory,
  getMobileFormUrlApi,
  remindProcessApi,
  recallProcessApi,
  revokeProcessApi,
  getTodoMenuToken,
  getEmployeeIdApi,
  getApplicantUserInfoApi,
  getAttachmentFilesApi,
  getApproveStatusApi,
  getApproveUserListApi,
  getJumpList,
} from "../api";
import HistoryRecord from "../component/HistoryRecord";
import ApprovalPopup from "../component/ApprovalPopup";
import ApprovalHistory from "../component/ApprovalHistory";
import { remotes } from "../../../../../remoteConfig";

export default {
  name: "StarBucksApprovalDetail",
  modules: [ "smbl.common", "hwfp.common", "smbl.workFlow", "hipspfm.workFlow", "hzero.common" ],
  components: {
    ApprovalHistory,
    ApprovalPopup,
    HistoryRecord,
  },
  provide() {
    return {
      approvalDetail: this,
    };
  },
  data() {
    return {
      childComponent: () => ({
        component: this.currentCom,
        //loading: ApprovalLoading,
      }),
      formParameters: {},
      approvalTitle: "", ///单据标题
      historicTaskList: [], //操作记录
      operateTypeArr: [],
      fileList: [],
      changeReqId: null,
      editFlag: false,
      attachmentUuid: uuid(),
      costAttachmentUuid: uuid(),
      attachment: uuid(),
      attachmentButtonFlag: false,
      isPbAttachment: false, // 是否pb审批
      historyRecordPopup: false,
      approvalHistoryPopup: false,
      taskId: null,
      processInstance: {},
      processInstanceId: null,
      isTodoJump:false, //外部系统待办跳转标识
      commentsRequired: false, // 审批意见是否必输
      rejectRequired: false, // 审批拒绝意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      currentCom: null,
      topHeight: 0,
      taskInfo: {},
      type: null,
      approvalHistory: [],
      approvalHistoryLoading: false,
      bfApproveFlag: false, // 星巴克合同审批前EC&FIN评分校验标识
      bfApproveCheckFlag: false, // 评分校验通过标识
      bfApproveHeaderId:"", // 评分校验接口单据id
      jumpList: [],
      rejectJumpConfigRebutFlag: false,
      rejectJumpConfigRefuseFlag: false,
      actionMap: {
        Approved: "complete",
        Rejected: "complete",
        Delegate: "delegate",
        AddSign: "AddSign",
        Jump: "jump",
        ApproveAndAddSign: "ApproveAndAddSign",
      },
      approveResultMap: {
        Approved: "Approved",
        Rejected: "Rejected",
        AddSign: "Approved",
        ApproveAndAddSign: "Approved",
      },
      userInfoPopupFlag: false,
      approvalActionTitle: {},
      limit: 2,
    };
  },
  computed: {
    getBtnArr() {
      const approveButtons = [];
      this.operateTypeArr.map((item) => {
        if (item === "ACTION_APPROVE") {
          approveButtons.push({
            title: this.$T("smbl.common.button.title.agree").$D("同意"),
            type: "primary",
            fill: true,
            handler: async () => {
              // 星巴克合同审批前增加EC&FIN评分校验(by 2022-2-21)
              // console.log("beforeApproveCheck:", this.bfApproveFlag, this.bfApproveHeaderId);
              if (this.bfApproveFlag) {
                await this.checkoutApproveStatus(this.bfApproveHeaderId);
                if (!this.bfApproveCheckFlag) {
                  return;
                }
              }
              this.$refs.approvalPopup.showApprove().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        if (item === "ACTION_REJECT") {
          approveButtons.unshift({
            title: this.$T("smbl.common.button.title.return").$D("退回"),
            type: "brown",
            bordered: true,
            handler: () => {
              this.$refs.approvalPopup.showReject().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        if (item === "ACTION_JUMP") {
          this.limit = 3;
          approveButtons.push({
            title: this.approvalActionTitle [item] || this.$T("smbl.common.action.jumped").$D("驳回"),
            handler: () => {
              this.$refs.approvalPopup.showJump().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        if (item === "ACTION_DELEGATE") {
          approveButtons.push({
            title: this.$T("smbl.common.action.delegate").$D("转交"),
            handler: () => {
              this.$refs.approvalPopup.showDelegate().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        const owner = (this.taskInfo || {}).owner || "";
        const isAddSign = owner.startsWith("AddSign") || owner.startsWith("ApproveAndAddSign");
        const addSign = this.$T("smbl.common.action.addSign").$D("加签");
        if (item === "ACTION_ADD_SIGN" && !isAddSign) {
          approveButtons.push({
            title: this.approvalActionTitle [item] || addSign,
            handler: () => {
              this.$refs.approvalPopup.showAddSign().then((params) => {
                this.approveTask(params);
              });
            }
          });
          approveButtons.push({
            title: this.$T("smbl.workFlow.view.form.approveAndAddSign", [ this.approvalActionTitle [item] || addSign ]).$D("同意并加签"),
            handler: () => {
              this.$refs.approvalPopup.showApproveAndAddSign().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
      });
      if (this.type) {
        const startedButtons = [];
        const { historicTaskList = [], remind, suspended, endTime, recall } = this.processInstance;
        this.type === "startedBy" && remind && startedButtons.push({
          title: this.$T("hwfp.common.view.message.revoke").$D("撤销"),
          type: "danger",
          bordered: true,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRevoke").$D("确认撤销吗"),
              onOk: this.revoke
            });
          }
        });
        this.type !== "involved" && !suspended && !endTime && !historicTaskList.some((i) => i.action === "Approved") && startedButtons.push({
          title: this.$T("hwfp.common.view.message.remind").$D("催办"),
          type: "primary",
          bordered: true,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRemind").$D("确认催办吗"),
              onOk: this.remind
            });
          }
        });
        this.type === "involved" && recall && startedButtons.push({
          title: this.$T("hwfp.common.view.message.recall").$D("撤回"),
          type: "danger",
          bordered: true,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRecall").$D("确认撤回吗"),
              onOk: this.recall
            });
          }
        });
        return startedButtons;
      }
      return approveButtons;
    },
    showApproveHistoryFlag() {
      const hiddenApprovalHistoryList = [
        "SPCM.CONTRACT_CEO_APPROVE_Z",
        "SPCM.CONTRACT_CEO_APPROVE",
      ];
      const processDefinitionId = this.taskInfo.processDefinitionId || this.processInstance.processDefinitionId || null;
      if (!processDefinitionId) {
        return false;
      }
      if (processDefinitionId.indexOf(":") === -1) {
        // 容错：如果不含分隔符，或分隔符不对，直接遍历匹配字符串
        // 缺点：会匹配到code_xxxx格式的单据，可能出现误差
        let results = hiddenApprovalHistoryList.filter((item) => processDefinitionId.indexOf(item) > -1);
        // 不包含则显示审批按钮
        return !results.length;
      }
      // 按processDefinitionKey精确匹配
      const processDefinitionKey = processDefinitionId.split(":")[0];
      // 不包含则显示审批按钮
      return hiddenApprovalHistoryList.indexOf(processDefinitionKey) === -1;
    },
  },
  async beforeMount() {
    if (SrmUtil.changeTheme) {
      SrmUtil.changeTheme({
        "--color-primary": "#006341",
        "--color-success": "#56BB37",
        "--color-ghost-success": "rgba(86,187,55, 0.14)",
        "--font-color-primary": "#006341",
      });
    }
    this.taskId = this.$route.query.taskId;
    this.type = this.$route.query.type;
    this.processInstanceId = this.$route.query.processInstanceId;
    this.isTodoJump = this.$route.query.isTodoJump;
    if (String(this.isTodoJump) === "true") {
      window.srmPopupBackOnClose = false;
    }
    try {
      this.$loading.show();
      await getTodoMenuToken();
      if (this.taskId) {
        //taskId存在就是待办流程
        const exists = await this.checkTaskExists(this.processInstanceId);
        if (!exists) {
          await this.$router.replace({ path: "/StarBucks_ApprovalApproved" });
          return;
        }
        await this.getTaskInfo();
      } else {
        //其他类型流程
        await this.getProcessInstanceInfo();
      }
      const componentName = await this.getComponentName();
      // console.log("this.formParameters:",this.formParameters);
      this.beforeApproveCheck(this.formParameters.bfApproveFlag || false, this.formParameters.bfApproveHeaderId);
      if (componentName) {
        // this.currentCom = SrmUtil.quietlyImportComponent(import(componentName));
        let components = componentName.split("/");
        let remote = components[0];
        let module = `./${components[1]}`;
        let remoteUrl = remotes[remote].replace(`${remote}@`, "");
        this.currentCom = SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(remote, "default", module, remoteUrl)());
      }
    } finally {
      this.$loading.hide();
    }
    this.getJumpList();
    this.fetchApprovalHistory();
  },
  methods: {
    backToList() {
      this.$router.replace({ path: "/StarBucks_ApprovalList" });
    },
    beforeApproveCheck(status, id) {
      this.bfApproveFlag = status;
      this.bfApproveHeaderId = id;
    },
    // 审批通过前校验
    async checkoutApproveStatus(bfApproveHeaderId) {
      this.bfApproveCheckFlag = false;
      await getApproveStatusApi(bfApproveHeaderId).then((res) => {
        if (!res) {
          this.$notification.open({ message: this.$T("smbl.common.message.starBucksApproveNotices").$D("该供应商E&C或FIN评估更新进行中") });
          this.bfApproveCheckFlag = false;
        } else {
          this.bfApproveCheckFlag = true;
        }
      });
    },
    getCostAttachment(costAttachment) {
      this.attachmentButtonFlag = true;
      this.costAttachmentUuid = costAttachment;
    },
    getPbAttachment(costAttachment) {
      this.attachment = costAttachment;
    },
    async approveTask(params = {}) {
      this.$loading.show({ content: this.$T("smbl.common.message.approving").$D("单据审批中") });
      const variables = [ "Delegate", "Jump" ].includes(params.approveResult) ? [] : [ {
        name: "comment",
        value: params.comment,
      }, {
        name: "approveResult",
        value: this.approveResultMap[params.approveResult]
      } ];

      Object.keys(params).forEach((key) => {
        if (key.startsWith("nextActId-")) {
          variables.push({
            name: key,
            value: params[key]
          });
        }
      });

      // 审批附件为空时，不上传uuid
      let approvalAttachmentUuid = null;
      if (params.attachmentUuid) {
        let files = await getAttachmentFilesApi(params.attachmentUuid);
        if (Array.isArray(files) && files.length > 0) {
          approvalAttachmentUuid = params.attachmentUuid;
        }
      }
      const approveData = {
        action: this.actionMap[params.approveResult],
        assignee: params.assignee,
        assignList: params.assignList,
        attachmentUuid: approvalAttachmentUuid,
        carbonCopyUsers: params.carbonCopyUsers,
        comment: params.comment,
        currentTaskId: this.taskId,
        jumpTarget: params.jumpTarget,
        jumpTargetName: params.jumpTargetName,
        rebutAutoJumpFlag: params.rebutAutoJumpFlag,
        processDefinitionId: this.taskInfo.processDefinitionId,
        processInstanceId: this.processInstanceId,
        variables
      };
      taskApproveApi(this.taskId, approveData).then((res) => {
        if (res && !res.failed) {
          if (res.warnDesc && res.warnDesc.length) {
            this.hideApprovalPopup();
            // warnDesc存在，意味着审批失败
            this.$notification.open({ message: res.warnDesc });
            return;
          }
          this.$notification.open({ message: this.$T("smbl.common.message.approveSuccess").$D("单据审批成功") });
          //判断是否为外部待办跳转，外部待办跳转直接退出应用
          if (this.isTodoJump) {
            // console.log("back:",window.parent.jw);
            if (window.parent.jw) {
              // console.log("doing-back:");
              window.parent.jw.closeWebView();
            }
            // this.$router.back();
          } else {
            this.$router.replace({ path: "/StarBucks_ApprovalList" });
          }
        }
        this.hideApprovalPopup();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    getUserInfoColumns() {
      return [ {
        fieldName: this.$T("smbl.common.model.department").$D("部门"),
        fieldType: "TEXT",
        fieldCode: "unitName",
      }, {
        fieldName: this.$T("smbl.common.model.affiliationCompany").$D("所属公司"),
        fieldType: "TEXT",
        fieldCode: "unitCompanyName",
      }, {
        fieldName: this.$T("smbl.common.model.documentName").$D("单据名称"),
        fieldType: "TEXT",
        fieldCode: "processDefinitionName",
        render: (val, item) => val || item.processName,
      }, {
        fieldName: this.$T("smbl.common.model.creationDate").$D("创建时间"),
        fieldType: "TEXT",
        fieldCode: "startTime",
      }, ];
    },
    hideApprovalPopup() {
      if (this.$refs && this.$refs.approvalPopup) {
        this.$refs.approvalPopup.hide();
      }
    },
    getHeaderColumns() {
      return [
        {
          fieldCode: "processName",
          render: (val, data) => <div class="head-container" onClick={
            (e) => {
              e.stopPropagation();
              this.userInfoPopupFlag = true;
            }
          }>
            <div class="avatar">
              <img src={data.avatar} />
            </div>
            <div class="title">
              <div class="text">{this.$T("smbl.common.view.requisitionerName").$D("申请人姓名")}</div>
              <div class="text">{this.$T("smbl.common.view.applicationSector").$D("申请部门")}</div>
            </div>
            <div class="value">
              <div class="text">{data.startUserName}</div>
              <div class="text">{data.unitName}</div>
            </div>
            <span class="arrow-icon srm-icon icon-chevron-right"></span>
          </div>,
        }
      ];
    },
    async getComponentName() {
      let componentName = null;
      let mobileFormUrl = this.type ?
        await getMobileFormUrlByInstanceIdApi(this.processInstanceId) :
        await getMobileFormUrlApi(this.taskInfo.processDefinitionId, this.taskInfo.taskDefinitionKey, this.taskInfo.executionId);
      this.isPbAttachment = mobileFormUrl && mobileFormUrl.includes("StarBucksPBContractGroupApproval");
      if (!mobileFormUrl || mobileFormUrl === "PC_ONLY") {
        this.$dialog({
          type: "alert",
          title: this.$T("smbl.common.message.tips").$D("提示"),
          content: this.$T("smbl.workFlow.validation.message.goToPC").$D("移动端表单未配置，请前往PC端进行操作!"),
          onOk: () => {
            setTimeout(() => {
              //判断是否为外部待办跳转，外部待办跳转直接退出应用
              if (this.isTodoJump) {
                // console.log("back:",window.parent.jw);
                if (window.parent.jw) {
                  // console.log("doing-back:");
                  window.parent.jw.closeWebView();
                }
              } else {
                this.$router.replace({ path: "/StarBucks_ApprovalList" });
              }
              this.hideApprovalPopup();
            }, 100);
          }
        });
        return componentName;
      } else if (mobileFormUrl.includes("?")) {
        // 区分新表单和旧表单，保证旧表单可以点击进入
        mobileFormUrl = mobileFormUrl.split("?");
        // eslint-disable-next-line no-new-object
        let theRequest = {};

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
      return componentName;
    },
    async checkTaskExists() {
      let exists = false;
      await checkTaskExistsApi(this.taskId).then((res) => {
        exists = res === "true" || res;
      });
      return exists;
    },
    transformHistoryData() {
      this.historicTaskList.forEach((item) => {
        const { name, action, actType } = item;
        let nodeName = name;
        if (actType === "startEvent") {
          nodeName = this.$T("hwfp.common.status.start").$D("开始");
        } else if (actType === "endEvent") {
          nodeName = this.$T("hwfp.common.status.end").$D("结束");
        } else if (!action) {
          nodeName = this.$T("hwfp.common.view.message.approvaling").$D("审批中");
        }
        item.nodeName = nodeName;
      });
    },
    showHistoryRecord() {
      this.historyRecordPopup = !this.historyRecordPopup;
    },
    showApprovalHistory() {
      this.approvalHistoryPopup = !this.approvalHistoryPopup;
    },
    async getProcessInstanceInfo() {
      await getProcessInstance(this.processInstanceId, this.type).then((res) => {
        this.processInstance = res;
        this.getStarBucksUserInfo();
        this.historicTaskList = res.historicTaskList || [];
        this.transformHistoryData();
      });
    },
    //获取流程信息
    async getTaskInfo() {
      await getTaskInfoApi(this.taskId).then((res) => {
        if (!res.id) {
          return;
        }
        this.taskInfo = res;
        this.processInstance = res.processInstance;
        this.getStarBucksUserInfo();

        /**
         * 该字段传必输 Y，则不默认填充 “审批拒绝”，校验字段必输
         * 该字段传非必输N，保持现状，自动填充 “审批拒绝”
         * 不传该字段 ，则不默认填充 “审批拒绝”，校验字段必输
         */
        this.rejectRequired = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_REFUSED_OPINION_FLAG"
        )[0] || {}).name === "N";
        this.rejectJumpConfigRebutFlag = (res.formData.formProperties.filter(
          (item) => item.id === "REJECT_JUMP_CONFIG_REBUT_FLAG"
        )[0] || {}).name === "Y";
        this.rejectJumpConfigRefuseFlag = (res.formData.formProperties.filter(
          (item) => item.id === "REJECT_JUMP_CONFIG_REFUSE_FLAG"
        )[0] || {}).name === "Y";
        const approvalActionTitle = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION_TITLE" && item.type === "enum"
        )[0] || {}).enumValues || [];
        approvalActionTitle.forEach((e) => {
          const { id, name } = e;
          this.approvalActionTitle[id] = name;
        });

        const approvalAction = res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION"
        )[0] || {};
        const operateType = approvalAction.enumValues;

        this.operateTypeArr = operateType.map((item) => {
          if (item.name === "Y") {
            return item.id;
          }
        });
        this.historicTaskList = res.historicTaskList || [];
        this.transformHistoryData();
        this.commentsRequired = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_NEED_OPINION_FLAG"
        )[0] || {}).name === "Y";
        this.nextNodeApprover = res.nextNodeApprover || [];
      });
    },
    async getStarBucksUserInfo() {
      // 置换employeeId
      let employeeData = await getEmployeeIdApi(this.processInstance.startUserId);
      // 请求主职位信息
      let positions = await getApplicantUserInfoApi(employeeData.employeeId);
      let primaryPosition = null; // 主岗
      for (let i = 0; i < positions.length; i++) {
        let item = positions[i];
        if (item.primaryPositionFlag) {
          primaryPosition = item;
          break;
        }
      }
      if (!primaryPosition && positions.length > 0) {
        primaryPosition = positions[0];
      }
      this.$set(this.processInstance, "unitName", primaryPosition ? primaryPosition.unitName : null);
      this.$set(this.processInstance, "unitCompanyName", primaryPosition ? primaryPosition.unitCompanyName : null);

      if (window.parent.jw) {
        window.parent.jw.setTitle({
          "title": this.processInstance.processDefinitionName || this.processInstance.processName,
        });
        window.parent.jw.getUsers({
          users: this.processInstance.startUserId,
          type: "num",
        }, {
          success: (res) => {
            let data = res.data || [];
            // 数组
            if (data.length > 0) {
              let userInfo = data[0];
              let avatar = userInfo.avatar;
              if (avatar && avatar.avatar_s) {
                this.$set(this.processInstance, "avatar", avatar.avatar_s.replace("\\", ""));
              } else {
                // console.log("avatar空", avatar);
              }
            } else {
              // console.log("数组为空", data);
            }
          },
          fail: function() {},
          complete: function() {},
        });
      } else {
        // console.log("jw不存在");
      }
    },
    fetchApprovalHistory() {
      this.approvalHistoryLoading = true;
      getTaskApprovalHistory(this.taskInfo.businessKey || this.processInstance.businessKey).then((res) => {
        if (res && res.length) {
          this.approvalHistory = res;
        }
      }).finally(() => {
        this.approvalHistoryLoading = false;
      });
    },
    getJumpList() {
      if (!this.taskId) {
        return;
      }
      getJumpList(this.taskId).then((res) => {
        this.jumpList = res || [];
      });
    },
    // 获取单据标题
    getApprovalTitle(val) {
      this.approvalTitle = val;
    },
    // 催办
    remind() {
      this.$loading.show({ content: this.$T("smbl.workFlow.message.underRemind").$D("正在催办中") });
      remindProcessApi(this.processInstanceId).then(() => {
        this.$notification.open({
          message: this.$T("smbl.workFlow.message.remindSuccess").$D("催办成功")
        });
        this.$router.back();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 撤回
    recall() {
      this.$loading.show({ content: this.$T("smbl.workFlow.message.underRecall").$D("正在撤回中") });
      recallProcessApi(this.processInstanceId).then(() => {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.validation.message.recallSuccess").$D("撤回成功")
        });
        this.$router.back();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 撤销
    revoke() {
      this.$loading.show({ content: this.$T("smbl.workFlow.message.underRevoke").$D("正在撤销中") });
      revokeProcessApi(this.processInstanceId).then(() => {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.validation.message.revikeSuccess").$D("撤销成功")
        });
        this.$router.back();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 发起群聊
    async startGroupChat() {
      const srmAccount = localStorage.getItem("srmAccount");
      if (!srmAccount || !this.processInstanceId) {
        return;
      }
      this.$loading.show();
      getApproveUserListApi(srmAccount, this.processInstanceId).then((res) => {
        let response = {
          ...res
        };
        this.$loading.hide();
        if (response.failed) {
          return;
        }
        let name = this.taskInfo.description;
        if (!name) {
          if (this.processInstance) {
            name = this.processInstance.description || this.processInstanceId;
          } else {
            name = this.processInstanceId;
          }
        }
        // 群组名称
        response.name = name;

        if (!response.users || !response.users.length || response.users.split(",").length <= 1) {
          this.$notification.open({
            message: this.$T("smbl.common.view.message.noApprovalUser").$D("未获取审批人信息"),
          });
          return;
        }

        if (window.parent.jw) {
          window.parent.jw.chartInit(response, {
            success: function () {
              // console.log("res = ", r);
            },
            fail: function() {
              // console.log("error = ", error);
            },
            complete: function() {
              // console.log("finish = ", finish);
            },
          });
        } else {
          // console.log("error111");
        }
        // console.log("1111", response);
      }).catch(() => {
        this.$loading.hide();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.detail-head {
  background: var(--color-primary);
  .approval-button {
    margin-right: 10px;
  }
}

>>> .srm-button-bordered-brown {
  border: 1px solid #475866;
}

>>> .srm-button-bordered-brown {
  color: #475866;
}

.head-container {
  width: 345px;
  height: 54px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  .avatar {
    width: 44px;
    height: 44px;
    background-color: var(--color-primary);
    border-radius: 22px;
    flex-shrink: 0;
    border-width: 1px;
    border-color: var(--background-color-empty);
    border-style: solid;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .title {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 15px;
    align-items: flex-start;
    justify-content: space-between;
    height: 44px;
    overflow: hidden;
    min-width: 60px;
  }
  .value {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 15px;
    align-items: flex-start;
    justify-content: space-between;
    height: 44px;
    flex-grow: 1;
    overflow: hidden;
    min-width: 100px;
  }
  .text {
    font-weight: normal;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
  .arrow-icon {
    flex-shrink: 0;
  }
}

.approval-detail-container {
  height 100vh;
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
}

.approval-detail-bottom {
  height: 100px;
  height calc(100px + constant(safe-area-inset-top));
  height calc(100px + env(safe-area-inset-top));
  width 100%;
  background: var(--background-color-empty);
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
}

.approval-from-loading {
  width 100%;
  padding 100px 50px;
  text-align center;
}

.user-info-popup {
  >>> .srm-popup-content {
    background: var(--background-color-empty-second);
  }
}
.user-info-head {
  padding: 15px 0px 20px 0px;
  background-color: var(--background-color-empty);
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: var(--font-color-default);
    margin-top: 15px;
  }
}

>>> .srm-history-record-item-content::before {
  background: var(--color-primary);
}

>>> .srm-history-record-status {
  color: var(--color-primary);
}

</style>
