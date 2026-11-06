<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="lineDataDs"
      :columns="getLineDataColumns"
      @itemClick="onItemClick"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineDs } from "../datasource/index";

export default {
  modules: [ "scux.pciQialityInspection" ],
  name: "PCISubmitInspectionList",
  data() {
    return {
      lineDataDs: new DataSet(lineDs()),
      formDataDs: null,
      distributionFlag: false,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "asnNum",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span> {val}</span>
            <span slot="right" style="color:#276EF1;">{record.checkStatusMeaning}</span>
          </SrmListHeader>,
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "organizationName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
  },
  methods: {
    getFormColumns(type = "") {
      return type === "returnInspections" ? [
        {
          fieldCode: "checkRemark",
        },
      ] : [
        {
          fieldCode: "employeeNum",
        },
      ];
    },
    onItemClick() {
      const { asnCheckHeaderId } = this.lineDataDs.current.data;
      this.$router.push({
        name: "PCISubmitInspectionDetails",
        query: { asnCheckHeaderId },
      });
    },
  },
};
</script>