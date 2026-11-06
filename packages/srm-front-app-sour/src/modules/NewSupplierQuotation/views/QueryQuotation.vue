<template>
  <div style="height: 100vh">
    <query-detail :document-type="currentType"/>
  </div>
</template>

<script>

import QueryDetail from "../components/QueryDetail";

export default {
  modules: [ "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "hipspfm.supplierQuotation", "hipspfm.workFlow", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.queryQuotation", "ssrc.biddingHall", ],
  name: "QueryQuotation",
  components: { QueryDetail },
  data() {
    return {
      currentType: "RFX",
    };
  },
};
</script>