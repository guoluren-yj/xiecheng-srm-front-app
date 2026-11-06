<template>
  <div style="height: 100vh">
    <srm-list
      :columns="listColumns"
      :data-set="listDs"
      :buttons="listButtons"/>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import StatusTag from "@/components/StatusTag";
import { relatedPurOrderAddDS } from "../datasource/relatedAddDS";
import { formatListColumns } from "../utils";
export default {
  modules: [ "sqam.common", "entity.roles", "sodr.sendOrder", "entity.order", "entity.business", "entity.organization", "sodr.common", "hzero.common", "sqam.quoteIncomingInspection", "entity.item", "smbl.common", "entity.supplier", "entity.company" ],
  name: "RelatedPurOrderAdd",
  props: {
    headerData: {
      type: Object,
      default: () => {},
      required: true,
    },
    addOk: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      listDs: new DataSet(relatedPurOrderAddDS(this.headerData)),
    };
  },
  computed: {
    listColumns() {
      const fieldsList = [
        {
          fieldCode: "displayPoNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { statusCode, evaluationFlag, statusCodeMeaning } = record;
            const color =
              statusCode === "CONFIRMED" ?
                evaluationFlag ?
                  "green" :
                  "yellow" :
                "gray";
            const text =
              statusCode === "CONFIRMED" ?
                evaluationFlag ?
                  this.$T("sqam.common.view.option.evaluated").$D("已评价") :
                  this.$T("sqam.common.view.option.unEvaluated").$D("待评价") :
                statusCodeMeaning;
            return (
              <SrmListHeader>
                <span>{value || "-"}</span>
                <StatusTag slot="right" text={text} color={color} />
              </SrmListHeader>
            );
          },
        },
        "orderTypeName",
        "purchaseAgentName",
        "ouName",
        "organizationName",
        "pohPcNum",
        [ "sourceCode", "releasedDate" ],
      ];
      return formatListColumns(fieldsList);
    },
    listButtons() {
      const { addOk, listDs } = this;
      return [
        {
          text: this.$T("hzero.common.button.confirm").$D("确认"),
          fill: true,
          type: "primary",
          disabled: (checkedList) => checkedList.length === 0,
          callback: async () => addOk(listDs),
        },
      ];
    },
  },
};
</script>
