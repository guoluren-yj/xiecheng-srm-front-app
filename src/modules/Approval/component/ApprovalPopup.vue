<template>
  <srm-popup :visible.sync="visible" :height="showCarbonCopy ? '85%' : '65%'"
             :show-header="false" rounded
             @onClose="hide">
    <srm-flex class="approve-form" direction="column">
      <srm-flex class="approve-remark-box" direction="column" align="start">
        <srm-flex justify="between">
          <h5>
            {{ popupTitle || $T("smbl.workFlow.view.approve.approveRemark").$D("审批意见") }}
            <span v-if="mCommentsRequired" style="color: red"> *</span>
          </h5>
          <srm-button v-if="showAttachment" size="small" icon="icon-paperclip">
            <srm-attachment-button
              :title="$T('smbl.workFlow.view.approve.attachment').$D('审批附件')"
              :attachments="[{
                attachmentUuid: approveParams.attachmentUuid,
                title: $T('smbl.workFlow.view.approve.uploadAttachment').$D('上传附件'),
              }]"
              show-total/>
          </srm-button>
        </srm-flex>
        <srm-textarea-field
          v-model="approvalRemark"
          :placeholder="remarkPlaceholder || $T('smbl.workFlow.view.approve.inputRemark').$D('请填写审批意见')"
          :height="120"
          required
          :max-length="1000"
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
            {{ approvalRemark ? `${approvalRemark.length}/1000` : "0/1000" }}
          </span>
        </srm-flex>
      </srm-flex>
      <srm-blank size="1px" theme="fill"/>
      <srm-flex class="fast-approve-remark-box" direction="column" align="start">
        <srm-flex justify="between">
          <h5>{{ $T("smbl.workFlow.view.approve.fastApproveRemark").$D("快捷回复") }}</h5>
          <div class="fast-approve-remark-edit">
            <srm-button v-show="!fastRemarkEditFlag" size="small" plain rect @click="fastRemarkEditFlag = true">
              {{ $T("smbl.common.button.edit").$D("编辑") }}
            </srm-button>
            <srm-button v-show="fastRemarkEditFlag" size="small" plain rect @click="fastRemarkCancel">
              {{ $T("smbl.common.button.cancel").$D("取消") }}
            </srm-button>
            <srm-button v-show="fastRemarkEditFlag" size="small" plain rect @click="fastRemarkConfirm">
              {{ $T("smbl.common.button.complete").$D("完成") }}
            </srm-button>
          </div>
        </srm-flex>
        <div class="fast-approve-remark-tip">
          <div v-if="displayFastRemark.length === 0">
            {{ $T("smbl.workFlow.view.approve.noFastRemark").$D("当前暂无快捷回复") }}
          </div>
          <div v-if="!fastRemarkEditFlag">
            <srm-tag
              v-for="(fastRemarkItem, index) in displayFastRemark"
              :key="fastRemarkItem.id"
              type="info"
              :closable="fastRemarkEditFlag && fastRemarkItem.type !== 'TENANT_FAST_REPLY'"
              rounded
              @click.native="clickFastRemark(fastRemarkItem.content)"
              @close="removeFastRemark(index)">
              {{ fastRemarkItem.content }}
            </srm-tag>
          </div>
          <div v-else>
            <div>
              <span style="color: #868D9C;font-weight: 400;margin-right: 8px;font-size: 14px">{{ $T("hzero.common.custom").$D("自定义") }}:</span>
              <srm-tag
                v-for="(fastRemarkItem, index) in userFastRemark"
                :key="fastRemarkItem.id"
                type="info"
                closable
                rounded
                @click.native="clickFastRemark(fastRemarkItem.content)"
                @close="removeFastRemark(index)">
                {{ fastRemarkItem.content }}
              </srm-tag>
            </div>
            <div>
              <span style="color: #868D9C;font-weight: 400;margin-right: 8px;font-size: 14px">{{ $T("hzero.common.predefined").$D("预定义") }}:</span>
              <srm-tag
                v-for="(fastRemarkItem) in predefiendFastRemark"
                :key="fastRemarkItem.id"
                type="info"
                rounded
                @click.native="clickFastRemark(fastRemarkItem.content)">
                {{ fastRemarkItem.content }}
              </srm-tag>
            </div>
          </div>
        </div>
      </srm-flex>
      <srm-blank v-if="showCarbonCopy" theme="fill"/>
      <srm-flex class="approve-operation-box" direction="column">
        <div v-if="approveResult === 'AddSign' || approveResult === 'ApproveAndAddSign'" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.addAddSign').$D('添加加签人') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="selectAddSign"
            ref="addSignLovField"
            v-model="approveParams.assignList"
            :placeholder="$T('smbl.workFlow.view.approve.selectAddSign').$D('请选择加签人')"
            code="HPFM.EMPLOYEE"
            :options="{ multiple: true, queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Delegate'" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.addDelegate').$D('添加转交人') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="selectDelegate"
            v-model="approveParams.assignee"
            :display.sync="approveParams.assigneeName"
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
            :disabled="stepRebut"
            :options="{ displayField: 'actName',subDisplayField: 'approverName', valueField: 'actId', listData: jumpListData }"
            @inputChange="onJumpListSelect"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Jump'" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.selectJumpNodeEmp').$D('驳回节点审批人') }}
            <span style="color: red"> *</span>
          </div>
          <srm-input-field
            key="selectJumpNodeEmp"
            v-model="approveParams.approverName"
            :disabled="stepRebut"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Jump' && !stepRebut && rejectJumpConfigRebutFlag" style="width: 100%">
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
            :disabled="stepRebut"
            :options="{ valueField: 'value', displayField: 'meaning', listData: rebutAutoJumpFlagData }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'Rejected' && rejectJumpConfigRefuseFlag" style="width: 100%">
          <div class="approval-popup-label">
            {{ $T('smbl.workFlow.view.approve.selectRejectPath').$D('请选择发起人再次提交后的审批路径') }}
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="selectRefusePath"
            v-model="approveParams.refuseAutoJumpFlag"
            :display.sync="approveParams.refuseAutoJumpFlagMeaning"
            :placeholder="$T('smbl.workFlow.view.approve.selectRejectPath').$D('请选择发起人再次提交后的审批路径')"
            select-type="select"
            :options="{ valueField: 'value', displayField: 'meaning', listData: refuseAutoJumpFlagData }"/>
          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="showCarbonCopy && approveResult !== 'CarbonCopy'" style="width: 100%">
          <srm-lov-field
            ref="carbonCopyLovField"
            key="select_c_c"
            v-model="approveParams.carbonCopyUsers"
            :label="$T('smbl.workFlow.view.approve.addCC').$D('添加抄送人')"
            :placeholder="$T('smbl.workFlow.view.approve.selectCC').$D('选择抄送人')"
            code="HPFM.EMPLOYEE"
            :options="{ multiple: true, queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>

          <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
          <srm-blank size="large"/>
          <srm-blank size="small"/>
        </div>
        <div v-if="approveResult === 'CarbonCopy'" style="width: 100%;">
          <div>
            <span class="select-carbon-copy-title">{{ $T('smbl.workFlow.view.approve.selectCarbonCopy').$D('添加传阅人') }}</span>
            <span style="color: red"> *</span>
          </div>
          <srm-lov-field
            key="select_carbon_copy"
            v-model="carbonCopyList"
            :placeholder="$T('smbl.workFlow.view.approve.selectCarbonCopyPlaceholder').$D('选择传阅人')"
            code="HPFM.EMPLOYEE"
            :options="{ multiple: true }" />
        </div>
        <div v-if="['Approved', 'ApproveAndAddSign'].includes(approveResult)" style="width: 100%">
          <div v-for="(nextApprover, index) in validNextNodeApprover"
               :key="index" style="width: 100%">
            <srm-lov-field
              :key="nextApprover.nextNodeId"
              v-model="approveParams[ nextApprover.nextNodeId ]"
              :code="nextApprover.candidates.length ? null : ((nextApprover.appointApproverEmpStr || nextApprover.appointApproverPostStr || nextApprover.appointApproverRoleStr) ? 'HWFP.APPOINT_APPROVER_SCOPE' : 'HPFM.EMPLOYEE')"
              :label="$T('smbl.workFlow.view.approve.appointApprover', [ nextApprover.nextActName ]).$D('指定【{}】审批人')"
              :placeholder="$T('smbl.workFlow.view.approve.selectApprover').$D('选择审批人')"
              :select-type="nextApprover.candidates.length ? 'select' : 'lov'"
              :options="{
                multiple: true,
                displayField: 'name',
                valueField: nextApprover.candidates.length ? 'employeeCode' : ((nextApprover.appointApproverEmpStr || nextApprover.appointApproverPostStr || nextApprover.appointApproverRoleStr) ? 'employeeCode' : 'employeeNum'),
                subDisplayField: 'employeeId',
                queryParams: {
                  startUser: processInstance ? processInstance.startUserId : null,
                  appointApproverEmpStr: nextApprover.appointApproverEmpStr || '',
                  appointApproverPostStr: nextApprover.appointApproverPostStr || '',
                  appointApproverRoleStr: nextApprover.appointApproverRoleStr || '',
                },
                listData: nextApprover.candidates || []}"/>
            <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
            <srm-blank size="large"/>
            <srm-blank size="small"/>
          </div>
        </div>
      </srm-flex>
      <srm-bottom-handler :btn-arr="bottomButtons" style="position: absolute"/>
    </srm-flex>
  </srm-popup>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import {
  getFastReplay,
  addFastReplay,
  deleteFastReplay,
  acquireTaskFormLockApi,
  releaseTaskFormLockApi
} from "../api/index";
import ApprovalLoading from "./ApprovalLoading";

