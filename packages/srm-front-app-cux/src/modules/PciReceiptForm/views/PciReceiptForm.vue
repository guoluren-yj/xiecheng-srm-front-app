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
import { tableDs } from "../dataSource/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "scux.receipt" ],
  name: "PciReceiptForm",
  data() {
    const {
      app: {
        _route: {
          query: { asnSignHeaderId },
        },
      },
    } = this.$router;
    return {
      lineDataDs: new DataSet(tableDs()),
      asnSignHeaderId,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "signNum",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span> {val}</span>
            <span slot="right" style="color:#276EF1;">{record.signStatusMeaning}</span>
          </SrmListHeader>,
        },
        { fieldCode: "workApproveString" },
        { fieldCode: "asnNum" },
        { fieldCode: "asnAddressTypeMeaning" },
        { fieldCode: "shipDate" },
        { fieldCode: "supplierName" },
        { fieldCode: "companyName" },
        { fieldCode: "signRemark" },
        { fieldCode: "createName" },
        { fieldCode: "creationDate" },
        { fieldCode: "importStatusMeaning" },
        { fieldCode: "attributeVarchar1" },
        { fieldCode: "attributeVarchar2Meaning" },
        { fieldCode: "attributeVarchar3" },
        { fieldCode: "attributeVarchar5Meaning" },
        { fieldCode: "attributeVarchar6" },
        { fieldCode: "option" },
      ];
    },
  },
  mounted() {
    if (this.asnSignHeaderId) {
      this.lineDataDs.addQueryParameter("asnSignHeaderId", this.asnSignHeaderId);
    }
    this.lineDataDs.query();
  },
  methods: {
    onItemClick() {
      const { asnSignHeaderId } = this.lineDataDs.current.data;
      this.$router.push({
        name: "PciReceiptFormDetail",
        query: { asnSignHeaderId, tenantId: SrmUtil.getTenantId() },
      });
    },
  },
};
</script>