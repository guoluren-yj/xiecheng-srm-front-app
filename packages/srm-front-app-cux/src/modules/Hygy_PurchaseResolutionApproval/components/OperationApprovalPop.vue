<template>
  <srm-popup
    :title="$T('hzero.common.button.Operator').$D('操作记录')"
    :visible="visible"
    position="bottom"
    rounded
    height="95%"
    @onClose="$emit('input', false)">
    <!-- 审批记录 -->
    <div class="title">{{ $T('hwfp.common.model.approval.record').$D('审批记录') }}</div>
    <div class="srm-history-record-content">
      <div v-for="(record,index) in recordList1" :key="index" class="srm-history-record-box">
        <div class="srm-history-record-year">{{ index + $T('hzero.common.view.year').$D('年') }}</div>
        <div v-for="(item, idx) in record" :key="idx" class="srm-history-record-item">
          <div class="srm-history-record-date">
            <span class="srm-history-record-month">{{ item.month }}</span>
            <span class="srm-history-record-time">{{ item.time }}</span>
          </div>
          <div class="srm-history-record-item-content">
            <div style="display: flex;justify-content: space-between;margin-top: -5px;">
              <div class="srm-history-record-operator">{{ item[operatorFieldName] || "-" }}</div>
              <div class="srm-history-record-status">{{ item[operationMeaningFieldName] || "-" }}</div>
            </div>
            <div class="srm-history-record-remark">
              {{ item[processRemarkFieldName] || "-" }}
            </div>
            <div v-if="showRemark" class="srm-history-record-remark-info">
              <SrmTextareaField v-model="item[processRemarkInfoFieldName]" :disabled="true"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 审批历史 -->
    <div v-if="historyApproval.length > 0" class="title">{{ $T('hwfp.common.model.approval.history').$D('审批历史') }}</div>
    <div class="srm-history-record-content">
      <div v-for="(history, historyIdx) in historyApproval" :key="historyIdx" class="approval-process-history">
        <div class="srm-history-process-box" @click="toggleVisible(history)">
          <srm-flex justify="between">
            <span class="srm-history-process-id">
              {{ $T("hwfp.common.model.process.ID").$D("流程标识") }}：{{ history.id }}
            </span>
            <span class="srm-history-process-status"
                  :class="{
                    'srm-history-process-status-red': ['REJECTED'].includes(history.processStatus),
                    'srm-history-process-status-green': ['APPROVED'].includes(history.processStatus),
                    'srm-history-process-status-blue': ['APPROVAL', 'SUSPENDED'].includes(history.processStatus),
                    'srm-history-process-status-black': ['STOP', 'REVOKE'].includes(history.processStatus),
                  }">
              {{ processLov[history.processStatus] }}
            </span>
          </srm-flex>
          <srm-blank/>
          <srm-flex justify="between">
            <span class="srm-history-process-time">{{ `${history.startTime}~${history.endTime}` }}</span>
            <div class="srm-history-process-toggle">
              <span v-if="detailVisible[history.id]">展开</span>
              <span v-else>收起</span>
              <em class="srm-icon icon-chevron-up"
                  :style="{ transform: detailVisible[history.id] ? 'rotateZ(180deg)' : 'rotateZ(0deg)' }"/>
            </div>
          </srm-flex>
        </div>
        <div v-if="!detailVisible[history.id]">
          <div v-for="(record, index) in recordList2[history.id]" :key="index" class="srm-history-record-box">
            <div class="srm-history-record-year">{{ index + $T('hzero.common.view.year').$D('年') }}</div>
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
import { getProcessLovApi } from "../api";
export default {
  modules: [ "hwfp.common","hzero.common" ],
  name: "OperationApprovalPop",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    historyApproval: {
      type: Array,
      default: () => []
    },
    showRemark: {
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
    }
  },
  data() {
    return {
      visible: false,
      recordList1: {}, // 审批记录
      recordList2: {}, // 审批历史
      detailVisible: {},
      processLov: {},
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.init1();
        this.init2();
      }
    }
  },
  async created() {
    await this.getLovApi();
  },
  methods: {
    toggleVisible(history) {
      this.$set(this.detailVisible, history.id, !this.detailVisible[history.id]);
    },
    async getLovApi() {
      await getProcessLovApi().then((res)=>{
        res.map((item)=>{
          this.processLov[item.value] = item.meaning;
        });
      });
    },
    init1() {
      this.recordList1 = {};
      this.actionData.forEach((data) => {
        const processDate = data[this.processDateFieldName];

        if (processDate && processDate.length > 18) {
          const year = processDate.substring(0, 4);
          const month = processDate.substring(5, 10);
          const time = processDate.substring(11);

          data.month = month;
          data.time = time;
          if (!this.recordList1[year]) {
            this.recordList1[year] = [];
          }
          this.recordList1[year].push(data);
        }
      });
    },
    init2() {
      this.recordList2 = {};
      this.historyApproval.forEach((e) => {
        const processId = e.id;

        if (!this.recordList2[processId]) {
          this.recordList2[processId] = {};
        }
        e.historicTaskExtList && e.historicTaskExtList.forEach((data) => {
          const processDate = data.startTime;

          if (processDate && processDate.length > 18) {
            const year = processDate.substring(0, 4);
            const month = processDate.substring(5, 10);
            const time = processDate.substring(11);

            data.month = month;
            data.time = time;
            if (!this.recordList2[processId][year]) {
              this.recordList2[processId][year] = [];
            }
            this.recordList2[processId][year].push(data);
          }
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

>>> .srm-popup-content {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 16px;
  color:var(--color-font-default);
  line-height: 32px;
  font-weight: bold;
  text-align: left;
  margin:5px 0 5px 20px;
}
.srm-history-record-content {
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  height 100%;
  overflow-y scroll;
}

.srm-history-record-year {
  font-size: 12px;
  text-align: left;
  color: #afafaf;
  background #F6F6F6;
  line-height: 16px;
  border-bottom 1px solid #f6f6f6;
  padding: 8px 0 8px 32px;
  margin-bottom 32px;
  width 100%;
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
  width 65px;
  padding 0 8px;
  margin-top -3px;
}

.srm-history-record-month {
  font-size: 12px;
  color: #333333;
  text-align: right;
  line-height: 16px;
  width 100%;
}

.srm-history-record-time {
  font-size: 10px;
  text-align: right;
  color: #333333;
  line-height: 12px;
  margin-top 2px;
  width 100%;
}

.srm-history-record-operator {
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
  padding 0 0 24px 16px;
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

.srm-history-process-box {
  padding 15px 12px;
}

.srm-history-process-id {
  font-size: 14px;
  color: #1B1E2B;
}

.srm-history-process-status {
  font-size: 14px;
  color: #05944F;
}
.srm-history-process-status-red {
  font-size: 14px;
  color: #f56349;
}
.srm-history-process-status-green {
  font-size: 14px;
  color: #00bf96;
}
.srm-history-process-status-blue {
  font-size: 14px;
  color: blue;
}
.srm-history-process-status-black {
  font-size: 14px;
  color: #333333;
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
</style>
