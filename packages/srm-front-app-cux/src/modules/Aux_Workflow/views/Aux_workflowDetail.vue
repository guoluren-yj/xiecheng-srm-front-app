<template>
  <!-- eslint-disable -->
  <div>
    <hips-view class="aux-workflow-detail">
      <!-- 导航 -->
      <hips-nav-bar slot="header" :have-border="false">
        <span slot="left" class="srm-icon icon-arrow-left nav-icon" style="padding-left: 15px;" @click="$router.back()" />
        <div slot="center" class="nav-head-title noWrap">{{ approvalTitle }}</div>
        <div slot="right" class="nav-head-right">
          <SrmUpload :attachment-uuid="attachmentUuid" />
          <span class="srm-icon icon-clock nav-icon" @click="showOperationPop" />
        </div>
      </hips-nav-bar>

      <section class="headInfo">
        <li>
          {{ $T("sprm.common.model.common.title").$D("标题") }}:
          <span style="color:#05944F">1.</span>{{ approvalTitle }}
        </li>
        <li>
          <span>{{ $T('hwfp.common.model.apply.time').$D('申请时间') }}:</span>
          <span>&nbsp;{{ createTime }}</span>
        </li>
        <li>
          <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}:</span>
          <span>&nbsp;&nbsp;{{ drafterRealName }}</span>
        </li>
      </section>


      <!-- 操作记录弹窗 -->
      <HistoryRecord v-model="operationPopup" :show-remark="true" :action-data="approvalRecords" />

      <!-- 审批操作弹窗 -->
      <SrmPopup height="100%" :visible.sync="approveFlag" :title="$T('hipspfm.common.message.handlerProcess').$D('流程处理')" >
        <ApproveForm v-if="operations.length>0" :check-flow-info-list="checkFlowInfoList" :refuse-node-list="refuseNodeList" :opinion-node-list="opinionNodeList" :operations="operations" @onApproveType="onApproveType" @submitApprove="submitApprove" />
      </SrmPopup>

      <component
        :is="childComponent"
        v-if="currentCom"
        :change-req-id="changeReqId"
        @GetApprovalTitle="GetApprovalTitle"
        @GetAttachmentUuid="GetAttachmentUuid"/>
      <div v-if="canApproveFlag && showApproveBtn" class="approval-detail-bottom"/>
    </hips-view>

    <!-- 底部按钮 -->
    <BottomHandler :canApproveFlag="canApproveFlag" :showApproveBtn="showApproveBtn" :user-flag="userFlag" :other-display="true" @handleDiscard="handleDiscard" />
  </div>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import { View, NavBar } from "hips";
