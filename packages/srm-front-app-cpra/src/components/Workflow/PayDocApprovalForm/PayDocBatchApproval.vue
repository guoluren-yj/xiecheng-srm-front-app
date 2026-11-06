<template>
  <div class="srm-payment-batch-approval">
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.PAY_DOC_BATCH_APPROVAL.COLLAPSE">
      <srm-scroll-tab-item code="batchInfo" :label="$T('sbsm.paymentWorkbench.view.title.payDocBatchInfo').$D('支付单批次信息')">
        <srm-form
          :data-set="batchInfoDs"
          :columns="batchInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="payList" :label="$T('sbsm.paymentWorkbench.view.title.payDocList').$D('支付单列表')">
        <srm-list
          customize-code="SMBL.WORKFLOW.PAY_DOC_BATCH_APPROVAL.DOC_LIST"
          :data-set="payListDs"
          :columns="payListColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import PayDocApproval from "./PayDocApproval";
import { payListDS } from "./datasource/batchDS";
import { formatColumns } from "./utils";
import { queryBatchInfo } from "./api";
export default {
  fieldCode: "PayDocBatchApproval",
  modules: [ "hzero.common", "sbsm.common", "sbsm.paymentWorkbench", "sbsm.paymentPool", "smbl.common" ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      batchInfoDs: new DataSet({}),
      payListDs: new DataSet(payListDS()),
    };
  },
  computed: {
    batchInfoColumns() {
      return [
        {
          fieldCode: "batchNum",
          fieldType: "EMPTY",
          render: (value) => <SrmListHeader><span>{value || "-"}</span></SrmListHeader>
        },
      ];
    },
    payListColumns() {
      return formatColumns([
        {
          fieldCode: "payNum",
          render: (value, record) =>
            <SrmButton plain onClick={() => this.showPayDocDetail(record)}>
              {value}
            </SrmButton>
        },
        "companyNum",
        "companyName",
        "displaySupplierNum",
        "displaySupplierName",
        [ "currencyCode", "payAmount" ],
        [ "payTypeName", "payFormMeaning" ],
        "remark",
        "createdByName",
        "creationDate",
        "attachmentUuid",
      ], {
        takeFlag: true,
        endRow: Infinity,
        showLabelTop: { header: false },
      });
    },
  },
  beforeMount() {
    this.initData();
  },
  methods: {
    async initData() {
      const { batchId } = this.parameters;
      const res = await queryBatchInfo(batchId).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        const { payHeaderDTOList, ...others } = res;
        this.batchInfoDs.create(others);
        this.payListDs.setData(payHeaderDTOList);
      }
    },
    showPayDocDetail(record) {
      const { payHeaderId } = record;
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content:
          <PayDocApproval props={{ "v-bind": "$attrs" }} parameters={{ payHeaderId }} />
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";
.srm-payment-batch-approval {
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
