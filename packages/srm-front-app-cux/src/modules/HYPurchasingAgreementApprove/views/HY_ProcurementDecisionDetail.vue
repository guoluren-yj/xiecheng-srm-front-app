
<template>
  <div class="procurement-scheme-detail">
    <nav-head :title="$T('scux.procurementDecisionReview.model.reviewDescriptionD').$D('采购决议审批')" />
    <ProcurementDecision :id="decisionReviewId" />
  </div>
</template>

<script>
import ProcurementDecision from "../components/ProcurementDecision";
export default {
  modules: [ "scux.procurementDecisionReview" ],
  name: "HY_ProcurementDecisionDetail",
  components: {
    ProcurementDecision,
  },
  data() {
    return {
      decisionReviewId: null,
    };
  },
  computed: {

  },
  beforeMount() {
    this.decisionReviewId = this.$route.query.decisionReviewId;
  }
};
</script>
<style lang="stylus" scoped>
  >>> .card{
    height :calc(100vh);
    overflow :scroll;
  }
</style>