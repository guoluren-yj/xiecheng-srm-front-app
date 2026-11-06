<template>
  <div>
    <div class="headStyle">
      <customize
        :columns="LadderHeaderColumns"
        :need-padding="true"
        :data-source="dataHeader"
        code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.PRICE_LADDER_HEAD"/>
    </div>
    <div>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="dataSet"
        :columns="LadderLineColumns"
        customize-code="SMBL.WORKFLOW.PRICE_APPROVAL_NEW.PRICE_LADDER" />
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import ladderQuotationDs from "../datasource/ladderQuotationDs";
export default {
  modules: [ "ssrc.priceLibraryNew", "ssrc.supplyInfoChange" ],
  name: "LadderQuotation",
  components: {},
  props: {
    priceLibId: {
      type: String,
    },
    dataHeader: {
      type: Object,
    },
  },
  data() {
    return {
      data: [],
      dataSet: new DataSet(ladderQuotationDs(this.priceLibId)),
    };
  },
  computed: {
    LadderHeaderColumns() {
      return [
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemIdMeaning").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
          formRow: 10,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.itemCategoryIdMeaning").$D("物料品类"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryIdMeaning",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.view.message.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
          formRow: 20,
        },
        {
          fieldName: this.$T("ssrc.priceLibraryNew.model.library.taxRate").$D("税率"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
          formRow: 30,
        },
      ];
    },
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
  created() {},
};
</script>

<style lang="stylus" scoped>
.headStyle {
  padding: 15px 10px 5px 0px;
  border-bottom: solid 8px #F0F2F5;
  font-weight: bold;

  span {
    line-height: 24px;
    font-size: 16px;
    display: inline-block;
    color: #1B1E2B;
  }
}
</style>
