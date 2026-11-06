<template>
  <srm-popup
    :title="title?title:$T('hzero.common.status.history').$D('操作记录')"
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

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

.srm-history-record-year {
  font-size: 12px;
  text-align: left;
  color: #afafaf;
  line-height: 16px;
  border-bottom 1px solid #f6f6f6;
  padding: 8px 0 8px 8px;
  margin-bottom 32px;
  padding-left 15px;
  background: white;
}

.srm-history-record-box {
}

.srm-history-record-item {
  padding 0 15px;
  display flex;
}

.srm-history-record-date {
  display flex;
  flex-direction column;
  align-items flex-end;
  justify-content flex-start;
  margin-top -3px;
  margin-right 8px;
}

.srm-history-record-month {
  font-size: 12px;
  color: #333333;
  text-align: right;
  line-height: 16px;
  width 100%;
  font-weight 600;
}

.srm-history-record-time {
  font-size: 10px;
  text-align: right;
  color: #333333;
  line-height: 12px;
  margin-top 2px;
  width 100%;
  font-weight normal;
}

.srm-history-record-operator {
  font-size 14px;
  font-weight 600;
  text-align: left;
  color: #333333;
  line-height: 20px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow hidden;
}

.srm-history-record-status {
  font-size: 14px;
  text-align: right;
  color: #276ef1;
  line-height: 20px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow hidden;
  font-weight 600;
}

.srm-history-record-remark {
  font-size: 12px;
  text-align: left;
  color: #757575;
  line-height: 16px;
  overflow hidden;
  margin-top 4px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom 6px;
  font-weight normal;
  // min-height 32px;
}

.srm-history-record-remark-info {
  margin-top: 8px;
}

>>> .srm-field-wrapper-container {
  margin-top: 0 !important;
}

.srm-history-record-item-content {
  position relative;
  flex: 1;
  border-left: 2px solid #F6F6F6;
  padding 0 0 22px 12px;
}

.srm-history-record-item-content::before {
  content: '';
  position: absolute;
  left -5px;
  top 0;
  display block;
  width 8px;
  height 8px;
  border-radius 4px;
  background $srm-theme-color-primary;
  z-index 1;
}

.srm-history-record-box :last-child {
  .srm-history-record-item-content {
    border 2px solid transparent !important;
  }
}

>>>.srm-popup-content {
  overflow hidden;
}
</style>
