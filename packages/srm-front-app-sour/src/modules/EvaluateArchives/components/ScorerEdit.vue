<template>
  <div style="height: 100%">
    <srm-list
      :height="`calc(100% - ${editFlag ? '74px' : '0px'})`"
      :data-set="dataSet"
      :columns="getListColumns()"/>
    <srm-bottom-handler v-if="editFlag" :btn-arr="getListButtons()"/>
  </div>
</template>

<script>

import { DataSet } from "srm-mobile-ui";
import scorerDS from "../datasource/scorerDS";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "ScorerEdit",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    },
    evalDtlId: {
      type: String | Number,
      default: null,
    },
    evalDtlIds: {
      type: Array,
      default: () => [],
    },
    editFlag: {
      type: Boolean,
      default: true,
    },
    selectAllFlag: {
      type: Boolean,
      default: false,
    },
    averageFlag: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      dataSet: new DataSet(scorerDS(this.evalDtlId, this.evalDtlIds, this.evalHeaderId, this.selectAllFlag, this.averageFlag)),
    };
  },
  mounted() {
    this.evalDtlId && this.dataSet.refresh();
  },
  methods: {
    getListButtons() {
      return [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          type: "primary",
          visible: true,
          handler: () => {
            if (this.evalDtlId) {
              this.dataSet.updateRecords(this.dataSet.records).then(() => this.$emit("save"));
            } else {
              this.dataSet.submitRecords(this.dataSet.records).then(() => this.$emit("save"));
            }
          },
        },
        {
          title: this.$T("smbl.common.button.new").$D("新建"),
          type: "primary",
          visible: true,
          fill: true,
          handler: () => {
            this.dataSet.create({}, 0);
          },
        },
      ];
    },
    getListColumns() {
      return [
        { formRow: 10, fieldCode: "respUserId", editor: this.editFlag },
        { formRow: 20, fieldCode: "userName", },
        { formRow: 30, fieldCode: "userDepartment", },
        { formRow: 40, fieldCode: "respWeight", editor: this.editFlag },
        {
          formRow: 50,
          fieldCode: "buttons",
          fieldType: "EMPTY",
          visible: this.editFlag,
          render: () => <SrmFlex justify="end">
            <SrmButton
              bordered
              type="danger"
              onClick={() => this.dataSet.removeLocalRecords([ this.dataSet.current ])}>
              {this.$T("smbl.common.button.delete").$D("删除")}
            </SrmButton>
          </SrmFlex>,
        }
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