const LOV_FIELD_OVERFLOW_REFS = [ "addSignLovField", "carbonCopyLovField" ];

export default {
  name: "ApprovalPopup",
  modules: [ "smbl.workFlow", "smbl.common", "hzero.common", "hwfp.common" ],
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
    showAttachment: {
      type: Boolean,
      default: false,
    },
    showCarbonCopy: {
      type: Boolean,
      default: false,
    },
    attachmentUuid: {
      type: [ String, Array ],
      default: null,
    },
    processInstance: {
      type: Object,
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
    rejectJumpConfigRefuseFlag: {
      type: Boolean,
      default: false,
    },
    actionTips: {
      type: Object,
      default: () => ({}),
    },
    processInstanceId: {
      type: Number,
      default: null
    },
    stepRebutFlag: {
      type: Boolean,
      default: false,
    },
    // 审批拒绝后发起人再次提交后的审批路径默认值
    rejectAgainSubmitPathDefault: {
      type: String,
    },
    // 审批驳回后发起人再次提交后的审批路径默认值
    rebutAgainSubmitPathDefault: {
      type: String,
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
      displayFastRemark: [],
      removedFastRemark: [],
      fastRemarkEditFlag: false,
      approveResult: null,
      approveParams: {
        attachmentUuid: this.showAttachment ? this.attachmentUuid || uuid() : null
      },
      userInfo: {},
      validateTimeout: null,
      mCommentsRequired: this.commentsRequired,
      refuseAutoJumpFlagData: [ {
        value: "0",
        meaning: this.$T("smbl.workFlow.message.selectBox.refuseAutoJumpFlag.false").$D("从首个节点开始审批")
      }, {
        value: "1",
        meaning: this.$T("smbl.workFlow.message.selectBox.refuseAutoJumpFlag.true").$D("跳过已审节点直接到我")
      }, ],
      rebutAutoJumpFlagData: [ {
        value: "0",
        meaning: this.$T("smbl.workFlow.message.selectBox.rebutAutoJumpFlag.false").$D("从驳回节点后重新审批")
      }, {
        value: "1",
        meaning: this.$T("smbl.workFlow.message.selectBox.rebutAutoJumpFlag.true").$D("跳过已审节点直接到我")
      }, ],
      carbonCopyList: null,
      lovFieldOverflow: {},
      lovOverflowObservers: {},
    };
  },
  computed: {
    popupTitle() {
      const titles = {
        "CarbonCopy": this.$T("smbl.workFlow.view.approve.carbonCopyRemark").$D("传阅意见"),
      };
      return this.approveResult ? titles[this.approveResult] : null;
    },
    remarkPlaceholder() {
      const placeholders = {
        "CarbonCopy": this.$T("smbl.workFlow.view.approve.carbonCopyPlaceholder").$D("请填写传阅意见"),
      };
      return this.approveResult ? placeholders[this.approveResult] : null;
    },
    predefiendFastRemark() {
      return this.displayFastRemark ? this.displayFastRemark.filter((i) => i.type === "TENANT_FAST_REPLY") : [];
    },
    userFastRemark() {
      return this.displayFastRemark ? this.displayFastRemark.filter((i) => i.type !== "TENANT_FAST_REPLY") : [];
    },
    validNextNodeApprover() {
      if (this.nextNodeApprover) {
        return this.nextNodeApprover
          .filter((node) => node.check === "Y" || node.needAppoint === "Y" || node.rejectedNeedAppoint === "Y")
          .map((node) => {
            if (node.check !== "Y" && (node.needAppoint === "Y" || node.rejectedNeedAppoint === "Y")) {
              node.nextNodeId = `nextActId-specify-${node.nextActId}`;
            } else {
              node.nextNodeId = `nextActId-${node.nextActId}`;
            }
            return node;
          });
      }
      return [];
    },
    stepRebut() {
      return this.stepRebutFlag;
    },
    jumpListData() {
      return this.jumpList;
    },
    jumpData() {
      return {
        stepRebut: this.stepRebutFlag,
        jumpListData: this.jumpList,
        approveResult: this.approveResult,
      };
    },
  },
  watch: {
    jumpData(v) {
      if (v.stepRebut && v.jumpListData.length > 0 && v.jumpListData[0] && v.approveResult === "Jump") {
        // 默认选第一个
        const target = v.jumpListData[0];
        this.approveParams.jumpTarget = target.actId;
        this.approveParams.jumpTargetName = target.actName;
        this.approveParams.approver = target.approver;
        this.approveParams.approverName = target.approverName;
        // 默认选重新申请
        if (this.rejectJumpConfigRebutFlag) {
          this.approveParams.rebutAutoJumpFlag = this.rebutAutoJumpFlagData[this.rebutAgainSubmitPathDefault === "START_FROM_REBUT" ? "0" : "1"].value;
          this.approveParams.rebutAutoJumpFlagMeaning = this.rebutAutoJumpFlagData[this.rebutAgainSubmitPathDefault === "START_FROM_REBUT" ? "0" : "1"].meaning;
        }
      }
    },
    approveResult() {
      this.$nextTick(this.initAllLovFieldOverflowWatch);
    },
    visible() {
      if (this.visible) {
        this.$nextTick(this.initAllLovFieldOverflowWatch);
      }
    },
    "approveParams.assignList"() {
      this.$nextTick(() => this.checkLovFieldOverflow("addSignLovField"));
    },
    "approveParams.carbonCopyUsers"() {
      this.$nextTick(() => this.checkLovFieldOverflow("carbonCopyLovField"));
    },
  },
  mounted() {
    this.userInfo = SrmUtil.getUserInfo();
    this.initFastReplay();
    this.initAllLovFieldOverflowWatch();
    window.addEventListener("resize", this.handleLovFieldResize);
  },
  beforeDestroy() {
    Object.values(this.lovOverflowObservers || {}).forEach((obs) => obs && obs.disconnect());
    this.lovOverflowObservers = {};
    window.removeEventListener("resize", this.handleLovFieldResize);
  },
  methods: {
    initAllLovFieldOverflowWatch() {
      LOV_FIELD_OVERFLOW_REFS.forEach((refName) => this.initLovFieldOverflowWatch(refName));
    },
    initLovFieldOverflowWatch(refName) {
      if (!refName) {
        return;
      }
      if (this.lovOverflowObservers[refName]) {
        this.lovOverflowObservers[refName].disconnect();
        this.lovOverflowObservers[refName] = null;
      }
      this.$set(this.lovFieldOverflow, refName, false);
      if (typeof ResizeObserver === "undefined") {
        return;
      }
      this.$nextTick(() => {
        const lovEl = this.$refs[refName] && this.$refs[refName].$el;
        if (!lovEl) {
          return;
        }
        const tagGroupEl = lovEl.querySelector(".srm-tag-group");
        if (!tagGroupEl) {
          return;
        }
        this.lovOverflowObservers[refName] = new ResizeObserver(() => {
          this.checkLovFieldOverflow(refName);
        });
        this.lovOverflowObservers[refName].observe(tagGroupEl);
        this.checkLovFieldOverflow(refName);
      });
    },
    checkLovFieldOverflow(refName) {
      if (!refName) {
        return;
      }
      const lovEl = this.$refs[refName] && this.$refs[refName].$el;
      if (!lovEl) {
        this.$set(this.lovFieldOverflow, refName, false);
        return;
      }
      const tagGroupEl = lovEl.querySelector(".srm-tag-group");
      if (!tagGroupEl) {
        this.$set(this.lovFieldOverflow, refName, false);
        return;
      }
      const isOverflow = tagGroupEl.scrollWidth - tagGroupEl.clientWidth > 1;
      this.$set(this.lovFieldOverflow, refName, isOverflow);
      tagGroupEl.classList.toggle("srm-multi-lov-overflow", isOverflow);
    },
    handleLovFieldResize() {
      LOV_FIELD_OVERFLOW_REFS.forEach((refName) => this.checkLovFieldOverflow(refName));
    },
    onJumpListSelect(val, select) {
      if (!select || !select.length) {
        this.approveParams.approver = null;
        this.approveParams.approverName = null;
      } else {
        this.approveParams.approver = select[0].approver;
        this.approveParams.approverName = select[0].approverName;
      }
    },
    initFastReplay() {
      getFastReplay().then((res) => {
        if (res && !res.failed) {
          this.fastRemark = res || [];
          this.displayFastRemark = Array.from(this.fastRemark);
        }
      });
    },
    hide() {
      this.visible = false;
    },
    fastRemarkCancel() {
      this.displayFastRemark = Array.from(this.fastRemark);
      this.fastRemarkEditFlag = false;
      this.removedFastRemark = [];
    },
    fastRemarkConfirm() {
      this.fastRemarkEditFlag = false;
      this.removedFastRemark.forEach((remark) => {
        deleteFastReplay(remark.id);
      });
      this.fastRemark = Array.from(this.displayFastRemark);
      this.removedFastRemark = [];
    },
    clickFastRemark(tag) {
      this.approvalRemark += tag;
    },
    removeFastRemark(index) {
      if (index > this.displayFastRemark.length - 1) {
        return;
      }
      this.removedFastRemark.push(this.displayFastRemark[index]);
      this.displayFastRemark.splice(index, 1);
    },
    addFastRemark() {
      if (!this.approvalRemark) {
        this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.noApproveRemark").$D("审批意见为空") });
        return;
      }
      // eslint-disable-next-line no-unused-vars
      for (let i in this.displayFastRemark) {
        if (this.displayFastRemark[i].content === this.approvalRemark) {
          this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.fastRemarkExists").$D("快捷回复已存在，请勿重复添加") });
          return;
        }
      }
      this.displayFastRemark.unshift({ content: this.approvalRemark });
      addFastReplay(this.approvalRemark).finally(() => {
        this.initFastReplay();
      });
    },
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
    approve() {
      if (!this.approvalRemark) {
        if (this.approveResult === "Approved" && !this.mCommentsRequired) {
          this.approvalRemark = this.$T("smbl.workFlow.view.form.approve").$D("审批同意");
        }
        if (this.approveResult === "Rejected") {
          if (this.rejectRequired) {
            //如果接口APPROVAL_REFUSED_OPINION_FLAG=N则填充
            this.approvalRemark = this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝");
          }
        }
      }
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
      if (this.approveResult === "Rejected" && !this.approveParams.refuseAutoJumpFlag && this.rejectJumpConfigRefuseFlag) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.approve.pleaseSelectRejectPath").$D("请选择重新审批路径")
        });
        return;
      }
      if (this.approveResult === "Jump") {
        this.approveParams.assignee = this.approveParams.approver;
      }
      this.approveParams.comment = this.approvalRemark;
      this.approveParams.approveResult = this.approveResult;
      const owner = (this.approvalDetail && this.approvalDetail.taskInfo || {}).owner || "";
      const isAddSign = owner.startsWith("AddSign") || owner.startsWith("ApproveAndAddSign");
      if (!isAddSign && this.approvalDetail && this.approvalDetail.$refs.childComponent &&
        this.approvalDetail.$refs.childComponent.beforeApprove) {
        acquireTaskFormLockApi(this.processInstanceId).then((res) => {
          if (res.failed) {
            return;
          }
          const validateResult = this.approvalDetail.$refs.childComponent.beforeApprove(this.approveResult, this.approveParams);
          if (validateResult instanceof Promise) {
            this.showLoading("formValidting");
            validateResult.then(() => {
              this.resolve({ ...this.approveParams, formLock: res.lock });
              this.visible = false;
            }).catch((e) => {
              this.hideLoading();
              releaseTaskFormLockApi(this.processInstanceId, res.lock);
              if (e) {
                this.$notification.open({ message: e });
              } else {
                this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormFailed").$D("表单数据校验失败") });
              }
            }).finally(() => {
              if (this.validateTimeout) {
                clearTimeout(this.validateTimeout);
                this.validateTimeout = null;
              }
              this.$loading.hide();
            });
            this.validateTimeout = setTimeout(() => {
              this.hideLoading();
              releaseTaskFormLockApi(this.processInstanceId, res.lock);
              this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormTimeout").$D("表单数据校验超时") });
              this.reject();
            }, 30000);
          } else if (!validateResult) {
            releaseTaskFormLockApi(this.processInstanceId, res.lock);
            this.hideLoading();
            this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.validateFormFailed").$D("表单数据校验失败") });
          } else {
            this.resolve({ ...this.approveParams, formLock: res.lock });
            this.visible = false;
          }
        }).catch(() => {
          this.hideLoading();
          this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.formLockFailed").$D("表单锁定失败失败") });
        });
      } else {
        this.resolve(this.approveParams);
        this.visible = false;
      }
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
      this.carbonCopyList = null;
      const action = "ACTION_REJECT";
      this.mCommentsRequired = false;
      this.approveResult = "Rejected";
      this.initButton();
      if (this.rejectJumpConfigRefuseFlag) {
        this.approveParams.refuseAutoJumpFlag = this.refuseAutoJumpFlagData[this.rejectAgainSubmitPathDefault === "START_FROM_FIRST" ? "0" : "1"].value;
        this.approveParams.refuseAutoJumpFlagMeaning = this.refuseAutoJumpFlagData[this.rejectAgainSubmitPathDefault === "START_FROM_FIRST" ? "0" : "1"].meaning;
      }
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝"),
        type: "danger",
        fill: true,
        help: this.actionTips.rejected,
        handler: () => {
          this.approve();
        },
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showApprove() {
      this.carbonCopyList = null;
      const action = "ACTION_APPROVE";
      this.mCommentsRequired = this.commentsRequired;
      this.approveResult = "Approved";
      this.initButton();
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.workFlow.view.form.approve").$D("审批同意"),
        type: "primary",
        help: this.actionTips.approved,
        fill: true,
        handler: () => {
          this.approve();
        },
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showDelegate() {
      this.carbonCopyList = null;
      const action = "ACTION_DELEGATE";
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "Delegate";
      this.initButton();
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.workFlow.view.form.delegate").$D("转交"),
        type: "primary",
        fill: true,
        help: this.actionTips.delegate,
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
      if (this.rejectJumpConfigRebutFlag) {
        this.approveParams.rebutAutoJumpFlag = this.rebutAutoJumpFlagData[this.rebutAgainSubmitPathDefault === "START_FROM_REBUT" ? "0" : "1"].value;
        this.approveParams.rebutAutoJumpFlagMeaning = this.rebutAutoJumpFlagData[this.rebutAgainSubmitPathDefault === "START_FROM_REBUT" ? "0" : "1"].meaning;
      }
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.common.action.jumped").$D("驳回"),
        type: "danger",
        help: this.actionTips.rebut,
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
      this.carbonCopyList = null;
      const action = "ACTION_ADD_SIGN";
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "AddSign";
      this.initButton();
      this.bottomButtons.push({
        title: this.approvalActionTitle [action] || this.$T("smbl.workFlow.view.form.addSign").$D("加签"),
        type: "primary",
        fill: true,
        handler: this.approve,
        help: this.actionTips.addSign,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    showApproveAndAddSign(hasApproveAndAddSignFlag) {
      this.carbonCopyList = null;
      const action = "ACTION_ADD_SIGN";
      const addSign = this.$T("smbl.workFlow.view.form.addSign").$D("加签");
      this.mCommentsRequired = true;
      this.approvalRemark = "";
      this.approveResult = "ApproveAndAddSign";
      this.initButton();
      this.bottomButtons.push({
        title: hasApproveAndAddSignFlag ? this.approvalActionTitle [action] || addSign : this.$T("smbl.workFlow.view.form.approveAndAddSign", [ this.approvalActionTitle [action] || addSign ]).$D("同意并加签"),
        type: "primary",
        fill: true,
        handler: this.approve,
        help: this.actionTips.approveAndAddSign,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    // 传阅
    showNewCarbonCopy() {
      this.carbonCopyList = null;
      this.mCommentsRequired = false;
      this.approvalRemark = "";
      this.approveResult = "CarbonCopy";
      this.initButton();
      this.bottomButtons.push({
        title: this.$T("smbl.workFlow.view.form.carbonCopy").$D("传阅"),
        type: "primary",
        fill: true,
        handler: this.carbonCopyAction,
        help: this.actionTips.carbonCopy,
      });
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    carbonCopyAction() {
      if (!this.carbonCopyList) {
        this.$notification.open({ message: this.$T("smbl.workFlow.view.approve.noCarbonCopyUser").$D("传阅人不能为空") });
        return;
      }
      this.resolve({
        appendComment: this.approvalRemark,
        employees: this.carbonCopyList.split(","),
      });
      this.visible = false;
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

  .fast-approve-remark-edit {
    display flex;
    align-items center;

    .srm-button {
      margin-left 20px;
    }
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
  color: #276EF1;
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

.select-carbon-copy-title {
  font-size: 14px;
  text-align: left;
  color: var(--font-color-default);
  line-height: 20px;
  font-weight: bold;
  margin-bottom: 2px;
}
>>> .srm-lov-value-wrap {
  flex-wrap nowrap;
}
>>> .srm-tag-group {
  display flex !important;
  flex-wrap nowrap !important;
  overflow hidden !important;
  max-width 100% !important;
  width 100%;
  position relative !important;
}
>>> .srm-tag {
  max-width none !important;
  flex-shrink 0;
}
>>> .srm-tag-text {
  max-width none !important;
  word-break keep-all !important;
}
>>> .srm-tag-group.srm-multi-lov-overflow::after {
  content '...';
  position absolute;
  right 0;
  top 0;
  bottom 0;
  background #fff;
  width 26px;
  padding-left 4px;
  display flex;
  align-items center;
  justify-content flex-start;
  color var(--font-color-default);
  font-size 14px;
  line-height 22px;
  font-weight 400;
  pointer-events none;
  z-index 1;
}
</style>
<style lang="stylus" scoped>
@media screen and (orientation: landscape) {
  .approve-form *{
    font-size: 1.5vw !important;
  }
  .approve-form  {
    padding: 1vw 0;
  }
  .approve-remark-box h5 {
    line-height: 2vw;
  }
  >>> .srm-button {
    height: 2.5vw !important;
    line-height: 2.5vw !important;
  }
  >>> .srm-button-text, >>> .srm-icon {
    font-size: 1.5vw !important;
  }
  .approval-popup-label {
    font-size: 2vw !important;
  }
  >>> textarea {
    font-size: 1.5vw !important;
    max-height: 4vw !important;
  }
  .fast-approve-remark-button {
    height: 2.5vw !important;
    line-height: 2.5vw !important;
    font-size: 1.5vw !important;
  }
  .fast-approve-remark-button-box {
    margin-bottom: 1vw;
  }
  .fast-approve-remark-box {
    padding: 1vw 4vw;
    >>> h5 {
      line-height: 2.5vw;
    }
  }
  .fast-approve-remark-tip {
    margin-top: 0;
    line-height: 2.5vw;
  }
  >>> .srm-tag {
    line-height: 2.5vw !important;
  }
  .approve-operation-box {
    padding: 1vw 4vw 2vw 2.667vw !important;
    >>> .srm-blank-large {
      height: 2vw;
    }
    >>> .srm-blank-small {
      height: 1vw;
    }
  }
  >>> .srm-field-label {
    font-size: 2vw !important;
    line-height: 2.5vw !important;
  }
  >>> .srm-lov {
    font-size: 1.5vw !important;
  }
  >>> .srm-lov *{
    font-size: 1.5vw !important;
  }
  >>> .srm-bottom-handler .srm-button {
    height: 3.2vw !important;
    padding: 0;
    font-size: 1.5vw !important;
    >>> .srm-button-text {
      font-size: 1.5vw !important;
    }
  }
  >>> .srm-field-wrapper-mini .srm-lov{
    line-height: 2.5vw !important;
  }
  >>> .approval-popup-label {
    line-height: 2vw !important;
  }
}
</style>