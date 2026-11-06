
<template>
  <div v-if="dateArr" class="tips">
    <span
      v-for="(item,index) in dateArr"
      :key="index"
      :class="dateIndex === index ? 'active': ''"
      @click="choseDate(index)">{{ item }}</span>
  </div>
</template>
<script type="text/ecmascript-6">
import { dateFormat } from "@/utils/index";
export default {
  modules: [ "hipspfm.common" ],
  name: "DateTip",
  props: {
    choseDateHandler: {
      type: Function,
      default: () => {}
    },
    dateClearFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startDate: "",
      endDate: "",
      dateIndex: ""
    };
  },
  computed: {
    dateArr() {
      return [
        this.$T("hipspfm.common.button.today").$D("今天"),
        this.$T("hipspfm.common.button.tomorrow").$D("明天"),
        this.$T("hipspfm.common.button.inThreeDays").$D("三日内"),
        this.$T("hipspfm.common.button.inWeek").$D("一周内")
      ];
    }
  },
  watch: {
    dateClearFlag(newValue, oldValue) {
      if (newValue) {
        this.dateIndex = "";
      }
    }
  },
  methods: {
    choseDate(index) {
      this.dateIndex = index;
      let dateTime = Date.now();
      switch (index) {
      case 0: //今天
        this.startDate = dateFormat(new Date(dateTime));
        this.endDate = dateFormat(new Date(dateTime));
        break;
      case 1: //明天
        this.startDate = dateFormat(new Date(dateTime + 1 * 24 * 60 * 60 * 1000));
        this.endDate = dateFormat(new Date(dateTime + 1 * 24 * 60 * 60 * 1000));
        break;
      case 2: //三日内
        this.startDate = dateFormat(new Date(dateTime));
        this.endDate = dateFormat(
          new Date(dateTime + 3 * 24 * 60 * 60 * 1000)
        );
        break;
      default:
        //一周内
        this.startDate = dateFormat(new Date(dateTime));
        this.endDate = dateFormat(
          new Date(dateTime + 7 * 24 * 60 * 60 * 1000)
        );
      }
      this.choseDateHandler(this.startDate, this.endDate);
    }
  }
};
</script>
<style lang="stylus" scoped>
.tips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: PingFangSC-Regular;

  span {
    border-radius: 2px;
    color: #82879E;
    // color: var(--color-font-default-c);
    margin-top: 4px;
    text-align: center;
    font-size: 12px;
    background: var(--color-bg-default-j);
    margin-right: 12px;
    word-break: break-all;
    padding: 8px 12px;

    &:first-child {
      margin-left: 0;
    }

    &.active {
      // color: var(--color-other-default-b);
      color: #354FF7;
      background-color: #E5FAF8;
    }
  }
}
</style>