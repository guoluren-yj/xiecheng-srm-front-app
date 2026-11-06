
<template>
  <div :id="id" class="bottom-handler" :style="{position}">
    <span
      v-for="(item,index) in btnArr"
      :key="index"
      :style="{color: item.color, background: item.background,lineHeight:height+'px'}"
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
    },
    height:{
      type: String | Number,
      default: "48"
    }
  }
};
</script>
<style lang="stylus" scoped>
.bottom-handler {
  width: 100%;
  text-align: center;
  padding-top: 12px;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 12px;
  padding-bottom: calc(12px+constant(safe-area-inset-bottom));
  padding-bottom: calc(12px+env(safe-area-inset-bottom));
  background: var(--color-bg-default);
  opacity: 0.9;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    display: inline-block;
    border-radius: 24px;
    line-height: 48px;
    &:nth-child(even) {
      margin-left: 25px;
    }
  }
}
</style>