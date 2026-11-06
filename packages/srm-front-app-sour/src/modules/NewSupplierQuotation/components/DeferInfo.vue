<template>
  <div v-if="message" class="ssrc-bidding-hall-rule-tag-wrap">
    <div class="dynamic-message-content-wrap">
      <div class="dynamic-message-content">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>

import { $T, } from "srm-mobile-ui";
import { isNil, } from "lodash";


export default {
  name: "DeferInfo",
  modules: [ "ssrc.biddingHall", "ssrc.inquiryHall", "ssrc.common" ],
  props: {
    status: {
      type: String || null,
      default: null,
    },
    head: {
      type: Object,
      default: () => {},
    },
    rule: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentStatus: "",
      showFlag: 1,
      headInfo: {},
      ruleInfo: {},
      message: "",
      type: null,
      colorMap: {},
    };
  },
  watch: {
    status(val) {
      this.currentStatus = val;
    },
    head(val) {
      this.headInfo = val || {};
    },
    rule(val) {
      this.headInfo = val || {};
    },
  },
  destroyed() {

  },
  deactivated() {

  },
  mounted() {
    this.init();
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
        rule = {},
      } = this.$props;
      const {
        supplierStatus,
        prohibitQuotationDate, // 删除报价日期
        // prohibitProcessExternalRemark,
        displayBiddingSupHeaderStatus,
        displayBiddingSupHeaderStatusMeaning,
        actionProcessRemark,
        trialBiddingQueryFlag,
      } = head || {};
      const {
        autoDeferDuration,
        autoDeferFlag,
        deferBiddingAllowedQuotationCount,
        autoDeferTypeMeaning,
      } = rule || {};

      const andEmptyFlag = !autoDeferFlag || !autoDeferDuration;
      if (andEmptyFlag) {
        return;
      }

       // 延时竞价阶段，如果出现新的报价时触发自动延时，延时竞价截止时间将自动延长1分钟，最多延时5次，
      const wheelCastMeaning = $T("ssrc.biddingHall.view.title.deferCountGenerateNewQuotedAndDelay", [ autoDeferTypeMeaning, autoDeferDuration, ])
        .$D(
          "延时竞价阶段，如果出现{autoDeferTypeMeaning}，竞价截止时间将自动延长至{autoDeferDuration}分钟"
        );
      const maxDeferCountMeaning = !isNil(deferBiddingAllowedQuotationCount) ? $T("ssrc.biddingHall.view.title.maxDeferCount", [ deferBiddingAllowedQuotationCount ]).$D("，最多延时{maxDeferCount}次。") : ".";
      // const suffixText = intl.get('ssrc.biddingHall.view.title.maxCountSourceFromWarning').d('其中最多延时X次,数据来源于允许报价次数(延时竞价)。');

      const INFOS = wheelCastMeaning + maxDeferCountMeaning;

      if (INFOS) {
        this.message = INFOS;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.ssrc-bidding-hall-rule-tag-wrap {
  font-weight: 400;
  line-height: 34px;
  background-color rgba(39, 110, 241, .1);
  font-size: 10px;
  color: #276EF1;
  width: 100%;
}

.dynamic-message-content-wrap {
  margin: 0 16px 0 16px;
  padding: 0 16px;
  overflow: hidden;
}

.dynamic-message-content {
  margin: 0 16px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
  animation: wordsLoop 10s linear infinite normal;
  -webkit-animation: wordsLoop 10s linear infinite normal;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  // -webkit-backface-visibility: hidden;
  // backface-visibility: hidden;

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

