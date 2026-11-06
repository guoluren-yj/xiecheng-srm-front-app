<template>
  <hips-popup
    v-model="value"
    style="height: 330px;width:100%"
    position="top"
    :overlay-on-click-close="false">
    <div class="body">
      <div class="title">
        <span v-if="type==='reject'">*</span>
        {{ $T(title).$D(title) }}
      </div>
      <hips-textarea
        v-model="inputValue"
        :placeholder="'     '+$T('hipspfm.common.message.pleaseEnter').$D('请输入')+$T(title).$D(title)"
        input-align="top"
        auto-height
        show-count/>
    </div>
    <div class="supplier-confirm">
      <span @click="closePop">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
      <span
        style="background: var(--color-other-default-b);"
        @click="handleEvent">{{ $T('hzero.common.button.confirm').$D("确认") }}</span>
    </div>
  </hips-popup>
</template>

<script>
import { Popup, NavBar, Textarea } from "hips";

export default {
  modules: [ "hzero.common", "hipspfm.common" ],
  name: "InfoPop",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "save"
    },
    title: {
      type: String,
      default: "hipspfm.common.message.title.feedbackInfo"
    }
  },
  data() {
    return {
      inputValue: ""
    };
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    handleEvent() {
      if (this.inputValue) {
        this.$emit("confirmInfo", this.inputValue);
      } else {
        this.Exception(this,
          this.$T("hzero.common.validation.notNull").$D("{name}不能为空"),
          [ this.title ]);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../style/mixin.styl'
.body {
  .title {
    padding: 16px 0px 8px 20px;
    font-size: 18px;
    color: var(--color-font-default);
    line-height: 26px;
    font-weight: bold;

    span {
      color: var(--color-other-default);
    }
  }

  >>> .hips-textarea {
    position: static;
    font-family: PingFangSC-Regular;
    padding: 0px 20px 12px 20px;
    align-items: center;
  }

  >>> .hips-textarea__input-value textarea {
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 28px;
    height: 100px !important;
  }

  >>> .hips-textarea__input-value textarea::-webkit-input-placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat;
    background-size: 20px 20px;
    color: var(--color-font-default-e);
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-moz-placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::-moz-placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-ms-input-placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat !important;
    color: var(--color-font-default-e);
    background-size: 20px 20px !important;
    background-position-y: 3px !important;
  }

  >>> .hips-textarea__input-value textarea::-ms-input-placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::placeholder {
    bg_url(icon_editor_b)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__count {
    color: var(--color-font-default-e);
  }
}

.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 56px;
  height: 56px;
  font-size: 18px;
  color:var(--color-font-default-d);
  border-top:1px solid var(--color-border-default);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(1) {
    color:var(--color-font-default-b);
  }
}
</style>