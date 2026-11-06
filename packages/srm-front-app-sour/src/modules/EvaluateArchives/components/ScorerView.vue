<template>
  <srm-list
    :data-set="dataSet"
    :columns="getListColumns()"/>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import scorerDS from "../datasource/scorerDS";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "ScorerView",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    },
    evalDtlId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      dataSet: new DataSet(scorerDS(this.evalDtlId, [], this.evalHeaderId)),
    };
  },
  mounted() {
    this.dataSet.refresh();
  },
  methods: {
    getListColumns() {
      const renderYesNo = (val) => {
        if (val === "" || val === null || typeof val === "undefined") {
          return "-";
        }
        return val === 0 ?
          this.$T("smbl.common.message.yes").$D("是") :
          this.$T("smbl.common.message.no").$D("否");
      };
      return [
        { formRow: 10, fieldCode: "respUserId", editor: false },
        { formRow: 10, fieldCode: "userName", editor: false },
        { formRow: 20, fieldCode: "userDepartment", editor: false },
        { formRow: 20, fieldCode: "respWeight", editor: false },
        { formRow: 30, fieldCode: "defaultScore", editor: false },
        { formRow: 40, fieldCode: "isStandard", editor: false, render: renderYesNo },
        { formRow: 40, fieldCode: "isVeto", editor: false, render: renderYesNo },
        { formRow: 50, fieldCode: "indOptName", editor: false },
        { formRow: 50, fieldCode: "score", editor: false },
        { formRow: 60, fieldCode: "remark", editor: false },
        { formRow: 70, fieldCode: "scorerAttachmentUuid", editor: false },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
