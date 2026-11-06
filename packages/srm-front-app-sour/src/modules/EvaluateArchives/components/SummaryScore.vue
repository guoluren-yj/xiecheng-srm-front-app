<template>
  <div style="height: 100%">
    <srm-flex class="eval-desc">
      {{
        $T("sslm.supplierDocManage.model.docManage.choseEvalGranularity").$D("考评颗粒度")
      }} ：{{ evalDesc }}
    </srm-flex>
    <srm-list
      :data-set="dataSet"
      :columns="getListColumns()"/>
  </div>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import summaryScoreDS from "../datasource/summaryScoreDS";

export default {
  modules: [ "sslm.supplierDocManage", "sslm.supplierManage" ],
  name: "SummaryScore",
  props: {
    evalLineId: {
      type: String | Number,
      default: null,
    },
    evalDesc: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      dataSet: new DataSet(summaryScoreDS(this.evalLineId)),
    };
  },
  mounted() {
    this.dataSet.refresh();
  },
  methods: {
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header showOpenTag={false}>{val}</srm-list-header>,
        },
        { formRow: 10, fieldCode: "indicatorName", },
        { formRow: 20, fieldCode: "benchmarkScore", },
        { formRow: 20, fieldCode: "evalWeight", },
        { formRow: 30, fieldCode: "scoreTypeMeaning", },
        { formRow: 30, fieldCode: "indicatorTypeMeaning", },
        { formRow: 40, fieldCode: "isVeto", },
        { formRow: 40, fieldCode: "supplierNum", },
        { formRow: 50, fieldCode: "respRemarks", },
        { formRow: 50, fieldCode: "finalScore", },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
.eval-desc {
  min-height 44px;
  align-items center;
  justify-content start;
  font-size: 14px;
  color: var(--font-color-default);
  font-weight: 600;
  word-break: break-all;
  padding: 0 15px;
}
</style>
