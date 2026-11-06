<template>
  <detail :permission-code-map="permissionCodeMap" page-code="audit" />
</template>
<script>
import Detail from "./QIReportDetail";
import { permissionCodeMap } from "./QIReportAuditList";
export default {
  modules: [ "sqam.common", "entity.attachment", "hzero.common", "hipspfm.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "smbl.common", "sodr.sendOrder", "entity.order", "sodr.common", "sqam.quoteIncomingInspection", "sqam.createRectification", "sslm.siteInvestigateReport", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "sslm.evaluationQuery" ],
  name: "QIReportAuditDetail",
  components: {
    Detail,
  },
  data() {
    return {
      permissionCodeMap,
    };
  }
};
</script>