<template>
  <div style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" class="count-down-all-wrap">
    <div v-if="showRunningTimer !== 1" style="" class="current-time-wrap">
      <srm-tooltip :title="title" class="count-down-title">
        <span class="title-text">
          {{ title }}
        </span>
      </srm-tooltip>
      <span>
        {{ timer }}
      </span>
    </div>

    <div v-if="showRunningTimer === 1" class="current-time-wrap">
      <srm-tooltip :title="title" class="count-down-title">
        <span class="title-text">
          {{ title }}
        </span>
      </srm-tooltip>
      <span>
        {{ timeLine ? `(${timeLine})` : "" }}
        {{ time.hour }}:{{ time.minute }}:{{ time.second }}
      </span>
    </div>
  </div>
</template>

<script>

import moment from "moment";
import { formatDateTime } from "../utils/dateTime";

/**
 * 倒计时组件
 * */
export default {
  name: "BiddingCountDown",
  modules: [ "ssrc.common", "ssrc.inquiryHall", "ssrc.common" ],
  props: {
    now: {
      type: String || null,
      default: null,
    },
    end: {
      type: String || null,
      default: null,
    },
    pausedFlag: {
      type: Number,
      default: 0,
    },
    runTitle: {
      type: String || null,
      default: null,
    },
    endTitle: {
      type: String || null,
      default: null,
    },
    others: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      time: {
        day: "00",
        hour: "00",
        minute: "00",
        second: "00",
      }, // time object
      timer: "",
      currentDate: null, // 倒计时开始时间
      endDate: null, // 倒计时截止时间
      countTimer: null, // interval time
      onlyShowEndTimeFlag: 0, // 只文本展示截止时间-用于外部控制
      stopFlag: null,
      currentRunTitle: "",
      currentEndTitle: "",
      title: "",
      otherProps: {},
      showRunningTimer: false,
      timeLine: "",
    };
  },
  watch: {
    now(val) {
      this.currentDate = val;
      this.calculateCountDown();
    },
    end(val) {
      this.endDate = val;
      this.calculateCountDown();
    },
    pausedFlag(val) {
      this.stopFlag = val;
      this.calculateCountDown();
    },
    runTitle(val) {
      this.currentRunTitle = val;
      this.calculateCountDown();
    },
    others(val = {}) {
      this.otherProps = val;
      this.calculateCountDown();
    },
    endTitle(val) {
      this.currentEndTitle = val;
      this.calculateCountDown();
    },
  },
  beforeUnmount() {
    this.clearTimer();
  },
  deactivated() {
    this.reset();
    this.clearTimer();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.calculateCountDown();
    },
    clearTimer() {
      clearInterval(this.countTimer);
    },
    reset() {
    },
    calculateCountDown() {
      this.clearTimer();

      if (!this.endDate) {
        this.clearTimer();
        this.timer = "";
        return;
      }

      let day = "00";
      let hour = "00";
      let minute = "00";
      let second = "00";
      this.timeLine = "";

      const sysEnd = this.formatTime(this.endDate);
      const sysNow = this.formatTime(this.currentDate);
      const endTime = new Date(sysEnd).getTime();
      const currentTime = sysNow ? new Date(sysNow).getTime() : new Date().getTime();
      let sysSecond = endTime - currentTime;
      const moreOneDay = sysSecond > 86400000;

      if (moreOneDay || sysSecond <= 0) {
        this.title = this.runTitle || this.endTitle;
        this.timer = formatDateTime({ dateTime: this.endDate });
        this.clearTimer();
        this.showRunningTimer = 0;
        return;
      }

      this.showRunningTimer = 1;
      this.title = this.endTitle;

      this.countTimer = setInterval(() => {
        // 防止倒计时出现负数
        if (sysSecond >= 1000) {
          sysSecond -= 1000;
          day = Math.floor(sysSecond / 1000 / 3600 / 24);
          hour = Math.floor(sysSecond / 1000 / 3600 % 24);
          minute = Math.floor(sysSecond / 1000 / 60 % 60);
          second = Math.floor(sysSecond / 1000 % 60);

          hour = this.addPadStart(hour);
          minute = this.addPadStart(minute);
          second = this.addPadStart(second);

          // if (moment(this.currentDate).isSame(this.endDate, 'day')) {
          //   // 今天
          //   this.timeLine = this.$T('ssrc.common.view.today').$D('今天');
          // }
          //
          // if (moment(this.currentDate).add(1, 'day').isSame(this.endDate, 'day')) {
          //   this.timeLine = this.$T('ssrc.common.view.tomarrow').$D('明天');
          // }
        } else {
          this.setTimeToZero();
          this.clearTimer();
        }

        this.time = {
          day,
          hour,
          minute,
          second,
        };

        if (this.pausedFlag) {
          this.clearTimer();
          return;
        }
      }, 1000);
    },
    formatDate(date) {
      if (!date) {
        return;
      }

      return formatDateTime({ dateTime: date });
    },
    setTimeToZero() {
      this.time = {
        day: "00",
        hour: "00",
        minute: "00",
        second: "00",
      };
    },
    // format "1" => "01"
    addPadStart(val) {
      let str = "";
      if (val === null) {
        return str;
      }

      str = String(val).padStart(2, "0");
      return str;
    },
    formatTime(time) {
      return time ? time.replace(/-/g, "/") : null;
    },
  },
};
</script>

<style lang="stylus" scoped>

.count-down-all-wrap {
  font-family: PingFangSC-Medium;
  background: rgba(255, 107, 107, 0.05);
  font-size: 14px;
  color: var(--color-img-default-c);
  line-height: 30px;
  font-weight: 500;
  text-align: center;
}

.current-time-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.title-text {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-img-default-c);
  margin-right: 4px;
}

.count-down-title {
  display: inline-block;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
