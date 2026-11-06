<template>
  <srm-list
    :data-set="dataSet"
    :columns="getListColumns()"/>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import evalProcessDS from "../datasource/evalProcessDS";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "EvalProcessView",
  props: {
    evalDtlId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      dataSet: new DataSet(evalProcessDS(this.evalDtlId)),
    };
  },
  methods: {
    getListColumns() {
      return [
        { formRow: 10, fieldCode: "paramDescription", editor: false },
        { formRow: 20, fieldCode: "paramValue", editor: false },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
