<template>
  <srm-list-header :show-open-tag="false" style="width: 100%" class="srm-list-header" v-bind="$attrs" v-on="$listeners">
    <slot/>
    <div slot="right">
      <div class="srm-list-header-slot-right">
        <slot name="right"/>
        <span v-if="showOpenTag" class="right-icon srm-icon icon-chevron-right"/>
      </div>
    </div>
  </srm-list-header>
</template>
<script>
export default {
  name: "NewSrmListHeader",
  props:{
    showOpenTag:{
      type: Boolean,
      default: true,
    }
  }
};
</script>
<style lang="stylus" scoped>
.srm-list-header{
  >>> .srm-list-item-card-head-right{
    margin-left: 8px;
    flex-shrink: 0;
    min-width: auto !important;
  }
  >>> .srm-list-item-card-head-left{
    max-width: 100% !important;
  }
  >>> .srm-list-header-slot-right{
    display: flex;
    align-items: center;
    .right-icon{
        font-size: 16px;
        line-height: 18px;
        margin-left: 8px;
        color: #333;
        font-weight: 400;
    }
  }
}
</style>