<template>
  <div>
    <srm-list :data-set="lineInfoDs" :columns="lineColumns" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/indexDs";
export default {
  modules: [ "scux.pricelibrary", "hipspfm.workFlow" ],
  name: "TopStarPriceLibraryApproval",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      lineInfoDs: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    lineColumns() {
      return [
        {
          fieldCode: "sourceNum",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "priceBatchQuantity",
        },
        {
          fieldCode: "unitPrice",
        },
        {
          fieldCode: "quotationExpiryDateFrom",
        },
        {
          fieldCode: "quotationExpiryDateTo",
        },
        {
          fieldCode: "taxRate",
        },
        {
          fieldCode: "taxCode",
        },
        {
          fieldCode: "uomNum",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "ouName",
        },
        {
          fieldCode: "purOrganizationName",
        },
        {
          fieldCode: "purchaseAgentName",
        },
      ];
    },
  },
  mounted() {
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      console.log("this.changeReqId===", this.changeReqId);
      this.lineInfoDs.setQueryParameter({ resultNewIds: this.changeReqId });
      this.lineInfoDs.refresh();
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
