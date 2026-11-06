<template>
  <div style="height: 100vh">
    <srm-list
      :columns="listColumns"
      :data-set="listDs"
      :buttons="listButtons"/>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { relatedOQDocAddDS } from "../datasource/relatedAddDS";
import { formatListColumns } from "../utils";
export default {
  modules: [ "sqam.common", "entity.roles", "sodr.sendOrder", "entity.order", "entity.business", "entity.organization", "sodr.common", "hzero.common", "sqam.quoteIncomingInspection", "entity.item", "smbl.common", "entity.supplier", "entity.company" ],
  name: "RelatedQCDocAdd",
  props: {
    headerData: {
      type: Object,
      default: () => {},
      required: true,
    },
    decisionResults: {
      type: String,
    },
    addOk: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const { headerData, decisionResults } = this;
    return {
      listDs: new DataSet(relatedOQDocAddDS(headerData, decisionResults)),
    };
  },
  computed: {
    listColumns() {
      const fieldsList = [
        "inspectionNum",
        "itemCode",
        "itemName",
        "poNum",
        "transactionNum"
      ];
      return formatListColumns(fieldsList);
    },
    listButtons() {
      const { addOk, listDs } = this;
      return [
        {
          text: this.$T("hzero.common.button.confirm").$D("确认"),
          fill: true,
          type: "primary",
          disabled: (checkedList) => checkedList.length === 0,
          callback: async () => addOk(listDs),
        },
      ];
    },
  },
};
</script>