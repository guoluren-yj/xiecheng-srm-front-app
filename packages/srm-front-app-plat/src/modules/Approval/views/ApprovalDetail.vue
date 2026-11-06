<template>
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <approval-detail-head ref="headInfoHeight" :columns="getHeaderColumns()" :data-source="processInstance">
        <!--        <srm-button v-if="attachmentUuid" class="approval-button" size="small" icon="icon-paperclip" fill bordered> -->
        <!--          <srm-upload :attachment-uuid="attachmentUuid" -->
        <!--                      :desc-title="$T('smbl.workFlow.button.taskDetail.file').$D('详情附件')" :show-count="false" -->
        <!--                      :show-icon="false" -->
        <!--                      style="margin-right: 0" -->
        <!--                      color="#fff"/> -->
        <!--        </srm-button> -->
        <div class="approval-headop">
          <srm-button :loading="approvalHistoryLoading"
                      class="approval-button"
                      size="small" icon="icon-clock" bordered
                      @click="showApprovalHistory">
            {{ $T("smbl.workFlow.button.taskDetail.record").$D("审批记录") }}
          </srm-button>
          <srm-tag
            v-if="processStatusUpCase"
            size="small"
            :type="colorMap[processStatusUpCase]"
            bordered
            fill>
            {{ statusMap[processStatusUpCase] }}
            <srm-tooltip v-if="processExceptionInformationMessageHead" placement="top" :title="processExceptionInformationMessageHead">
              <span class="srm-icon icon-mall_alert-circle"/>
            </srm-tooltip>
          </srm-tag>
          <div class="approval-headop-mount">
            <slot name="approval-headop-mount" />
          </div>
        </div>
      </approval-detail-head>
      <div style="position: relative">
        <div v-if="tip" class="approval-detail-tip">{{ tip }}</div>
        <component
          :is="currentCom"
          v-if="currentCom"
          :key="mobileFormUrl"
          ref="childComponent"
          style="background: var(--background-color-empty)"
          :parameters="formParameters"
          class="approval-detail-content"
          :top-height="topHeight"
          :change-req-id="changeReqId"
          :edit-flag="editFlag"
          @InitMountNode="initMountNode"
          @GetApprovalTitle="getApprovalTitle"/>
      </div>
      <!-- <approval-loading v-else/> -->
      <div v-if="getBtnArr.length" class="approval-detail-bottom"/>
    </div>
    <!-- 操作记录弹窗 -->
    <history-record
      v-model="historyRecordPopup"
      :title="$T('smbl.workFlow.button.taskDetail.record').$D('审批记录')"
      operator-field-name="assigneeName"
      operation-meaning-field-name="action"
      process-date-field-name="endTime"
      process-remark-field-name="comment"
      :action-data="historicTaskList"/>
    <reply-record
      v-model="showReplyRecord"
      :task-id="taskId"
      :process-instance-id="processInstanceId"
      :comment-item="replayCommentItem"
      :comment-id="replayCommentId"/>
    <approval-history
      v-model="approvalHistoryPopup"
      :has-process-forecast="processStatusForecast === 'APPROVAL'"
      :history-approval="approvalHistory"
      :current-approval-data="currentApprovalData"
      :history-approval-data="historyApprovalData"
      :forecast-approval="forecastInstances"
      :forecast-unfold="forecastUnfold"
      :show-model-standard-time="showModelStandardTime"
      :show-reply-record-popup="showReplyRecordPopup"/>
    <approval-history
      v-model="approvalForecastPopup"
      :title="$T('smbl.workFlow.view.previewProcess').$D('流程预测')"
      :show-popup-close="false"
      :history-approval="approvalHistory"
      :forecast-approval="forecastInstances">
      <div slot="prompt" class="approval-history-prompt">
        {{ $T('smbl.workFlow.view.taskDetail.processPreviewPrompt').$D('流程预览仅供参考，实际结果可能会根据配置改变') }}
      </div>
      <srm-button
        v-if="processStatus === 'APPROVAL'"
        slot="left"
        plain
        class="approval-history-button"
        @click="approvalForecastPopup = false">
        {{ $T('smbl.workFlow.button.taskDetail.backToHistoryApproval').$D('返回审批记录') }}
      </srm-button>
    </approval-history>
    <div v-if="bottomTextTip" class="bottom-text-tip">
      <div class="bottom-text-tip-wrap"><slot name="bottom-text-tip" /></div>
      <span class="srm-icon icon-x" @click.stop="bottomTextTip=false"/>
    </div>
    <!-- 底部按钮 -->
    <div class='approval-detail-footer-button'>
      <srm-bottom-handler v-if="currentCom && getBtnArr.length" :btn-arr="getBtnArr" type="action-sheet" class-name="approval-detail-footer-button-popup" />
    </div>
    <approval-popup
      v-if="currentCom"
      ref="approvalPopup"
      :action-tips="actionTips"
      :process-instance-id="processInstanceId"
      :comments-required="commentsRequired"
      :reject-required="rejectRequired"
      :attachment-uuid="attachmentUuid"
      :jump-list="jumpList"
      :process-instance="processInstance"
      show-attachment
      :reject-jump-config-rebut-flag="rejectJumpConfigRebutFlag"
      :reject-jump-config-refuse-flag="rejectJumpConfigRefuseFlag"
      :reject-again-submit-path-default="rejectAgainSubmitPathDefault"
      :rebut-again-submit-path-default="rebutAgainSubmitPathDefault"
      :approval-action-title="approvalActionTitle"
      :step-rebut-flag="stepRebutFlag"
      :next-node-approver="nextNodeApprover" show-other-actions show-carbon-copy/>
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import {
  getProcessInstance,
  getTaskInfoApi,
  checkTaskExistsApi,
  taskApproveApi,
  getMobileFormUrlByInstanceIdApi,
  getMobileFormUrlByTaskId,
  getTaskApprovalHistory,
  remindProcessApi,
  recallProcessApi,
  revokeProcessApi,
  getTodoMenuToken,
  getJumpList,
  getFileApi,
  getForecastInstancesApi,
  getApprovalButtonTipsApi,
  postCarbonCopyUserApi,
  getApprovalGlobalConfig,
} from "../api/index";
import SrmAppCore from "srm-front-app-core";
import HistoryRecord from "@/components/HistoryRecord";
import ApprovalPopup from "../component/ApprovalPopup";
import ApprovalLoading from "../component/ApprovalLoading";
import ApprovalDetailHead from "../component/ApprovalDetailHead";
import { remotes } from "../../../../remoteConfig";
import ReplyRecord from "@/modules/Approval/component/ReplyRecord";
import ApprovalHistory from "@/modules/Approval/component/ApprovalHistory";
import mixins from "@/modules/CUX/Common_Approval/mixins";

