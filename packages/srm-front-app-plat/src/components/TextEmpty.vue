<template>
  <div class="text-empty">
    {{ text || $T('hipspfm.common.view.message.noInfo').$D('暂无信息') }}
  </div>
</template>
<script>
export default {
  modules: ["hipspfm.common"],
  name: "TextEmpty",
  props:{
    text:{
      type: String,
      default: "",
    }
  }
};
</script>
<style lang="stylus" scoped>
.text-empty{
  width: 100%;
  font-size: 12px;
  color: var(--font-color-field2);
  line-height: 16px;
  font-weight: 400;
  padding: 18px 30px;
  text-align: center
}
</style>