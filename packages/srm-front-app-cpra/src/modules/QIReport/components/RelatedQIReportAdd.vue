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
import { relatedQIReportAddDS } from "../datasource/relatedAddDS";
export default {
  modules: [ "sqam.common", "entity.roles", "sodr.sendOrder", "entity.order", "entity.business", "entity.organization", "sodr.common", "hzero.common", "sqam.quoteIncomingInspection", "entity.item" ],
  name: "RelatedQIReportAdd",
  props: {
    headerData: {
      type: Object,
      default: () => {},
      required: true,
    },
    addOk: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    const { problemHeaderId, supplierTenantId } = this.headerData;
    return {
      listDs: new DataSet(relatedQIReportAddDS({ problemHeaderId, supplierTenantId })),
      listColumns: [
        {
          fieldCode: "problemNum",
          fieldType: "EMPTY",
          render: (value) => <SrmListHeader>{value}</SrmListHeader>,
        },
        { fieldCode: "problemTitle" },
        { fieldCode: "createdName" },
      ]
    };
  },
  computed: {
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
  }
};
</script>