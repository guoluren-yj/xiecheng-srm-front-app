<template>
  <srm-popup
    :visible="visible" position="top" @onClose="closePop">
    <div class="container">
      <div class="line-title">{{ $T("ssrc.supplierQuotation.model.supQuo.quotationEndDate").$D("截止时间") }}</div>
      <div class="show-time">
        <srm-calendar-field v-model="roundQuotationEndDate" theme="fill"/>
      </div>
      <div class="line-title">{{ $T("ssrc.bidHall.model.bidHall.startingReason").$D("开始原因") }}</div>
      <div class="line-text">
        <srm-textarea-field
          v-model="startingReason"
          placeholder=""
          theme="fill"
          :min-height="80"/>
      </div>
    </div>

    <bottom-handler :btn-arr="getBtnArr" position="static" height="40" />
  </srm-popup>
</template>
<script>
import BottomHandler from "@/components/NewBottomHandler";

export default {
  modules: [ "hipspfm.common", "ssrc.supplierQuotation", "ssrc.bidHall" ],
  name: "NewQuotePop",
  components: {
    BottomHandler,
  },
  filters: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number | String,
      default: 0,
    },
  },
  data() {
    return {
      datePopup: false,
      roundQuotationEndDate: "",
      startingReason: "",
    };
  },
  computed: {
    getBtnArr() {
      const arr = [
        {
          title: this.$T("hipspfm.common.button.cancle").$D("取消"),
          color: "#757575",
          background: "#f6f6f6",
          handler: () => {
            this.closePop();
          },
        },
        {
          title: this.$T("ssrc.supplierQuotation.model.supQuo.confirmLaunch").$D("确定发起"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.confirm();
          },
        },
      ];
      return arr;
    },
  },
  methods: {
    confirm() {
      const now = new Date();
      // eslint-disable-next-line no-useless-escape
      const time = new Date(this.roundQuotationEndDate.replace(/\-/g, "/"));
      if (now.getTime() < time.getTime()) {
        this.$emit("confirm", {
          startingReason: this.startingReason,
          roundQuotationEndDate: this.roundQuotationEndDate,
        });
      } else {
        this.$notification.open({
          // eslint-disable-next-line rulesdir/check_modules
          message: this.$T("").$D("截至时间必须大于当前选择日期"),
          description: "",
          class: "notification",
        });
      }
    },
    closePop() {
      this.$emit("changeVisible", false);
    },
  },
};
</script>
<style lang="stylus" scoped>
.container {
  min-height: 236px;

  .line-title {
    margin: 16px 15px 8px 15px;
    font-size: 12px;
    text-align: left;
    color: var(--color-font-default-b);
    line-height: 16px;
  }

  .show-time {
    margin-left: 15px;
    padding: 0 15px 16px 0;
    border-bottom: 1px solid var(--color-border-default);
    font-size: 14px;
    text-align: left;
    color: var(--color-font-default);
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time-img {
      width: 20px;
      height: 20px;
    }
  }

  .line-text {
    margin: 0 15px 16px 15px;
    background: var(--color-bg-default-b);
    border-radius: 8px;
    position: relative;

    >>> .hips-textarea {
      position: static;
      background-color: var(--color-bg-default-b) !important;
      padding: 0 !important;
      textarea:disabled, textarea[disabled]{ -webkit-opacity:0.22; opacity: 0.22;color:var(--color-font-default) !important  }
    }

    >>> .hips-textarea__input-value {
      padding: 12px;
    }

    .text-img {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 20px;
      height: 20px;
    }
  }

  .time-input {
    position: static;
    height: 20px;
    padding: 0;
    width: 80%;

    >>> .hips-input__body .hips-input__input-value input {
      font-size: 14px;
      text-align: left;
      color: var(--color-font-default);
      line-height: 20px;
    }
  }
}

>>> .hips-button {
  padding: 0 16px;
}
</style>
