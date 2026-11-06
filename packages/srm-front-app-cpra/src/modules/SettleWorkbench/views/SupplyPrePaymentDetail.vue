<template>
  <pre-payment :header-ds="headerDs" :line-ds="lineDs" role="supplier" />
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import PrePayment from "../components/PrePaymentDetail";
import { headerDS, lineDS } from "../datasource/supplyPrePaymentDetailDS";
export default {
  modules: [ "ssta.prePayment", "ssta.purchaseSettle", "entity.attachment", "ssta.common", "ssta.purchaseInvoicePool", "smbl.common", "hzero.common", "ssta.purchaseSettlePool", "hipspfm.common", "hipspfm.workFlow", "ssta.supplySettle", "ssta.supplySettlePool" ],
  name: "SupplyPrePaymentDetail",
  components: { PrePayment },
  data() {
    return {
      headerDs: null,
      lineDs: null,
    };
  },
  computed: {
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const { settleHeaderId } = this.$route.query;
      if (settleHeaderId) {
        this.headerDs = new DataSet(headerDS(settleHeaderId));
        this.lineDs = new DataSet(lineDS(settleHeaderId));
      }
    }
  }
};
</script>

<style>

</style>
