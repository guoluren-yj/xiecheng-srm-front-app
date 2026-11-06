<template>
  <hips-popup
    v-model="value"
    style="height:90%;width:100%;overflow: hidden;"
    position="bottom"
    class="top-boder-radius"
    :overlay-on-click-close="false"
    @click-overlay="closePop">
    <div class="BigContainer">
      <div class="header">
        <hips-nav-bar slot="header" :have-border="false">
          <div v-show="slide" slot="center" class="subTitle">{{ $T("hipspfm.common.message.title.operationRecord").$D("操作记录") }}</div>
          <div slot="right" class="complete" @click="closePop">{{ $T("hipspfm.common.button.complete").$D("完成") }}</div>
        </hips-nav-bar>
        <!-- <div class="title" v-show="!slide">{{ $T("hipspfm.common.message.title.operationRecord").$D("操作记录")}}</div> -->
        <div v-show="!slide" ref="hiddenTitle" class="hidden-title">
          <div ref="lovTitle" class="sub-title" >{{ $T("hipspfm.common.message.title.operationRecord").$D("操作记录") }}</div>
        </div>
      </div>
      <div class="scroll-wrap">
        <hips-scroll
          ref="scroll"
          :data="[operationArr]"
          :scroll-events="scrollEvents"
          :scroll-options="scrollOption"
          @scroll="onScroll"
          @pulling-down="loadRefreshOperate">
          <div v-if="operationArr.length" class="record-container">
            <hips-timeline>
              <hips-timeline-item
                v-for="(item,index) in operationArr"
                :key="index"
                class="record-item"
                :color="colorArr[index%4]">
                <div v-if="item.processedDate" class="time-item">
                  <div class="time-date">{{ item.processedDate.slice(0,10) }}</div>
                  <div class="time-clock">{{ item.processedDate.slice(11) }}</div>
                </div>
                <div v-if="item.processDate" class="time-item">
                  <div class="time-date">{{ item.processDate.slice(0,10) }}</div>
                  <div class="time-clock">{{ item.processDate.slice(11) }}</div>
                </div>
                <div v-if="item.startTime" class="time-item">
                  <div class="time-date">{{ item.startTime.slice(0,10) }}</div>
                  <div class="time-clock">{{ item.startTime.slice(11) }}</div>
                </div>

                <div v-if="item.processUserName" class="operation-item">
                  <div class="producer">
                    <div>{{ item.processUserName }}</div>
                    <srm-tooltip v-if="item.processRemark" :title="item.processRemark">
                      <div v-if="item.processRemark" class="operation-reamrk">
                        {{ $T('hipspfm.common.message.title.operationReamrk').$D('操作描述') }}：{{ item.processRemark }}
                      </div>
                    </srm-tooltip>
                  </div>
                  <div class="operation-status">{{ item.processTypeMeaning||item.processOperationMeaning||item.processStatusMeaning }}</div>
                </div>
                <div v-if="item.processUser" class="operation-item">
                  <div class="producer">{{ item.processUser }}</div>
                  <div class="operation-status">{{ item.processStatusMeaning }}</div>
                </div>
                <div v-if="item.realName" class="operation-item">
                  <div class="producer">
                    {{ item.realName }}
                    <div v-if="item.processRemark">{{ $T('hipspfm.common.message.title.operationReamrk').$D('操作描述') }}：{{ item.processRemark }}</div>
                  </div>
                  <div class="operation-status">{{ item.processOperationMeaning }}</div>
                </div>
                <div v-else class="operation-item">
                  <div class="producer">{{ item.assigneeName }}</div>
                  <div class="operation-status">{{ item.name }}</div>
                </div>
              </hips-timeline-item>
            </hips-timeline>
          </div>
          <!-- 空白页 -->
          <no-content
            v-else-if="!operationArr.length&&!loading"
            :title="'hipspfm.common.message.noOperationRecord'"
            img-src="NoResult@3x.png"/>
          <div class="no-more"/>
        </hips-scroll>
      </div>
    </div>
  </hips-popup>
</template>
<script>
import BScroll from "better-scroll";
import NoContent from "@/components/NoContent";
import { View, Icon, NavBar, Timeline, TimelineItem, Scroll, Popup } from "hips";
export default {
  modules: [ "hipspfm.common" ],
  name: "OperationRecord",
  components: {
    NoContent,
    [Icon.name]: Icon,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    operationArr: {
      type: Array,
      default: () => []
    },
    loadMore: {
      type: Function,
    },
    loadRefresh: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      colorArr: [ "var(--color-other-default-b)", "#3473FF", "var(--color-other-default)", "#6B5AED" ],
      scrollEvents: [ "scroll", "scroll-end" ],
      list: [],
      slide: false,
      tempArr:[],
      scrollOption: {
        pullDownRefresh: {
          threshold: 60,
          stop: 40,
          txt:" "
        },
        pullUpLoad: false,
      },
    };
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    onScroll({ x, y }) {
      if (y < 0) {
        this.$refs.lovTitle.style.top = 100 / 667 * y + "vh";
      } else {
        this.$refs.lovTitle.style.top = "0vh";
      }
      this.$refs.hiddenTitle.style.height = 100 / 667 * (38 + y) + "vh";
      if (38 + y <= 0) {
        this.slide = true;
        console.log(123412321321);
      } else {
        this.slide = false;
      }
    },
    async loadRefreshOperate() {
      await this.loadRefresh();
    }
  }
};
</script>

<style lang="stylus" scoped>
.BigContainer {
  position: relative;
  height: 100%;

  .header {
    padding: 0px 20px;
    font-family: PingFangSC-Medium;
    .complete {
      text-align: right;
      color: var(--color-other-default-b);
    }

    .hidden-title{
      overflow-y:hidden;
      max-height:40px;
      .sub-title {
        position:relative;
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-weight: bold;
        font-size: 24px;
        color:var(--color-font-default);
        margin-bottom: 8px;
      }
    }
  }
  .scroll-wrap {
    height: calc(100% - 26vw);
  }

  .record-container {
    position: relative;
    margin: 17px 0px 0px 95px;

    .record-item {
      margin-left: 22px;
      // height: 63px;

      .time-item {
        position: absolute;
        top: 0px;
        left: -75px;

        .time-date {
          text-align: right;
          font-size: 12px;
          color:var(--color-font-default);
          font-family: PingFangSC-Medium;
        }

        .time-clock {
          text-align: right;
          font-size: 10px;
          color:var(--color-font-default-b);
        }
      }

      .operation-item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        .producer {
          color:var(--color-font-default);
          width: 168px;
        }

        .operation-status {
          text-align: right
          margin-right: 20px;
          width:90px;
          color:var(--color-font-default-c);
        }
      }
    }

    >>> .hips-timeline-item__content {
      top: -1.8vw !important;
    }
  }

  .supplier-confirm {
    width: 100%;
    height: calc(49px + constant(safe-area-inset-bottom));
    height: calc(49px + env(safe-area-inset-bottom));
    line-height: 49px;
    background:var(--color-bg-default);
    border-top:1px solid var(--color-border-default);
    text-align: center;
    font-size: 18px;
    color: var(--color-other-default-b);
    z-index: 100000;
    position: absolute;
    bottom: 0;
    font-weight: bold;

  }

  .operation-reamrk {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
