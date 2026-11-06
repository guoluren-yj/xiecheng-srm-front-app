<template>
  <div style="height: 100vh;">
    <srm-tree
      height="100%"
      :title="$T('ssrc.priceLibraryNew.model.library.viewScope').$D('适用范围')"
      :data="list"
      tab-key="dataName"
      parent-key="parentKey"
      primary-key="key"
      :show-checkbox="false"
      data-format="LIST"
      :render-fn="renderItem"/>
  </div>
</template>

<script>
export default {
  modules: [ "ssrc.priceLibraryNew" ],
  name: "ViewScope",
  components: {
  },
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {
    };
  },
  methods: {
    renderItem(item) {
      return item.firstFlag ? <span>{item.dataName}</span> : <span>{item.dataCode}-{item.dataName}</span>;
    },
  },
};
</script>

<style lang="stylus" scoped></style>
