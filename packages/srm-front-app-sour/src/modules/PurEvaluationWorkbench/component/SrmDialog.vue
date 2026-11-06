<!-- 三个按钮提示框 -->
<script>
export default {
  modules: [ "smbl.common" ],
  name: "SrmDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    okText: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "",
    },
    otherText: {
      type: String,
      default: "",
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showOk: {
      type: Boolean,
      default: true,
    },
    showOther: {
      type: Boolean,
      default: false,
    },
    onOk: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onOther: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {},
  methods: {
    cancel() {
      if (this.onCancel) {
        this.onCancel();
      }
    },
    ok() {
      if (this.onOk) {
        this.onOk();
      }
    },
    other() {
      if (this.onOther) {
        this.onOther();
      }
    },
  },
  render() {
    return (
      <SrmPopup visible={this.show} width="100%" height="100%" position="center" show-header={false}>
        <div class="srm-dialog-container">
          <div class="srm-dialog">
            <div class="srm-dialog-header">
              {this.title || this.$T("smbl.common.message.tip").$D("提示")}
            </div>
            <div class="srm-dialog-content">
              {this.content}
            </div>
            <SrmFlex class="srm-dialog-footer">
              {
                this.showCancel &&
                <TouchFeedback active-class-name="srm-dialog-footer-button-active">
                  <SrmFlexItem class="srm-dialog-footer-cancel" flex="1" nativeOnClick={this.cancel}>
                    {this.cancelText || this.$T("smbl.common.button.cancel").$D("取消")}
                  </SrmFlexItem>
                </TouchFeedback>
              }
              {
                this.showOther &&
                <TouchFeedback active-class-name="srm-dialog-footer-button-active">
                  <SrmFlexItem class="srm-dialog-footer-other" flex="1" nativeOnClick={this.other}>
                    {this.otherText}
                  </SrmFlexItem>
                </TouchFeedback>
              }
              {
                this.showOk &&
                <TouchFeedback active-class-name="srm-dialog-footer-button-active">
                  <SrmFlexItem class="srm-dialog-footer-ok" flex="1" nativeOnClick={this.ok}>
                    {this.okText || this.$T("smbl.common.button.ok").$D("确认")}
                  </SrmFlexItem>
                </TouchFeedback>
              }
            </SrmFlex>
          </div>
        </div>
      </SrmPopup>
    );
  },
};
</script>

<style lang="stylus" scoped>
.srm-dialog-container {
  color var(--font-color-default);
  width 100%;
  height 100%;
  display flex;
  align-items center;
  justify-content center;
  background transparent;
}
>>>.srm-popup-center {
  display flex;
  align-items center;
}
>>>.srm-popup {
  background transparent;
}
.srm-dialog {
  background var(--background-color-empty);
  width 80%;
  border-radius 6px;
  font-size 16px;
  overflow hidden;
}
.srm-dialog-header {
  font-weight bold;
  text-align center;
  margin-top 20px;
}
.srm-dialog-content {
  margin-top 8px;
  padding 0 15px;
  display flex;
  color #757575;
  align-items center;
  justify-content center;
  overflow-x hidden;
  overflow-y scroll;
  text-align center;
}
.srm-dialog-footer {
  margin-top 20px;
  .srm-flex-item {
    height 48px;
    display flex;
    align-items center;
    justify-content center;
  }
}
.srm-dialog-footer-cancel {
  position relative;
  overflow hidden;
  border-right var(--background-color-empty-second) solid 1px;
}
.srm-dialog-footer-other {
  position relative;
  overflow hidden;
  border-right var(--background-color-empty-second) solid 1px;
}
.srm-dialog-footer-button-active {
  background var(--background-color-empty-second);
}
.srm-dialog-footer-ok {
  position relative;
  overflow hidden;
  color var(--font-color-primary);
}
</style>
