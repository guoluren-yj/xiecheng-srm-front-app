<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.PylontechSettlementBatchStatementSubmitForm.view.title.baseInfo').$D(
        '基本信息'
      )">
        <srm-form :data-set="headerDataDs" :columns="getGroupInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.PylontechSettlementBatchStatementSubmitForm.view.title.lineInfo').$D(
        '行明细'
      )">
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" :scrollable="false" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.PylontechSettlementBatchStatementSubmitForm.view.title.attachement').$D(
        '附件信息'
      )">
        <srm-form :data-set="headerDataDs" :columns="getAttachmentColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, headerData } from "./dataSource/index";

export default {
  modules: [ "scux.PylontechSettlementBatchStatementSubmitForm" ],
  name: "PylontechSettlementBatchStatementSubmitForm",
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
      headerDataDs: new DataSet(headerData()),
      lineInfoDataSet: new DataSet(lineInfoDs()),
      documentType: "",
    };
  },
  computed: {
    // 基本信息
    getGroupInfoColumns() {
      return [
        {
          fieldCode: "batchSettleNum",
        },
        {
          fieldCode: "createdByMeaning",
        },
        {
          fieldCode: "createdUnitIdMeaning",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "attributeDecimal1",
          fieldName: this.documentType === "INVOICE" ? this.$T("scux.PylontechSettlementBatchStatementSubmitForm.model.attributeDecimal1.INVOICE").$D(
            "开票金额合计") : this.documentType === "PAYMENT" ? this.$T("scux.PylontechSettlementBatchStatementSubmitForm.model.attributeDecimal1.PAYMENT").$D(
            "实际付款金额合计") : this.$T("scux.PylontechSettlementBatchStatementSubmitForm.model.attributeDecimal1.PREPAYMENT").$D(
            "预付金额合计"),
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    // 行信息
    lineColumns() {
      return [
        {
          fieldCode: "index",
        },
        {
          fieldCode: "settleNum",
        },
        {
          fieldCode: "supplierIdMeaning",
        },
        {
          fieldCode: "companyIdMeaning",
        },
        this.documentType === "PAYMENT" && {
          fieldCode: "paymentAmount",
        },
        this.documentType === "INVOICE" && {
          fieldCode: "invoiceTaxIncludedAmount",
        },
        this.documentType === "PREPAYMENT" && {
          fieldCode: "prepaymentAmount",
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "attributeLongtext1",
        },
        {
          fieldCode: "attachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachment-uuid={val}
                show-icon={false}
                title={this.$T(
                  "scux.PylontechSettlementBatchStatementSubmitForm.model.attributeLongtext1"
                ).$D("附件")}
                desc-title={this.$T("scux.PylontechSettlementBatchStatementSubmitForm.model.check").$D(
                  "查看"
                )}
              />
            </div>,
        },
      ];
    },
    // 附件信息
    getAttachmentColumns() {
      return [
        {
          fieldCode: "attributeLongtext4",
          render: (val) =>
            <div>
              <SrmUpload
                attachment-uuid={val}
                show-icon={false}
                title={this.$T(
                  "scux.PylontechSettlementBatchStatementSubmitForm.model.attributeLongtext1"
                ).$D("附件")}
                desc-title={this.$T("scux.PylontechSettlementBatchStatementSubmitForm.model.check").$D(
                  "查看"
                )}
              />
            </div>,
        },
        {
          fieldCode: "attributeLongtext2",
        },
      ];
    }
  },
  async mounted() {
    const { bussinessKey } = this.parameters;
    this.headerDataDs.setQueryParameter({ bussinessKey });
    await this.headerDataDs.refresh();
    const { documentType } = this.headerDataDs.current?.toData() || {};
    this.documentType = documentType;
    this.lineInfoDataSet.setQueryParameter({ bussinessKey });
    this.lineInfoDataSet.refresh();
  },
  methods: {
  },
};
</script>

<style scoped lang="stylus">
.preserve-format {
   white-space: pre-line; /* 保留换行，合并连续空格 */
}
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
