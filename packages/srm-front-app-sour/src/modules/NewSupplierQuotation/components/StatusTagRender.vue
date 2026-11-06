<template>
  <div v-if="message && showFlag === 1" class="ssrc-bidding-hall-status-tag-wrap" :style="{ backgroundColor: colorMap.backgroundColor, }">
    <div class="ssrc-bidding-hall-status-message-wrap">
      <srm-tooltip :title="message" style="height: 100%;">
        <div :style="{ color: colorMap.color }" :class="currentTrialFlag ? 'ssrc-bidding-hall-status-message dynamic-message-content-trial' : 'ssrc-bidding-hall-status-message'">
          {{ message }}
        </div>
      </srm-tooltip>
    </div>

    <span :style="{ color: colorMap.color }" class="class-icon" @click="close">
      <span class="srm-icon icon-x" />
    </span>
  </div>
</template>

<script>

import { getWarningStatus } from "../utils/renderer";

export default {
  name: "StatusTagRender",
  modules: [ "ssrc.biddingHall", "ssrc.inquiryHall", "ssrc.common" ],
  props: {
    status: {
      type: String || null,
      default: null,
    },
    supplierStatus: {
      type: String || null,
      default: null,
    },
    head: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentStatus: "",
      showFlag: 1,
      headInfo: {},
      message: "",
      type: null,
      colorMap: {},
      currentSupplierStatus: null,
      currentTrialFlag: 0,
    };
  },
  watch: {
    status(val) {
      this.currentStatus = val;
      this.getStatusMessage();
    },
    head(val) {
      this.headInfo = val || {};
      this.getStatusMessage();
    },
    supplierStatus(val) {
      this.currentSupplierStatus = val;
      this.getStatusMessage();
    },
  },
  beforeUnmount() {
    this.clearAllData();
  },
  deactivated() {

  },
  mounted() {
    this.init();
  },
  clearAllData() {
    this.showFlag = 0;
    this.message = "";
  },
  methods: {
    init() {
      this.getStatusMessage();
    },
    close() {
      this.showFlag = 0;
    },
    getStatusMessage() {
      const {
        head = {},
        supplierSupplementStartAndNotQuoted,
        // type = "status"
        // supplierStatus,
        supplierStatus,
      } = this.$props;
      const {
        prohibitQuotationDate, // 删除报价日期
        // prohibitProcessExternalRemark,
        displayBiddingSupHeaderStatus,
        displayBiddingSupHeaderStatusMeaning,
        actionProcessRemark,
        trialBiddingQueryFlag,
      } = head || {};

      const {
        currentMessage,
        color,
        backgroundColor,
        trialStatus = 0,
      } = getWarningStatus({
        ...(head || {}),
        supplierStatus,
        supplierSupplementStartAndNotQuoted,
        actionProcessRemark,
        trialBiddingQueryFlag,
        prohibitQuotationDate,
        status: displayBiddingSupHeaderStatus,
        statusMeaning: displayBiddingSupHeaderStatusMeaning,
      }) || {};

      this.currentTrialFlag = trialStatus;

      if (currentMessage) {
        this.message = currentMessage;
        this.showFlg = 1;
        this.colorMap = { color, backgroundColor, };
      } else {
        this.close();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.ssrc-bidding-hall-status-tag-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  line-height: 34px;
  padding: 0 16px;
  font-size: 10px;
  height:  34px;
}

.ssrc-bidding-hall-status-message-wrap {
  width: 96%;
  height:  34px;
  overflow: hidden;
}

.ssrc-bidding-hall-status-message {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 34px;
  font-size: 12px;
  font-weight: 500;
}

.class-icon {
  font-size: 12px;
}

.icon-close {
  heigth: 16px;
}

.dynamic-message-content-trial {
  margin: 0 16px;
  display: inline-block;
  white-space: nowrap;
  animation: wordsLoop 10s linear infinite normal;
  -webkit-animation: wordsLoop 10s linear infinite normal;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  // -webkit-backface-visibility: hidden;
  // backface-visibility: hidden;
  width: unset;
  font-size: 12px;

  @keyframes wordsLoop {
    0% {
      transform: translateX(100%);
      -webkit-transform: translateX(100%);
    }
    100% {
      transform: translateX(-104%);
      -webkit-transform: translateX(-104%);
    }
  }

  &:hover {
    animation-play-state: paused;
  }
}

</style>

