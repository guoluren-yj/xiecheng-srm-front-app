<template>
  <srm-tab-bar display="justify">
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.settleMainInfo').$D('结算主信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionParty").$D("交易方信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_TRANSACTION_PARTY"
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionAmount").$D("交易金额信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.TRANSACTION_AMOUNT"
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionAmountColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.transactionAffair").$D("交易事务信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.TRANSACTION_AFFAIR"
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionAffairColumns()"
        @click.native="showAffairDetail"/>
    </srm-tab-item>
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.settleRunInfo').$D('结算执行信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.billInfo").$D("对账信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.BILL_INFO"
        :data-set="settleLineDetailDataSet"
        :columns="getBillColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.invoiceInfo").$D("开票信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.INVOICE_INFO"
        :data-set="settleLineDetailDataSet"
        :columns="getInvoiceColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_PAYMENT_INFO"
        :data-set="settleLineDetailDataSet"
        :columns="getPaymentColumns()"
        @click.native="showPaymentDetail"/>
    </srm-tab-item>
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.strategy').$D('结算策略信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.settleDataRule").$D("结算数据规则") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SETTLE_DATA_RULE"
        :data-set="settleConfigDataSet"
        :columns="getSettleDataRuleColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.settleRule").$D("结算单规则") }}
      </srm-flex>
      <srm-form
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SETTLE_RULE"
        :data-set="settleConfigDataSet"
        :columns="getSettleRuleColumns()"/>
    </srm-tab-item>
  </srm-tab-bar>
</template>
<script>

import { DataSet } from "srm-mobile-ui";
import settleLineDetailDS from "../datasource/settleLineDetailDS";
import settleConfigDS from "../datasource/settleConfigDS";
import { formatColumns } from "../utils";

