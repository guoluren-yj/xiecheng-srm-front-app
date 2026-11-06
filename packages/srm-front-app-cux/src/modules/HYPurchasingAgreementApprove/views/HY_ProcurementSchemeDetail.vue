
<template>
  <div class="procurement-scheme-detail">
    <nav-head :title="$T('scux.procurementDecisionReview.view.title.procurementProgrammeReview').$D('采购方案评审')" />
    <PurchasingSchemeApproveDetailContent :id="schemeReviewId" />
  </div>
</template>

<script>
import PurchasingSchemeApproveDetailContent from "../components/PurchasingSchemeApproveDetailContent";
export default {
  modules: [ "scux.procurementDecisionReview" ],
  name: "HY_ProcurementSchemeDetail",
  components: {
    PurchasingSchemeApproveDetailContent,
  },
  data() {
    return {
      schemeReviewId: null,
    };
  },
  computed: {

  },
  beforeMount() {
    this.schemeReviewId = this.$route.query.schemeReviewId;
  }
};
</script>
<style lang="stylus" scoped>
  >>> .customize{
    height :calc(100vh);
    overflow :scroll;
  }
</style>