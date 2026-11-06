<template>
  <div style="height: 100vh">
    <quotation-new :document-type="currentType" />
  </div>
</template>

<script>

import QuotationNew from "../components/QuotationNew";

export default {
  modules: [ "ssrc.queryQuotation", "hzero.common", "ssrc.rf", "ssrc.inquiryHall", "hipspfm.workFlow", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "hzero.common", "ssrc.biddingOpen", "ssrc.biddingHall", ],
  name: "QuotationBidding",
  components: { QuotationNew },
  data() {
    return {
      currentType: "BID",
    };
  },
};
</script>
