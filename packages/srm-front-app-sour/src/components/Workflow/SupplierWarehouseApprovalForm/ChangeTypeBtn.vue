<template>
  <span v-if="btnParams.showBtnComp" class="change-type-btn">
    <srm-button
      :class="btnParams.activeAll ? 'srm-button-on-change':'srm-button-no-change'"
      @click="hanldeBtnChange(true)">
      {{ $T('sslm.common.view.button.all').$D('全部') }}
    </srm-button>
    <srm-button
      :class="btnParams.activeAll ? 'srm-button-no-change':'srm-button-on-change'"
      @click="hanldeBtnChange(false)">
      {{ $T('sslm.common.view.button.onlyChange').$D('仅变更') }}
    </srm-button>
  </span>
</template>

<script>
export default {
  modules: [ "sslm.common" ],
  name: "ChangeTypeBtn",
  props: {
    btnParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    hanldeBtnChange(val) {
      const { handleChangeType } = this.btnParams;
      if (handleChangeType) {
        handleChangeType(val);
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
  .change-type-btn {
     background: rgb(239, 239, 239);
     border-radius: 4vw;
     display: inline-block;
     margin-left: auto;
    .srm-button-on-change {
      background: #FFFFFF;
      color: rgba(0,0,0,.8) !important;
      line-height: 16px;
      font-size: 12px;
      font-weight: 600;
      height: 24px;
      padding-left: 8px;
      padding-right: 8px;
    }
    .srm-button-no-change {
      background: rgb(239, 239, 239);
      color: rgba(0,0,0,.45) !important;
      line-height: 16px;
      font-size: 12px;
      font-weight: 500;
      height: 24px;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
</style>