import ApproveForm from "../components/ApproveForm";
import BottomHandler from "../components/BottomHandler";
import HistoryRecord from "@/components/HistoryRecord";
import { isEmpty } from "@/utils/index";
import { getHistoryRecordApi, getOperationsApi, submitApproveApi, getDetailApi, isCanApproveApi, getBckNodeApi, getTaskInfoApi, getUserConfig, fecthDiscard } from "../api/index";
import { remotes } from "../../../../remoteConfig";
/* eslint-disable */
export default {
  modules: [ "hipspfm.common","hipspfm.workFlow","sprm.common","hwfp.common","ssrc.common" ],
  name: "Aux_workflowDetail",
  components: {
    ApproveForm,
    BottomHandler,
    HistoryRecord,
    [View.name]: View,
    [NavBar.name]: NavBar,
  },
  provide() {
    return {
      showOperationPop: this.showOperationPop,
      showOperationForm: this.showOperationForm,
    };
  },
  data() {
    return {
      childComponent: () => ({
        component: this.currentCom,
        //loading: ApprovalLoading,
      }),
      approvalTitle: "",
      attachmentUuid: "",
      processInstanceId: "",
      currentCom: null,
      approvalRecords: [], //审批记录
      operationPopup: false,
      processInstance: {},
      drafterRealName: "", //申请人
      createTime: "", //创建时间
      changeReqId: "", //流程id
      approveFlag: false, //审批操作弹窗
      canApproveFlag: false, //是否可以审批
      refuseNodeList: [], //退回节点
      opinionNodeList: [], //整理意见节点
      operations: [], //操作类型
      checkFlowInfoList:[],//同意界面修改流程信息列表
      userFlag: false, // 当前申请人是否等于用户
      baseInfo: {}, // 基本信息
    };
  },
  computed: {
    showApproveBtn() {
      return this.operations.includes("handler_refuse") || this.operations.includes("handler_pass");
    }
  },
  async beforeMount() {

    try {
      this.$loading.show();
      this.processInstanceId = this.$route.query.processInstanceId;
      const detailInfo = await getDetailApi(this.processInstanceId);
      if (detailInfo.failed) {
        return;
      }

      const { appUrl, handler, title, drafterRealName, createTime } = detailInfo;
      getUserConfig().then(res => {
        if(res && !res.failed) {
          this.userFlag = res.realName === drafterRealName;
        }
      });
      this.baseInfo = detailInfo;
      this.handler = handler;
      this.drafterRealName = drafterRealName;
      this.approvalTitle = title;
      this.createTime = createTime;
      const componentName = await this.mountFormComponent(appUrl);
      
      if (componentName) {
        // this.currentCom = () => SrmUtil.quietlyImportComponent(import(componentName));
        let components = componentName.split("/");
        let remote = components[0];
        let module = `./${components[1]}`;
        let remoteUrl = remotes[remote].replace(`${remote}@`, "");
        this.currentCom = SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(remote, "default", module, remoteUrl)());
      }
    } finally {
      this.$loading.hide();
    }


    this.isCanApprove();
    this.getHistoryRecord();
  },
  methods: {
    // 废弃
    handleDiscard() {
      const { billList, formDataId, tempFormId} = this.baseInfo;
      const {billType} = !isEmpty(billList) ? billList[0] : {};
        const currentData = {
          ...this.baseInfo,
          processId: this.processInstanceId,
          billType,
          id: formDataId,
          type: tempFormId,
          operationType: 'drafter_abandon',
          remark: '废弃',
        };
        this.$loading.show();
        fecthDiscard(currentData).then(res => {
          this.$loading.hide();
          if(!res.failed) {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.scanAbnormal").$D("操作成功!"),
              class: "notification",
            });
            setTimeout(() => {
            this.$router.replace({ name: "Aux_workflowList" });
            }, 200);
          }
        });
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    showOperationForm() {
      this.approveFlag = !this.approveFlag;
    },
    GetApprovalTitle() {
      // this.approvalTitle = val;
    },
    GetAttachmentUuid(val) {
      this.attachmentUuid = val;
    },
    // 加载表单
    mountFormComponent(mobileFormUrl) {
      let componentName = null;

      if (mobileFormUrl) {
        if (mobileFormUrl === "PC_ONLY") {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.common.message.tips").$D("提示"),
            content: this.$T("hipspfm.workFlow.validation.message.goToPC").$D("请前往PC端进行操作" + "!"),
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
            onOk() {}
          });
        } else {
          //存在可在移动查看的表单，按钮释放
          // eslint-disable-next-line no-lonely-if
          if (mobileFormUrl.includes("?")) {
            // eslint-disable-next-line no-param-reassign
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
            componentName = mobileFormUrl[0].substr(1);
            this.changeReqId = changeReqId;
            // }
          } else {
            // eslint-disable-next-line no-param-reassign
            mobileFormUrl = mobileFormUrl.split("/");
            let changeReqId = mobileFormUrl.pop();

            mobileFormUrl.shift();
            componentName = mobileFormUrl.join("/");
            this.changeReqId = changeReqId;
          }
        }
      } else {
        // eslint-disable-next-line
        this.$hips.dialog.alert({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content: this.$T("hipspfm.workFlow.validation.message.noMobileForm").$D("未配置移动端表单"),
          okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
          onOk() {}
        });
      }
      return componentName;
    },
    // 获取退回节点
    async getBckNode() {
      const taskInfo = await getTaskInfoApi(this.handler, this.processInstanceId);
      const { data } = taskInfo;

      const param = {
        "task_info": data,
        "handler": this.handler,
        "operation_type": "handler_refuse",
        "process_id": this.processInstanceId,
      };

      getBckNodeApi(param).then((res) => {
        const { data: { parameter: { handler_refuse: { refuseNodeList } } } } = res;

        this.refuseNodeList = refuseNodeList;
      });
    },
    // 获取整理意见即将流向的节点
    async getOpinionNode() {
      const taskInfo = await getTaskInfoApi(this.handler, this.processInstanceId);
      const { data } = taskInfo;
      const param = {
        "task_info": data,
        "handler": this.handler,
        "operation_type": "handler_pass",
        "process_id": this.processInstanceId,
      };

      getBckNodeApi(param).then((res) => {
        const { data: { parameter: { handler_pass: { manualBranchNodeList } } } } = res;
        this.opinionNodeList = manualBranchNodeList;
      });
    },
    // 获取同意界面修改流程信息
    async getAgreeModifyInfoList() {
      const taskInfo = await getTaskInfoApi(this.handler, this.processInstanceId);
      const { data } = taskInfo;
      const param = {
        "task_info": data,
        "handler": this.handler,
        "operation_type": "handler_pass",
        "process_id": this.processInstanceId,
      };

      getBckNodeApi(param).then((res) => {
        if (res && !res.failed) {
          const { data: { parameter = {} } = {} } = res;
          if (JSON.stringify(parameter["handler_pass"]) === "{}") {
            this.checkFlowInfoList = [];
            return;
          }
          this.checkFlowInfoList = parameter["handler_pass"]?.canModifyHandlerNodeList;
        }
      });
    },
    // 是否可以审批
    isCanApprove() {
      isCanApproveApi(this.handler, this.processInstanceId).then((res) => {
        this.canApproveFlag = res.data && res.data.can_approve;
        if (this.canApproveFlag) {
          this.getOperations();
        }
      });
    },
    // 获取审批记录
    getHistoryRecord() {
      const handler = this.handler;
      const processId = this.processInstanceId;

      getHistoryRecordApi(handler, processId).then((res) => {
        if (res.code === "00") {
          const data = res.data.list || [];
          const newList = data.map((item) => ({
            operator: item.handlerName,
            processRemark: item.factNodeName,
            processRemarkInfo: item.auditNote,
            processDate: item.createTime + ":00",
            processOperationMeaning: item.actionInfo,
          }));

          this.approvalRecords = newList;
        }
      });
    },
    // 获取审批操作
    getOperations() {
      const handler = this.handler;
      const processId = this.processInstanceId;

      getOperationsApi(handler, processId).then((res) => {
        if (res.code === "00") {
          const { data: { operations } } = res;
          const operationArr = operations.length && operations[0].operations || [];

          this.operations = operationArr.map((v) => v.operationType);
          if (this.operations.includes("handler_refuse")) {
            this.getBckNode();
          }
        }
      });
    },
    onApproveType(val) {
      if (val === "handler_pass") {
        this.getAgreeModifyInfoList();
        return;
      }
      if (val === "handler_approval_opinions") {
        this.getOpinionNode();
      }
    },
    // 提交
    submitApprove(auditNote, approvers, operationType, otherParams, employees, nextNode) {
      const nodeInfo = nextNode ? `manualBranchNode:${nextNode}` : "";
      const params = {
        "process_id": this.processInstanceId, // ( 流程实例ID )
        "handler": this.handler, //( 处理人)
        "audit_note": auditNote, //( 审批意见 )
        "handler_type": "ACCOUNT", //(处理人类型)
        "operation_type": operationType, //操作类型
        "next_node_info":nodeInfo, //流向节点
        approvers
      };
      if (operationType === "handler_refuse") {
        params["params"] = otherParams;
      }
      let employeeMeorry;
      if (localStorage.getItem("employeesFlag") && JSON.parse(localStorage.getItem("employeesFlag"))[
        SrmUtil.getUserInfo().id
      ]) {
        employeeMeorry = JSON.parse(JSON.parse(localStorage.getItem("employeesFlag"))[
          SrmUtil.getUserInfo().id
        ]);
      } else {
        employeeMeorry = [];
      }
      let employeesList = employees.concat();
      // eslint-disable-next-line no-unused-vars
      for (let item of employeesList) {
        if (employeeMeorry.length <= 0) {
          employeeMeorry.push({ ...item, count:0 });
        }
        if (JSON.stringify(employeeMeorry).includes(item.employeeId)) {
          employeeMeorry.forEach((meorry) => {
            if (meorry.employeeId === item.employeeId) {
              meorry.count++;
            }
          });
        } else {
          employeeMeorry.push({ ...item, count:1 });
        }
      }
      this.$loading.show();
      let employeeMemorryInfo = JSON.parse(localStorage.getItem("employeesFlag")) || {};
      employeeMemorryInfo[SrmUtil.getUserInfo().id] = JSON.stringify(employeeMeorry);
      submitApproveApi(params).then((res) => {
        this.$loading.hide();
        if (res.code === "00") {
          localStorage.setItem("employeesFlag", JSON.stringify(employeeMemorryInfo));
          this.approveFlag = false;
          this.$notification.open({
            message: res.msg,
            key,
            class: "notification"
          });
          setTimeout(() => {
            this.$router.replace({ name: "Aux_workflowList" });
          }, 200);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.aux-workflow-detail {
  // padding-bottom: 44px !important;
  overflow: scroll !important;
  background: var(--color-bg-default-b)
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  background white;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--color-other-default-f);
}
.nav-icon {
  font-size: 24px;
  color: #000;
}

.nav-head-title {
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  font-weight: bold;
  font-family: PingFangSC-Medium;
  color:var(--color-font-default);
}

.nav-head-right {
  display: flex;
  margin-right: 15px;
}

.headInfo {

  background: #ffffff;
  padding: 15px 16px;
  margin-bottom: 8px;

  li {
    // display: flex;
    margin-bottom: 4px;
    line-height: 20px;
    font-size: 14px;

    &:last-child {
      margin-bottom: 0px;
    }

    span {

      color: #333;
      font-size: 14px;
      line-height: 20px;
      display: inline-block;
      font-family: PingFangSC-Medium;
    }
  }
}
</style>
