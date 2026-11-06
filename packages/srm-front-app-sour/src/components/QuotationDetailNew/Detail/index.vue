<template>
  <div>
    <srm-button v-if="rowData.quotationDetailFlag || sourceResultId" plain @click="showQuotationDetailPopup">
      {{ $T('ssrc.inquiryHall.model.inquiryHall.view').$D('查看') }}
    </srm-button>
    <span v-else>-</span>
  </div>
</template>

<script>
import { $T } from "srm-mobile-ui";
import Content from "./Content.vue";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "spfm.dashboard", "hipspfm.common", "hzero.button" ],
  name: "QuotationDetail",
  props: {
    rowData: {
      type: Object,
      default: null,
    },
    sourceFrom: {
      type: String,
      default: "RFX",
    },
    sourceResultId: { // 协议通过sourceResultId查询报价明细，暂预留口子
      type: String | Number,
      default: "",
    },
    allowSupplierViewFlag: { // 阵营供应商标志(ps: 阵营分为采购方和供应商，默认采购方)
      type: Boolean,
      default: false,
    },
    sourceHeaderId: {
      type: String | Number,
      default: "",
    },
    tenantId: {
      type: String | Number,
      default: "",
    },
    currentPageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    showQuotationDetailPopup() {
      this.$popup({
        title: $T("spfm.dashboard.model.supplierTodoWorkflow.task").$D("待办事项"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: true,
        content: <Content
          rowData={this.rowData}
          sourceFrom={this.sourceFrom}
          sourceResultId={this.sourceResultId}
          allowSupplierViewFlag={this.allowSupplierViewFlag}
          sourceHeaderId={this.sourceHeaderId}
          rowKeyId={this.rowData?.quotationLineId ? "supQuotationDetailId" : "quotationDetailId"}
          tenantId={this.tenantId}
          currentPageType={this.currentPageType}
        />
      });
    },
  },
};

</script>
<style scoped lang="stylus">

</style>