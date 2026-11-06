<template>
  <div style="height: 100%">
    <!-- <srm-search
      v-model="searchValue"
      :field="{ fieldCode: 'categoryName', fieldType: 'TEXT'}"
      :placeholder="$T('sslm.supplierDocManage.model.docManage.categoryName').$D('品类名称')"
      @search="onSearch"/> -->
    <srm-tree
      v-if="regionsLinkageData.length"
      v-model="selected"
      :show-tab="editFlag"
      tab-key="regionName"
      primary-key="regionId"
      data-format="TREE"
      :show-checkbox="editFlag"
      :render-fn="renderItem"
      multiple
      :data="regionsLinkageData" height="calc(100% - 118px)"/>
    <srm-bottom-handler :btn-arr="getButtons()"/>
  </div>
</template>

<script>

import { getRegionsInfoApi } from "../api/index";

export default {
  modules: [ "smbl.common" ],
  name: "RegionsLinkage",
  props: {
    countryId: {
      type: String | Number,
      default: null,
    },
    editFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // searchValue: {},
      regionsLinkageData: [],
      selected: [],
    };
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      this.$loading.show();
      this.regionsLinkageData = [];
      getRegionsInfoApi(this.countryId).then((res) => {
        const regionsLinkageData = res || [];
        this.regionsLinkageData = regionsLinkageData;
        // this.selected = regionsLinkageData.filter((e) => e.evalLineId);
        // this.regionsLinkageData = this.editFlag ? regionsLinkageData : Array.prototype.slice.call(this.selected);
      }).finally(() => this.$loading.hide());
    },
    onSearch() {
      this.getTreeData();
    },
    renderItem(item) {
      return `${item.regionName}-${item.regionCode}`;
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
