<template>
  <srm-popup
    :visible="visible"
    :title="title"
    @onClose="closePop">
    <div class="container font">
      <div class="form-item">
        <div class="label">
          {{ textAreaLabel }}
          <span v-if="required" class="require-span">*</span>
        </div>
        <div class="line-text">
          <srm-textarea-field
            v-model="reason"
            :height="height"
            :theme="theme"
            :size="size"
            :auto-size="autoSize"
            :show-resizer="showResizer"
            :edit-button="editButton"
            :placeholder="placeholder"/>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0" :btn-arr="getBtnArr"/>
  </srm-popup>
</template>
<script>
import { $T } from "srm-mobile-ui";

export default {
  modules: [ "smbl.common", "hzero.common", "ssrc.inquiryHall" ],
  name: "TextAreaPop",
  props: {
    title: {
      type: String,
      default: $T("smbl.common.message.tips").$D("提示"),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    textAreaLabel:{
      type: String,
      default: $T("smbl.common.message.remark").$D("备注"),
    },
    editButton: {
      type: Boolean,
      default: false,
    },
    showResizer: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "fill",
    },
    height: {
      type: Number,
      default: 120,
    },
    autoSize: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "16",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      reason: "",
    };
  },
  computed: {
    getBtnArr() {
      return [
        {
          title: this.$T("hzero.common.view.button.cancel").$D("取消"),
          type: "primary",
          fill: false,
          bordered: true,
          handler: () => {
            this.closePop();
          },
        },
        {
          title: this.$T("hzero.common.button.confirm").$D("确认"),
          type: "primary",
          fill: true,
          handler: () => {
            this.submit();
          },
        },
      ];
    },
  },
  methods: {
    closePop() {
      this.reason = "";
      this.$emit("changeVisible", false);
    },
    submit() {
      const resValue = this.reason;
      if (this.required) {
        if (this.reason.trim()) {
          this.closePop();
          this.$emit("submit", resValue);
        } else {
          this.$notification.open({
            message: `${this.$T("smbl.common.view.submit.tips").$D("请先填写")}${this.textAreaLabel}`,
            class: "notification"
          });
        }
      } else {
        this.closePop();
        this.$emit("submit", resValue);
      }
    }
  },
};
</script>
<style lang="stylus" scoped>
.FullPop {
  border-radius: 12px 12px 0 0;
}
.head {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  border-radius: 12px 12px 0 0;
  .cancle-img {
    width: 28px;
    height: 28px;
    position: absolute;
    right: 15px;
    bottom: 9px;
  }
}
.container {
  height: 300px;
  overflow: auto;
  padding-bottom: 16px;
  padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  .form-item {
    padding 16px 15px;
    border-top 1px solid #f6f6f6;
    .label {
      color #AFAFAF;
      font-size: 12px;
      line-height: 16px;
    }
    .line-text {
      height: 64px;
      margin-top 8px;
      margin-bottom 40px;
      background: var(--color-bg-default-b);
      border-radius: 8px;
      position: relative;
      >>> .hips-textarea {
        position: static;
        background-color: var(--color-bg-default-b) !important;
        padding: 0 !important;
        textarea:disabled, textarea[disabled]{ -webkit-opacity:0.22; opacity: 0.22;color:var(--color-font-default) !important  }
      }
      >>> .hips-textarea--disabled {
        opacity: 1;
      }
      >>> .hips-textarea__input-value {
        padding: 12px;
        textarea {
          height: 40px !important;
          font-size: 14px !important;
          color: #cbcbcb !important;
          line-height: 20px !important;
        }
      }
      .text-img {
        position: absolute;
        right: 12px;
        bottom: 12px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.font {
  font-size: 16px;
  color: var(--color-font-default);
  line-height: 22px;
}
</style>
