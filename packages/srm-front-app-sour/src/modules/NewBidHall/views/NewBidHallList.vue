<template>
  <div style="height: 100vh">
    <hall-list :document-type="currentType"/>
  </div>
</template>

<script>
import HallList from "../components/HallList";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common" ],
  name: "NewBidHallList",
  components: { HallList },
  data() {
    return {
      currentType: "BID",
    };
  },
};
</script>
