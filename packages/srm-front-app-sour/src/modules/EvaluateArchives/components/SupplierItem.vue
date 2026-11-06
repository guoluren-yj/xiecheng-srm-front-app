<template>
  <div style="height: 100%">
    <srm-search
      v-model="searchValue"
      :field="{ fieldCode: 'itemName', fieldType: 'TEXT'}"
      :placeholder="$T('sslm.supplierDocManage.model.docManage.itemsName').$D('物料名称')"
      @search="onSearch"/>
    <srm-tree
      v-if="itemData.length"
      v-model="selected"
      :show-tab="editFlag"
      tab-key="itemName"
      primary-key="itemId"
      data-format="TREE"
      :show-checkbox="editFlag"
      :render-fn="renderItem"
      multiple
      :data="itemData" height="calc(100% - 118px)"/>
    <srm-bottom-handler :btn-arr="getButtons()"/>
  </div>
</template>

<script>

import { getSupplierItem } from "../api";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.workbench", "sslm.evaluationTemplate" ],
  name: "SupplierItem",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    },
    supplierId: {
      type: String | Number,
      default: null,
    },
    editFlag: {
      type: Boolean,
      default: false,
    },
    selectedItemVOS: {
      type: Array,
    }
  },
  data() {
    return {
      searchValue: {},
      itemData: [],
      selected: [],
      oldSelected:[], // 初始选中的
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      this.$loading.show();
      this.itemData = [];
      const selectedItemKeys = this.selectedItemVOS && this.selectedItemVOS.filter((e) => e.insertFlag === 1).map((e) => e.itemId);
      getSupplierItem(this.evalHeaderId, this.supplierId, this.searchValue.itemName).then((res) => {
        const itemData = res.content || [];
        this.selected = typeof selectedItemKeys === "undefined" ? itemData.filter((e) => e.evalLineId) : itemData.filter((e) => selectedItemKeys.includes(e.itemId));
        this.oldSelected = itemData.filter((e) => e.evalLineId);
        this.itemData = this.editFlag ? itemData : Array.prototype.slice.call(this.selected);
      }).finally(() => this.$loading.hide());
    },
    onSearch() {
      this.getTreeData();
    },
    renderItem(item) {
      return `${item.itemName}-${item.itemCode}`;
    },
    getButtons() {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          visible: true,
          handler: () => {
            this.$emit("cancel");
          },
        },
        {
          title: this.$T("smbl.common.button.confirm").$D("确定") + `(${this.selected.length})`,
          type: "primary",
          visible: true,
          fill: true,
          handler: () => {
            let itemVOS = [];
            // 选中的数据 insertFlag 置为 1
            itemVOS = this.selected.map((e) => ({
              ...e,
              insertFlag:1,
            }));
            let selectedIds = [];
            selectedIds = this.selected.map((e) => e.itemId);
            // 将已选数据取消选着，需要将 insertFlag 字段置为 0
            this.oldSelected.forEach((element) => {
              if (!selectedIds.includes(element.itemId)) {
                itemVOS.push({ ...element, insertFlag:0 });
              }
            });
            this.$emit("submit", itemVOS);
          },
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>
</style>
