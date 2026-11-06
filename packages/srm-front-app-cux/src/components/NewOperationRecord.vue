<template>
  <hips-popup
    v-model="value"
    style="height:90%;width:100%;overflow: hidden;"
    position="bottom"
    class="top-boder-radius"
    :overlay-on-click-close="false"
    @click-overlay="$emit('input',false)">
    <div class="header">
      <hips-nav-bar slot="header">
        <div v-show="slide" slot="center" class="header">{{ $T("hipspfm.common.message.title.operationRecord").$D("操作记录") }}</div>
        <div slot="right" class="right-button" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
        </div>
      </hips-nav-bar>
      <div v-show="!slide" class="title">{{ $T("hipspfm.common.message.title.operationRecord").$D("操作记录") }}</div>
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
              v-for="(item,index) in operationArr" :key="index"
              class="record-item">
              <div class="time-item">
                <div class="time-date">{{ item.endTime|CalcDate }}</div>
                <div class="time-clock">{{ item.endTime|CalcTime }}</div>
              </div>

              <div>
                <div class="operation-item">
                  <div v-if="item.assigneeName" class="producer">
                    {{ item.assigneeName }}
                    <span v-if="hasFile && item.action" class="producer-action">{{ transferMean(item.action.toLowerCase()) }}</span>
                  </div>
                  <div v-if="!hasFile">
                    <div class="operation-status" style="color: var(--color-other-default-b);">{{ item.action }}</div>
                    <!-- <div class="operation-status" style="color: var(--color-other-default);">拒绝</div>
                    <div class="operation-status" style="color：var(--color-other-default-c);">加签</div>
                    <div class="operation-status" style="color: var(--color-other-default-b);">转交</div>
                    <div class="operation-status" style="color: var(--color-other-default-b);">同意并加签</div> -->
                  </div>
                  <div v-else-if="item.attachmentUuid" class="operation-status" @click="showFile(item.attachmentUuid)">
                    <img class="image-black-default" src="@/assets/attached_file@3x.png" alt="">
                  </div>
                </div>
                <div class="result">
                  <li v-show="hasFile">{{ $T('hipspfm.common.message.approvalProcess').$D('审批环节') }}：<span style="color: var(--color-other-default-b);">{{ item.name }}</span></li>
                  <li v-if="item.comment">{{ $T('hipspfm.common.message.approvalComment').$D('审批意见') }}：{{ item.comment }}</li>
                </div>
              </div>
            </hips-timeline-item>
          </hips-timeline>
        </div>
        <!-- 空白页 -->
        <no-content v-else :title="'hipspfm.common.message.noOperationRecord'" img-src="NoResult@3x.png"/>
        <div class="no-more"/>
      </hips-scroll>
    </div>
    <div class="supplier-confirm" @click="$emit('input',false)">
      <span>{{ $T("hipspfm.common.button.confirm").$D("确认") }}</span>
    </div>

    <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid"/>
  </hips-popup>
</template>
<script>
import AttachedFile from "@/components/File/AttachedFile";
import NoContent from "@/components/NoContent";
import { View, NavBar, Icon, Timeline, TimelineItem, Scroll, Popup } from "hips";
export default {
  modules: [ "hipspfm.common" ],
  name: "OperationRecord",
  components: {
    NoContent,
    AttachedFile,
    [View.name]: View,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
  },
  props: {
    "value": {
      type: Boolean,
      default: false,
    },
    "operationArr": {
      type: Array,
      default: []
    },
    "hasFile":{
      type: Boolean,
      default: true,
    },
    loadRefresh: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      filePopup: false,
      attachmentUuid: "",
      scrollEvents: [ "scroll", "scroll-end" ],
      slide:false,
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
  mounted() {
  },
  methods: {
    showFile(uuid) {
      this.filePopup = !this.filePopup;
      this.attachmentUuid = uuid;
    },
    onScroll({ x, y }) {
      if (y >= 0) {
        this.slide = false;
      } else {
        this.slide = true;
      }
    },
    async loadRefreshOperate() {
      await this.loadRefresh();
    },
    transferMean(value) {
      switch (value) {
      case "approved": return this.$T("hipspfm.common.action.approved").$D("同意");
      case "rejected": return this.$T("hipspfm.common.message.reject").$D("拒绝");
      case "addsign": return this.$T("hipspfm.common.action.addSign").$D("加签");
      case "approveandaddsign": return this.$T("hipspfm.common.action.approveAndAddSign").$D("同意并加签");
      case "delegate": return this.$T("hipspfm.common.action.delegate").$D("转交");
      case "jump": return this.$T("hipspfm.common.action.jump").$D("驳回");
      case "recall": return this.$T("hipspfm.common.action.recall").$D("撤回");
      case "revoke": return this.$T("hipspfm.common.action.revoke").$D("撤销");
      case "autodelegate": return this.$T("hipspfm.common.action.autoDelegate").$D("自动转交");
      case "carboncopy": return this.$T("hipspfm.common.action.carbonCopy").$D("抄送");
      default: return value;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.right-button {
  margin-right: 20px;
  width: 24px;
  height: 24px;
}

.header {
  font-size: 18px;
  line-height: 26px;
}
>>> .hips-timeline-item__content {
  margin-top: 20px;
}
>>> .hips-timeline-item{

}
.title {
  font-size: 24px;
  color:var(--color-font-default);
  line-height: 32px;
  font-weight: bold;
  text-align: left;
  margin:5px 0 5px 20px;
}
.scroll-wrap {
  height: calc(100vh - 110px);
  padding-bottom: 49px;
  padding-bottom: calc(49px + constant(safe-area-inset-bottom));
  padding-bottom: calc(49px + env(safe-area-inset-bottom));
}

.record-container {
  position: relative;
  margin: 16px 0px 0px 95px;

  .record-item {
    margin-left: 22px;
    // height: 63px;
    padding: 0 0 10px 0 !important;
    position static;

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
        width: 210px;
        margin-bottom:4px;
      }
      .producer-action{
        background:var(--color-bg-default-c);
        border-radius: 2px;
        border-radius: 2px;
        display: inline-block;
        font-family: PingFangSC-Medium;
        padding:1px 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 18px;
      }

      .operation-status {
        text-align: right
        margin-right: 20px;
        width:90px;
        color:var(--color-font-default-c);
        img {
          height: 20px;
          width: 20px;
        }
      }

    }
    .result {
      li {
        padding-right: 20px;
        color:var(--color-font-default);
        &:nth-child(2) {
          color:var(--color-font-default-b);
        }
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
</style>