<template>
  <srm-popup
    :title="title || $T('smbl.workFlow.button.taskDetail.record').$D('审批记录')"
    :visible="visible"
    position="bottom"
    height="100%"
    rounded
    :show-close="showPopupClose"
    class="srm-history-record-popup"
    @onClose="$emit('input', false)">
    <slot slot="left" name="left" />
    <slot name="prompt" />
    <srm-collapse v-if="hasProcessForecast">
      <srm-collapse-item name="2" icon="abc">
        <srm-flex justify="between">
          <span v-text="$T('smbl.workFlow.view.previewProcessTitle').$D('流程预测(仅供参考，实际结果可能会根据配置改变)')" />
          <span v-if="showForecastRecord" @click="showForecastApproval">{{ $T("smbl.workFlow.button.collapse").$D("收起") }}</span>
          <span v-else @click="showForecastApproval">{{ $T("smbl.workFlow.button.expend").$D("展开") }}</span>
        </srm-flex>
      </srm-collapse-item>
    </srm-collapse>
    <div
      v-for="(historyList, historyListIdx) in displayApprovals"
      :key="historyListIdx"
      class="srm-history-record-content">
      <div v-for="(historyGroup, historyGroupIdx) in historyList.historicTaskExtList" :key="historyGroupIdx"
           class="approval-process-history">
        <div class="srm-history-process-box">
          <srm-flex justify="between">
            <span class="srm-history-node-name">
              {{ historyGroup[0].nodeName || historyGroup[0]._actionName_ || "-" }}
            </span>
            <div>
              <span v-if="historyGroup[0].actType === 'startEvent'" style="font-size: 10px;">
                {{ $T("hwfp.common.model.process.ID").$D("流程标识") }}：{{ historyGroup[0].processInstanceId || "-" }}
              </span>
              <srm-tag v-if="showModelStandardTime && !!historyGroup[0].modelStandardTime" bordered type="info" size="small">
                {{ $T("hwfp.common.view.message.current.preStage.modelStandardTime").$D("标准用时") }}：{{ historyGroup[0].modelStandardTime || "-" }}
              </srm-tag>
              <srm-tag v-if="historyGroup[0].approvalStrategy" bordered type="info" size="small">
                {{ historyGroup[0].approvalStrategy }}
              </srm-tag>
              <srm-tag v-if="historyGroup[0].nodeStatus" :type="actionColorMap[historyGroup[0].nodeStatusCode]"
                       size="small" fill
                       style="margin-left: 10px;">
                {{ historyGroup[0].nodeStatus }}
              </srm-tag>
            </div>
          </srm-flex>
        </div>
        <div>
          <div class="srm-history-record-box">
            <div v-for="(history, idx) in historyGroup" :key="idx" class="srm-history-record-item">
              <div class="srm-history-record-date" style="margin-top: -5px;">
                <span style="font-size: 12px" :class="['srm-history-record-month', {
                  'srm-history-record-time-hide': history.month === '-'
                } ]">{{ history.month !== '-' ? history.month : '0000-00-00' }}</span>
                <span style="font-size: 12px" :class="['srm-history-record-time', {
                  'srm-history-record-time-hide': history.month === '-'
                } ]">{{ history.time }}</span>
              </div>
              <div
                :class="['srm-history-record-item-content', {
                  'srm-history-record-item-content-green': ['APPROVED', 'APPROVEANDADDSIGN'].includes(history._actionCode_),
                  'srm-history-record-item-content-red': 'REJECTED' === history._actionCode_,
                  'srm-history-record-item-content-lime': ['COMMENT', 'REPLY'].includes(history._actionCode_),
                  'srm-history-record-item-content-primary': ['Pending', 'Approving'].includes(history.nodeStatusCode),
                }]">
                <div style="display: flex;justify-content: space-between;margin-top: -5px;align-items: center;">
                  <div class="srm-history-record-operator">
                    {{ history.assigneeName || "-" }}
                    <span v-if="['APPROVED', 'APPROVEANDADDSIGN'].includes(history._actionCode_)"
                          class="srm-icon icon-check" style="color: rgb(5, 148, 79);" />
                  </div>
                  <span :class="['srm-history-record-status', ['-', undefined, null].includes(history._actionName_) ? '' : 'with-bg-color']">{{
                    history._actionName_ }}</span>
                </div>
                <div v-if="history.comment">
                  <srm-tooltip :title="history.comment || '-'">
                    <div
                      v-if="history.isReply"
                      class="srm-history-record-remark"
                      v-text="`${$T('smbl.workFlow.view.approve.repplyContent').$D('回复内容')}：${history.comment || '-'}`"/>
                    <div
                      v-else-if="history.actType==='CommentCarbonCopy'"
                      class="srm-history-record-remark"
                      v-text="`${$T('smbl.workFlow.view.approve.commentContent').$D('评论内容')}：${history.comment || '-'}`"/>
                    <div
                      v-else
                      class="srm-history-record-remark"
                      v-text="`${$T('smbl.workFlow.view.approve.approveRemark').$D('审批意见')}：${history.comment || '-'}`"/>
                  </srm-tooltip>
                </div>
                <comment-images
                  v-if="history.attachmentUuid"
                  :attachment-uuid="history.attachmentUuid" />
                <div v-if="history.approveDuration">
                  <div class="srm-history-record-remark"
                       v-text="`${$T('smbl.workFlow.view.approve.processDuration').$D('审批用时')}：${history.approveDuration || '-'}`"/>
                </div>
                <div style="padding: 5px 0;">
                  <srm-attachment-button
                    style="display: inline"
                    size="small"
                    show-total
                    :attachments="[{
                      uploadButton: 'none',
                      readonly: true,
                      attachmentUuid: history.attachmentUuid
                    }]"/>
                  <a
                    v-if="history.commentReplyFlag ===1"
                    style="color: #276EF1;font-size: 14px;line-height: 16px; margin-left: 10px;"
                    @click="showReplyRecordPopup(history)">
                    {{ $T('hzero.common.button.reply').$D('回复') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </srm-popup>
</template>

<script>
import { SrmUtil } from "srm-mobile-ui";
import CommentImages from "./CommentImages";

export default {
  modules: [ "hwfp.common", "hzero.common", "smbl.workFlow" ],
  name: "ApprovalHistory",
  components: { CommentImages },
  props: {
    title: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false,
    },
    historyApproval: {
      type: Array,
      default: () => []
    },
    forecastApproval: {
      type: Array,
      default: () => []
    },
    hasProcessForecast: {
      type: Boolean,
      default: false,
    },
    showPopupClose: {
      type: Boolean,
      default: true,
    },
    forecastUnfold: {
      type: Boolean,
      default: false,
    },
    showModelStandardTime: {
      type: Boolean,
      default: false,
    },
    showReplyRecordPopup: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      visible: false,
      statusMap: {},
      colorMap: {
        "REJECTED": "danger",
        "APPROVED": "success",
        "APPROVAL": "info",
        "SUSPENDED": "info",
        "STOP": "info",
        "REVOKE": "info",
      },
      actionMeaningMap: {},
      actionColorMap: {
        Approved: "success",
        Rejected: "danger",
        Delegate: "info",
        AddSign: "info",
        ApproveAndAddSign: "info",
        Approving: "warn",
        Pending: "primary",
      },
      actionCodeColorMap: {
        APPROVED: "#05944f",
        REJECTED: "#e11900",
        APPROVEANDADDSIGN: "#05944f",
      },
      historyRecord: [],
      forecastRecord: [],
      showForecastRecord: false,
    };
  },
  computed: {
    displayApprovals() {
      const result = [
        ...this.forecastRecord,
        ...this.historyRecord,
      ];
      return result;
    },
    initAndExpand() {
      return {
        value: this.value,
        forecastUnfold: this.forecastUnfold,
      };
    },
  },
  watch: {
    initAndExpand(val) {
      this.visible = val.value;
      if (val.forecastUnfold) {
        this.showForecastRecord = true;
      }
      if (val.value) {
        this.init();
      }
    },
  },
  mounted() {
    SrmUtil.getValueSetBatch({
      statusMap: "HWFP.PROCESS_APPROVE_STATUS",
      actionMeaningMap: "HWFP.APPROVAL.ACTION"
    }, this);
  },
  methods: {
    showForecastApproval() {
      this.showForecastRecord = !this.showForecastRecord;
      this.init();
    },
    groupBy(array, f) {
      let groups = {};
      array.forEach(function (o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },
    arrayGroupBy(list, groupId) {
      return this.groupBy(list, (item) => [ item[groupId] ]);
    },
    getNodeAction(node) {
      if (node.actType === "CommentCarbonCopy") {
        return {
          actionCode: "COMMENT",
          actionName:  this.$T("hzero.common.text.comment").$D("评论"),
        };
      } else if (node.action) {
        let actionCode = null;
        let actionName = null;
        switch (node.action.toUpperCase()) {
        case "STARTDELEGATEEVENT":
          actionCode = "STARTDELEGATEEVENT";
          actionName = this.$T("hzero.common.text.startDelegete").$D("申请人转交");
          break;
        case "APPROVED":
          actionCode = "APPROVED";
          actionName = this.$T("hzero.common.status.agree").$D("同意");
          break;
        case "REJECTED":
          actionCode = "REJECTED";
          actionName = this.$T("hzero.common.status.reject").$D("拒绝");
          break;
        case "ADDSIGN":
          actionCode = "ADDSIGN";
          actionName = this.$T("hzero.common.status.addSign").$D("加签");
          break;
        case "APPROVEANDADDSIGN":
          actionCode = "APPROVEANDADDSIGN";
          actionName = this.$T("hzero.common.status.ApproveAndAddSign").$D("同意并加签");
          break;
        case "DELEGATE":
          actionCode = "DELEGATE";
          actionName = this.$T("hzero.common.status.delegate").$D("转交");
          break;
        case "JUMP":
          actionCode = "JUMP";
          actionName = this.$T("hzero.common.status.jump").$D("驳回");
          break;
        case "RECALL":
          actionCode = "RECALL";
          actionName = this.$T("hzero.common.status.recall").$D("撤回");
          break;
        case "REVOKE":
          actionCode = "REVOKE";
          actionName = this.$T("hzero.common.status.revoke").$D("撤销");
          break;
        case "AUTODELEGATE":
          actionCode = "AUTODELEGATE";
          actionName = this.$T("hzero.common.status.autoDelegate").$D("自动转交");
          break;
        case "CARBONCOPY":
          actionCode = "CARBONCOPY";
          actionName = this.$T("hzero.common.status.carbonCopy").$D("抄送");
          break;
        case "AUTOCARBONCOPY":
          actionCode = "CARBONCOPY";
          actionName = this.$T("hzero.common.status.autocarboncopy").$D("自动抄送");
          break;
        case "SPECIFY":
          actionCode = "SPECIFY";
          actionName = this.$T("hzero.common.status.specify").$D("指定");
          break;
        case "STOP":
          actionCode = "STOP";
          actionName = this.$T("hzero.common.status.stop").$D("终止");
          break;
        default:
          break;
        }
        return { actionCode, actionName };
      }
      return {};
    },
    transformHistoryData(historicTaskList = [], isForecast = false) {
      const result = [];
      historicTaskList.forEach((historicTask) => {
        const item = { ...historicTask };
        item.nodeId = item.processInstanceId;
        item.nodeName = item.name || this.getNodeNameByActType(item.actType);
        if (item.actType === "startEvent") {
          item.nodeName = this.$T("hwfp.common.status.submitApproval").$D("提交审批");
        }
        const { actionCode, actionName } = this.getNodeAction(item);
        item._actionCode_ = actionCode;
        item._actionName_ = actionName;
        item.processDuration = item.approveDuration;
        item.nodeStatus = item.nodeStatus && item.nodeStatus.trim();
        if (!item.action && ![ "startEvent", "endEvent", "CommentCarbonCopy" ].includes(item.actType)) {
          if (isForecast) {
            item.nodeStatus = this.$T("hwfp.common.view.title.pending").$D("待审批");
            item.nodeStatusCode = "Pending";
          } else {
            item.nodeStatus = this.$T("hwfp.common.view.message.approvaling").$D("审批中");
            item.nodeStatusCode = "Approving";
          }
        }
        if (item.actType === "CommentCarbonCopy" && item.commentRemindEmpNameList && item.commentRemindEmpNameList.length) {
          item.comment = `${item.commentRemindEmpNameList.join(",")} ${item.comment}`;
        }
        result.push(item);
      });
      return result.reverse();
    },
    getNodeNameByActType(actType) {
      if (actType === "startEvent") {
        return this.$T("hwfp.common.status.submitApproval").$D("提交审批");
      } else if (actType === "endEvent") {
        return this.$T("hwfp.common.status.end").$D("结束");
      } else if (actType === "ommentCarbonCopy") {
        return this.$T("hzero.common.text.comment").$D("评论");
      }
      return "";
    },
    init() {
      this.historyRecord = [];
      this.forecastRecord = [];
      if (this.forecastApproval.length && this.showForecastRecord) {
        // 预测流程审批
        const forecastList = this.transformHistoryData(this.forecastApproval, true) || [];
        const forecastMap = {}; // 更改结构为对象，便于查询
        const forecastKeys = []; // 记录对象key的顺序
        forecastList.forEach((e) => {
          e.month = "-";
          e.time = "00:00:00";
          if (!forecastMap[e.taskDefinitionKey]) {
            forecastKeys.push(e.taskDefinitionKey);
            forecastMap[e.taskDefinitionKey] = [];
          }
          forecastMap[e.taskDefinitionKey].push(e);
        });
        if (forecastKeys.length) {
          const displayForecast = [];
          forecastKeys.forEach((key) => {
            displayForecast.push(forecastMap[key]);
          });
          this.forecastRecord = [ {
            historicTaskExtList: displayForecast,
          } ];
        }
      }

      this.historyApproval.forEach((e) => {
        const item = { ...e };
        item.historicTaskExtList = this.transformHistoryData(item.historicTaskExtList) || [];

        let newList = [];
        let tempList = [];
        item.historicTaskExtList.forEach((data, index) => {
          const processDate = data.endTime || "";

          const month = processDate.substring(0, 10) || "-";
          const time = processDate.substring(11) || "00:00:00";

          data.month = month;
          data.time = time;
          const preItem = item.historicTaskExtList[index - 1];
          if (!preItem || data.taskDefinitionKey !== preItem.taskDefinitionKey || data.actType === "CommentCarbonCopy") {
            tempList = [ data ];
            if (data.commentRecordList) {
              tempList.push(
                ...data.commentRecordList.map((commentRecord) => ({
                  ...commentRecord,
                  assigneeName: `${commentRecord.employeeName || ""}`,
                  month: (commentRecord.creationDate || "").substring(0, 10) || "-",
                  time: (commentRecord.creationDate || "").substring(11) || "00:00:00",
                  isReply: true,
                  _actionCode_: "REPLY",
                  _actionName_: this.$T("hzero.common.view.label.reply").$D("回复"),
                }))
              );
            }
            newList.push(tempList);
          } else {
            tempList.push(data);
            if (data.commentRecordList) {
              tempList.push(...data.commentRecordList);
            }
          }
        });
        item.historicTaskExtList = newList;
        this.historyRecord.push(item);
      });
      // 若多次提交审批，去掉中间的结束
      let submitTimes = 0;
      this.historyRecord.forEach((record, index) => {
        const { historicTaskExtList } = record;
        if (historicTaskExtList &&
          historicTaskExtList.length &&
          historicTaskExtList[historicTaskExtList.length - 1] &&
          historicTaskExtList[historicTaskExtList.length - 1][0] &&
          historicTaskExtList[historicTaskExtList.length - 1][0].actType === "startEvent") {
          submitTimes += 1;
        }
        if (submitTimes > 1 && index !== 0) {
          record.historicTaskExtList = historicTaskExtList.map((item) => {
            if (item[0] && item[0].actType === "endEvent") {
              return item.filter((i) => i.actType !== "endEvent");
            }
            return item;
          }).filter((i) => i.length);
        }
      });
    },
    openForecastAction() {
      this.showForecastFlag = !this.showForecastFlag;
    },
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

.srm-history-record-content {
  font-family: PingFangSC;
  font-weight: 600;
}

.srm-history-record-year {
  margin-bottom 32px;
  border-bottom 1px solid #f6f6f6;
}

.srm-history-record-box {
  border-bottom 1px solid #f6f6f6;
  padding-top 16px;
}

.srm-history-record-time-hide {
  color transparent !important;
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
  margin-top -5px;
  margin-right 12px;
  width: 73px;
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
  flex-wrap: nowrap;
  flex: 1 1 70%;
  font-size 12px;
  font-weight 600;
  text-align: left;
  color: var(--font-color-default);
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin-left: 8px;
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
  border-left: 1px solid #F6F6F6;
  padding 0 0 22px 12px;
  width calc(100% - 64px);
  min-width: 0;
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
  background #cbcbcb;
  z-index 1;
}
.srm-history-record-item-content-green::before {
  background: #05944F;
}
.srm-history-record-item-content-red::before {
  background: #E64322;
}
.srm-history-record-item-content-lime::before {
  background: #36C2CF;
}
.srm-history-record-item-content-primary::before {
  background $srm-theme-color-primary;
}

.srm-history-process-box {
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

.srm-history-node-name {
}

.srm-history-process-time {
  font-size 12px;
  color #797979;
}

.srm-history-process-toggle {
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;

  .srm-icon {
    display inline-block;
    transition all .3s ease;
  }
}

.srm-history-record-popup {
  >>> .srm-popup-header .srm-popup-header-back {
    width: auto;
  }
  >>> .srm-collapse-title {
    min-height: 8.206vw;
    font-size: 12px;
    color: #276EF1;
    text-align: center;
    line-height: 16px;
    font-weight: 500;
  }
}
</style>
<style lang="stylus" scoped>
@media screen and (orientation: landscape) {
  .srm-history-record-popup {
    >>> .srm-popup-header {
      font-size: 2vw;
      height: 6vw;
    }
    >>> .srm-popup-content {
      height: calc(100% - 6vw) !important;
    }
    >>> .srm-popup-header .srm-popup-header-close .srm-icon {
      font-size: 2vw !important;
    }
    >>> .srm-popup-header-title {
      font-size: 2vw !important;
      height: 6vw !important;
    }
    >>> .srm-popup-header-close {
      height: 4vw !important;
      width: 4vw !important;
    }
    >>> .srm-collapse-title {
      height: 4.2vw;
      min-height: 4.2vw;
      font-size: 1.5vw !important;
    }
    .srm-history-process-box {
      font-size: 1.5vw;
      padding: 1vw 4vw;
      line-height: 2.5vw;
    }
    .srm-history-record-box {
      padding-top: 1vw;
    }
    .srm-history-record-item-content {
      padding: 0 0 0 3.2vw;
    }
    .srm-history-record-operator {
      line-height: 3vw;
      font-size: 1.5vw;
      >>> .srm-icon {
        font-size: 2vw;
      }
    }
    >>> .srm-button {
      font-size: 1.5vw;
    }
    >>> .srm-tag {
      font-size: 1.5vw;
      padding: 0 1vw;
      line-height: 2vw;
    }
    .srm-history-record-month {
      line-height: 3vw;
    }
    .srm-history-record-remark {
      font-size: 1.5vw;
      line-height: 2vw;
    }
    .srm-history-record-status {
      font-size: 1.5vw;
      line-height: 2vw;
    }
  }
}
</style>