<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet" customize-code="SMBL.DELIVERY_BILL_QUERY.LIST" :columns="getColumns" @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "sinv.purchaserDelivery", "sinv.purchaseReception", "sinv.common", "entity.supplier" ],
  name: "DeliveryBillQueryList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  computed: {
    getColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.asnNum}</span>
          <span slot="right">{item.asnStatusMeaning}</span>
        </SrmListHeader>
      }, {
        fieldName: this.$T("entity.supplier.tag").$D("供应商"),
        fieldCode: "supplierCompanyName",
      },
      {
        fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
        fieldCode: "organizationName",
      },
      {
        fieldName: this.$T("sinv.common.model.common.expectedArriveTime").$D("预计到货时间"),
        fieldCode: "expectedArriveDate",
      } ];
    }
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      // const { asnHeaderId, organizationName, purchaseAgentName } = data;
      const { asnHeaderId, purchaseAgentName } = data;

      this.$router.push({
        name: "DetailDocument",
        query: { asnHeaderId, purchaseAgentName }
        // query: { asnHeaderId, organizationName, purchaseAgentName }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
