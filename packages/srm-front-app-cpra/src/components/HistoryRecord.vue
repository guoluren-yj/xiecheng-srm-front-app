<template>
  <srm-popup
    :title="title?title:$T('hzero.common.status.history').$D('历史记录')"
    :visible="visible"
    position="bottom"
    rounded
    @onClose="$emit('input', false)">
    <srm-scroll height="100%" :refreshable="false">
      <history-record-tiled
        :remark-label="remarkLabel"
        :show-remark="showRemark"
        :loading="loading"
        :action-data="actionData"
        :operation-meaning-field-name="operationMeaningFieldName"
        :operator-field-name="operatorFieldName"
        :process-date-field-name="processDateFieldName"
        :process-remark-field-name="processRemarkFieldName"
        :process-remark-info-field-name="processRemarkInfoFieldName"
        :attachment-field-name="attachmentFieldName"
        :show-file-btn="showFileBtn"/>
    </srm-scroll>
  </srm-popup>
</template>

<script>

import HistoryRecordTiled from "@/components/HistoryRecordTiled";

export default {
  name: "HistoryRecord",
  components: { HistoryRecordTiled },
  modules: [ "hzero.common", "smbl.workFlow" ],
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false,
    },
    showRemark: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    actionData: {
      type: Array,
      default: () => []
    },
    operationMeaningFieldName: {
      type: String,
      default: "processOperationMeaning",
    },
    operatorFieldName: {
      type: String,
      default: "operator",
    },
    processDateFieldName: {
      type: String,
      default: "processDate",
    },
    processRemarkFieldName: {
      type: String,
      default: "processRemark",
    },
    processRemarkInfoFieldName: {
      type: String,
      default: "processRemarkInfo",
    },
    attachmentFieldName: {
      type: String,
      default: "attachmentUuid",
    },
    showFileBtn: {
      type: Boolean,
      default: false,
    },
    remarkLabel: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      recordList: {}
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    }
  },
};
</script>