<template>
  <div class="form">
    <srm-customize-detail :data-set="dataSet" theme="fill" :columns="getColumns()" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { logisticInfoDS } from "../datasource/indexDS";

export default {
  modules: [ "ssrc.inquiryHall", "sinv.purchaseReception", "sinv.common", "entity.supplier" ],
  name: "SrmFormExample",
  data() {
    return {
      asnHeaderId:null,
      dataSet: new DataSet(logisticInfoDS(this.asnHeaderId)),
    };
  },
  beforeMount() {
    const { asnHeaderId } = this.$route.query;
    this.asnHeaderId = asnHeaderId;
  },
  methods: {
    getColumns() {
      return [
        { fieldCode: "logisticsCompany" },
        { fieldCode: "logisticsStaff" },
        { fieldCode: "logisticsContactInfo" },
        { fieldCode: "logisticsCost" },
        { fieldCode: "logisticsPhoneNum" },
        { fieldCode: "internationalTelCode" },
        { fieldCode: "logisticsReceiptStatus" },
        { fieldCode: "carNumber" },
      ];
    }
  }
};
</script>

<style scoped lang="stylus">
.form {
  height 100vh;
  overflow-y scroll;

}
</style>