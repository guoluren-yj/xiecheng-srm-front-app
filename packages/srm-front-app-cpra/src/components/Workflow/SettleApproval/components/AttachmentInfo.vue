<template>
  <div class="attachment-container">
    <srm-form
      :row-col-to-seq="true"
      class="attachment-form"
      :data-set="dataSet"
      :customize-code="isInvoice ? 'SMBL.WORKFLOW.SETTLE_APPROVAL.INV_ATTACHMENT_INFO' : 'SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_ATTACHMENT_INFO'"
      :columns="columns"/>
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
}
</style>
