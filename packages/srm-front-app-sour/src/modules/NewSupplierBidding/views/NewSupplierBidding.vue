<template>
  <div style="height: 100vh">
    <hall-list :document-type="currentType"/>
  </div>
</template>

<script>
// import NewSupplierBidding from "../components/NewSupplierBidding";
import HallList from "../components/HallList";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", ],
  name: "NewSupplierBidding",
  components: { HallList },
  data() {
    return {
      currentType: "BID",
    };
  },
};
</script>
