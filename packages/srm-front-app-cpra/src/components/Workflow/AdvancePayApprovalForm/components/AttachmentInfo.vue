<template>
  <div class="attachment-container">
    <srm-form
      :row-col-to-seq="true"
      class="attachment-form"
      :data-set="dataSet"
      customize-code="SMBL.WORKFLOW.ADVANCE_PAY.ATTACHMENT"
      :columns="columns"/>
    <div class="attachment-footer" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "smbl.common" ],
  name: "AttachmentInfo",
  props: {
    dataSet: {
      type: Object,
      default: () => new DataSet({}),
    },
    directory: {
      type: String,
      default: "",
    },
    isInvoice: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    columns() {
      return [
        {
          fieldCode: "attachmentUuid",
          fieldName: this.$T("smbl.common.button.viewAttachment").$D("查看附件"),
          fieldType: "UPLOAD",
          formRow: 10,
          showCount: true,
          bucketName: "private-bucket",
          directory: this.directory,
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>
.attachment-container {
  .attachment-form {
    min-height: 58px;
    padding: 0;
  }
  .attachment-footer {
    height: 30px; // 兼容下客户OA系统嵌套底部遮挡情况
    background-color: var(--background-color-empty-second);
  }
}
</style>
