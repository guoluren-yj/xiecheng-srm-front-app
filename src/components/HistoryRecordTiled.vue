<template>
  <div v-loading="loading" class="srm-history-record-content">
    <div v-if="actionData.length">
      <div v-for="(record, index) in recordList" :key="index" class="srm-history-record-box">
        <srm-flex v-show="index !== '-'" class="srm-history-record-year" justify="between">
          {{ index }}
          <div>
            <srm-tag v-if="record.length && record[0][approvalStrategyFieldName]" type="info" size="small" fill>
              {{ record[0][approvalStrategyFieldName] }}
            </srm-tag>
          </div>
        </srm-flex>
        <div v-for="(item, idx) in showAll ? record : record.slice(0, 3)" :key="idx" class="srm-history-record-item">
          <div class="srm-history-record-date">
            <span :class="['srm-history-record-month', {
              'srm-history-record-time-hide': item.month === '-'
            } ]">{{ item.month }}</span>
            <span :class="['srm-history-record-time', {
              'srm-history-record-time-hide': item.month === '-'
            } ]">{{ item.time }}</span>
          </div>
          <div class="srm-history-record-item-content">
            <div style="display: flex;justify-content: space-between;margin-top: -5px;align-items: center;">
              <div class="srm-history-record-operator">{{ item[operatorFieldName] || "-" }}</div>
              <div :class="['srm-history-record-status', ['-', undefined, null].includes(item[operationMeaningFieldName]['text']) ? '' : 'with-bg-color']">
                {{
                  item[operationMeaningFieldName]["text"]
                }}
              </div>
            </div>
            <div v-if="remarkLabel || item[processRemarkFieldName]">
              <srm-tooltip :title="item[processRemarkFieldName]">
                <div class="srm-history-record-remark" v-text="(remarkLabel || item[processRemarkFieldName] ? `${remarkLabel || $T('smbl.workFlow.view.approve.approveRemark').$D('审批意见')}：${item[processRemarkFieldName] || '-'}` : null)"/>
              </srm-tooltip>
            </div>
            <div v-if="item[processDurationFieldName]">
              <div class="srm-history-record-remark" v-text="`${$T('smbl.workFlow.view.approve.processDuration').$D('审批用时')}：${item[processDurationFieldName]|| '-'}`"/>
            </div>
            <srm-button v-if="item[attachmentFieldName]" size="small" icon="icon-paperclip" bordered>
              <srm-upload :attachment-uuid="item[attachmentFieldName]"
                          :desc-title="$T('smbl.workFlow.view.approve.attachment').$D('审批附件')"
                          :title="$T('smbl.workFlow.view.approve.uploadAttachment').$D('上传附件')"
                          :show-count="false"
                          :show-icon="false"
                          color="#276ef1"/>
            </srm-button>
            <div v-if="showFileBtn">
              <srm-button icon="icon-notes" size="small">
                <srm-upload
                  type="primary"
                  :show-icon="false"
                  :show-count="false"
                  :desc-title="item.type"
                  :attachment-uuid="item.rfxProcessAttachmentDTOS"/>
              </srm-button>
            </div>
            <div v-if="showRemark" class="srm-history-record-remark-info">
              <srm-textarea-field v-model="item[processRemarkInfoFieldName]" :disabled="true"/>
            </div>
          </div>
        </div>
        <srm-button
          v-if="!showAll && record.length > 3" class="srm-history-record-expand" full-width plain
          @click="showAll = true">
          {{ $T("smbl.common.button.expendHistoryRecord").$D("展开操作记录") }}
          <span class="srm-icon icon-chevrons-right"/>
        </srm-button>
        <srm-button
          v-if="showAll && record.length > 3" class="srm-history-record-expand" full-width plain
          @click="showAll = false">
          {{ $T("smbl.common.button.deExpendHistoryRecord").$D("收起操作记录") }}
          <span class="srm-icon icon-chevrons-left"/>
        </srm-button>
      </div>
    </div>
    <!-- platform-9045 直接传多语言 key，由 NoContent 组件内部统一翻译；传译文会被组件当作 key 二次翻译，英文环境落到中文兜底 -->
    <no-content v-else title="smbl.common.message.data.none"/>
  </div>
</template>

<script>

import NoContent from "srm-mobile-ui/packages/srm-list/NoContent";

