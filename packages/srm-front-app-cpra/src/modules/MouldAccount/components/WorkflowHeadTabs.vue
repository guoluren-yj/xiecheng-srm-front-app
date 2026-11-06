<template>
  <span v-show="!tabsProps.hidden" class="workflow-head-tabs">
    <srm-button
      :class="tabsProps.activeKey === 'all' ? 'srm-button-on-change':'srm-button-no-change'"
      @click="handleChange('all')">
      {{ $T('smbl.common.view.button.all').$D('全部') }}
    </srm-button>
    <srm-button
      :class="tabsProps.activeKey === 'changed' ? 'srm-button-on-change' : 'srm-button-no-change'"
      @click="handleChange('changed')">
      {{ $T('smbl.common.view.button.onlyChanged').$D('仅变更') }}
    </srm-button>
  </span>
</template>

<script>
export default {
  modules: [ "smbl.common" ],
  name: "WorkflowHeadTabs",
  props: {
    tabsProps: {
      type: Object,
      default: () => ({
        hidden: false,
        activeKey: "all",
      }),
    },
  },
  data() {
    return {};
  },
  methods: {
    handleChange(val) {
      this.$emit("tabsChange", val);
    }
  },
};
</script>

<style lang="stylus" scoped>
.workflow-head-tabs {
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