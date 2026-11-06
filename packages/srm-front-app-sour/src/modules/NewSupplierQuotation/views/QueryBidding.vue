<template>
  <div style="height: 100vh">
    <query-detail :document-type="currentType"/>
  </div>
</template>

<script>

import QueryDetail from "../components/QueryDetail";

export default {
  modules: [ "ssrc.queryQuotation", "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "hipspfm.supplierQuotation", "hipspfm.workFlow", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.biddingHall", ],
  name: "QueryBidding",
  components: { QueryDetail },
  data() {
    return {
      currentType: "BID",
    };
  },
};
</script>