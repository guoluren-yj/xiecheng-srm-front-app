<template>
  <div style="height: 100vh">
    <hall-list :document-type="currentType"/>
  </div>
</template>

<script>

import HallList from "../components/HallList";

export default {
  modules: [ "ssrc.queryQuotation", "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.biddingHall", ],
  name: "ListApply",
  components: { HallList },
  data() {
    return {
      currentType: "RFX",
    };
  },
};
</script>
