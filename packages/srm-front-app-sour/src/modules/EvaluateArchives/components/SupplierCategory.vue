<template>
  <div style="height: 100%">
    <srm-search
      v-model="searchValue"
      :field="{ fieldCode: 'categoryName', fieldType: 'TEXT'}"
      :placeholder="$T('sslm.supplierDocManage.model.docManage.categoryName').$D('品类名称')"
      @search="onSearch"/>
    <srm-tree
      v-if="categoryData.length"
      v-model="selected"
      :show-tab="editFlag"
      tab-key="categoryName"
      primary-key="categoryId"
      data-format="TREE"
      :show-checkbox="editFlag"
      :render-fn="renderItem"
      multiple
      :data="categoryData" height="calc(100% - 118px)"/>
    <srm-bottom-handler :btn-arr="getButtons()"/>
  </div>
</template>

<script>

import { getSupplierCategory } from "../api";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.workbench", "sslm.evaluationTemplate" ],
  name: "SupplierCategory",
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
    selectedCategoryVOS: {
      type: Array,
    }
  },
  data() {
    return {
      searchValue: {},
      categoryData: [],
      selected: [],
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      this.$loading.show();
      this.categoryData = [];
      const selectCategoryKeys = this.selectedCategoryVOS && this.selectedCategoryVOS.map((e) => e.categoryId);
      getSupplierCategory(this.evalHeaderId, this.supplierId, this.searchValue.categoryName).then((res) => {
        const categoryData = res || [];
        this.selected = typeof selectCategoryKeys === "undefined" ? categoryData.filter((e) => e.evalLineId) : categoryData.filter((e) => selectCategoryKeys.includes(e.categoryId));
        this.categoryData = this.editFlag ? categoryData : Array.prototype.slice.call(this.selected);
      }).finally(() => this.$loading.hide());
    },
    onSearch() {
      this.getTreeData();
    },
    renderItem(item) {
      return `${item.categoryName}-${item.categoryCode}`;
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
            this.$emit("submit", this.selected);
          },
        },
      ];
    },
  }
};
</script>

<style lang="stylus" scoped>
</style>
