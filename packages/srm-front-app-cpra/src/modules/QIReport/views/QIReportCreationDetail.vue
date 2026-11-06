<template>
  <q-i-report-detail :permission-code-map="permissionCodeMap" page-code="creation"/>
</template>
<script>
import QIReportDetail from "./QIReportDetail";
import { permissionCodeMap } from "./QIReportCreationList";
export default {
  modules: [ "sqam.common", "entity.attachment", "hzero.common", "hipspfm.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "smbl.common", "sodr.sendOrder", "entity.order", "sodr.common", "sqam.quoteIncomingInspection", "sqam.createRectification", "sslm.siteInvestigateReport", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "sslm.evaluationQuery" ],
  name: "QIReportCreationDetail",
  components: {
    QIReportDetail
  },
  data() {
    return {
      permissionCodeMap,
    };
  }
};
</script>