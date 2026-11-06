<template>
  <div>
    <!-- 阶梯报价 -->
    <srm-list
      :scrollable="false"
      height="auto"
      style="height: auto"
      :data-set="dataSet"
      :columns="LadderLineColumns"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { ladderQuotationDS } from "../datasource/index";
export default {
  modules: [ "ssrc.priceLibraryNew", "ssrc.supplyInfoChange" ],
  name: "LadderQuotation",
  components: {},
  props: {
    priceLibLadderList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      dataSet: new DataSet(ladderQuotationDS()),
    };
  },
  computed: {
    LadderLineColumns() {
      return [
        {
          fieldCode: "ladderLineNum",
          fieldType: "EMPTY",
          render: (val, record) =>
            <span style="font-weight:600">
              {this.$T("ssrc.priceLibraryNew.model.library.ladder").$D(
                "阶梯"
              )}
              {val}-[{record.ladderFrom},{record.ladderTo})
            </span>,
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxIncludedPrice").$D("含税单价"),
          fieldType: "TEXT",
          fieldCode: "ladderPrice",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.netPrice").$D("未税单价"),
          fieldType: "TEXT",
          fieldCode: "ladderNetPrice",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.cumulative").$D("是否累计阶梯"),
          fieldType: "TEXT",
          fieldCode: "cumulativeFlag",
          formRow: 30,
          render: (val) => val === 1 ?
            this.$T("ssrc.supplyInfoChange.model.yes").$D("是") :
            this.$T("ssrc.supplyInfoChange.model.no").$D("否"),
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.ladderPriceRemark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "ladderPriceRemark",
          formRow: 30,
        },
      ];
    },
  },
  beforeMount() {
    this.dataSet.setData(this.priceLibLadderList);
  },
};
</script>

<style lang="stylus" scoped>
</style>
