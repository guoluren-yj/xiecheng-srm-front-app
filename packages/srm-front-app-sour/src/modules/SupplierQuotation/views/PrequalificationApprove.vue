<template>
  <div>
    <!-- 头信息 -->
    <srm-detail-head :data-source="prequalInfo" :columns="getDetailHeadColumns" />
    <div class="card">
      <customize-detail :columns="getColumns" :data-source="prequalInfo" />
    </div>
    <!-- 附件弹窗 -->
    <attached-file v-model="filePopup" :attachment-uuid="prequalAttachmentUuid" />

    <!-- 上传附件弹窗 -->
    <attached-file
      v-model="upLoadPopup"
      :can-upload="editFlag"
      :can-delete="editFlag"
      :attachment-uuid="validAttachmentUuid"/>
    <srm-bottom-handler
      v-if="editFlag"
      :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getPreQualInfo,
  getPrequalificationFile,
  submitPrequalificationApi,
} from "../api/index";
export default {
  modules: [
    "hipspfm.common",
    "hipspfm.supplierQuotation",
    "ssrc.supplierQuotation",
  ],
  name: "PrequalificationApprove",
  components: {
    AttachedFile
  },
  beforeRouteLeave(to, from, next) {
    // eslint-disable-next-line consistent-this
    const self = this;
    const newDate = JSON.stringify(self.prequalInfo);
    if (self.oldData === newDate) {
      next();
    } else {
      // eslint-disable-next-line rulesdir/no_hips
      self.$hips.dialog.confirm({
        closable: false,
        content: this.$T(
          "hipspfm.supplierQuotation.message.validation.haveChangeIsNotSave"
        ).$D("当前页面有更改，是否提交更改！"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.updateFlag = false;
          self.submit();
          next();
        },
        onCancel() {
          next();
        },
      });
    }
  },
  data() {
    return {
      prequalInfo: {},
      rfxHeaderId: "",
      supplierCompanyId: "",
      oldData: "", //旧数据
      updateFlag: false, //内容是否更改
      prequalAttachmentUuid: "", //资格预审文件
      validAttachmentUuid: "", //资格预审申请文件
      filePopup: false,
      upLoadPopup: false,
      prequalEndDate: "",
      operationMeaning: "",
      prequalLineStatusMeaning: "",
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          type:"primary",
          title: this.$T("hipspfm.common.button.submit").$D("提交"),
          // eslint-disable-next-line no-return-assign
          handler: this.submit,
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "prequalEndDate",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.prequalEndDate").$D("预审截止时间"),
        },
        {
          fieldCode: "reviewMethodMeaning",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.reviewMethod").$D("审查方式"),
        },
      ];

      return columns;
    },
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.examiner").$D("审查员"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.prequalLocation").$D("申请提交地点"),
          fieldCode: "prequalLocation",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.prequalFileExpense").$D("预审文件费"),
          fieldCode: "prequalFileExpense",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.qualifiedLimit").$D("合格上限"),
          fieldCode: "qualifiedLimit",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.prequalRemark").$D("资格预审备注"),
          fieldCode: "prequalRemark",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.prequalificationDocuments").$D("资格预审文件"),
          fieldCode: "pcName",
          render: () => <span style="color:blue"> {this.$T(
            "hipspfm.common.button.viewAttachments"
          ).$D("查看附件")} </span>,
          callBack: () => {
            this.showFilePop();
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.applicationFile").$D("申请文件"),
          fieldCode: "applicationAttachment",
          required: 1,
          render: () => {
            if (this.editFlag) {
              return <span style="color:blue"> {this.$T(
                "hipspfm.common.button.uploadAttachment"
              ).$D("上传附件")} </span>;
            }
            return <span style="color:blue"> {this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")} </span>;
          },
          callBack: () => {
            if (this.editFlag) {
              this.showUpFilePop();
            } else {
              this.showUpFilePop();
            }
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.applicationNotes").$D("申请说明"),
          fieldCode: "applicationRemark",
          fieldType: this.editFlag ? "INPUT" : "TEXT",
          placeholder: this.$T(
            "hipspfm.supplierQuotation.message.validation.handlerApplicationNotes"
          ).$D("请填写申请说明"),
          required: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.applicationNotes").$D("申请说明"),
          fieldCode: "applicationRemark",
          fieldType: this.editFlag ? "INPUT" : "TEXT",
          placeholder: this.$T(
            "hipspfm.supplierQuotation.message.validation.handlerApplicationNotes"
          ).$D("请填写申请说明"),
          required: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.applicationNotes").$D("申请说明"),
          fieldCode: "applicationRemark",
          fieldType: this.editFlag ? "INPUT" : "TEXT",
          placeholder: this.$T(
            "hipspfm.supplierQuotation.message.validation.handlerApplicationNotes"
          ).$D("请填写申请说明"),
          required: 1,
        },
      ];
      return columns;
    },
    editFlag() {
      const prequalEndDate = new Date(
        this.prequalEndDate ? this.prequalEndDate.replace(/-/g, "/") : ""
      ).getTime();
      const currentDate = new Date().getTime();
      if (
        prequalEndDate > currentDate &&
        this.operationMeaning !== "UNPARTICIPATED"
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    const {
      rfxHeaderId,
      operationMeaning,
      supplierCompanyId,
      prequalLineStatusMeaning,
    } = this.$route.query;
    this.rfxHeaderId = rfxHeaderId;
    this.operationMeaning = operationMeaning;
    this.supplierCompanyId = supplierCompanyId;
    this.prequalLineStatusMeaning = prequalLineStatusMeaning;
    this.getPreQual();
  },
  methods: {
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    showUpFilePop() {
      this.upLoadPopup = !this.upLoadPopup;
    },
    //获取预审信息
    getPreQual() {
      this.$loading.show();
      const params = {
        prequalCategory: "RFX",
      };
      getPreQualInfo(this.rfxHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res) {
          this.prequalInfo = res;
          console.log("res", res);
          this.prequalEndDate = res.prequalEndDate;
          this.validAttachmentUuid = res.validAttachmentUuid || uuid();
          // this.prequalInfo.validAttachmentUuid = this.validAttachmentUuid;
          this.prequalInfo.currentAttachmentUuid = this.validAttachmentUuid;
          this.oldData = JSON.stringify(res);
          this.prequalAttachmentUuid = res.prequalAttachmentUuid || uuid();
        }
      });
    },
    async submit() {
      // eslint-disable-next-line consistent-this
      const _this = this;

      // 判断是否有申请附件
      const fileList = await getPrequalificationFile(this.validAttachmentUuid);
      if (!fileList.length) {
        _this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.message.validation.handlerValidAttachmentUuid"
          ).$D("请先上传附件！"),
          description: "",
          key,
          class: "notification",
        });
        return false;
      }

      if (!_this.prequalInfo.applicationRemark) {
        _this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.message.validation.handlerApplicationRemark"
          ).$D("申请说明不能为空！"),
          description: "",
          key,
          class: "notification",
        });
        return false;
      }
      // 提交数据
      // _this.prequalInfo.delete['prequalAttachmentUuid'];
      delete _this.prequalInfo.prequalAttachmentUuid;
      const result = await submitPrequalificationApi(
        this.supplierCompanyId,
        _this.prequalInfo
      );
      if (result && result.failed) {
        _this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.submitFailed"
          ).$D("提交失败"),
          description: result.message,
          key,
          class: "notification",
        });
      } else {
        _this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.submitSuccessed"
          ).$D("提交成功"),
          description: "",
          key,
          class: "notification",
        });
        _this.getPreQual();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.card {
    width: 100%;
    height: 100vh;
    overflow: auto;
    color: #666666;
    padding: 0 15px 12px 15px;
    background: var(--color-bg-default);
  }
</style>
