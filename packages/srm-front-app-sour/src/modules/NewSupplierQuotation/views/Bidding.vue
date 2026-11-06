<template>
  <div style="height: 100vh">
    <bidding-hall-supplier :document-type="currentType"/>
  </div>
</template>

<script>
import BiddingHallSupplier from "../components/BiddingHallSupplier";

export default {
  modules: [ "ssrc.queryQuotation", "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "hipspfm.workFlow", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.biddingHall", ],
  name: "Bidding",
  components: { BiddingHallSupplier },
  data() {
    return {
      currentType: "RFX",
    };
  },
};
</script>
