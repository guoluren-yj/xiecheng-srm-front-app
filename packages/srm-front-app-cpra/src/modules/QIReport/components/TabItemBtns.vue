<template>
  <srm-flex
    v-show="showFlag && dataSet.isReady"
    justify="end"
    class="tab-item-button">
    <em
      v-show="!dataSet.editFlag"
      class="srm-icon icon-edit"
      @click="Object.assign(dataSet, { editFlag: true })"/>
    <em
      v-show="!dataSet.editFlag"
      class="srm-icon icon-plus"
      @click="addItem"/>
    <srm-button
      v-show="dataSet.editFlag"
      plain
      type="danger"
      :disabled="dataSet.selected.length === 0"
      @click="deleteSelected">
      {{ $T("hzero.common.button.delete").$D("删除") }}
    </srm-button>
    <srm-button
      v-show="dataSet.editFlag"
      plain
      @click="Object.assign(dataSet, { editFlag: false })">
      {{ $T("hzero.common.button.cancel").$D("取消") }}
    </srm-button>
  </srm-flex>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "hzero.common" ],
  name: "TabItemBtns",
  props: {
    showFlag: {
      type: Boolean,
      default: true,
    },
    dataSet: {
      type: DataSet,
      default: () => new DataSet(),
    },
  },
  methods: {
    addItem() {
      this.$emit("addItem");
    },
    deleteSelected() {
      this.$emit("deleteSelected");
    }
  },
};
</script>
<style lang="stylus" scoped>
.tab-item-button {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  gap: 12px;

  .srm-icon {
    font-size: 20px;
    color: var(--font-color-disable);
  }
}
</style>