<template>
  <div class="ssta-multi-demen-warpper">
    <div class="ssta-splite-rule-title" style="font-size: 14px">{{ $T("ssta.common.view.title.spliteRule").$D("拆分规则") }}</div>
    <div class="ssta-splite-rule-content">
      {{ supplierFlag ?
        $T("ssta.supplySettle.model.supplySettle.collectionSpliteRule").$D("收款自动拆分规则") :
        $T("ssta.purchaseSettle.model.purchaseSettle.paymentSpliteRule").$D("付款自动拆分规则") }}
      ：
      {{ paymentSpliteRuleMeaning }}
    </div>
    <div style="height:12px;background:#F6F6F6" />
    <srm-list
      :data-set="multiDimensionPayDs"
      :columns="getMultiDimenPayListColumns">
      <span slot="searchLeft">
        {{ $T('ssta.common.view.title.paymentDetailInfo').$D('付款明细信息') }}
      </span>
    </srm-list>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { multiDimensionPayDS, multiPrePayWriteOffDS } from "../datasource/purchaseSettleDetailDS";
import { multiDimensionPayDS as supMultiDimensionPayDS, multiPrePayWriteOffDS as supMultiPrePayWriteOffDS } from "../datasource/supplySettleDetailDS";
export default {
  modules: [ "smbl.common", "ssta.purchaseSettle", "ssta.common", "ssta.purchaseSettlePool", "hzero.common", "ssta.purchaseInvoicePool", "ssta.supplySettle", "ssta.directPoolSupply", "ssta.costSheet", "ssta.supplySettlePool", "ssta.supplyInvoicePool" ],
  name: "MultiDimenAssign",
  props: {
    supplierFlag: Boolean,
    settleHeaderId: String | Number,
    paymentDimensionData: Object,
    paymentSpliteRuleMeaning: String,
  },
  data() {
    const { settleHeaderId, paymentDimensionData, supplierFlag } = this;
    const multiDimensionPayDSFunc = supplierFlag ? supMultiDimensionPayDS : multiDimensionPayDS;
    const multiPrePayWriteOffDSFunc = supplierFlag ? supMultiPrePayWriteOffDS : multiPrePayWriteOffDS;
    return {
      multiDimensionPayDs: new DataSet(multiDimensionPayDSFunc(settleHeaderId, paymentDimensionData)),
      multiPrePayWriteOffDs: new DataSet(multiPrePayWriteOffDSFunc()),
    };
  },
  computed: {
    getMultiDimenPayListColumns() {
      const fieldsList = this.multiDimensionPayDs.fields.concat([ {
        fieldCode: "prePaymentWriteOff",
        fieldName: this.supplierFlag ?
          this.$T("ssta.purchaseSettle.button.preColmentWriteOff").$D("预收款核销") :
          this.$T("ssta.purchaseSettle.button.prePaymentWriteOff").$D("预付款核销"),
        render: (_, record) =>
          <SrmButton plain onClick={() => this.showMultiPrePayWriteOffRecord(record)}>
            {this.supplierFlag ?
              this.$T("ssta.supplySettle.button.preColWriteOffRecord").$D("预收款核销记录") :
              this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录")}
          </SrmButton>
      } ]);
      return fieldsList.map((item, index) => index ?
        { ...item, formRow: index } :
        { ...item, formRow: index, fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> }
      );
    },
    getMultiPrePayWriteOffListColumns() {
      return this.multiPrePayWriteOffDs.fields;
    },
  },
  methods: {
    showMultiPrePayWriteOffRecord(record) {
      const { settleApplyLineList } = record;
      const preApplyAmountList = [];
      const multiPrepaymentAddList = [];
      this.multiDimensionPayDs.records.forEach((item) => {
        if (Array.from(item.get("settleApplyLineList")).length > 0) {
          Array.from(item.get("settleApplyLineList")).forEach((a) => {
            preApplyAmountList.push(a);
          });
        }
      });
      settleApplyLineList.forEach((row) => {
        let { defaultRemainingAmount } = row;
        const { applyAmount } = row;
        preApplyAmountList.forEach((input) => {
          if (input.prepaymentLineId === row.prepaymentLineId) {
            defaultRemainingAmount = defaultRemainingAmount - (input.applyAmount || 0);
          }
        });
        multiPrepaymentAddList.push({
          ...row,
          prepaymentRemainingAmount: defaultRemainingAmount - (applyAmount || 0),
        });
      });
      this.multiPrePayWriteOffDs.setData(multiPrepaymentAddList);
      this.$popup({
        rounded: true,
        showClose: true,
        showHeader: true,
        title: this.supplierFlag ?
          this.$T("ssta.supplySettle.button.multPreColWriteOffRecord").$D("多维度预收款核销记录") :
          this.$T("ssta.purchaseSettle.button.multPrePayWriteOffRecord").$D("多维度预付款核销记录"),
        content: <SrmList dataSet={this.multiPrePayWriteOffDs} columns={this.getMultiPrePayWriteOffListColumns} />
      });
    },
  }
};
</script>
<style lang="stylus" scoped>
.ssta-multi-demen-warpper {
  /deep/ .srm-flex-justify-start {
    justify-content: space-between;
  }
}
.ssta-splite-rule-title {
  height: 36px;
  font-size: 14px;
  line-height: 36px;
  padding: 0 15px;
}

.ssta-splite-rule-content {
  height: 52px;
  line-height: 52px;
  padding: 0 15px;
}
</style>