export default {
  modules: [ "hzero.common", "smbl.workFlow", "smbl.common" ],
  name: "HistoryRecordTiled",
  components: { NoContent },
  props: {
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
    processDurationFieldName: {
      type: String,
      default: "processDuration",
    },
    processRemarkInfoFieldName: {
      type: String,
      default: "processRemarkInfo",
    },
    nodeNameFieldName: {
      type: String,
      default: "nodeName",
    },
    approvalStrategyFieldName: {
      type: String,
      default: "approvalStrategy",
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
      recordList: {},
      actionDataNameMap: {},
      showAll: false,
    };
  },
  watch: {
    actionData: {
      handler() {
        this.init();
      },
      immediate: true
    },
  },
  methods: {
    init() {
      this.recordList = {};
      this.actionData.forEach((data) => {
        const processDate = data[this.processDateFieldName] || "";
        const nodeName = data[this.nodeNameFieldName] || "-";
        const status = data[this.operationMeaningFieldName] || "-";
        if (typeof status !== "object") {
          data[this.operationMeaningFieldName] = {};
          data[this.operationMeaningFieldName]["text"] = status;
          data[this.operationMeaningFieldName]["type"] = "default";
        }
        const month = processDate.substring(5, 10) || "-";
        const time = processDate.substring(11) || "00:00:00";

        data.month = month;
        data.time = time;
        if (!this.recordList[nodeName]) {
          this.recordList[nodeName] = [];
        }
        this.recordList[nodeName].push(data);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

.srm-history-record-content {
  font-family: PingFangSC;
  font-weight: 600;
  height 100%;
  min-height 300px;
}

.srm-history-record-year {
  font-size: 12px;
  text-align: left;
  color: var(--font-color-default);
  line-height: 16px;
  border-bottom 1px solid var(--split-line-color-primary);
  padding: 8px 12px 8px 15px;
  background: var(--background-color-empty-second);

  .srm-tag {
    font-weight normal;
  }
}

.srm-history-record-box {
}

.srm-history-record-item {
  padding 0 15px;
  display flex;
}

.srm-history-record-item:nth-child(2) {
  margin-top 24px;
}

.srm-history-record-date {
  display flex;
  flex-direction column;
  align-items flex-end;
  justify-content flex-start;
  margin-top -3px;
  margin-right 8px;
  width: 73px;
}

.srm-history-record-month {
  font-size: 12px;
  color: var(--font-color-default);
  text-align: right;
  line-height: 16px;
  width 100%;
  font-weight 600;
}

.srm-history-record-time {
  font-size: 10px;
  text-align: right;
  color: var(--font-color-default);
  line-height: 12px;
  margin-top 2px;
  width 100%;
  font-weight normal;
}

.srm-history-record-time-hide {
  color transparent;
}

.srm-history-record-operator {
  flex-wrap: nowrap;
  flex: 1 1 70%;
  font-size 12px;
  font-weight 600;
  text-align: left;
  color: var(--font-color-default);
  line-height: 16px;
  text-overflow: ellipsis;
  overflow hidden;
}

.srm-history-record-status {
  display: block;
  white-space: nowrap;
  align-items: center;
  flex-wrap: nowrap;
  font-family: PingFangSC;
  font-size: 10px;
  text-align: right;
  line-height: 12px;
  text-overflow: ellipsis;
  padding: 2px;
  overflow hidden;
  font-weight 400;
  border-radius 2px;
  height: fit-content;
}

.srm-history-record-status.with-bg-color {
  background-color: #EEEEEE;
}

.srm-history-record-remark {
  font-size: 12px;
  text-align: left;
  color: #868D9C;
  line-height: 16px;
  overflow hidden;
  margin-top 4px;
  display: block;
  word-break break-all;
  text-overflow: ellipsis;
  width 100%;
  white-space:pre-wrap;
  font-weight: 400;
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
  border-left: 1px solid var(--split-line-color-primary);
  padding 0 0 22px 12px;
  width calc(100% - 64px)
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
  background var(--font-color-primary);
  z-index 1;
}

.srm-history-record-box :last-child {
  .srm-history-record-item-content {
    border 2px solid transparent !important;
  }
}

.srm-history-record-expand {
  height 32px !important;
  border-top var(--split-line-color-primary) solid 1px;
  border-bottom var(--split-line-color-primary) solid 1px;
}
</style>
