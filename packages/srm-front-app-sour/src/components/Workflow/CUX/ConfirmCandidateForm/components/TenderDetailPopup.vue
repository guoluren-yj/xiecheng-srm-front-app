<template>
  <div>
    <srm-list :data-set="lineDs" :columns="getLineColumns()" />
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { tenderDetailLineDS } from "../datasource/yongxianglineDS";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryQuotation", "ssrc.common", "ssrc.bidHall", "hzero.common" ],
  name: "TenderDetailPopup",
  props: {
    rfxHeaderId: {
      type: String | Number,
      default: "",
    },
    supplierCompanyId: {
      type: String | Number,
      default: "",
    },
    quotationHeaderId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      lineDs: new DataSet(tenderDetailLineDS({ rfxHeaderId: this.rfxHeaderId, supplierCompanyId: this.supplierCompanyId, quotationHeaderId: this.quotationHeaderId })),
    };
  },
  methods: {
    getLineColumns() {
      return [
        {
          formRow: 10,
          seq: 10,
          fieldCode: "itemName",
        },
        {
          formRow: 10,
          seq: 20,
          fieldCode: "itemCode",
        },
        {
          formRow: 20,
          seq: 10,
          fieldCode: "specs",
        },
        {
          formRow: 20,
          seq: 20,
          fieldCode: "taxIncludedFlag",
          render: (val) => val ? this.$T("hzero.common.status.yes").$D("是") : this.$T("hzero.common.status.no").$D("否"),
        },
        {
          formRow: 30,
          fieldCode: "taxRate",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "validQuotationPrice",
        },
        {
          formRow: 40,
          seq: 20,
          fieldCode: "validNetPrice",
        },
        {
          formRow: 50,
          seq: 10,
          fieldCode: "validQuotationQuantity",
        },
        {
          formRow: 50,
          seq: 20,
          fieldCode: "totalAmount",
        },
        {
          formRow: 60,
          fieldCode: "supplierAttachmentUuid",
        },
      ];
    },
  },
};
</script>
<style scoped lang="stylus">

</style>