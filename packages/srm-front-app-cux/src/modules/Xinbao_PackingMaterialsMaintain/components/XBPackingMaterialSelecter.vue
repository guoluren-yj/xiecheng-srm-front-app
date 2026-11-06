<template>
  <srm-popup :visible.sync="show" :title="title" height="70%" rounded>
    <srm-list :data-set="dataSet" :columns="getColumns()" @itemClick="onItemClick" />
  </srm-popup>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import packingMaterialsListDatasource from "../datasource/XBPackingMaterialsListDS";
import XBPackingMaterialItem from "./XBPackingMaterialItem";
export default {
  modules: [ "smbl.common" ],
  name: "XBPackingMaterialSelecter",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "弹窗标题",
    },
    currentItemId: { // 当前选中的item
      type: String,
      default: null,
    }
  },
  data() {
    return {
      dataSet: new DataSet(packingMaterialsListDatasource()),
    };
  },
  computed: {
    show: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    getColumns() {
      return [ {
        fieldType: "EMPTY",
        render: (val, item) => {
          return (
            <XBPackingMaterialItem v-model={item} isSelected={this.currentItemId === item.itemCode} />
          );
        },
      }, ];
    },
    onItemClick(item) {
      this.$emit("didSelectAtItem", item.data);
      this.$emit("input", false);
    }
  },
};
</script>

<style lang="stylus" scoped>
</style>
