<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet" customize-code="SMBL.MYDELIVERY.LIST" :columns="getColumns" @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "sinv.purchaserDelivery", "sinv.purchaseReception", "hipspfm.common", "sinv.common" ],
  name: "MyDeliveryList",
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
        fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
        fieldCode: "companyName",
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
      const { asnHeaderId } = data;

      this.$router.push({
        name: "MyDeliveryDetail",
        query: { asnHeaderId }
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
