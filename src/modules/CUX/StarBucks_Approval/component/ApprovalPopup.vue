<template>
  <srm-popup :visible.sync="visible" :height="showOtherActions ? '85%' : '65%'"
             :show-header="false" rounded
             @onClose="hide">
    <srm-flex class="approve-form" direction="column">
      <srm-flex class="approve-remark-box" direction="column" align="start">
        <srm-flex justify="between">
          <h5>
            {{ $T("smbl.workFlow.view.approve.approveRemark").$D("审批意见") }}
            <span v-if="mCommentsRequired" style="color: red"> *</span>
          </h5>
          <srm-button v-if="showOtherActions" size="small" icon="icon-paperclip" type="primary">
            <srm-upload :attachment-uuid="approveParams.attachmentUuid"
                        :desc-title="$T('smbl.workFlow.view.approve.attachment').$D('审批附件')"
                        :title="$T('smbl.workFlow.view.approve.uploadAttachment').$D('上传附件')"
                        :show-icon="false"
                        can-upload
                        can-delete />
          </srm-button>
        </srm-flex>
        <srm-textarea-field
          v-model="approvalRemark"
          :placeholder="$T('smbl.workFlow.view.approve.inputRemark').$D('请填写审批意见')"
          :height="120"
          required
          :max-length="500"
          :clear-button="false"
          :show-length="false"
          :edit-button="false"
          :show-resizer="false"/>
        <srm-flex class="fast-approve-remark-button-box" justify="end">
          <span style="margin-right: 16px" :class="['fast-approve-remark-button', {
            'fast-approve-remark-button-active': approvalRemark
          }]" @click.stop="addFastRemark">
            {{
              $T("smbl.workFlow.view.approve.saveFastRemark").$D("设为快捷回复")
            }}
          </span>
          <span class="fast-approve-remark-button">
            {{ approvalRemark ? `${approvalRemark.length}/500` : "0/500" }}
          </span>
        </srm-flex>
      </srm-flex>
      <srm-blank size="1px" theme="fill"/>
      <srm-flex class="fast-approve-remark-box" direction="column" align="start">
        <h5>{{ $T("smbl.workFlow.view.approve.fastApproveRemark").$D("快捷回复") }}</h5>
        <div class="fast-approve-remark-tip">
          <div v-if="fastRemark.length === 0">
            {{ $T("smbl.workFlow.view.approve.noFastRemark").$D("当前暂无快捷回复") }}
          </div>
          <srm-tag-group v-else :tags="fastRemark.map(e => e.content)" closable type="info" :max-lines="5" rounded
                         @click="clickFastRemark"
                         @remove="removeFastRemark"/>
        </div>
      </srm-flex>
      <srm-blank v-if="showOtherActions" theme="fill"/>
      <srm-flex v-if="showOtherActions" class="approve-operation-box" direction="column">
        <div v-if="approveResult === 'AddSign' || approveResult === 'ApproveAndAddSign'" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.addAddSign').$D('添加加签人') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            v-model="approveParams.assignList"
            :placeholder="$T('smbl.workFlow.view.approve.selectAddSign').$D('请选择加签人')"
            code="HPFM.EMPLOYEE"
            :options="{ multiple: true, queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Delegate'" style="width: 100%">
          <srm-lov-field
            v-model="approveParams.assignee"
            :label="$T('smbl.workFlow.view.approve.addDelegate').$D('添加转交人')"
            :placeholder="$T('smbl.workFlow.view.approve.selectDelegate').$D('请选择转交人')"
            code="HPFM.EMPLOYEE"
            :options="{ queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Jump'" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.selectJumpNode').$D('选择驳回节点') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="selectJumpNode"
            v-model="approveParams.jumpTarget"
            :display.sync="approveParams.jumpTargetName"
            :placeholder="$T('smbl.workFlow.view.approve.selectJumpNode').$D('选择驳回节点')"
            select-type="select"
            :default-value="{meaning: jumpList[0]?.actName, value: jumpList[0]?.actId}"
            :options="{ displayField: 'actName',subDisplayField: 'approverName', valueField: 'actId', listData: jumpList }"
            @inputChange="onJumpListSelect"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Jump' && rejectJumpConfigRebutFlag" style="width: 100%; display: none">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.selectJumpPath').$D('请选择驳回节点人员重新审批后的审批路径') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="selectJumpPath"
            v-model="approveParams.rebutAutoJumpFlag"
            :display.sync="approveParams.rebutAutoJumpFlagMeaning"
            :placeholder="$T('smbl.workFlow.view.approve.selectJumpPath').$D('请选择驳回节点人员重新审批后的审批路径')"
            select-type="select"
            :default-value="rebutAutoJumpFlagData[1]"
            :options="{ valueField: 'value', displayField: 'meaning', listData: rebutAutoJumpFlagData }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div style="width: 100%">
          <srm-lov-field v-model="approveParams.carbonCopyUsers"
                         :label="$T('smbl.workFlow.view.approve.addCC').$D('添加抄送人')"
                         :placeholder="$T('smbl.workFlow.view.approve.selectCC').$D('选择抄送人')"
                         code="HPFM.EMPLOYEE"
                         :options="{ multiple: true, queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>

          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="['Approved', 'ApproveAndAddSign'].includes(approveResult)" style="width: 100%">
          <div v-for="(nextApprover, index) in validNextNodeApprover"
               :key="index" style="width: 100%">
            <srm-lov-field
              :key="nextApprover.nextNodeId"
              v-model="approveParams[ nextApprover.nextNodeId ]"
              :code="nextApprover.candidates.length ? null : 'HPFM.EMPLOYEE'"
              :label="$T('smbl.workFlow.view.approve.appointApprover', [ nextApprover.nextActName ]).$D('指定【{}】审批人')"
              :placeholder="$T('smbl.workFlow.view.approve.selectApprover').$D('选择审批人')"
              :select-type="nextApprover.candidates.length ? 'select' : 'lov'"
              :options="{
                multiple: true,
                displayField: 'name',
                valueField: nextApprover.candidates.length ? 'employeeCode' : 'employeeNum',
                subDisplayField: 'employeeId',
                queryParams: {
                  startUser: processInstance ? processInstance.startUserId : null,
                },
                listData: nextApprover.candidates || []}"/>
            <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
            <srm-blank size="large"/>
            <srm-blank size="small"/>
          </div>
        </div>
      </srm-flex>
    </srm-flex>
    <srm-bottom-handler style="position: absolute;" :btn-arr="bottomButtons"/>
  </srm-popup>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import {
  getFastReplay,
  addFastReplay,
  deleteFastReplay,
} from "../api";

