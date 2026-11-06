<template>
  <div v-loading="loading" class="srm-history-record-content">
    <div v-if="actionData.length">
      <div
        v-for="(record, index) in recordList"
        :key="index"
        class="srm-history-record-box">
        <srm-flex
          v-show="index !== '-'"
          class="srm-history-record-year"
          justify="between">
          {{ index }}
          <div>
            <srm-tag
              v-if="record.length && record[0][approvalStrategyFieldName]"
              type="info"
              size="small"
              fill>
              {{ record[0][approvalStrategyFieldName] }}
            </srm-tag>
          </div>
        </srm-flex>
        <div
          v-for="(item, idx) in showAll ? record : record.slice(0, 3)"
          :key="idx"
          class="srm-history-record-item">
          <div class="srm-history-record-date">
            <span class="srm-history-record-month">{{ item.month }}</span>
            <span class="srm-history-record-time">{{ item.time }}</span>
          </div>
          <div class="srm-history-record-item-content">
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-top: -5px;
              ">
              <srm-tooltip :title="item[operatorFieldName]" style="width:60px" placement="top">
                <div class="srm-history-record-operator">
                  {{ item[operatorFieldName] || "-" }}
                </div>
              </srm-tooltip>

              <srm-tooltip
                :title="item[operationMeaningFieldName]['text']"
                placement="top">
                <srm-button
                  plain
                  :type="item[operationMeaningFieldName]['type']"
                  class="srm-history-record-status">
                  {{ item[operationMeaningFieldName]["text"] }}
                </srm-button>
              </srm-tooltip>

              <srm-tooltip
                :title="css(item.objectVersionNumber)"
                placement="top">
                <div
                  v-if="item.objectVersionNumber"
                  class="srm-history-record-operator">
                  {{ $T('smbl.workFlow.view.approve.inplace').$D('刊位:')+textCount(item.objectVersionNumber) }}
                </div>
              </srm-tooltip>
            </div>
            <div v-if="remarkLabel || item[processRemarkFieldName]">
              <srm-tooltip :title="item[processRemarkFieldName]">
                <div
                  class="srm-history-record-remark"
                  v-text="
                    remarkLabel || item[processRemarkFieldName]
                      ? `${
                        remarkLabel ||
                        $T('smbl.workFlow.view.approve.approveRemark').$D(
                          '审批意见'
                        )
                      }：${item[processRemarkFieldName] || '-'}`
                      : null
                  "/>
              </srm-tooltip>
            </div>
            <srm-button
              v-if="item[attachmentFieldName]"
              size="small"
              icon="icon-paperclip"
              bordered>
              <srm-upload
                :attachment-uuid="item[attachmentFieldName]"
                :desc-title="
                  $T('smbl.workFlow.view.approve.attachment').$D('审批附件')
                "
                :title="
                  $T('smbl.workFlow.view.approve.uploadAttachment').$D(
                    '上传附件'
                  )
                "
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
              <srm-textarea-field
                v-model="item[processRemarkInfoFieldName]"
                :disabled="true"/>
            </div>
          </div>
        </div>
        <srm-button
          v-if="!showAll && record.length > 3"
          class="srm-history-record-expand"
          full-width
          plain
          @click="showAll = true">
          {{ $T("smbl.common.button.expendHistoryRecord").$D("展开操作记录") }}
          <span class="srm-icon icon-chevrons-right" />
        </srm-button>
        <srm-button
          v-if="showAll && record.length > 3"
          class="srm-history-record-expand"
          full-width
          plain
          @click="showAll = false">
          {{
            $T("smbl.common.button.deExpendHistoryRecord").$D("收起操作记录")
          }}
          <span class="srm-icon icon-chevrons-left" />
        </srm-button>
      </div>
    </div>
    <no-content
      v-else
      :title="$T('smbl.common.message.data.none').$D('暂无数据')"/>
  </div>
</template>

<script>
import NoContent from "srm-mobile-ui/packages/srm-list/NoContent";
import { $T } from "srm-mobile-ui";

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
      default: () => [],
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
      immediate: true,
    },
  },
  methods: {
    textCount(val) {
      return `第${val}次`;
    },
    css(val) {
      return $T("smbl.common.message.data.inplace").$D("刊位:") + `第${val}次`;
    },
    init() {
      this.recordList = {};
      this.actionData.forEach((data) => {
        const processDate = data[this.processDateFieldName];
        const nodeName = data[this.nodeNameFieldName] || "-";
        const status = data[this.operationMeaningFieldName] || "-";
        if (typeof status !== "object") {
          data[this.operationMeaningFieldName] = {};
          data[this.operationMeaningFieldName]["text"] = status;
          data[this.operationMeaningFieldName]["type"] = "primary";
        }
        if (processDate && processDate.length > 18) {
          //const year = processDate.substring(0, 4);
          const month = processDate.substring(5, 10);
          const time = processDate.substring(11);

          data.month = month;
          data.time = time;
          if (!this.recordList[nodeName]) {
            this.recordList[nodeName] = [];
          }
          this.recordList[nodeName].push(data);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~srm-mobile-ui/src/style/var.styl';

.srm-history-record-content {
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  height: 100%;
  min-height: 300px;
}

.srm-history-record-year {
  font-size: 12px;
  text-align: left;
  color: var(--font-color-default);
  line-height: 16px;
  border-bottom: 1px solid var(--split-line-color-primary);
  padding: 8px 12px 8px 15px;
  background: var(--background-color-empty-second);

  .srm-tag {
    font-weight: normal;
  }
}

.srm-history-record-box {
}

.srm-history-record-item {
  padding: 0 15px;
  display: flex;
}

.srm-history-record-item:nth-child(2) {
  margin-top: 24px;
}

.srm-history-record-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: -3px;
  margin-right: 8px;
}

.srm-history-record-month {
  font-size: 12px;
  color: var(--font-color-default);
  text-align: right;
  line-height: 16px;
  width: 100%;
  font-weight: 600;
}

.srm-history-record-time {
  font-size: 10px;
  text-align: right;
  color: var(--font-color-default);
  line-height: 12px;
  margin-top: 2px;
  width: 100%;
  font-weight: normal;
}

.srm-history-record-operator {
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: var(--font-color-default);
  line-height: 20px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
}

.srm-history-record-status {
  font-size: 14px;
  text-align: right;
  line-height: 20px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
  font-weight: 600;
  height: auto;
  border-radius: 0;
}

.srm-history-record-remark {
  font-size: 12px;
  text-align: left;
  color: #757575;
  line-height: 16px;
  overflow: hidden;
  margin-top: 4px;
  display: block;
  word-break: break-all;
  text-overflow: ellipsis;
  width: 100%;
  white-space: pre-wrap;
}

.srm-history-record-remark-info {
  margin-top: 8px;
}

>>> .srm-field-wrapper-container {
  margin-top: 0 !important;
}

.srm-history-record-item-content {
  position: relative;
  flex: 1;
  border-left: 2px solid var(--split-line-color-primary);
  padding: 0 0 22px 12px;
  width: calc(100% - 64px);
}

.srm-history-record-item-content::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 0;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--font-color-primary);
  z-index: 1;
}

.srm-history-record-box :last-child {
  .srm-history-record-item-content {
    border: 2px solid transparent !important;
  }
}

.srm-history-record-expand {
  height: 32px !important;
  border-top: var(--split-line-color-primary) solid 1px;
  border-bottom: var(--split-line-color-primary) solid 1px;
}
</style>
