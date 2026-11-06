<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div>
    <srm-popup
      :visible="value"
      height="80%"
      :show-close="false"
      @onClose="$emit('input', false)">
      <span
        slot="left"
        class="cancel"
        @click="closePop">
        {{ $T("hipspfm.common.button.cancle").$D("取消") }}
      </span>
      <span slot="right" class="confirm" @click="openTender">
        {{ $T("ssrc.bidHall.view.button.confirmOpeningBid").$D("确认开标") }}
      </span>
      <div class="tender-content">
        <ul>
          <li>{{ $T("ssrc.bidHall.view.message.title.openingBid").$D("开标") }}</li>
          <li v-if="tenderArr.length>0&&tenderArr[0].passwordFlag">
            <srm-input-field
              v-model="password"
              required
              :label="getLabel()"
              :placeholder="$T('ssrc.bidHall.model.bidHall.inputBidPassword').$D('请输入开标密码')"
              type="password"
              :class="openTip?'':'font-red'"/>
            <span :style="{color:'var(--color-other-default-b)',flexBasis:'100px'}" @click="getPassWord">
              {{ $T("ssrc.bidHall.view.button.resendPassword").$D("重发密码") }}
            </span>
          </li>
        </ul>
        <div class="tender-list">
          <hips-timeline>
            <hips-timeline-item
              v-for="(item,index) in tenderArr"
              :key="index"
              :color="colorArr[index%2]">
              <div class="tender-item">
                <div class="tender-name">{{ item.userName }}</div>
                <div class="tender-status">{{ item.openedFlagMeaning }}</div>
              </div>
            </hips-timeline-item>
          </hips-timeline>
        </div>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import { Timeline, TimelineItem } from "hips";
//oldBidDetail import { openTenderApi, getPassWordApi } from "@/common/BidDetail/api";
import { openTenderApi, getPassWordApi } from "../api";
export default {
  modules: [ "hipspfm.bidHall", "hipspfm.common", "ssrc.bidHall" ],
  name: "OpenTender",
  components: {
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tenderArr: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    bidHeaderId: {
      type: Number | String
    }
  },
  data() {
    return {
      password: "",
      colorArr: [ "var(--color-other-default-c)", "#00CFC" ],
      openTip: true
    };
  },
  watch: {},
  mounted() {},
  methods: {
    getLabel() {
      return <span>{this.$T("ssrc.bidHall.model.bidHall.bidPassword").$D("开标密码")}<span class="bidPassword-label-required">*</span></span>;
    },
    closePop() {
      this.$emit("input", false);
    },
    // 重发密码
    async getPassWord() {
      await getPassWordApi(this.bidHeaderId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.bidHall.view.message.resendPasswordFailed").$D("重发密码失败"),
            description: res.message,
            class: "notification",
            duration: 3
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.bidHall.view.message.resendPasswordSuccess").$D("重发密码成功"),
            class: "notification",
            duration: 3
          });
        }
      });
    },
    // 确认开标
    async openTender() {
      let params = {};
      if (this.tenderArr.length > 0 && this.tenderArr[0].passwordFlag) {
        params.openPassword = this.password;
      }
      await openTenderApi(params, this.bidHeaderId).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.bidHall.view.message.openingBidFailed").$D("开标失败"),
            description: res.message,
            class: "notification",
            duration: 3,
            key
          });
          this.openTip = false;
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.bidHall.view.message.openingBidSuccess").$D("开标成功"),
            class: "notification",
            duration: 3,
            key
          });
          this.closePop();
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
    .cancel {
      color:var(--color-font-default-b);
      padding-left: 20px;
    }

    .confirm {
      color: var(--color-other-default-b);
      text-align: right;
      padding-right: 20px;
    }

  .font-red {
    >>> .hips-input__input-value input {
      color: var(--color-other-default) !important;
    }
  }

  .tender-content {
    padding: 0 20px;

    ul {
      li:nth-child(1) {
        height: 40px;
        nt-family: PingFangSC-Medium;
        font-size: 24px;
        color:var(--color-font-default);
        line-height: 32px;
        font-weight: 700;
      }

      li:nth-child(2) {
        display: flex;
        height: 54px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        border-bottom:1px solid var(--color-border-default);

        .bidPassword-label-required {
          margin-left: 4px;
    color: var(--color-other-default) !important;
        }

        span:nth-child(1), span:nth-child(2) {
          font-size: 16px;
          color: var(--color-font-default);
          line-height: 24px;
        }

        span:nth-child(2) {
          margin: 0px 13px;
        }

        span:nth-child(4) {
          font-size: 14px;
          color: var(--color-other-default-b);
          line-height: 22px;
        }
      }
    }

    >>> .hips-input {
      padding: 0;
      flex: 1;
    }

    >>> .hips-input__input-value input {
      font-size: 16px;
      line-height: 24px;
      color:var(--color-font-default-c);
    }

    >>> .hips-input__input-value input::-webkit-input-placeholder {
      color: var(--color-font-default-e);
    }

    .tender-list {
      .tender-item {
        font-size: 16px;
        letter-spacing: 0;
        line-height: 26px;
        width: 315px;
        display: flex;
        justify-content: space-between;

        .tender-name {
          color:var(--color-font-default);
        }

        .tender-status {
          color: var(--color-other-default-c);
          text-align: right;
        }
      }
    }

    >>> .hips-timeline {
      height: 54px;
    }

    >>> .hips-timeline-item {
      display: flex;
      flex: 1;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0;
    }

    >>> .hips-timeline-item__content {
      top: 0;
      border-bottom:1px solid var(--color-border-default);
      padding: 3.733vw 0;
      margin-left: 20px;
    }

    >>> .hips-timeline-item__head {
      height: 12px;
      width: 12px;
    }
  }
  >>> .srm-popup-header-back,>>>.srm-popup-header-close{
    width:auto !important;
  }

</style>