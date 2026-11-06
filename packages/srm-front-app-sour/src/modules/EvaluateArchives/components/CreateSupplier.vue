<template>
  <srm-list
    :data-set="dataSet"
    :columns="getListColumns()"
    :buttons="getListButtons()"/>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import createSupplierDS from "../datasource/createSupplierDS";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.workbench", "sslm.evaluationTemplate" ],
  name: "CreateSupplier",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    },
    exist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dataSet: new DataSet(createSupplierDS(this.evalHeaderId, this.exist)),
    };
  },
  methods: {
    getListButtons() {
      return [
        {
          text: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          visible: true,
          callback: () => {
            this.$emit("cancel");
          },
        },
        {
          text: this.$T("smbl.common.button.confirm").$D("确定"),
          type: "primary",
          visible: true,
          fill: true,
          callback: () => {
            const selected = this.dataSet.selected.map((r) => r.data);
            for (let i = 0; i < selected.length; i++) {
              const r = selected[i];
              if (r.exist) {
                this.$notification.open({
                  message: this.$T("sslm.workbench.model.workbench.supplierExists").$D("存在已选择的供应商，请勿重复选择"),
                });
                return;
              }
            }
            this.$emit("submit", selected);
          },
        },
      ];
    },
    getListColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "companyNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag={false}>
            {val}
            {item.exist && <srm-tag slot="right">{this.$T("smbl.common.view.selected").$D("已选择")}</srm-tag>}
          </SrmListHeader>
        },
        { formRow: 20, fieldCode: "companyName", },
        { formRow: 30, fieldCode: "erpSupplierName", },
        { formRow: 40, fieldCode: "erpSupplierNum", },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