export default {
  name: "ApprovalPopup",
  modules: [ "smbl.workFlow", "smbl.common" ],
  inject: {
    approvalDetail: {
      default: null
    }
  },
  props: {
    jumpList: {
      type: Array,
      default: () => [],
    },
    commentsRequired: {
      type: Boolean,
      default: false,
    },
    rejectRequired: {
      type: Boolean,
      default: false,
    },
    nextNodeApprover: {
      type: Array,
      default: () => [],
    },
    showOtherActions: {
      type: Boolean,
      default: false,
    },
    attachmentUuid: {
      type: String,
      default: null,
    },
    approvalActionTitle: {
      type: Object,
      default: () => ({})
    },
    rejectJumpConfigRebutFlag: {
      type: Boolean,
      default: false,
    },
    processInstance: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      approvalRemark: "",
      resolve: null,
      reject: null,
      bottomButtons: [],
      fastRemark: [],
      approveResult: null,
      validNextNodeApprover: [],
      approveParams: {
        attachmentUuid: this.attachmentUuid || uuid(),
      },
      userInfo: {},
      validateTimeout: null,
      mCommentsRequired: this.commentsRequired,
      rebutAutoJumpFlagData: [ {
        value: "0",
        meaning: this.$T("smbl.workFlow.message.selectBox.rebutAutoJumpFlag.false").$D("从驳回节点后重新审批")
      }, {
        value: "1",
        meaning: this.$T("smbl.workFlow.message.selectBox.rebutAutoJumpFlag.true").$D("跳过已审节点直接到我")
      }, ],
    };
  },
  mounted() {
    this.userInfo = SrmUtil.getUserInfo();
    this.validNextNodeApprover = this.nextNodeApprover
      .filter((node) => node.check === "Y" || node.needAppoint === "Y" || node.rejectedNeedAppoint === "Y")
      .map((node) => {
        if (node.check !== "Y" && (node.needAppoint === "Y" || node.rejectedNeedAppoint === "Y")) {
          node.nextNodeId = `nextActId-specify-${node.nextActId}`;
        } else {
          node.nextNodeId = `nextActId-${node.nextActId}`;
        }
        return node;
      });
    this.initFastReplay();
  },
  beforeUpdate() {
    if (this.jumpList.length !== 0) {
      this.approveParams.approver = this.jumpList[0].approver;
      this.approveParams.jumpTarget = this.jumpList[0].actId;
      this.approveParams.jumpTargetName = this.jumpList[0].actName;
      this.approveParams.rebutAutoJumpFlag = this.rebutAutoJumpFlagData[1].value;
      this.approveParams.rebutAutoJumpFlagMeaning = this.rebutAutoJumpFlagData[1].meaning;
    }
  },
  methods: {
    onJumpListSelect(val, select) {
      if (!select || !select.length) {
        this.approveParams.approver = null;
      } else {
        this.approveParams.approver = select[0].approver;
      }
    },
    initFastReplay() {
      getFastReplay().then((res) => {
        if (res && !res.failed) {
          this.fastRemark = res || [];
        }
      });
    },
    hide() {
      this.visible = false;
    },
    clickFastRemark(tag) {
      this.approvalRemark += tag;
    },
    removeFastRemark(tag, index) {
      if (index > this.fastRemark.length - 1) {
        return;
      }
      deleteFastReplay(this.fastRemark[index].id);
      this.fastRemark.splice(index, 1);
    },
    addFastRemark() {
      if (!this.approvalRemark) {
        this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.noApproveRemark").$D("审批意见为空") });
        return;
      }
      // eslint-disable-next-line no-unused-vars
      for (let i in this.fastRemark) {
        if (this.fastRemark[i].content === this.approvalRemark) {
          this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.fastRemarkExists").$D("快捷回复已存在，请勿重复添加") });
          return;
        }
      }
      this.fastRemark.push({ content: this.approvalRemark });
      addFastReplay(this.approvalRemark).finally(() => {
        this.initFastReplay();
      });
    },
    approve() {
      if (!this.approvalRemark) {
        if (this.approveResult === "Approved" && !this.mCommentsRequired) {
          this.approvalRemark = this.$T("smbl.workFlow.view.form.starbucksApprove").$D("Approved");
        }
        if (this.approveResult === "Rejected") {
          if (this.rejectRequired) {
            //如果接口APPROVAL_REFUSED_OPINION_FLAG=N则填充
            this.approvalRemark = this.$T("smbl.workFlow.view.form.starbucksReject").$D("Approved");
          }
        }
        if (this.approveResult === "ApproveAndAddSign") {
          this.approvalRemark = this.$T("smbl.workFlow.view.form.starbucksActionAddSign").$D("Approved");
        }
      }
      // 除拒绝外，其他几种操作均不要求审批意见必输
      if (!this.approvalRemark) {
        this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.noApproveRemark").$D("审批意见为空") });
        return;
      }
      if (this.approveResult === "Delegate" && !this.approveParams.assignee) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.approve.selectDelegate").$D("请选择转交人")
        });
        return;
      }
      if ([ "ApproveAndAddSign", "AddSign" ].includes(this.approveResult) && !this.approveParams.assignList) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.approve.selectAddSign").$D("请选择加签人")
        });
        return;
      }
      if (this.approveResult === "Jump" && !this.approveParams.jumpTarget) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.approve.pleaseSelectJumpNode").$D("请选择驳回节点")
        });
        return;
      }
      if (this.approveResult === "Jump" && !this.approveParams.rebutAutoJumpFlag && this.rejectJumpConfigRebutFlag) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.approve.pleaseSelectJumpPath").$D("请选择驳回路径")
        });
        return;
      }
      if (this.approveResult === "Jump") {
        this.approveParams.assignee = this.approveParams.approver;
      }
      this.approveParams.comment = this.approvalRemark;
      this.approveParams.approveResult = this.approveResult;
      if (typeof this.approveParams.assignList === "string") {
        this.approveParams.assignList = this.approveParams.assignList && this.approveParams.assignList.split(",");
      }
      if (this.approvalDetail && this.approvalDetail.$refs.childComponent &&
        this.approvalDetail.$refs.childComponent.beforeApprove) {
        const validateResult = this.approvalDetail.$refs.childComponent.beforeApprove(this.approveResult, this.approveParams);

        if (validateResult instanceof Promise) {
          this.$loading.show({ content: this.$T("smbl.workFlow.view.approve.validateForm").$D("表单数据校验中") });
          validateResult.then(() => {
            this.resolve(this.approveParams);
            this.visible = false;
          }).catch(() => {
            this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormFailed").$D("表单数据校验失败") });
          }).finally(() => {
            if (this.validateTimeout) {
              clearTimeout(this.validateTimeout);
              this.validateTimeout = null;
            }
            this.$loading.hide();
          });
          this.validateTimeout = setTimeout(() => {
            this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormTimeout").$D("表单数据校验超时") });
            this.reject();
          }, 30000);
          return;
        }
        if (!validateResult) {
          this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormFailed").$D("表单数据校验失败") });
          return;
        }
      }
      this.resolve(this.approveParams);
      // this.visible = false;
    },
    initButton() {
      this.bottomButtons = [];
      this.bottomButtons.push({
        title: this.$T("smbl.common.button.cancel").$D("取消"),
        type: "info",
        handler: this.hide,
      });
    },
    showReject() {
      this.mCommentsRequired = false;
      this.approveResult = "Rejected";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝"),
        type: "danger",
        fill: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showApprove() {
      this.mCommentsRequired = this.commentsRequired;
      this.approveResult = "Approved";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.approve").$D("审批同意"),
        type: "primary",
        fill: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showDelegate() {
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "Delegate";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.delegate").$D("转交"),
        type: "primary",
        fill: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showJump() {
      this.carbonCopyList = null;
      const action = "ACTION_JUMP";
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "Jump";
      this.initButton();
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.common.action.jumped").$D("驳回"),
        type: "danger",
        bordered: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showAddSign() {
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "AddSign";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.addSign").$D("加签"),
        type: "primary",
        fill: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showApproveAndAddSign() {
      const action = "ACTION_ADD_SIGN";
      const addSign = this.$T("smbl.workFlow.view.form.addSign").$D("加签");
      this.mCommentsRequired = false;
      this.approvalRemark = "";
      this.approveResult = "ApproveAndAddSign";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.approveAndAddSign", [ this.approvalActionTitle [action] || addSign ]).$D("同意并加签"),
        type: "primary",
        fill: true,
        handler: this.approve,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.approve-form {
  font-size: 14px;
  padding 20px 0;
}

.approve-remark-box {
  padding 0 15px 0 10px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
    margin-left 5px;
  }
}

.fast-approve-remark-box {
  padding 20px 15px;

  h5 {
    color: #1B1E2B;
    line-height: 20px;
    font-weight: bold;
  }
}

.fast-approve-remark-tip {
  font-size 14px;
  color: #afafaf;
  line-height: 23px;
  font-weight: 400;
  margin-top 8px;
  width 100%;
}

.fast-approve-remark-button-box {
  margin-bottom 20px;
}

.fast-approve-remark-button {
  font-size: 12px;
  color: #AFAFAF;
  line-height: 24px;
  font-weight: 400;
  right 0;
}

.fast-approve-remark-button-active {
  color: var(--font-color-primary);
}

.approve-operation-box {
  padding 20px 15px 15px 10px;
}

.approval-popup-label {
  display: block;
  font-size: 14px;
  text-align: left;
  color: var(--font-color-default);
  line-height: 20px;
  font-weight: bold;
  margin-bottom: 2px;
}
</style>
