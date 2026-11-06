<template>
  <!-- eslint-disable -->
  <hips-popup v-model="value"
              style="height:91%;width:100%"
              position="top"
              class="top-boder-radius"
              :overlay-on-click-close="false"
              @click-overlay="closePop">
    <div class="supplier-container">
      <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
        <div
          slot="left"
          class="cancel"
          @click="closePop">
          {{ $T('hipspfm.common.button.cancle').$D('取消') }}
        </div>
        <div
          v-if="type === 'transfer'"
          slot="right"
          class="transfer"
          @click="transfer">
          {{ $T('hipspfm.workFlow.action.delegate').$D('转交') }}
        </div>
        <div
          v-if="type === 'signature'"
          slot="right"
          class="transfer"
          @click="signature">
          {{ $T('hipspfm.common.action.addSign').$D('加签') }}
        </div>
        <div
          v-if="type === 'approvelSignature'"
          slot="right"
          class="approvel"
          @click="approvelSignature">
          {{ $T('hipspfm.common.action.approveAndAddSign').$D('同意并加签') }}
        </div>
      </hips-nav-bar>
      <!-- 列表 -->
      <div class="scroll-wrap">
        <div class="contentText">
          <hips-textarea
            v-model="auditOpinionRej"
            :label="$T('hipspfm.common.message.approvalComment').$D('审批意见')"
            :placeholder="'    '+$T('hipspfm.workFlow.view.message.inputApproveRemark').$D('请输入审批意见')"
            label-position="top"
            auto-height
            :required="commentsRequired"
            :max-height="134"/>
        </div>
        <div v-if="type === 'transfer'" class="contentLov">
          <li>
            <span>
              <i style="color:var(--color-other-default)">*</i>
              {{ $T('hipspfm.common.action.delegate').$D('转交') }}
            </span>
          </li>
          <div class="supplier" @click="selectTransferManager">
            <span v-show="!transferValue.name" class="status-span">
              {{
                $T('hipspfm.workFlow.validation.message.handlerDelegate').$D('请选择转交人')
              }}
            </span>
            <div>
              <div v-show="transferValue.name" class="supplier-item">{{ transferValue.name }}</div>
            </div>
            <span v-show="transferValue.name" @click.stop="clearTransfer">
              <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
            </span>
            <span>
              <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt>
            </span>
          </div>
        </div>
        <div v-if="type === 'signature'||type === 'approvelSignature'" class="contentLov">
          <li>
            <span>
              <i style="color:var(--color-other-default)">*</i>
              {{ $T('hipspfm.workFlow.action.addSign').$D('加签') }}
            </span>
          </li>
          <div class="supplier" @click="showSignaturePop">
            <span v-show="!signatureValue.length"
                  class="status-span">{{ $T('hipspfm.workFlow.validation.message.handlerAddSign').$D('请选择加签人') }}</span>
            <div>
              <div v-show="signatureValue.length" class="supplier-item">
                {{ signatureValue.map((v) => {
                  return v.name;
                }).join(',') }}
              </div>
            </div>
            <span v-show="signatureValue.length" @click.stop="clearSignature">
              <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
            </span>
            <span>
              <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt>
            </span>
          </div>
        </div>
        <div v-if="!getTenantNum" class="contentLov">
          <li>
            <span>{{ $T('hipspfm.workFlow.view.message.addCopy').$D('添加抄送人') }}</span>
          </li>
          <div class="supplier" @click="selectCcManager">
            <span v-show="!supplierValue.length"
                  class="status-span">{{ $T('hipspfm.workFlow.validation.message.handlerCC').$D('请选择抄送人') }}</span>
            <div>
              <div v-show="supplierValue.length" class="supplier-item">{{ approveManager(supplierValue) }}</div>
            </div>
            <span v-show="supplierValue.length" @click.stop="clearSupplier">
              <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
            </span>
            <span>
              <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt>
            </span>
          </div>
          <div v-if="showApprovalFlag">
            <li>
              <span>{{ $T('hipspfm.workFlow.view.message.designatedApprover').$D('指定审批人') }}</span>
            </li>
            <div class="supplier" @click="selectApproveManager">
              <span v-show="!approvalValue.length" class="status-span">{{
                $T('hipspfm.workFlow.validation.message.handlerDesignatedApprover').$D('请选择审批人')
              }}</span>
              <div>
                <div v-show="approvalValue.length" class="supplier-item">{{ approveManager(approvalValue) }}</div>
              </div>
              <span v-show="approvalValue.length" @click.stop="clearApproval">
                <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
              </span>
              <span>
                <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt>
              </span>
            </div>
          </div>
        </div>

        <div class="contentAttachment">
          <div class="attachmentBox">
            <div>
              <p>{{ $T('hipspfm.workFlow.view.message.publishAttachments').$D('发布附件') }}</p>
              <p v-show="attachmentNumber == 0" class="noAttachment">
                {{ $T('hipspfm.workFlow.view.message.nowNoAttachment').$D('当前暂未上传附件') }}
              </p>
              <p
                v-show="attachmentNumber > 0"
                class="hasAttachment"
                @click="showFilePop(attachmentUUIDs)">
                {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
              </p>
            </div>
            <div @click="showFilePop(attachmentUUIDs)">
              <span>
                <img class="image-blue-default" src="@/assets/Navigation bar_import_highlight@3x.png">
                {{ $T('hipspfm.common.button.uploadAttachment').$D('上传附件') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <lov
        v-model="signaturePopup"
        code="HPFM.EMPLOYEE"
        :clear-flag="clearFlagD"
        multiple
        :title="$T('hipspfm.workFlow.view.message.selectEmployee').$D('选择员工')"
        :query-params="{tenantId,lovCode:'HPFM.EMPLOYEE'}"
        @submitValue="GetSignature"/>
    </div>
    <!-- <hips-popup
        style="height:100%;width:100%"
        v-model="filePopup"
    position="top"> -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUUIDs"
      :title="$T('hipspfm.workFlow.view.message.publishAttachments').$D('发布附件')"
      :can-upload="true"
      :can-delete="true"
      @attachmentNumber="getAttachmentNumber"/>
    <!-- </hips-popup> -->
  </hips-popup>
</template>

<script>
import uuid from "uuid";
import { http } from "srm-mobile-ui";
import Lov from "@/components/Lov";

const storage = window.localStorage;

import { View, NavBar, Popup, Textarea } from "hips";
// import SelectSupplier from "../components/SelectSupplier";
import AttachedFile from "@/components/File/AttachedFile";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "smbl.common", "smbl.workFlow" ],
  name: "ToDoOperates",
  components: {
    Lov,
    AttachedFile,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
    [Popup.name]: Popup,
  },
  props: {
    type: {
      // 类型
      type: String,
      default: ""
    },
    value: {
      // 弹出层状态
      type: Boolean,
      default: false
    },
    commentsRequired: {
      // 审批意见是否必输
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default: () => ({})
    },
    editFlag: {
      //可编辑类型参数
      type: String | Number,
      default: "",
    },
    listData: {
      //可编辑页面列表传值
      type: Array,
      default: () => []
    },
    // 操作完成后返回路径
    backRoutePath: {
      type: String,
      default: "MyTodoList"
    },
    otherParams: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      auditOpinionRej: "",
      transferPopup: false, // 转交弹窗
      transferValue: "", // 转交人
      supplierPopup: false, // 抄送人弹窗
      supplierValue: "", // 抄送人
      approvalPopup: false, // 审批人弹窗
      approvalValue: "", // 审批人
      signaturePopup: false, // 加签弹窗
      signatureValue: [], // 加签人
      attachmentUUIDs: "", // 上传附件
      attachmentNumber: 0,
      filePopup: false,
      clearFlagA: false,
      clearFlagC: false,
      clearFlagD: false,
      clearFlagB: false,
      tenantId: window.localStorage.tenantId,
      operateUrl: "", // 审批操作地址
      nextActId: "",
      showApprovalFlag: false
    };
  },
  computed: {
    params() {
      const param = {
        variables: [
          { name: "approveResult", value: "", "@class": "org.activiti.rest.service.api.engine.variable.RestVariable" },
          {
            name: "comment",
            value: this.auditOpinionRej,
            "@class": "org.activiti.rest.service.api.engine.variable.RestVariable"
          }
        ],
        carbonCopyUsers: this.supplierValue.length ? this.supplierValue.map((v) => v.employeeNum).toString() : null,
        assignee: null,
        attachmentUuid: this.attachmentUUIDs,
        action: "",
        comment: this.auditOpinionRej,
        jumpTarget: null,
        jumpTargetName: null,
        tenantId: this.tenantId,
      };

      const newParams = this.listData.map((item) => ({ ...item, ...param }));

      return newParams;
    },
    // 水滴筹二开-不想看到抄送  获取对应编码
    getTenantNum() {
      return window.localStorage.getItem("tenantNum") === "SRM-SDC";
    },
    approveManager() {
      return (item) => item.length && item.map((v) => v.name).join(",");
    }
  },
  watch: {
    value() {
      if (this.value) {
        this.auditOpinionRej = "";
        this.operateUrl = `/hwfp/v1/${storage.getItem("organizationId")}/runtime/batch-tasks`;
        this.attachmentUUIDs = uuid();
      }
    }
  },
  async mounted() {
    // const { content }= await this.getFileUUIDApi();
    // this.attachmentUUIDs = content;
  },
  methods: {
    // getFileUUIDApi() {
    //   const url = `/hfle/v1/${this.tenantId}/files/uuid`;
    //   return http.post(url);
    // },
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    // 抄送人弹窗
    // showSupplierPop() {
    //   this.supplierPopup = !this.supplierPopup;
    //   if (this.supplierPopup !== true) {
    //     this.clearFlagA = false;
    //   }
    // },
    // 获取抄送人值
    GetSupplier(val) {
      this.supplierValue = val.length ? val[0] : {};
    },
    //清除抄送的值
    clearSupplier() {
      this.supplierValue = "";
      this.clearFlagA = true;
    },
    //获取转交人
    getTransferManager(value) {
      this.transferValue = value.length ? value[0] : {};
    },
    //选择转交人
    selectTransferManager() {
      this.$lov("HPFM.EMPLOYEE", this.getTransferManager, {
        multiple: false,
        subDisplayField: "employeeNum",
        queryField:"name"
      });
    },
    // 选择抄送人
    selectCcManager() {
      this.$lov("HPFM.EMPLOYEE", this.getCcManager, {
        multiple: true,
        subDisplayField: "employeeNum",
        queryField:"name"
      });
    },
    //获取抄送人
    getCcManager(value) {
      this.supplierValue = value;
    },
    // 选择审批人
    selectApproveManager() {
      this.$lov("HPFM.EMPLOYEE", this.getApprovalManager, {
        multiple: true,
        subDisplayField: "employeeNum",
      });
    },
    //获取审批人值
    getApprovalManager(value) {
      this.approvalValue = value;
    },
    //清除审批人的值
    clearApproval() {
      this.approvalValue = "";
      this.clearFlagB = true;
    },
    // 转交弹窗
    showTransferPop() {
      this.transferPopup = !this.transferPopup;
      if (this.transferPopup !== true) {
        this.clearFlagC = false;
      }
    },
    //获取转交人值
    GetTransfer(val) {
      this.transferValue = val.length ? val[0] : {};
    },
    //清除转交人的值
    clearTransfer() {
      this.transferValue = "";
      this.clearFlagC = true;
    },
    // 加签人弹窗
    showSignaturePop() {
      this.signaturePopup = !this.signaturePopup;
      if (this.signaturePopup !== true) {
        this.clearFlagD = false;
      }
    },
    //获取加签人值
    GetSignature(val) {
      this.signatureValue = val || [];
    },
    //清除加签人的值
    clearSignature() {
      this.signatureValue = [];
      this.clearFlagD = true;
    },
    // 获取附件数量
    getAttachmentNumber(data) {
      this.attachmentNumber = data;
    },
    // 转交
    async transfer() {
      const verify = this.verify();
      const params = this.params;
      params.forEach((item) => {
        item.variables = [];
        item.assignee = this.transferValue.employeeNum;
        item.action = "delegate";
      });

      if (verify) {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.view.message.inDelegate").$D("正在转交中"),
          description: "",
          class: "notification"
        });
        this.$loading.show();
        http.post(this.operateUrl, params).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.delegateSuccess").$D("转交成功"),
              class: "notification",
              duration: 3
            });
            this.closePop();
            // this.$router.replace({ path: this.backRoutePath });
          }
        });
      }
    },
    // 加签
    async signature() {
      const verify = this.verify();
      const params = this.params;
      params.forEach((item) => {
        item.variables[0].value = "Approved";
        item.assignList = this.signatureValue.map((v) => v.employeeNum);
        item.action = "addSign";
      });

      if (verify) {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.view.message.inAddSign").$D("正在加签中"),
          description: "",
          class: "notification"
        });
        this.$loading.show();
        http.post(this.operateUrl, params).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.addSignSuccess").$D("加签成功"),
              class: "notification",
              duration: 3
            });
            this.closePop();
            // this.$router.replace({ path: this.backRoutePath });
          }
        });
      }
    },
    // 同意并加签
    async approvelSignature() {
      const verify = this.verify();
      const params = this.params;

      params.forEach((item) => {
        item.variables[0].value = "Approved";
        item.assignList = this.signatureValue.map((v) => v.employeeNum);
        item.action = "ApproveAndAddSign";
      });
      if (verify) {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.view.message.inApproveAndAddSign").$D("正在同意并加签中"),
          description: "",
          class: "notification",
          duration: 5
        });
        this.$loading.show();
        http.post(this.operateUrl, params).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.workFlow.view.message.approveAndAddSignSuccess").$D("同意并加签成功"),
              class: "notification",
              duration: 3
            });
            this.closePop();
            // this.$router.replace({ path: this.backRoutePath });
          }
        });
      }
    },
    // 验证输入
    verify() {
      if (!this.auditOpinionRej) {
        //如果没有填审批意见，给默认值
        if (this.type === "approvel" && !this.commentsRequired) {
          this.auditOpinionRej = this.$T("smbl.workFlow.view.form.approve").$D("审批同意");
        }
        if (this.type === "refuse") {
          this.auditOpinionRej = this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝");
        }
      }
      let temp = this.auditOpinionRej.trim();

      if (this.commentsRequired || this.type === "refuse") {
        if (!temp) {
          this.$notification.open({
            message: this.$T("hipspfm.workFlow.validation.message.rrmarkIsRequired").$D("审批意见为必填项"),
            description: "",
            class: "notification",
            duration: 3
          });
          return false;
        }
      }
      if (this.type === "transfer" && !this.transferValue.employeeId) {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.validation.message.delegateIsRequired").$D("转交人为必选项"),
          description: "",
          class: "notification",
          duration: 3
        });
        return false;
      }
      if (
        (this.type === "signature" || this.type === "approvelSignature") && !this.signatureValue.length) {
        this.$notification.open({
          message: this.$T("hipspfm.workFlow.validation.message.signatureIsRequired").$D("加签人为必选项"),
          description: "",
          class: "notification",
          duration: 3
        });
        return false;
      }

      return true;
    },
    // 关闭当前弹窗
    closePop() {
      this.$emit("input", false);
      this.auditOpinionRej = "";
      this.transferValue = "";
      this.supplierValue = "";
      this.approvalValue = "";
      this.signatureValue = [];
      this.attachmentUUIDs = "";
      this.attachmentNumber = 0;
      this.otherParams?.dataSet?.refresh();
    },
    // 校验表单数据
    verifyFormData(temp) {
      return temp;
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '../style/mixin.styl'
.supplier-container {
  position: relative;
  height: 100%;
  padding-bottom: calc(0px + constant(safe-area-inset-bottom));
  padding-bottom: calc(0px + env(safe-area-inset-bottom));

  .supplier-header {
    height: 48px;
    width: auto;
    margin-left: 20px;
    margin-right: 20px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    letter-spacing: 0.3px;
    line-height: 24px;

    .cancel {
      color: var(--color-font-default-b);
    }

    .approvel {
      color: var(--color-other-default-b);
    }

    .refuse {
      color: var(--color-other-default);
    }

    .transfer {
      color: var(--color-other-default-c);
    }
  }

  .scroll-wrap {
    height: 566px;
    overflow: auto;
  }

  .contentText {
    >>> .hips-textarea {
      position: static;
      padding: 6px 20px;
      border-bottom: 1px solid var(--color-border-default);
    }

    >>> .hips-textarea__label-value {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: var(--color-font-default);
      line-height: 26px;
      font-weight: bold;
    }

    >>> .hips-textarea__label {
      position: static;
    }

    >>> .hips-textarea__label--is-required:before {
      font-size: 18px;
      color: var(--color-other-default);
      line-height: 26px;
    }

    >>> .hips-textarea__body {
      height: 146px;
    }

    >>> .hips-textarea__input-value textarea {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: var(--color-font-default);
      letter-spacing: 0.7px;
      line-height: 28px;
    }

    >>> .hips-textarea__input-value textarea::-webkit-input-placeholder {
      bg_url(icon_editor)
      background-repeat: no-repeat;
      background-size: 20px 20px;
      color: var(--color-font-default-e);
      background-position-y: 3px;
    }

    >>> .hips-textarea__input-value textarea:-moz-placeholder {
      bg_url(icon_editor)
      background-repeat: no-repeat;
      color: var(--color-font-default-e);
      background-size: 20px 20px;
      background-position-y: 3px;
    }

    >>> .hips-textarea__input-value textarea::-moz-placeholder {
      bg_url(icon_editor)
      background-repeat: no-repeat;
      color: var(--color-font-default-e);
      background-size: 20px 20px;
      background-position-y: 3px;
    }

    >>> .hips-textarea__input-value textarea:-ms-input-placeholder {
      bg_url(icon_editor)
      background-repeat: no-repeat !important;
      color: var(--color-font-default-e);
      background-size: 20px 20px !important;
      background-position-y: 3px !important;
    }

    >>> .hips-textarea__input-value textarea::-ms-input-placeholder {
      bg_url(icon_editor)
      background-repeat: no-repeat;
      color: var(--color-font-default-e);
      background-size: 20px 20px;
      background-position-y: 3px;
    }

    >>> .hips-textarea__input-value textarea::placeholder {
      // bg_url(icon_editor)
      bg_url(icon_editor)
      background-repeat: no-repeat;
      color: var(--color-font-default-e);
      background-size: 20px 20px;
      background-position-y: 3px;
    }

    >>> .hips-textarea__error-message {
      display: none;
    }
  }

  .contentLov {
    padding: 0 20px;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 700;
      margin-top: 28px;

      span {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: var(--color-font-default);
        line-height: 26px;
      }
    }

    .supplier {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border-default);
      font-size: 16px;
      color: var(--color-font-default-b);
      // line-height: 34px;
      padding: 8px 0px 7px 0px;
      font-family: PingFangSC-Regular;

      .status-span {
        line-height: 24px;
      }

      .supplier-item {
        width: 265px;
        color: var(--color-font-default);
      }

      .delete {
        display: inline-block;
        margin-left: 4px;
        height: 12px;
        width: 12px;
        color: var(--color-font-default-e);
        position: relative;
        top: 1.5px;
      }
    }

    img {
      width: 24px;
      height: 24px;
    }
  }

  .contentAttachment {
    padding: 37px 20px 40px 20px;

    .attachmentBox {
      height: 68px;
      border: 2px solid var(--color-border-default);
      border-radius: 2px;
      display: flex;
      justify-content: space-between;

      & div:nth-child(1) {
        width: 215px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* flex-wrap: wrap; */
        flex-direction: column;
        padding: 12px 0;

        p {
          width: 165px;
        }

        p:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-font-default);
          line-height: 22px;
        }

        .noAttachment {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: var(--color-font-default-b);
          line-height: 20px;
        }

        .hasAttachment {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: var(--color-other-default-b);
          line-height: 20px;
        }
      }

      & div:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;

        span {
          width: 100%;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: var(--color-other-default-b);
          line-height: 22px;
          display: flex;
          justify-content: center;
          border-left: 2px solid var(--color-border-default);

          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}

>>> .hips-toast.is-placebottom {
  width: 355px;
  border-radius: 2px;

  div {
    padding: 14px 16px !important;
  }
}

>>> .hips-toast__text {
  text-align: left;
}
</style>
