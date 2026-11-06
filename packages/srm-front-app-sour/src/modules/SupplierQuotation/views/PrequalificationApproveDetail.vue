<template>
  <div style="height: 100vh; overflow: auto;">
    <!-- 头信息 -->
    <srm-detail-head :data-source="prequalInfo" :columns="getDetailHeadColumns" />
    <div style="padding: 0 15px 12px 15px;">
      <customize-detail :columns="getColumns" :data-source="prequalInfo" />
    </div>
    <!-- 附件弹窗 -->
    <attached-file v-model="filePopup" :attachment-uuid="prequalAttachmentUuid" />

    <!-- 上传附件弹窗 -->
    <attached-file
      v-model="upLoadPopup"
      :can-upload="false"
      :can-delete="false"
      :attachment-uuid="validAttachmentUuid"/>
  </div>
</template>

<script>
import uuid from "uuid";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getPreQualInfo,
} from "../api/index";
export default {
  modules: [
    "hipspfm.common",
    "hipspfm.supplierQuotation",
    "ssrc.supplierQuotation",
  ],
  name: "PrequalificationApproveDetail",
  components: {
    AttachedFile
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
          render: () => {
            return <span style="color:blue"> {this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")} </span>;
          },
          callBack: () => {
            this.showUpFilePop();
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.applicationNotes").$D("申请说明"),
          fieldCode: "applicationRemark",
        },
      ];
      return columns;
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
          this.prequalEndDate = res.prequalEndDate;
          this.validAttachmentUuid = res.validAttachmentUuid || uuid();
          // this.prequalInfo.validAttachmentUuid = this.validAttachmentUuid;
          this.prequalInfo.currentAttachmentUuid = this.validAttachmentUuid;
          this.oldData = JSON.stringify(res);
          this.prequalAttachmentUuid = res.prequalAttachmentUuid || uuid();
        }
      });
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
