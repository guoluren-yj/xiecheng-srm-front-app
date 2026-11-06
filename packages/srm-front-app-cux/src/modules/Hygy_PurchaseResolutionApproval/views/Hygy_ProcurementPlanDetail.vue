
<template>
  <div class="procurement-scheme-detail">
    <nav-head :title="$T('scux.procurementDecisionReview.view.title.procurementProgrammeReview').$D('采购方案评审')" />
    <PurchasingSchemeApproveDetailContent :id="schemeReviewId" />
    <div class="safe-footer" />
  </div>
</template>

<script>
import PurchasingSchemeApproveDetailContent from "../components/PurchasingSchemeApproveDetailContent";
export default {
  modules: [ "scux.procurementDecisionReview","spcm.common","scux.commercialTermsPre","scux.purchaseRecordApproval" ],
  name: "Hygy_ProcurementSchemeDetail",
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
.procurement-scheme-detail {
  overflow: scroll;
  width: 100%;
  height: 100vh;

  .safe-footer {
    width: 100%;
    height: 0px;
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
  }
}
</style>