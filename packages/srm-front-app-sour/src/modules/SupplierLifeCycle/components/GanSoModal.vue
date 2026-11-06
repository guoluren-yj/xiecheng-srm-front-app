<template>
  <srm-popup :visible.sync="modalProps.visible" show-back :title="title" @onClose="modalProps.onClose">
    <srm-list :data-set="modalDataSet" :scrollable="false" :columns="columns" />
  </srm-popup>
</template>
<script>
export default {
  modules: [ "sslm.common" ],
  name: "GanSoModal",
  props: {
    modalProps: {
      type: Object,
    }
  },
  computed: {
    modalDataSet() {
      return this.modalProps.dataSet;
    },
    title() {
      return this.modalProps.title;
    },
    columns() {
      return this.modalProps.dataSet.fields.map((t) => ({
        fieldName: t.fieldName,
        fieldCode: t.fieldCode,
      }));
    },
  },
};
</script>
<style lang="stylus" scoped>
</style>
