<template>
  <srm-popup
    :visible="value"
    :title="$T('ssrc.inquiryHall.model.inquiryHall.implementation').$D('执行情况')"
    position="bottom"
    rounded
    @onClose="$emit('input', false)">
    <srm-scroll height="100%" :refreshable="false">
      <div class="srm-perform-box">
        <div v-if="implementationType === 'FORM'">
          <div v-if="JSON.stringify(implementationValue) === '[]' || JSON.stringify(implementationValue) === ''" class="srm-perform-record-text">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(record, index) in implementationValue" :key="index">
            <div v-if="fieldSource === 'prequalLines'">
              <div class="srm-perform-record-form">
                <div class="srm-first-child">{{ record.supplierCompanyName }}</div>
                <div :class="getFormClass(record)">{{ record.displayPreSupplerStatusMeaning }}</div>
              </div>
            </div>
            <div v-if="fieldSource === 'headerQuotationDetails'">
              <div class="srm-perform-record-form">
                <div class="srm-first-child">{{ record.supplierCompanyName }}</div>
                <div class="srm-status-black">{{ $T('ssrc.common.model.common.tender').$D('投标') }} {{ record.quotedCount }} {{ $T('ssrc.inquiryHall.model.inquiryHall.line').$D('行') }}</div>
              </div>
            </div>
            <div v-if="fieldSource === 'headerQuotationDetailsNotStart'">
              <div class="srm-perform-record-form">
                <div class="srm-first-child">{{ record.supplierCompanyName }}</div>
                <div class="srm-status-black">{{ record.feedbackStatusMeaning }}</div>
              </div>
            </div>
            <div v-if="fieldSource === 'evaluateExperts'">
              <div class="srm-perform-record-form">
                <div class="srm-first-child">{{ record.expertName }}</div>
                <div :class="record.scoredStatus === 'SCORED' ? 'srm-status-green' : 'srm-status-grey'">{{ record.scoredStatusMeaning }}</div>
              </div>
            </div>
            <div v-if="fieldSource === 'suggestedSuppliers'">
              <div class="srm-perform-record-form">
                <div class="srm-first-child">{{ record.supplierCompanyName }}</div>
                <div class="srm-status-black">{{ record.biddingAmount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="implementationType === 'PROCESS'">
          <div v-if="JSON.stringify(implementationValue) === '[]' || JSON.stringify(implementationValue) === ''" class="srm-perform-record-text">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-if="fieldSource === 'headerWorkFlows'">
            <div class="srm-perform-record-process">
              <div v-for="(record,index) in implementationValue" :key="index" :class="getProcessClassA(record)">
                <div>
                  <span>{{ record.employeeName }} {{ record.approvalMessageMeaning }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="fieldSource === 'progresses'">
            <div class="srm-perform-record-process">
              <div v-for="(record,index) in implementationValue" :key="index" :class="getProcessClassB(record)">
                <div>
                  <span>{{ record.progressNameMeaning }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="JSON.stringify(implementationValue) === '[]' || JSON.stringify(implementationValue) === ''" class="srm-perform-record-text">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-if="fieldSource === 'approvalMessage'">
            <div class="srm-perform-record-text">
              <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.approvalMessage').$D('拒绝理由') }}：{{ implementationValue }}</span>
            </div>
          </div>
          <div v-if="fieldSource === 'paused'">
            <div class="srm-perform-record-text">
              <span>{{ implementationValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </srm-scroll>
  </srm-popup>
</template>
<script>

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "hipspfm.common" ],
  name: "ImplementePop",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    //TEXT\FORM\PROCESS
    implementationType: {
      type: String,
      default: "TEXT",
    },
    // 字段来源
    fieldSource: {
      type: String,
      default: "",
    },
    implementationValue: {
      type: [ String, Array ],
      default: null,
    }
  },
  data() {
    return {
    };
  },
  methods:{
    getProcessClassA(item) {
      let processClassName;
      switch (item.approvalMessage) {
      case "Rejected":
        processClassName = "srm-perform-record-process-red";
        break;
      case "Submitted":
      case "Approved":
        processClassName = "srm-perform-record-process-green";
        break;
      default:
        processClassName = "srm-perform-record-process-black";
        break;
      }
      return processClassName;
    },
    getProcessClassB(item) {
      let processClassName;
      let curProgressSequence;
      this.implementationValue.map((e) => {
        if (e.isCurrentFlag === 1) {
          curProgressSequence = e.progressSequence;
        }
      });
      if (item.progressSequence === curProgressSequence) {
        processClassName = "srm-perform-record-process-black";
      } else if (item.progressSequence < curProgressSequence) {
        processClassName = "srm-perform-record-process-bule";
      } else {
        processClassName = "srm-perform-record-process-grey";
      }
      return processClassName;
    },
    getFormClass(item) {
      let formClassName;
      switch (item.displayPreSupplerStatus) {
      case "RETURN_PREQUAL":
        formClassName = "srm-status-red";
        break;
      case "Submitted":
      case "Approved":
        formClassName = "srm-status-green";
        break;
      default:
        formClassName = "srm-status-black";
        break;
      }
      return formClassName;
    }
  }
};
</script>
<style lang="stylus" scoped>

.srm-perform-box {
  padding: 0 15px;

  .srm-perform-record-form {
    display: flex;
    align-items: center;
    white-space: nowrap;
    justify-content: space-between
    line-height: 22px;
    font-size: 16px;
    height: 54px;
    width: 100%;
    color: var(--color-font-default);

    .srm-first-child {
      width: 80%;
      margin-right: 5px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .srm-status-green {
      color: #05944F
    }
    .srm-status-red {
      color: #E11900
    }
    .srm-status-black {
      color: var(--color-font-default);
    }
    .srm-status-grey {
      color: #AFAFAF;
    }
  }

  .srm-perform-record-process{
    margin-top: 15px;
  }

.srm-perform-record-process-grey {
    position relative;
    padding 0 0 22px 12px;
    width calc(100% - 64px);
    font-size: 14px;
    line-height: 20px;
    color: #AFAFAF;
    border-left: 1px solid var(--split-line-color-primary);
    &:last-child {
      border-left: 1px var(--split-line-color-primary);
      margin-left: 1px;
    }
  }

  .srm-perform-record-process-grey::before{
    content: '';
    position: absolute;
    left -4px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 5px;
    background var(--color-font-default-d);
    border: 1px solid #AFAFAF;
    z-index 1;
  }

  .srm-perform-record-process-black {
    position relative;
    padding 0 0 22px 12px;
    width calc(100% - 64px);
    font-size: 14px;
    line-height: 20px;
    color: var(--color-font-default);
    border-left: 1px solid var(--split-line-color-primary);
    &:last-child {
      border-left: 1px var(--split-line-color-primary);
      margin-left: 1px;
    }
  }

  .srm-perform-record-process-black::before{
    content: '';
    position: absolute;
    left -4px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 5px;
    background var(--color-font-default-d);
    border: 1px solid var(--color-font-default);
    z-index 1;
  }

  .srm-perform-record-process-bule {
    position relative;
    padding 0 0 22px 12px;
    width calc(100% - 64px)
    font-size: 14px;
    line-height: 20px;
    color: #0C6BFA
    border-left: 1px solid var(--split-line-color-primary);
    &:last-child {
      border-left: 1px var(--split-line-color-primary);
      margin-left: 1px;
    }
  }

  .srm-perform-record-process-bule::before{
    content: '';
    position: absolute;
    left -4px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 5px;
    background var(--color-font-default-d);
    border: 1px solid #0C6BFA;
    z-index 1;
  }

  .srm-perform-record-process-green {
    position relative;
    padding 0 0 22px 12px;
    width calc(100% - 64px)
    font-size: 14px;
    line-height: 20px;
    color: #05944F;
    border-left: 1px solid var(--split-line-color-primary);
    &:last-child {
      border-left: 1px var(--split-line-color-primary);
      margin-left: 1px;
    }
  }

  .srm-perform-record-process-green::before{
    content: '';
    position: absolute;
    left -4px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 5px;
    background var(--color-font-default-d);
    border: 1px solid #05944F;;
    z-index 1;
  }

  .srm-perform-record-process-red {
    position relative;
    padding 0 0 22px 12px;
    width calc(100% - 64px)
    font-size: 14px;
    line-height: 20px;
    color: #E11900;
    border-left: 1px solid var(--split-line-color-primary);
    &:last-child {
      border-left: 1px var(--split-line-color-primary);
      margin-left: 1px;
    }
  }

  .srm-perform-record-process-red::before{
    content: '';
    position: absolute;
    left -4px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 5px;
    background var(--color-font-default-d);
    border: 1px solid #E11900;
    z-index 1;
  }

  .srm-perform-record-text {
    padding: 16px 0 0 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--color-font-default);
  }
}
</style>
