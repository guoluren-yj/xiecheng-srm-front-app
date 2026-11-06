<template>
  <srm-popup
    :title="$T('hwfp.common.model.approval.history').$D('审批历史')"
    :visible="visible"
    position="bottom"
    rounded
    @onClose="$emit('input', false)">
    <div class="srm-history-record-content">
      <div v-for="(history, historyIdx) in historyApproval" :key="historyIdx" class="approval-process-history">
        <div class="srm-history-process-box" @click="toggleVisible(history)">
          <srm-flex justify="between">
            <span class="srm-history-process-id">
              {{ $T("hwfp.common.model.process.ID").$D("流程标识") }}：{{ history.id || "-" }}
            </span>
            <srm-button plain size="mini" :type="colorMap[history.processStatus]" class="srm-history-process-status">
              {{ statusMap[history.processStatus] || history.processStatus || "-" }}
            </srm-button>
          </srm-flex>
          <srm-flex justify="between" style="margin-top: 4px;">
            <span class="srm-history-process-time">{{ `${history.startTime}~${history.endTime}` }}</span>
            <div class="srm-history-process-toggle">
              <span v-if="detailVisible[history.id]">{{ $T("smbl.workFlow.button.expend").$D("展开") }}</span>
              <span v-else>{{ $T("smbl.workFlow.button.collapse").$D("收起") }}</span>
              <em class="srm-icon icon-chevron-up"
                  :style="{ transform: detailVisible[history.id] ? 'rotateZ(180deg)' : 'rotateZ(0deg)' }"/>
            </div>
          </srm-flex>
        </div>
        <div v-if="!detailVisible[history.id]">
          <div v-for="(record, index) in recordList[history.id]" :key="index" class="srm-history-record-box">
            <div class="srm-history-record-year"/>
            <div v-for="(item, idx) in record" :key="idx" class="srm-history-record-item">
              <div class="srm-history-record-date">
                <span class="srm-history-record-month">{{ item.month }}</span>
                <span class="srm-history-record-time">{{ item.time }}</span>
              </div>
              <div class="srm-history-record-item-content">
                <div style="display: flex;justify-content: space-between;margin-top: -5px;">
                  <div class="srm-history-record-operator">{{ item.assigneeName || "-" }}</div>
                  <div class="srm-history-record-status">{{ item.name || "-" }}</div>
                </div>
                <div class="srm-history-record-remark">
                  {{ item.comment || "-" }}
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

export default {
  modules: [ "hwfp.common", "hzero.common", "smbl.workFlow" ],
  name: "ApprovalHistory",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    historyApproval: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      visible: false,
      recordList: {},
      detailVisible: {},
      statusMap: {
        "REJECTED": this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
        "APPROVED": this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
        "APPROVAL": this.$T("smbl.workFlow.view.status.approval").$D("审批中"),
        "SUSPENDED": this.$T("smbl.workFlow.view.status.suspend").$D("挂起中"),
        "STOP": this.$T("smbl.workFlow.view.status.stop").$D("终止"),
        "REVOKE": this.$T("smbl.workFlow.view.status.revoke").$D("撤销"),
      },
      colorMap: {
        "REJECTED": "danger",
        "APPROVED": "success",
        "APPROVAL": "info",
        "SUSPENDED": "info",
        "STOP": "info",
        "REVOKE": "info",
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.init();
      }
    }
  },
  methods: {
    toggleVisible(history) {
      this.$set(this.detailVisible, history.id, !this.detailVisible[history.id]);
    },
    init() {
      this.recordList = {};
      this.historyApproval.forEach((e) => {
        const processId = e.id;

        if (!this.recordList[processId]) {
          this.recordList[processId] = {};
        }
        e.historicTaskExtList && e.historicTaskExtList.forEach((data) => {
          const processDate = data.startTime;

          if (processDate && processDate.length > 18) {
            const year = processDate.substring(0, 4);
            const month = processDate.substring(5, 10);
            const time = processDate.substring(11);

            data.month = month;
            data.time = time;
            if (!this.recordList[processId][year]) {
              this.recordList[processId][year] = [];
            }
            this.recordList[processId][year].push(data);
          }
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

.srm-history-record-content {
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  height 100%;
  overflow-y scroll;
}

.srm-history-record-year {
  margin-bottom 32px;
  border-bottom 1px solid #f6f6f6;
}

.srm-history-record-box {
  border-bottom 1px solid #f6f6f6;
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
  color: #006341;
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
  background: #006341;
  z-index 1;
}

.srm-history-record-box :last-child {
  .srm-history-record-item-content {
    border 2px solid transparent !important;
  }
}

.srm-history-process-box {
  padding 15px 16px;
}

.srm-history-process-id {
  font-size: 14px;
  color: #1B1E2B;
  font-weight 600;
}

.srm-history-process-status {
  font-size: 14px;
  font-weight 600;
  border-radius 0;
}

.srm-history-process-time {
  font-size 12px;
  color #797979;
}

.srm-history-process-toggle {
  font-size: 12px;
  color: #006341;
  line-height: 16px;

  .srm-icon {
    display inline-block;
    transition all .3s ease;
  }
}
</style>
