<template>
  <div style="height: 100vh">
    <quotation-detail :document-type="currentType"/>
  </div>
</template>

<script>

import QuotationDetail from "../components/Detail";

export default {
  modules: [ "ssrc.queryQuotation", "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "hipspfm.supplierQuotation", "hipspfm.workFlow", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.biddingHall", ],
  name: "DetailBidding",
  components: { QuotationDetail },
  data() {
    return {
      currentType: "BID",
    };
  },
};
</script>
