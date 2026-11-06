<template>
  <div class="price-execute-approval">
    <srm-form :data-set="dataSet" customize-type="detail" :columns="getColumns" customize-code="SMBL.WORKFLOW.BIDEVALUATION_REPORT" />
    <SrmPopup
      :visible.sync="modelFlag"
      :title="$T('scux.bidEvaluationReport.view.approval').$D('审批流')">
      <srm-list :data-set="modelDataSet" :columns="getModelColumns" />
    </SrmPopup>
  </div>
</template>
<script>

import { DataSet } from "srm-mobile-ui";
import indexDatasource from "./BidEvaluationReportFormDs.js";
import modelDataSet from "./model.js";

export default {
  modules: [ "scux.bidEvaluationReport" ],
  name: "PurchasingChemeApproveForm",
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
  },
  data() {
    return {
      modelFlag: false,
      dataSet: new DataSet(indexDatasource()),
      modelDataSet: new DataSet(modelDataSet()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "bidNumber",
        },
        {
          fieldCode: "schemeReviewNumber",
        },
        {
          fieldCode: "categoryManagerName",
        },
        {
          fieldCode: "procurementStrategy",
        },
        {
          fieldCode: "projectName",
        },

        {
          fieldCode: "procurementAmount",
        },
        {
          fieldCode: "approvalMatrix",
          render: () => {
            // eslint-disable-next-line no-return-assign
            return <span style="color: blue" onClick={()=> this.modelFlag = true}>{this.$T("scux.bidEvaluationReport.view.approval").$D("审批流")}</span>;
          }
        },
        {
          fieldCode: "uploadUuid",
        },
        {
          fieldCode: "projectIntroduction",
        },
        {
          fieldCode: "tenderProcessIntroduction",
        },
        {
          fieldCode: "evaluationSituation",
        },
        {
          fieldCode: "evaluationResult",
        }
      ];
    },
    getModelColumns() {
      return [
        {
          fieldName: "层级",
          fieldCode: "level",
          langCode: "scux.bidEvaluationReport.model.level",
        },
        {
          fieldName: "审批节点",
          fieldCode: "authNodeName",
          langCode: "scux.bidEvaluationReport.model.authNodeName",
        },
        {
          fieldName: "审批人",
          fieldCode: "hygyEvalApprovalUsers",
          langCode: "scux.bidEvaluationReport.model.hygyEvalApprovalUsers",
          render: (val = []) => {
            return val.length && val.map((v)=>v.employeeName).join("，");
          },
        },
      ];
    }
  },
  beforeMount() {
    this.dataSet.addPathParameter("changeReqId", this.changeReqId);
    this.modelDataSet.addQueryParameter("docAuthId", this.changeReqId);
    this.modelDataSet.addQueryParameter("documentType", "PBBG");
  },
  mounted() {
    this.$emit("GetApprovalTitle", this.$T("scux.bidEvaluationReport.view.title.bidEvaluationReport").$D("评标报告"));
  },
};
</script>

<style lang="stylus" scoped>
.price-execute-approval {
  height: calc(100vh - 64.333vw);
  overflow: auto;
}
</style>
