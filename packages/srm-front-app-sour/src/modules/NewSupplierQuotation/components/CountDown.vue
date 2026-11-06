<template>
  <span v-if="!!endDate">
    <span v-if="(onlyShowEndTimeWhenGTOneDay === 1 && gtOneDayFlag === 1) || onlyShowEndTimeFlag === 1">
      {{ currentCountGtDayDirectShowLabel }}:
      {{ endDate }}
    </span>

    <span v-else>
      {{ currentRunningTitle }}
      <span v-if="gtOneDayFlag === 1">{{ time.day }}{{ $T("ssrc.common.model.day").$D("天") }}</span>
      {{ time.hour }}:{{ time.minute }}:{{ time.second }}
    </span>
  </span>
</template>

<script>

/**
 * 倒计时组件
 * */
export default {
  name: "CountDown",
  modules: [ "ssrc.common", ],
  props: {
    now: {
      type: String || null,
      default: null,
    },
    end: {
      type: String || null,
      default: null,
    },
    gtDayDirectShow: {
      type: Number,
      default: 1,
    },
    pausedFlag: {
      type: Number,
      default: 0,
    },
    formattedFunc: {
      type: Function,
      default: null,
    },
    countRunningTitle: {
      type: String || null,
      default: null,
    },
    countDirectionShowEndTitle: {
      type: String || null,
      default: null,
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
      currentDate: null, // 倒计时开始时间
      endDate: null, // 倒计时截止时间
      countTimer: null, // interval time
      onlyShowEndTimeFlag: 0, // 只文本展示截止时间-用于外部控制
      stopFlag: null,
      gtOneDayFlag: false, // 倒计时超过一天
      onlyShowEndTimeWhenGTOneDay: null, // 倒计时超过一天仅显示截止时间
      currentRunningTitle: "",
      currentCountGtDayDirectShowLabel: "",
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
    gtDayDirectShow(val) {
      this.onlyShowEndTimeWhenGTOneDay = val;
      this.calculateCountDown();
    },
    pausedFlag(val) {
      this.stopFlag = val;
      this.calculateCountDown();
    },
    onlyShowEndTime(val) {
      this.onlyShowEndTimeFlag = val;
    },
  },
  destroyed() {
    this.clearTimer();
  },
  deactivated() {
    this.clearTimer();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const {
        pausedFlag = 0,
        gtDayDirectShow = 0,
        countRunningTitle = "",
        countDirectionShowEndTitle = "",
      } = this.$props || {};

      this.onlyShowEndTimeWhenGTOneDay = gtDayDirectShow;
      this.stopFlag = pausedFlag;
      this.currentRunningTitle = countRunningTitle;
      this.currentCountGtDayDirectShowLabel = countDirectionShowEndTitle;
    },
    clearTimer() {
      clearInterval(this.countTimer);
    },
    calculateCountDown() {
      this.clearTimer();

      if (!this.endDate || this.pausedFlag || this.onlyShowEndTimeFlag) {
        this.clearTimer();
        return;
      }

      let day = "00";
      let hour = "00";
      let minute = "00";
      let second = "00";

      const sysEnd = this.formatTime(this.endDate);
      const sysNow = this.formatTime(this.currentDate);
      const endTime = new Date(sysEnd).getTime();
      const currentTime = sysNow ? new Date(sysNow).getTime() : new Date().getTime();
      let sysSecond = endTime - currentTime;

      if (sysSecond > 86400000) {
        this.gtOneDayFlag = 1;

        if (this.onlyShowEndTimeWhenGTOneDay === 1) {
          this.clearTimer();
          this.onlyShowEndTimeWhenGTOneDay = 1; // 大于一天，显示时间
          return;
        }
      }

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
      }, 1000);
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

