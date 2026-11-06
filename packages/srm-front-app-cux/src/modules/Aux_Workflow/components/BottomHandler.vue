
<template>
  <!-- eslint-disable -->
  <div class="bottom-handler">
    <span v-if="formForm && canApproveFlag && showApproveBtn" class="srm-icon icon-arrow-back-up left-icon" @click="showOperationForm" />
    <div class="bottom-btn">
      <SrmButton v-if="formForm && canApproveFlag && showApproveBtn" size="x-large" type="primary" fill :full-width="true" @click="$emit('confirm')">{{ $T('hipspfm.common.button.confirm').$D('确认') }}</SrmButton>
      <SrmButton v-if="!formForm && otherDisplay && canApproveFlag && showApproveBtn" size="x-large" type="primary" fill :full-width="true" @click="showOperationForm">{{ $T('hipspfm.common.message.handlerProcess').$D('流程处理') }}</SrmButton>
      <SrmButton v-if="otherDisplay && canApproveFlag && userFlag" size="x-large" type="primary" fill :full-width="true" @click="$emit('handleDiscard')">{{ $T('hipspfm.common.message.discard').$D('废弃') }}</SrmButton>
    </div>
    <span v-if="formForm && canApproveFlag && showApproveBtn" class="srm-icon icon-mist right-icon" @click="showOperationPop" />
  </div>
</template>
<script>
export default {
  modules: [ "hipspfm.common" ],
  name: "BottomHandler",
  inject: {
    showOperationForm: {
      default: null,
    },
    showOperationPop: {
      default: null,
    }
  },
  props: {
    formForm: {
      type: Boolean,
      default: false,
    },
    canApproveFlag: {
      type: Boolean,
      default: false,
    },
    showApproveBtn: {
      type: Boolean,
      default: false,
    },
    otherDisplay: {
      type: Boolean,
      default: false,
    },
    userFlag: {
      type: Boolean,
      default: false,
    },
  }
};
</script>
<style lang="stylus" scoped>
.bottom-handler {
  width: 100%;
  text-align: center;
  padding-top: 12px;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 12px;
  background: var(--color-bg-default);
  // opacity: 0.9;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-icon, .right-icon {
  font-size: 32px;
}
.left-icon {
  margin-right: 30px;
}
.right-icon {
  margin-left: 30px;
}
.bottom-btn {
  flex: 1;
}
</style>
