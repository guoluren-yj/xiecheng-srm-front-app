<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet"
      :columns="getListColumns()"
      customize-code="SMBL.EVALUATE_ARCHIVES_FILL.LIST"
      @itemClick="onListItemClick"/>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import evalListDS from "../datasource";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "EvaluateArchivesFillList",
  data() {
    return {
      dataSet: new DataSet(evalListDS()),
      kpiMethod: {},
    };
  },
  computed: {},
  watch: {},
  activated() {
    this.dataSet.refresh();
  },
  mounted() {
    this.dataSet.refresh();
    SrmUtil.getValueSetBatch({ kpiMethod: "SSLM.KPI_EVAL_METHOD" }, this);
  },
  methods: {
    onListItemClick(record) {
      this.$router.push({
        name: "EvaluateArchivesFillDetail",
        query: {
          evalHeaderId: record.get("evalHeaderId"),
          evalGranularity: record.get("evalGranularity"),
        },
      });
    },
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (val, item) =>
            <srm-list-header>
              {val}
              <SrmButton
                slot="right"
                style={{ fontWeight: "bold" }}
                type="warn"
                plain
                rect
              >
                {item.evalStatusMeaning}
              </SrmButton>
            </srm-list-header>,
        },
        { formRow: 10, fieldCode: "evalName" },
        { formRow: 20, fieldCode: "evalTplName" },
        { formRow: 30, fieldCode: "evalDimensionMeaning" },
        { formRow: 40, fieldCode: "evalDimensionValueMeaning" },
        { formRow: 50, fieldCode: "processUserName" },
        { formRow: 60, fieldCode: "creationDate" },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped></style>
