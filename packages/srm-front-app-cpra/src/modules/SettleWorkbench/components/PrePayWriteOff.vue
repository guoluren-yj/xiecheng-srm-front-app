<template>
  <srm-list
    :data-set="prePayWriteOffDs"
    :columns="getPrePayWriteOffListColumns"
    @itemClick="onClickItem"/>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { take } from "lodash";
import { prePayWriteOffDS } from "../datasource/purchaseSettleDetailDS";
import { prePayWriteOffDS as supPrePayWriteOffDS } from "../datasource/purchaseSettleDetailDS";
export default {
  modules: [ "ssta.purchaseSettle", "ssta.common", "ssta.purchaseSettlePool", "hzero.common", "ssta.purchaseInvoicePool", "ssta.supplySettle", "smbl.common" ],
  name: "PrePayWriteOff",
  props: {
    settleHeaderId: String | Number,
    settleLineId: {
      type: String | Number,
      default: "",
    },
    supplierFlag: Boolean,
  },
  data() {
    const { settleHeaderId, settleLineId, supplierFlag } = this;
    const prePayWriteOffDSFunc = supplierFlag ? supPrePayWriteOffDS : prePayWriteOffDS;
    return {
      prePayWriteOffDs: new DataSet(prePayWriteOffDSFunc(settleHeaderId, settleLineId))
    };
  },
  computed: {
    getPrePayWriteOffListColumns() {
      return take(this.prePayWriteOffDs.fields, 5).map((item, index) => index ?
        { ...item, formRow: index } :
        { ...item, formRow: index, fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> }
      );
    },
    getPrePayWriteOffDetailColumns() {
      return this.prePayWriteOffDs.fields;
    },
  },
  methods: {
    onClickItem() {
      this.$popup({
        rounded: true,
        showClose: true,
        showHeader: true,
        title:  this.supplierFlag ?
          this.$T("ssta.common.view.title.preColWriteOffRecordDetail").$D("预收款核销记录详情") :
          this.$T("ssta.common.view.title.prePayWriteOffRecordDetail").$D("预付款核销记录详情"),
        content: <SrmForm customizeType="detail" dataSet={this.prePayWriteOffDs} columns={this.getPrePayWriteOffDetailColumns} />
      });
    },
  }
};
</script>
