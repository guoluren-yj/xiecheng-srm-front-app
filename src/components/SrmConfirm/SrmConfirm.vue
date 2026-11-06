<template>
  <srm-popup width="100%" height="330px" :visible="visible" position="top" :show-header="false" @onClose="close">
    <div class="srm-confirm">
      <div class="srm-confirm-title">
        <span v-if="required" class="require-span">*</span> {{ title || $T('hipspfm.common.message.remark').$D('备注') }}
      </div>
      <div class="srm-confirm-input">
        <!-- <srm-textarea-field theme="fill" :placeholder="$T('smbl.common.view.pleaseInput',[title||$T('hipspfm.common.message.remark').$D('备注')]).$D('请输入{}')"/> -->
        <srm-textarea-field v-model="inputValue" theme="fill" :placeholder="$T('hipspfm.workFlow.view.message.inputApproveRemark').$D('请输入审批意见')"/>
      </div>
      <srm-flex class="srm-confirm-footer">
        <touch-feedback active-class-name="srm-confirm-footer-button-active">
          <srm-flex-item class="srm-confirm-footer-cancel" flex="1" @click.native.stop="cancel">{{ cancelText || $T("smbl.common.button.cancel").$D("取消") }}</srm-flex-item>
        </touch-feedback>
        <touch-feedback active-class-name="srm-confirm-footer-button-active">
          <srm-flex-item class="srm-confirm-footer-ok" flex="1" @click.native.stop="ok">{{ okText || $T("smbl.common.button.ok").$D("确认") }}</srm-flex-item>
        </touch-feedback>
      </srm-flex>
    </div>
  </srm-popup>
</template>

<script>
import { Exception } from "@/utils/index";
export default {
  modules: [ "hzero.common", "hipspfm.common", "hipspfm.workFlow", "smbl.common" ],
  name: "SrmConfirm",
  data() {
    return {
      inputValue: "",
      visible: false,
      title: null,
      required: false,
      content: "",
      okText: null,
      cancelText: null,
      showCancel: true,
      showOk: true,
      onOk: null,
      onCancel: null,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit("input", false);
    },
    cancel() {
      if (this.onCancel) {
        this.onCancel();
      } else {
        this.close();
      }
    },
    ok() {
      if (!this.inputValue && this.required) {
        // eslint-disable-next-line new-cap
        Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.title ]);
      } else if (this.onOk) {
        this.onOk(this.inputValue, this.close);
      } else {
        this.$emit("confirmInfo", this.inputValue);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>

.srm-confirm {
  position: relative;
  width: 100%;
  height: 100%;
}

.srm-confirm-title {
  padding: 16px 0px 8px 20px;
  font-size: 18px;
  color: var(--color-font-default);
  line-height: 26px;
  font-weight: bold;
}
.srm-confirm-footer {
  position: absolute;
  bottom: 0;
  border-top: 1px solid var(--color-border-default);
  .srm-flex-item {
    height: 56px;
    line-height: 56px;
    text-align: center;
  }
}

.srm-confirm-input {
  padding: 0 20px;
  >>>.srm-textarea {
    height: 100px;
  }
}

.srm-confirm-footer-cancel {
  color: var(--color-font-default-b);
}

.srm-confirm-footer-ok {
  background: var(--color-other-default-b);
  color: #ffffff;
}

.srm-confirm-footer-button-active {
  background #eee;
}

</style>
