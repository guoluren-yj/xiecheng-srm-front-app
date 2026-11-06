<template>
  <srm-popup class="cust-dialog"
             :visible="value"
             :show-header="false"
             width="100%"
             height="100%"
             position="center">
    <div class="cust-dialog-container">
      <div class="cust-dialog-content">
        {{ content }}
      </div>
      <div class="cust-dialog-footer">
        <touch-feedback active-class-name="cust-dialog-footer-button-active">
          <div class="cust-dialog-button"
               @click="onCancel">
            {{ $T("smbl.chat.view.dialog.cancelText").$D("取消修改") }}
          </div>
        </touch-feedback>
        <touch-feedback active-class-name="cust-dialog-footer-button-active">
          <div class="cust-dialog-button"
               @click="onConfirm">
            {{ $T("smbl.chat.view.dialog.okText").$D("确认退出") }}
          </div>
        </touch-feedback>
      </div>
    </div>
  </srm-popup>
</template>
<script>
export default {
  name: "CustDialog",
  modules: ["smbl.chat", "smbl.common"],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onCancel() {
      this.$emit("input", false);
      this.$emit("onCancel");
    },
    onConfirm() {
      this.$emit("input", false);
      this.$emit("onConfirm");
    },
  },
};
</script>

<style lang="stylus" scoped>
.cust-dialog {
  .cust-dialog-container {
    position: absolute;
    background: #fff;
    width: 80vw;
    border-radius: 6px;
    font-weight: 400;
    line-height: 24px;
    color: #333;
    font-size: 16px;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .cust-dialog-content {
      padding: 24px 20px;
      text-align: center;
    }

    .cust-dialog-footer {
      display: flex;
      border-top: 1px solid #F6F6F6;

      .cust-dialog-button {
        flex: 1;
        padding: 12px 0;
        text-align: center;

        &:last-child {
          color: #E11900;
          border-left: 1px solid #F6F6F6;
        }
      }
    }
  }

  .cust-dialog-footer-button-active {
    background: var(--background-color-empty-second);
  }
}
</style>
