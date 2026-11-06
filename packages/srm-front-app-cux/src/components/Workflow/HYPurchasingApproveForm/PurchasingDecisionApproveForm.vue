<template>
  <div class="price-execute-approval">
    <srm-form :data-set="dataSet" customize-type="detail" :columns="getColumns" customize-code="SMBL.WORKFLOW.PURCHASING_DECISION_APPROVE" />
    <SrmPopup
      :visible.sync="modelFlag"
      :title="$T('scux.procurementDecisionReview.view.approval').$D('审批流')">
      <srm-list :data-set="modelDataSet" :columns="getModelColumns" />
    </SrmPopup>
  </div>
</template>
<script>

import { DataSet } from "srm-mobile-ui";
import indexDatasource from "./initialDataDs.js";
import modelDataSet from "./model.js";

export default {
  modules: [ "scux.procurementDecisionReview" ],
  name: "PurchasingDecisionApproveForm",
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
          fieldCode: "decisionReviewNumber",
        },
        {
          fieldCode: "schemeReviewNumber",
        },
        {
          fieldCode: "categoryManager",
        },
        {
          fieldCode: "department",
        },
        {
          fieldCode: "reviewDescription",
        },
        {
          fieldCode: "procurementStrategy",
        },
        {
          fieldCode: "urgencyProcurementFlag",
        },
        {
          fieldCode: "materialName",
        },

        {
          fieldCode: "purchaseAmount",
        },

        {
          fieldCode: "approvalMatrix",
          render: () => {
            // eslint-disable-next-line no-return-assign
            return <span style="color: blue" onClick={()=> this.modelFlag = true}>{this.$T("scux.procurementDecisionReview.view.approval").$D("审批流")}</span>;
          }
        },

        {
          fieldCode: "attachmentUuid",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getModelColumns() {
      return [
        {
          fieldName: "层级",
          fieldCode: "level",
          langCode: "scux.procurementDecisionReview.model.level",
        },
        {
          fieldName: "审批节点",
          fieldCode: "authNodeName",
          langCode: "scux.procurementDecisionReview.model.authNodeName",
        },
        {
          fieldName: "审批人",
          fieldCode: "hygyEvalApprovalUsers",
          langCode: "scux.procurementDecisionReview.model.hygyEvalApprovalUsers",
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
    this.modelDataSet.addQueryParameter("documentType", "CGJYPS");
  },
  mounted() {
    this.$emit("GetApprovalTitle", this.$T("scux.procurementDecisionReview.view.title.procurementDecisionReview").$D("采购决议评审表"));
  },
};
</script>

<style lang="stylus" scoped>
.price-execute-approval {
  height: calc(100vh - 64.333vw);
  overflow: auto;
}
</style>
