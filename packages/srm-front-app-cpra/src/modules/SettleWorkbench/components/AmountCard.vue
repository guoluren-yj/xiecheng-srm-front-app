<template>
  <srm-flex class="amount-cards-warpper" justify="between">
    <div class="ssta-line-detail-amount-card">
      <div class="amount-card-item amount-card-item-quantity">
        <span class="amount-card-item-title">
          {{ occupiedQuantityFlag ?
            $T('ssta.common.model.common.occupiedQuantity').$D('占用数量') :
            $T('ssta.common.model.common.occupiedAmountWithTax').$D('占用金额(含税)') }}
          <span v-if="occupiedData.uom && occupiedQuantityFlag">({{ occupiedData.uom }})</span>
          / ({{ occupiedData.currencyCode }})
        </span>
        <span class="amount-card-item-number">
          <span v-if="occupiedQuantityFlag">{{ occupiedData.quantity }}/</span>
          <span>{{ occupiedData.amount }}</span>
        </span>
      </div>
      <div v-show="isOpen" class="amount-card-item amount-card-item-netAmount">
        <span class="amount-card-item-title">
          {{ $T('ssta.purchaseSettlePool.view.TaxExcluded').$D('不含税') }}
        </span>
        <span class="amount-card-item-number">{{ occupiedData.netAmount }}</span>
      </div>
      <div v-show="isOpen" class="amount-card-item">
        <span class="amount-card-item-title">
          {{ $T('ssta.purchaseSettlePool.view.TaxAamount').$D('税额') }}
        </span>
        <span class="amount-card-item-number">{{ occupiedData.taxAmount }}</span>
      </div>
      <div v-show="!isOpen && !occupiedData.simpleFlag" class="srm-icon icon-chevrons-down amount-card-item-open" @click="() => isOpen=!isOpen" />
      <div v-show="isOpen" class="srm-icon icon-chevrons-up amount-card-item-open" @click="() => isOpen=!isOpen" />
    </div>
    <div class="ssta-line-detail-amount-card">
      <div class="amount-card-item amount-card-item-quantity">
        <span class="amount-card-item-title">
          {{ completedQuantityFlag ?
            $T('ssta.common.model.common.completedQuantity').$D('完成数量') :
            $T('ssta.common.model.common.completedAmountWithTax').$D('完成金额(含税)') }}
          <span v-if="occupiedData.uom && completedQuantityFlag">({{ occupiedData.uom }})</span>
          / ({{ completedData.currencyCode }})
        </span>
        <span class="amount-card-item-number">
          <span v-if="completedQuantityFlag">{{ completedData.quantity }}/</span>
          <span>{{ completedData.amount }}</span>
        </span>
      </div>
      <div v-show="isOpen" class="amount-card-item amount-card-item-netAmount">
        <span class="amount-card-item-title">
          {{ $T('ssta.purchaseSettlePool.view.TaxExcluded').$D('不含税') }}
        </span>
        <span class="amount-card-item-number">{{ completedData.netAmount }}</span>
      </div>
      <div v-show="isOpen" class="amount-card-item">
        <span class="amount-card-item-title">
          {{ $T('ssta.purchaseSettlePool.view.TaxAamount').$D('税额') }}
        </span>
        <span class="amount-card-item-number">{{ completedData.taxAmount }}</span>
      </div>
      <div v-show="!isOpen && !completedData.simpleFlag" class="srm-icon icon-chevrons-down amount-card-item-open" @click="() => isOpen=!isOpen" />
      <div v-show="isOpen" class="srm-icon icon-chevrons-up amount-card-item-open" @click="() => isOpen=!isOpen" />
    </div>
  </srm-flex>
</template>

<script>
export default {
  modules: [ "ssta.common", "ssta.purchaseSettlePool" ],
  props: {
    occupiedData: {
      type: Object,
      default: () => ({}),
    },
    completedData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { settleMatchDimension: occupiedDimension, onlyAmount: occupiedOnlyAmount } = this.occupiedData;
    const { settleMatchDimension: completedDimension, onlyAmount: completedOnlyAmount } = this.completedData;
    return {
      isOpen: false,
      occupiedQuantityFlag: occupiedDimension === "QUANTITY" && !occupiedOnlyAmount,
      completedQuantityFlag: completedDimension === "QUANTITY" && !completedOnlyAmount,
    };
  },
};
</script>

<style lang="stylus" scoped>
.ssta-line-detail-amount-card {
  width: calc(50%-3.5px);
  display: flex;
  font-size: 12px;
  flex-direction: column;
  padding: 12px 8px;
  background: #F6F6F6;
  position: relative;
  border-radius: 4px;
  .amount-card-item {
    display: flex;
    flex-direction: column;
    .amount-card-item-title {
      font-size: 10px;
      margin-bottom: 4px;
      color: #757575;
    }
    .amount-card-item-number {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .amount-card-item-netAmount {
    padding: 8px 0;
    margin-top: 6px;
    border-top: 1px solid #E2E2E2;
  }
}

.amount-card-item-open {
  font-size: 12px;
  position: absolute;
  bottom: 0;
  left: 50%;
}

.amount-cards-warpper {
  padding: 12px 15px;
  position: relative;
}
</style>