export default {
  name: "ApprovalDetail",
  modules: [ "smbl.common", "hwfp.common", "smbl.workFlow", "hipspfm.workFlow", "hzero.common", "hwfp.task" ],
  components: {
    // ApprovalHistory,
    ApprovalPopup,
    HistoryRecord,
    ApprovalDetailHead,
    ReplyRecord,
    ApprovalHistory: SrmAppCore.getCuxComponent()(ApprovalHistory),
  },
  mixins: [mixins],
  provide() {
    return {
      approvalDetail: this,
    };
  },
  data() {
    return {
      formParameters: {},
      approvalTitle: "", ///单据标题
      historicTaskList: [], //操作记录
      showForecastApproval: false, // 流程预测是否显示
      operateTypeArr: [],
      fileList: [],
      changeReqId: null,
      editFlag: false,
      attachmentUuid: uuid(),
      historyRecordPopup: false,
      approvalHistoryPopup: false,
      approvalForecastPopup: false, // 显示预测流程弹框
      taskId: null,
      processInstance: {},
      processInstanceId: null,
      commentsRequired: false, // 审批意见是否必输
      rejectRequired: false, // 审批拒绝意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      currentCom: null,
      topHeight: 0,
      taskInfo: {},
      type: null,
      approvalHistory: [],
      currentApprovalData: [],
      historyApprovalData: [],
      approvalHistoryLoading: true,
      actionMap: {
        Approved: "complete",
        Rejected: "complete",
        Delegate: "delegate",
        AddSign: "AddSign",
        Jump: "jump",
        ApproveAndAddSign: "ApproveAndAddSign",
      },
      actionMeaningMap: {},
      actionColorMap: {
        Approved: "success",
        Rejected: "danger",
        Delegate: "info",
        AddSign: "info",
        ApproveAndAddSign: "info",
      },
      approveResultMap: {
        Approved: "Approved",
        Rejected: "Rejected",
        AddSign: "Approved",
        ApproveAndAddSign: "Approved",
      },
      listDataSet: null,
      jumpList: [],
      componentName: null,
      mobileFormUrl: null,
      approvalActionTitle: {},
      rejectJumpConfigRebutFlag: false,
      rejectJumpConfigRefuseFlag: false,
      hasApproveAndAddSignFlag: false,
      forecastInstances: [],
      processStatus: null,
      processStatusForecast: null,
      actionTips: {},
      bottomTextTip: false,
      forecastUnfold: false,
      showModelStandardTime: false,
      showReplyRecord: false,
      replayCommentId: null,
      replayCommentItem: null,
      stepRebutFlag: false,
      rejectAgainSubmitPathDefault: null,
      rebutAgainSubmitPathDefault: null,
      processExceptionInformationMessageHead: null,
      processStatusUpCase: null,
      statusMap: {
        "REJECTED": this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
        "APPROVED": this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
        "APPROVAL": this.$T("smbl.workFlow.view.status.approval").$D("审批中"),
        "SUSPENDED": this.$T("smbl.workFlow.view.status.suspend").$D("挂起中"),
        "STOP": this.$T("smbl.workFlow.view.status.stop").$D("终止"),
        "REVOKE": this.$T("smbl.workFlow.view.status.revoke").$D("撤销"),
      },
      colorMap: {
        "REJECTED": "danger",
        "APPROVED": "success",
        "APPROVAL": "warn",
        "SUSPENDED": "info",
        "STOP": "info",
        "REVOKE": "info",
      },
    };
  },
  computed: {
    getBtnArr() {
      const approveButtons = [];
      if (this.over$weiLongBtn) {
        const response = this.over$weiLongBtn(approveButtons);
        return response;
      }
      this.operateTypeArr.map((item) => {
        if (item === "ACTION_APPROVE") {
          approveButtons.push({
            title: this.approvalActionTitle [item] || this.$T("smbl.workFlow.view.button.approvalPass").$D("审批通过"),
            type: "primary",
            fill: true,
            help: this.actionTips.approved,
            handler: () => {
              this.$refs.approvalPopup.showApprove().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        if (item === "ACTION_REJECT") {
          approveButtons.unshift({
            title: this.approvalActionTitle [item] || this.$T("smbl.workFlow.view.button.approvalReject").$D("审批拒绝"),
            type: "danger",
            bordered: true,
            help: this.actionTips.rejected,
            handler: () => {
              this.$refs.approvalPopup.showReject().then((params) => {
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
            help: this.actionTips.addSign,
            handler: () => {
              this.$refs.approvalPopup.showAddSign().then((params) => {
                this.approveTask(params);
              });
            }
          });
          // if (!this.hasApproveAndAddSignFlag) {
          //   approveButtons.push({
          //     title: this.$T("smbl.workFlow.view.form.approveAndAddSign", [ this.approvalActionTitle [item] || addSign ]).$D("同意并加签"),
          //     help: this.actionTips.approveAndAddSign,
          //     handler: () => {
          //       this.$refs.approvalPopup.showApproveAndAddSign(false).then((params) => {
          //         this.approveTask(params);
          //       });
          //     }
          //   });
          // }
        }

        if (item === "ACTION_APPROVE_AND_ADD_SIGN" && !isAddSign) {
          approveButtons.push({
            title: this.approvalActionTitle [item] || this.$T("smbl.workFlow.view.form.approveAndAddSign", [ addSign ]).$D("同意并加签"),
            help: this.actionTips.approveAndAddSign,
            handler: () => {
              this.$refs.approvalPopup.showApproveAndAddSign(true).then((params) => {
                this.approveTask(params);
              });
            }
          });
        }

        if (item === "ACTION_DELEGATE") {
          approveButtons.push({
            title: this.approvalActionTitle [item] || this.$T("smbl.common.action.delegate").$D("转交"),
            help: this.actionTips.delegate,
            handler: () => {
              this.$refs.approvalPopup.showDelegate().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
        if (item === "ACTION_JUMP" && this.jumpList.length && !isAddSign) {
          approveButtons.push({
            title: this.approvalActionTitle [item] || this.$T("smbl.common.action.jumped").$D("驳回"),
            help: this.actionTips.rebut,
            handler: () => {
              this.$refs.approvalPopup.showJump().then((params) => {
                this.approveTask(params);
              });
            }
          });
        }
      });
      if (this.type) {
        const startedButtons = [];
        const { remind, recall } = this.processInstance;
        this.type === "startedBy" && remind && startedButtons.push({
          title: this.$T("hwfp.common.view.message.revoke").$D("撤销"),
          type: "danger",
          bordered: true,
          help: this.actionTips.revoke,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRevoke").$D("确认撤销吗"),
              onOk: this.revoke
            });
          }
        });
        this.processInstance && this.processInstance.remind && startedButtons.push({
          title: this.$T("hwfp.common.view.message.remind").$D("催办"),
          type: "primary",
          bordered: true,
          help: this.actionTips.remind,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRemind").$D("确认催办吗"),
              onOk: this.remind
            });
          }
        });
        (this.type === "startedBy" || this.type === "involved") && startedButtons.push({
          title: this.$T("hwfp.common.view.message.carbonCopy").$D("传阅"),
          type: "primary",
          bordered: true,
          help: this.actionTips.carbonCopy,
          handler: () => {
            this.$refs.approvalPopup.showNewCarbonCopy().then((params) => {
              this.carbonTask(params);
            });
          }
        });
        this.type === "involved" && recall && startedButtons.push({
          title: this.$T("hwfp.common.view.message.recall").$D("撤回"),
          type: "danger",
          bordered: true,
          help: this.actionTips.recall,
          handler: () => {
            this.$dialog({
              content: this.$T("hwfp.common.view.message.confirmRecall").$D("确认撤回吗"),
              onOk: this.recall
            });
          }
        });
        startedButtons.push({
          title: this.$T("hwfp.task.view.option.comment").$D("评论"),
          handler: () => {
            this.showReplyRecordPopup();
          }
        });
        return startedButtons;
      }
      approveButtons.push({
        title: this.$T("hwfp.task.view.option.comment").$D("评论"),
        handler: () => {
          this.showReplyRecordPopup();
        }
      });
      return approveButtons;
    },
  },
  beforeMount() {
    this.mountApi();
    if (this.over$initH5JDk) {
      this.over$initH5JDk();
    }
  },
  methods: {
    showLoading(status) {
      this.$loading.show({
        icon: " ",
        dark: true,
        content: ApprovalLoading,
        loadingProps: {
          status,
        },
      });
    },
    hideLoading() {
      this.$loading.hide();
    },
    showTip(tip) {
      this.tip = tip;
      setTimeout(() => {
        this.tip = "";
      }, 2000);
    },
    mountApi() {
      this.taskId = this.$route.query.taskId;
      this.type = this.$route.query.type;
      this.processInstanceId = this.$route.query.processInstanceId;
      const dataSetId = this.$route.query.dataSetId;
      this.listDataSet = DataSet.getDataSet(dataSetId);
      this.init();
      const actionTips = this.$store.getters["Approval/getActionTips"];
      if (!actionTips) {
        getApprovalButtonTipsApi().then((response) => {
          this.$store.commit("Approval/setActionTips", response);
          this.actionTips = response;
        });
      } else {
        this.actionTips = actionTips;
      }
    },
    showReplyRecordPopup(replayCommentItem) {
      this.showReplyRecord = true;
      this.replayCommentItem = replayCommentItem;
      this.replayCommentId = replayCommentItem ? replayCommentItem.commentIdEncrypt : null;
    },
    async init() {
      try {
        this.approvalHistory = [];
        this.formParameters = {};
        this.changeReqId = null;
        this.$loading.show();
        const promsies = [
          getTodoMenuToken(),
          SrmUtil.getValueSetBatch({ actionMeaningMap: "HWFP.APPROVAL.ACTION" }, this),
          this.getComponentName(),
        ];
        if (this.taskId) {
          //taskId存在就是待办流程
          promsies.push(this.checkTaskExists(this.processInstanceId));
        } else {
          //其他类型流程
          promsies.push(this.getProcessInstanceInfo());
        }
        // eslint-disable-next-line no-unused-vars
        const [menuToken, valueBatch, componentName, processInfo] = await Promise.all(promsies);
        this.handleComponentName(componentName);
        let jumpPageFlag = false;
        if (this.taskId) {
          //taskId存在就是待办流程
          // 无processInfo就是待办已经审批过了
          if (!processInfo) {
            if (this.over$initJumpInvolved) {
              // 覆盖跳到已审批中转页面逻辑，直接跳到已办，该二开内必须执行并返回getProcessInstanceInfo结果
              await this.over$initJumpInvolved();
            } else {
              const config = await getApprovalGlobalConfig();
              if (config && config.todoJumpApprovedFlag === 1) {
                jumpPageFlag = true;
                this.$router.replace({ path: "/ApprovalDetail", query:{
                  type:"involved",
                  processInstanceId:this.processInstanceId
                } });
                this.type = "involved";
                // eslint-disable-next-line no-undefined
                this.taskId = undefined;
                // eslint-disable-next-line no-unused-vars
                const [_, involvedComponentName] = await Promise.all([
                  this.getProcessInstanceInfo(),
                  this.getComponentName(),
                ]);
                if (involvedComponentName) {
                  this.handleComponentName(involvedComponentName, true);
                }
              } else {
                jumpPageFlag = true;
                //this.listDataSet && this.listDataSet.removeLocalRecords([ this.listDataSet.current ]);
                await this.$router.replace({ path: "/ApprovalApproved", query:{
                  processInstanceId:this.processInstanceId
                } });
                return;
              }
            }
          } else {
            await this.getTaskInfo();
          }
        }
        if (!jumpPageFlag && (!componentName || componentName === "PC_ONLY")) {
          this.$dialog({
            type: "alert",
            title: this.$T("smbl.common.message.tips").$D("提示"),
            content: this.$T("smbl.workFlow.validation.message.goToPC").$D("移动端表单未配置，请前往PC端进行操作!"),
            onOk: () => {
              setTimeout(() => {
                this.$router.replace({ path: "/ApprovalList" });
              }, 100);
            }
          });
        }
      } finally {
        this.hideLoading();
      }
      // 查询流程定义配置
      this.getProcessConfig();
      // 获取预测审批流程
      this.getForecastInstances(this.processInstance.processDefinitionId);
      this.fetchApprovalHistory();
    },
    handleComponentName(componentName, jumpPageFlag) {
      if (componentName && componentName !== "PC_ONLY") {
        this.currentCom = null;
        this.componentName = componentName;
        // 审批表单适配子应用详情页/mm/hhh
        // if (componentName.indexOf("modules") > -1) {
        //   this.currentCom = SrmUtil.quietlyImportComponent(import(`@/modules/${componentName.replace("modules/", "")}.vue`));
        // } else {
        //   this.currentCom = SrmUtil.quietlyImportComponent(import(`@/components/Workflow/${componentName}.vue`));
        // }
        // this.currentCom = SrmUtil.quietlyImportComponent(import("appCpra/OrderApprovalNew"));
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
        SrmUtil.quietlyImportComponent(SrmUtil.loadRemoteComponent(appKey, "default", module, remoteUrl)()).then((com) => {
          this.currentCom = com && com.default;
        });
      } else if (jumpPageFlag) {
        this.$dialog({
          type: "alert",
          title: this.$T("smbl.common.message.tips").$D("提示"),
          content: this.$T("smbl.workFlow.validation.message.goToPC").$D("移动端表单未配置，请前往PC端进行操作!"),
          onOk: () => {
            setTimeout(() => {
              this.$router.replace({ path: "/ApprovalList" });
            }, 100);
          }
        });
      }
    },
    getJumpList(params) {
      if (!this.taskId) {
        return;
      }
      getJumpList(this.taskId, { params }).then((res) => {
        this.jumpList = res || [];
      });
    },
    showProcessDetailPopup() {
      this.$popup({
        title: this.$T("smbl.workFlow.view.title.headerInfo").$D("流程头信息"),
        showHeader: true,
        showClose: true,
        rounded: true,
        height: "75vh",
        position: "bottom",
        content: <CustomizeDetail
          style="padding: 0 15px"
          dataSource={this.processInstance}
          columns={this.getDetailColumns()}
        />,
      });
    },
    async approveTask(params = {}) {
      const variables = [ "Delegate", "Jump" ].includes(params.approveResult) ? [] : [ {
        name: "comment",
        value: params.comment,
      }, {
        name: "approveResult",
        value: this.approveResultMap[params.approveResult]
      } ];

      Object.keys(params).forEach((key) => {
        const paramValue = params[key];
        if (key.startsWith("nextActId-") && paramValue !== null && paramValue !== "" && typeof paramValue !== "undefined") {
          variables.push({
            name: key,
            value: paramValue
          });
        }
      });
      const attachmentCount = await getFileApi(params.attachmentUuid);
      this.showLoading("serviceExcuting");
      const approveData = {
        action: this.actionMap[params.approveResult],
        assignee: params.assignee,
        assignList: params.assignList ? params.assignList.split(",") : [],
        attachmentUuid: attachmentCount.length ? params.attachmentUuid : null,
        carbonCopyUsers: params.carbonCopyUsers,
        comment: params.comment,
        currentTaskId: this.taskId,
        jumpTarget: params.jumpTarget,
        jumpTargetName: params.jumpTargetName,
        processDefinitionId: this.taskInfo.processDefinitionId,
        processInstanceId: this.processInstanceId,
        refuseAutoJumpFlag: params.refuseAutoJumpFlag,
        rebutAutoJumpFlag: params.rebutAutoJumpFlag,
        variables,
        ...params?.formLock && { formLock: params.formLock }
      };
      taskApproveApi(this.taskId, approveData).then((res) => {
        if (res && !res.failed && !res.warnDesc) {
          this.showTip(this.$T("smbl.common.message.approveSuccess").$D("单据审批成功"));
          this.approvalHistory = [];
          this.currentApprovalData = [];
          this.historyApprovalData = [];
          if (this.over$toInvolved) {
            this.over$toInvolved();
            return;
          }
          if (this.taskId && this.listDataSet) {
            //待审批的单据审批通过自动加载下一个
            this.listDataSet.refresh().then(() => {
              const listRecords = this.listDataSet.records.filter((record) => record.get("mobileFormUrl"));
              if (listRecords.length) {
                const next = listRecords[0];
                const taskId = next.get("id");
                const processInstanceId = next.get("processInstanceId");
                let href = window.location.href;
                href = href.replace(/taskId=[_\-a-zA-Z0-9]*/, `taskId=${taskId}`);
                href = href.replace(/processInstanceId=[_\-a-zA-Z0-9]*/, `processInstanceId=${processInstanceId}`);
                window.history.replaceState({}, "", href);
                this.taskId = taskId;
                this.processInstanceId = processInstanceId;
                this.currentCom = null;
                this.componentName = null;
                this.init();
                this.showTip(`${this.$T("smbl.common.message.approveSuccess").$D("单据审批成功")},${this.$T("hwfp.common.message.view.title.nextProcess").$D("已自动打开下一条待办")}`);
              } else {
                this.showTip(this.$T("hwfp.common.message.view.title.finishProcess").$D("当前列表待办已完成"));
                this.goBack();
              }
            });
            return;
          }
          this.goBack();
        }
        if (res.warnDesc) {
          this.$notification.open({ message: res.warnDesc });
        }
      }).finally(() => {
        this.hideLoading();
      });
    },
    goBack() {
      if (this.$route.query.dataSetId) {
        this.$router.back();
      } else {
        this.$router.replace({ path: "/ApprovalList" });
      }
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "processName",
        render: (val, data) => val || data.processDefinitionName ?
          <div style="width: 100%;" onClick={this.showProcessDetailPopup}>{val || data.processDefinitionName}<span style="margin-left: 8px;" class="srm-icon icon-chevrons-right"/></div> :
          <SrmSkeleton loading title rows={1}/>
      }, {
        fieldCode: "startUserName",
        render: (val, data) => val && `${val} / ${data.createTime || data.startTime}`
      } ];
    },
    getDetailColumns() {
      let generatorColumns = [];
      if (this.processExceptionInformationMessageHead) {
        generatorColumns.push({
          fieldCode: "processExceptionInformationMessageHead",
          fieldName: this.$T("hwfp.common.model.process.processExceptionInformationMessageHead").$D("挂起原因"),
          render: () => this.processExceptionInformationMessageHead
        });
      }
      return [ {
        fieldCode: "processName",
        fieldName: this.$T("hwfp.common.model.process.name").$D("流程名称"),
        render: (val, data) => val || data.processDefinitionName
      }, {
        fieldCode: "id",
        fieldName: this.$T("hwfp.common.model.process.ID").$D("流程标识"),
        render: (val, data) => val || data.id
      }, {
        fieldCode: "startUserName",
        fieldName: this.$T("hwfp.common.model.apply.owner").$D("申请人"),
        render: (val, data) => val || data.assigneeName
      }, {
        fieldCode: "createTime",
        fieldName: this.$T("hwfp.common.model.apply.time").$D("申请时间"),
        render: (val, data) => val || data.startTime
      }, {
        fieldCode: "description",
        fieldName: this.$T("hwfp.common.model.process.description").$D("流程描述"),
        render: (val, data) => val || data.description,
      }, ...generatorColumns];
    },
    async getComponentName() {
      let componentName = null;
      let mobileFormUrl = this.type ?
        await getMobileFormUrlByInstanceIdApi(this.processInstanceId) :
        await getMobileFormUrlByTaskId(this.taskId);
      if (!mobileFormUrl || mobileFormUrl === "PC_ONLY") {
        return mobileFormUrl;
      }
      mobileFormUrl = String(mobileFormUrl);
      this.mobileFormUrl = mobileFormUrl;
      if (mobileFormUrl.includes("?")) {
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
    showHistoryRecord() {
      this.historyRecordPopup = !this.historyRecordPopup;
    },
    showApprovalHistory() {
      this.approvalHistoryPopup = !this.approvalHistoryPopup;
    },
    async getProcessInstanceInfo() {
      await getProcessInstance(this.processInstanceId, this.type, { commentRecordFlag: 1 }).then((res) => {
        this.processInstance = res;
        this.processStatus = this.processInstance.processStatus;
        this.processStatusForecast = this.processInstance.processStatusForecast;
        this.processStatusUpCase = (this.processInstance.processStatusForecast || "").toUpperCase();
        this.historicTaskList = res.historicTaskList;
        this.processExceptionInformationMessageHead = this.processInstance.processExceptionInformation && this.processInstance.processExceptionInformation.messageHead;
        this.currentApprovalData.push(res);
        this.approvalHistory.push(res);
      });
    },
    //获取流程信息
    async getTaskInfo() {
      await getTaskInfoApi(this.taskId, { commentRecordFlag: 1 }).then((res) => {
        if (!res.id) {
          return;
        }
        this.taskInfo = res;
        this.processStatus = this.taskInfo.processStatus;
        this.processStatusForecast = this.taskInfo.processStatusForecast;
        this.processInstance = res.processInstance;
        this.processInstance.description = res.description;
        const approvalAction = res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION"
        )[0] || {};
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
        this.rejectJumpConfigRebutFlag = (res.formData.formProperties.filter(
          (item) => item.id === "REJECT_JUMP_CONFIG_REBUT_FLAG"
        )[0] || {}).name === "Y";
        this.rejectJumpConfigRefuseFlag = (res.formData.formProperties.filter(
          (item) => item.id === "REJECT_JUMP_CONFIG_REFUSE_FLAG"
        )[0] || {}).name === "Y";
        this.rejectAgainSubmitPathDefault = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVE_REJECT_AGAIN_SUBMIT_PATH_DEFAULT"
        )[0] || {}).name;
        this.rebutAgainSubmitPathDefault = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVE_REBUT_AGAIN_SUBMIT_PATH_DEFAULT"
        )[0] || {}).name;
        const approvalActionTitle = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION_TITLE" && item.type === "enum"
        )[0] || {}).enumValues || [];
        approvalActionTitle.forEach((e) => {
          const { id, name } = e;
          this.approvalActionTitle[id] = name;
        });
        const operateType = approvalAction.enumValues || [];

        // this.hasApproveAndAddSignFlag =
        //   operateType.filter((item) => item.id === "ACTION_APPROVE_AND_ADD_SIGN").length > 0;
        this.operateTypeArr = operateType.map((item) => {
          if (item.name === "Y") {
            return item.id;
          }
        });
        this.historicTaskList = res.historicTaskList;
        this.approvalHistory.push(res);
        this.currentApprovalData.push(res);
        this.nextNodeApprover = res.nextNodeApprover || [];
      });
    },
    // 获取预测审批流程
    getForecastInstances(processDefinitionId) {
      getForecastInstancesApi(this.processInstanceId, processDefinitionId).then((res) => {
        if (!res.failed) {
          const forecastProcessList = res || [];
          if (forecastProcessList.length === 1) {
            // 只有一条时，显示结束节点
            this.forecastInstances = forecastProcessList;
          } else {
            this.forecastInstances = forecastProcessList.filter((e) => e.actType !== "endEvent");
          }
        }
      });
    },
    fetchApprovalHistory() {
      this.approvalHistoryLoading = true;
      getTaskApprovalHistory(this.taskInfo.businessKey || this.processInstance.businessKey, this.processInstance.id, { commentRecordFlag: 1 }).then((res) => {
        if (res && res.length) {
          this.approvalHistory.push(...res.reverse());
          this.historyApprovalData.push(...res.reverse());
        }
      }).finally(() => {
        this.approvalHistoryLoading = false;
      });
    },
    // 获取单据标题
    getApprovalTitle(val) {
      this.approvalTitle = val;
    },
    initMountNode(nodes) {
      if (nodes) {
        const { headerButtonRight, bottomTextTip } = nodes;
        this.$slots["approval-headop-mount"] = headerButtonRight;
        this.$slots["bottom-text-tip"] = bottomTextTip;
        // eslint-disable-next-line no-undefined
        if (bottomTextTip !== undefined) {
          this.bottomTextTip = true;
        }
      }
    },
    // 催办
    remind() {
      this.$loading.show({ content: this.$T("smbl.workFlow.message.underRemind").$D("正在催办中") });
      remindProcessApi(this.processInstanceId).then((res) => {
        if (res.warnDesc) {
          this.$notification.open({ message: res.warnDesc });
          return;
        }
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
      recallProcessApi(this.processInstanceId).then((res) => {
        if (res.warnDesc) {
          this.$notification.open({ message: res.warnDesc });
          return;
        }
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
      revokeProcessApi(this.processInstanceId).then((res) => {
        if (res.warnDesc) {
          this.$notification.open({ message: res.warnDesc });
          return;
        }
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.revokeFailed").$D("撤销失败"),
            description: res.message,
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.revikeSuccess").$D("撤销成功")
          });
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 传阅
    carbonTask(params) {
      this.$loading.show({ content: this.$T("smbl.common.message.approving").$D("单据审批中") });
      const requestData = {
        ...params,
        type: this.type,
        processInstanceId: this.processInstanceId,
      };
      postCarbonCopyUserApi(requestData).then(() => {
        this.$notification.open({ message: this.$T("smbl.workFlow.message.carbonCopySuccess").$D("传阅成功") });
        this.goBack();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    getProcessConfig() {
      getApprovalGlobalConfig().then((res) => {
        if (res) {
          this.forecastUnfold = res.forecastUnfoldFlag === 1;
          this.showModelStandardTime = res.modelStandardTimeFlag === 1;
          this.stepRebutFlag = res.stepRebutFlag === 1;
          this.getJumpList(res.stepRebutFlag === 1 ? { workStationFlg: 1 } : null);
        } else {
          this.getJumpList(null);
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
  background: var(--background-color-empty-second);
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
  transform: unset !important;
  transition: unset !important;
}

.approval-detail-bottom {
  height 200px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

.approval-from-loading {
  width 100%;
  padding 100px 50px;
  text-align center;
}

.approval-button {
  margin-right 10px;
}

.approval-button {
  >>> .srm-upload-title {
    color white !important;
  }
}

.approval-detail-tip {
  position absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #E6F2ED;
  font-size: 12px;
  color: #05944F;
  text-align: center;
  line-height: 32px;
  height: 32px;
  font-weight: 500;
}

.approval-history-prompt {
  font-family: PingFangSC-Medium;
  padding: 8px 16px;
  background: var(--color-ghost-primary);
  text-align: center;
  color: var(--color-primary);
  font-weight: 500;
  line-height: 16px;
  font-size: 12px;
}

.approval-history-button {
  margin-left: 15px !important;
}

.bottom-text-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #276EF1;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  position: fixed;
  bottom: 74px;
  width: 100%;
  padding: 8px 15px;
  background: #EFF3FE;
  .bottom-text-tip-wrap {
    flex: 1;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.approval-headop {
  flex: 1;
  display: flex;
  justify-content: space-between;
  .approval-headop-mount {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  .srm-tag {
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .srm-icon {
      color: #FFF;
      font-size: 13px
      height: 13px;
      width: 14px;
      position: relative;
      display: flex;

      &::before {
        position: absolute;
        top: 3px
      }
    }
  }
}
</style>
<style lang="stylus">
@media screen and (orientation: landscape) {
  .approval-detail-footer-button-popup .srm-popup {
    max-height: 100%;
    overflow: auto;
  }
}
</style>
<style lang="stylus" scoped>
@media screen and (orientation: landscape) {
  a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote,
  body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt,
  em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6,
  header, html, i, iframe, img, input, ins, kbd, label, legend, li, mark, menu,
  nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike,
  strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u,
  ul, var, video {
    font-size: 1.5vw !important;
  }
  .approval-detail-container {
    .approval-detail-head {
      padding: 2vw 2vw 0;
      >>> .customize-item-field {
        line-height: 2.5vw !important;
        font-size: 2vw !important;
      }
    }
    .approval-detail-head-info {
      margin-bottom: 2vw !important;
    }
    >>> .approval-detail-head-slot {
      padding-bottom: 2vw !important;
    }
    .approval-headop {
      button {
        height: 3.2vw !important;
        >>> .srm-button-text {
          font-size: 1.5vw !important;
        }
        >>> .srm-icon {
          font-size: 2vw !important;
        }
      }
    }
    >>> .srm-scroll-tab-button {
      padding: 1.5vw 1vw!important;
      font-size: 1.5vw !important;
    }
    >>> .srm-scroll-tab-button:first-of-type {
      padding-left: 2vw !important;
    }
    .approval-detail-footer-button {
      >>> .srm-bottom-handler {
        padding: 0 2vw !important;
      }
      >>> .srm-icon {
        font-size: 1.5vw;
      }
      >>> .srm-bottom-more-icon {
         height: 3.2vw !important;
         .srm-icon {
          font-size: 4vw !important;
         }
      }
      >>> .srm-bottom-item {
        padding: 1vw 2vw !important;
        .srm-button-text {
          font-size: 1.5vw !important;
        }
        .srm-button {
          padding: 1vw 2vw !important;
          height: 3.2vw !important;
        }
      }
    }
  }
  .approval-detail-content {
    >>> .srm-scroll-tab-item-title {
      font-size: 1.5vw;
      padding: 1vw 2vw;
      line-height: 3vw;
      .tab-item-button .srm-icon {
        font-size: 2.5vw !important;
      }
    }
    >>> .srm-upload-field .srm-button {
      height: 2vw!important;
    }
    >>> .srm-list-container .no-content {
       height: 20vw!important;
    }
    >>> .srm-list-container .no-content div p {
      font-size: 2vw!important;
    }
    >>> .srm-field-wrapper-mini .srm-date {
      font-size: 1.5vw !important;
      height: 3vw !important;
      line-height: 3vw !important;
    }
    >>> .card-personalized {
      padding: 1vw 2vw;
    }
    >>> .customize {
      .customize-item {
        margin-bottom: 1.5vw;
      }
      .customize-item-field *{
        line-height: 1.5vw !important;
        font-size: 1.5vw !important;
      }
    }
    >>> .noContent span{
      font-size: 2vw !important;
    }
    >>> .srm-field-wrapper-container {
      .srm-field-wrapper, .srm-text {
        min-height: 2.5vw;
        font-size: 1.5vw;
        line-height: 2.5vw;
      }
    }
    >>> .srm-list-item-card-head-right .srm-icon {
      font-size: 2vw !important;
    }
    >>> .srm-attachment-group-item {
      line-height: 2vw;
      padding: 2vw;
      img {
        width: 4vw;
        height: 4vw;
      }
      .srm-attachment-group-label {
        font-size: 1.5vw;
      }
      .srm-icon {
        font-size: 2vw;
      }
    }
    >>> .srm-list-item-card {
      padding: 2vw !important;
    }
    >>> .srm-history-record-content {
      * {
        font-size: 1.5vw !important;
      }
      .srm-history-record-item:nth-child(2) {
        margin-top: 2vw;
      }
      .srm-history-record-month, .srm-history-record-operator, .srm-history-record-remark {
        line-height: 3.5vw;
      }
    }
    >>> .srm-list-load-more-box {
      padding: 1.5vw;
    }
    >>> .srm-button-text, .no-content div {
      font-size: 1.5vw !important;
    }
    >>> .customize .customize-item-field .srm-attachment-group, .customize .customize-item-field .srm-attachment-group-label {
      line-height: 4vw !important;
      height: 4vw !important;
    }
  }
}
</style>
<style lang="stylus">
@media screen and (orientation: landscape) {
  .srm-popup-content {
    .srm-field-wrapper {
      font-size: 1.5vw !important;
    }
      .customize-item {
      height: 2.5vw !important;
      line-height: 2.5vw !important;
    }
    .srm-button-text {
      font-size: 1.5vw !important;
    }
    .srm-scroll-tab {
      .srm-scroll-tab-button {
        font-size: 2vw !important;
        padding-top: 1.5vw !important;
        padding-bottom: 1.5vw !important;
      }
      .srm-scroll-tab-item-title {
        font-size: 2vw !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      .srm-scroll-tab-item {
        .srm-form {
          padding-top: 1vw !important;
          padding-bottom: 1vw !important;
        }
        .module-title {
          padding: 2vw 4vw !important;
          font-size: 2vw !important;
          line-height: 2vw !important;
        }
        .srm-list-item-card {
          padding: 2vw 4vw !important;
        }
      }
    }

  }
}
</style>