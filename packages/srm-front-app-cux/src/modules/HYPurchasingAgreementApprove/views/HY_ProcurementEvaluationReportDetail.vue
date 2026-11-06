
<template>
  <div class="procurement-scheme-detail">
    <nav-head :title="$T('scux.bidEvaluationReport.view.title.bidEvaluationReport').$D('评标报告')" />
    <BidEvaluationReport :id="evaluationReviewId" />
  </div>
</template>

<script>
import BidEvaluationReport from "../components/BidEvaluationReport";
export default {
  modules: [ "scux.bidEvaluationReport" ],
  name: "HY_ProcurementEvaluationReportDetail",
  components: {
    BidEvaluationReport,
  },
  data() {
    return {
      evaluationReviewId: null,
    };
  },
  computed: {

  },
  beforeMount() {
    this.evaluationReviewId = this.$route.query.evaluationReviewId;
  }
};
</script>
<style lang="stylus" scoped>
  >>> .card{
    height :calc(100vh);
    overflow :scroll;
  }
</style>