<template>
  <div class="srm-settle-submit-approval">
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.SETTLE_BATCH_APPROVAL.COLLAPSES">
      <srm-scroll-tab-item code="basic" :label="$T('ssta.common.view.title.basicInfo').$D('基本信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_BATCH_APPROVAL.BASIC"
          :data-set="batchHeaderDataSet"
          :columns="headerColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="line" :label="$T('ssta.common.view.title.settleLineBatch').$D('结算单列表')">
        <srm-list
          customize-code="SMBL.WORKFLOW.SETTLE_BATCH_APPROVAL.LINE"
          :data-set="batchLineDataSet"
          :columns="lineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import SettleSubmitApproval from "./SettleSubmitApproval";
import { batchHeaderDS, batchLineDS } from "./datasource/batchDS";
export default {
  name: "SettleBatchSubmitApproval",
  modules: [ "ssta.purchaseSettle", "smbl.common", "ssta.purchaseInvoicePool", "ssta.purchaseSettlePool", "ssta.invoiceSheet", "sfin.purchaseBillConfirm", "ssta.common", "hzero.common", "hipspfm.common" ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const { batchApproveId } = this.parameters;
    return {
      batchHeaderDataSet: new DataSet(batchHeaderDS(batchApproveId)),
      batchLineDataSet: new DataSet(batchLineDS(batchApproveId)),
    };
  },
  computed: {
    headerColumns() {
      return [
        { fieldCode: "batchNum", },
        { fieldCode: "createdName" },
        { fieldCode: "creationDate" },
        { fieldCode: "settleTypeMeaning" },
      ];
    },
    lineColumns() {
      return [
        {
          fieldCode: "settleNum",
          render: (value, record) =>
            <SrmButton plain onClick={() => this.showSettleDetail(record)}>
              {value}
            </SrmButton>
        },
        { fieldCode: "companyName" },
        { fieldCode: "supplierCompanyName" },
        { fieldCode: "paymentApplyAmount" },
        { fieldCode: "paymentAmount" },
        { fieldCode: "applyAmount" },
      ];
    },
  },
  methods: {
    showSettleDetail(record) {
      const { settleHeaderId, documentType } = record;
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content:
          <SettleSubmitApproval props={{ "v-bind": "$attrs" }} parameters={{ settleHeaderId, documentType, readonly: true }} />
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";
.srm-settle-submit-approval {
  >>> .srm-form {
    padding: 15px 15px;
    min-height: 60px;
    margin: 0;
  }
}

>>> .customize-item {
  .srm-button-plain {
    font-size: inherit;
    font-weight: inherit;
  }
}

>>> .customize-detail {
  .form-item {
    .srm-field-value {
      font-size: 14px;
    }
  }
}

>>> .srm-list-item-card-head-left {
  max-width 100% !important;
}

>>> .srm-history-record-content {
  min-height: auto;
}

.tab-item-button {
  display: flex;
  gap: 8px;
  font-weight: 500;

  .srm-icon {
    font-size: 20px;
    color: var(--font-color-disable);
  }
}

.srm-list-icon-search {
  font-weight normal;
  font-size: 20px;
  color: $srm-theme-color-primary;
}
.collapse-item {
  >>> .srm-collapse-title {
    background: var(--background-color-empty-tab-title);
  }
  .collapse-title {
    height: 54px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: var(--font-color-default);
    background: var(--background-color-empty-tab-title);
    width: 100%;
  }
  .collapse-title-flex {
    width: auto;
  }
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}
.collapse-item-operation {
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}
.slot-content {
  width: 100%;
}
.bottom-button-wrapper {
  height: calc(74px + env(safe-area-inset-bottom));
}
</style>
