<template>
  <div style="height: 100%">
    <srm-list
      height="calc(100% - 14px)"
      :data-set="dataSet"
      :show-bottom-bar="false"
      :columns="getListColumns()"/>
    <srm-bottom-handler :btn-arr="getButtons()"/>
  </div>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import backToEvalDS from "../datasource/backToEvalDS";

export default {
  modules: [ "sslm.commonApplication", "sslm.supplierDocManage", "smbl.common" ],
  name: "BackToEval",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      dataSet: new DataSet(backToEvalDS(this.evalHeaderId)),
    };
  },
  methods: {
    getButtons() {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          visible: true,
          handler: () => this.$emit("cancel"),
        },
        {
          title: this.$T("smbl.common.button.confirm").$D("确定"),
          type: "primary",
          visible: true,
          fill: true,
          handler: () => {
            if (!this.dataSet.selected.length) {
              return;
            }
            this.dataSet.submitRecords(this.dataSet.selected).then(() => this.$emit("confirm"));
          },
        },
      ];
    },
    getListColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={false}>{val}</SrmListHeader>
        },
        { formRow: 10, fieldCode: "indicatorName", },
        { formRow: 20, fieldCode: "supplierNum", },
        { formRow: 30, fieldCode: "supplierName", },
        { formRow: 40, fieldCode: "categoryName", },
        { formRow: 50, fieldCode: "completeFlagMeaning", },
        { formRow: 50, fieldCode: "userName", },
        { formRow: 60, fieldCode: "respWeight", },
        { formRow: 60, fieldCode: "score", },
        { formRow: 70, fieldCode: "backReason", },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
