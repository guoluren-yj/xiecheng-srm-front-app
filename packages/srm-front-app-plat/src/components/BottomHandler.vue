
<template>
  <div :id="id" class="bottom-handler" :style="{position}">
    <span
      v-for="(item,index) in btnArr"
      :key="index"
      :style="{color: item.color,border: '1px solid '+item.color, background: item.background}"
      @click="item.handler">{{ item.title }}</span>
  </div>
</template>
<script>
export default {
  modules: [ "hipspfm.common" ],
  name: "BottomHandler",
  props: {
    btnArr: {
      type: Array,
      default: () => [
        {
          // eslint-disable-next-line no-invalid-this
          title: this.$T("hipspfm.common.button.moreOperate").$D("更多操作"),
          color: "var(--color-font-default-b)",
          handler: () => {}
        },
        {
          // eslint-disable-next-line no-invalid-this
          title: this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          color: "var(--color-other-default)",
          handler: () => {}
        },
        {
          // eslint-disable-next-line no-invalid-this
          title: this.$T("hipspfm.common.button.approved").$D("审批通过"),
          color: "var(--color-other-default-b)",
          handler: () => {}
        }
      ]
    },
    position: {
      type: String,
      default: "fixed"
    },
    id: {
      type: String,
      default: "FootButton"
    }
  }
};
</script>
<style lang="stylus" scoped>
.bottom-handler {
  width: 100%;
  text-align: center;
  padding-top: 8px;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 8px;
  padding-bottom: calc(8px+constant(safe-area-inset-bottom));
  padding-bottom: calc(8px+env(safe-area-inset-bottom));
  background: var(--color-bg-default);
  opacity: 0.9;
  bottom: 0;
  display: flex;
  z-index: 50;

  span {
    flex: 1;
    font-weight: bold;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    display: inline-block;
    border-radius: 4px;
    line-height: 42px;
    &:nth-child(even) {
      margin-left: 25px;
    }
  }
}
</style>