export default {
  modules: [ "ssta.purchaseInvoicePool", "ssta.purchaseSettle", "smbl.common", "ssta.purchaseSettlePool" ],
  name: "SettleLineDetail",
  props: {
    settleId: {
      type: String | Number,
      default: null
    },
    settleConfigNum: {
      type: String,
      default: null
    },
    showLinePayment: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      settleLineDetailDataSet: new DataSet(settleLineDetailDS()),
      settleConfigDataSet: new DataSet(settleConfigDS()),
    };
  },
  beforeMount() {
    this.settleLineDetailDataSet.addPathParameter("settleId", this.settleId);
    this.settleLineDetailDataSet.refresh();
    this.settleConfigDataSet.addPathParameter("settleConfigNum", this.settleConfigNum);
    this.settleConfigDataSet.refresh();
  },
  methods: {
    showAffairDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.TRANSACTION_AFFAIR_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleLineDetailDataSet}
          columns={this.getTransactionAffairColumns(true)}/>
      });
    },
    getTransactionAffairColumns(detailFlag) {
      const fieldCodeList = [
        "settleNum",
        "elecInvoiceView",
        "sourceSettleNum",
        "sourceSettleLineNum",
        "dataSourceMeaning",
        "trxDate",
        [ "trxYear", "orderType" ],
        [ "poLineLocation", "releaseNum" ],
        [ "purOrganizationName", "invOrganizationName" ],
        [ "inventoryName", "createdByName" ],
        [ "purchaseAgentName", "freightFlag" ],
        "trxTypeCode",
        "trxTypeCodeMeaning",
        "contractAndLineNum",
        "poAndLineNum",
        "asnAndLineNum",
        "sourceParentSettleLineNum",
        "ecPoNum",
        "ecPoSubNum",
        "deliverTime",
        "deliverQuantity",
        "invoiceMethodMeaning",
        "afterSalesStatusMeaning",
        "invoiceTypeMeaning",
        "costName",
        "termCode",
        "settleAttach",
        "pcSubjectLineNum"
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: !detailFlag });
      return columns;
    },
    getTransactionColumns() {
      return [
        { formRow: 1, fieldCode: "companyName" },
        { formRow: 2, fieldCode: "companyNum" },
        { formRow: 3, fieldCode: "sourceCompanyNum" },
        { formRow: 4, fieldCode: "sourceCompanyName" },
        { formRow: 5, fieldCode: "sourceSupplierCompanyName" },
        { formRow: 6, fieldCode: "sourceSupplierCompanyNum" },
        // { formRow: 6, fieldCode: "companyName" },
        { formRow: 8, fieldCode: "supplierCompanyNum" },
        { formRow: 9, fieldCode: "supplierCompanyName" },
      ];
    },
    getTransactionAmountColumns() {
      const fieldCodeList = [
        "itemName",
        "itemCode",
        [ "quantity", "unitPriceBatch" ],
        [ "netPrice", "netAmount" ],
        [ "taxIncludedPrice", "taxIncludedAmount" ],
        [ "taxRate", "taxAmount" ],
        "currencyCode",
        "uom",
        "specificationsModel",
        [ "srmItemCode", "categoryName" ]
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true, showTitle: true });
      return columns;
    },
    getBillColumns() {
      return [
        { formRow: 1, fieldCode: "billOccupiedQuantity" },
        { formRow: 2, fieldCode: "billOccupiedAmount" },
        { formRow: 3, fieldCode: "billCompletedQuantity" },
        { formRow: 4, fieldCode: "billCompletedAmount" },
        { formRow: 5, fieldCode: "billRemoveFlag" },
        { formRow: 6, fieldCode: "billOccupiedNetAmount" },
        { formRow: 7, fieldCode: "billOccupiedTaxAmount" },
        { formRow: 8, fieldCode: "billCompletedNetAmount" },
        { formRow: 9, fieldCode: "billCompletedTaxAmount" },
        { formRow: 10, fieldCode: "billLockQuantity" },
      ];
    },
    getInvoiceColumns() {
      return [
        { formRow: 1, fieldCode: "invoiceOccupiedQuantity", },
        { formRow: 2, fieldCode: "invoiceCompletedQuantity" },
        { formRow: 3, fieldCode: "invoiceCompletedNetAmount" },
        { formRow: 4, fieldCode: "invoiceCompletedTaxAmount" },
        { formRow: 5, fieldCode: "invoiceRemoveFlag" },
        { formRow: 6, fieldCode: "invoiceOccupiedNetAmount" },
        { formRow: 7, fieldCode: "invoiceOccupiedTaxAmount" },
        { formRow: 8, fieldCode: "invoiceOccupiedAmount" },
        { formRow: 9, fieldCode: "invoiceCompletedAmount" },
        { formRow: 10, fieldCode: "invoiceLockQuantity" },
      ];
    },
    showPaymentDetail() {
      const columns = this.getPaymentColumns();
      columns[0].fieldType = "TEXT";
      columns[0].render = (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");

      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          dataSet={this.settleLineDetailDataSet}
          customizeType="detail"
          columns={columns}/>
      });
    },
    getPaymentColumns() {
      return [
        { formRow: 1, fieldCode: "paymentRemoveFlag" },
        { formRow: 2, fieldCode: "paymentOccupiedAmount" },
        { formRow: 3, fieldCode: "paymentCompletedAmount" },
        { formRow: 4, fieldCode: "paymentLockQuantity" },
      ];
    },
    getSettleDataRuleColumns() {
      const fieldCodeList = [
        "settleConfigName",
        "settleConfigNum",
        "settleBasePriceMeaning",
        "settleModeMeaning",
        "settleMatchDimensionMeaning",
        "versionNumber"
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true, showTitle: true });
      return columns;
    },
    getSettleRuleColumns() {
      return [
        { formRow: 1, fieldCode: "invoiceSettleCompanyCodeMeaning" },
        { formRow: 2, fieldCode: "paymentSettleCompanyCodeMeaning" },
        { formRow: 3, fieldCode: "invoiceSettleSupplierCodeMeaning" },
        { formRow: 4, fieldCode: "paymentSettleSupplierCodeMeaning" },
        { formRow: 5, fieldCode: "invoicePartMatchFlag" },
        { formRow: 5, fieldCode: "paymentPartMatchFlag" },
        { formRow: 7, fieldCode: "invoicePriceEditFlag" },
        { formRow: 7, fieldCode: "invoiceTaxRateEditFlag" },
        { formRow: 8, fieldCode: "invoiceTaxAmountEditFlag" },
        { formRow: 8, fieldCode: "taxAllowanceAmountLower" },
        { formRow: 12, fieldCode: "invoiceDependencyFlag" },
        { formRow: 12, fieldCode: "paymentDependencyFlag" },
      ];
    }
  }
};
</script>

<style scoped lang="stylus">
>>> .srm-form {
  padding: 16px 15px;
  min-height: 60px;
  margin: 0;
  border-bottom #F6F6F6 solid 2px;
}

.sub-title {
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  border-bottom #F6F6F6 solid 1px;
  height 36px;
  padding-left 15px;
  font-weight: 600;
}
</style>
