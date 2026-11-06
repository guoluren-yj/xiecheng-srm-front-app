<template>
  <settle-detail
    v-if="settleHeaderId === $route.query.settleHeaderId"
    role="purchaser"
    :ds-funcs-map="dsFuncsMap" />
</template>

<script>
import SettleDetail from "../components/SettleDetail";
import { settleHeaderDS, settleLineDS, taxInvoiceDS } from "../datasource/purchaseSettleDetailDS";
export default {
  modules: [ "smbl.common", "ssta.supplySettle", "ssta.purchaseSettle", "hzero.common", "ssta.common", "hwfp.common", "ssta.purchaseSettlePool", "ssta.purchaseInvoicePool", "ssta.directPoolSupply", "ssta.costSheet", "ssta.supplySettlePool", "ssta.supplyInvoicePool" ],
  name: "PurchaseSettleDetail",
  components: { SettleDetail },
  beforeRouteUpdate(to, from, next) {
    this.settleHeaderId = to.query.settleHeaderId;
    next();
  },
  data() {
    const { settleHeaderId } = this.$route.query;
    return {
      settleHeaderId,
      dsFuncsMap: {
        settleHeaderDS,
        settleLineDS,
        taxInvoiceDS,
      }
    };
  },
};
</script>
