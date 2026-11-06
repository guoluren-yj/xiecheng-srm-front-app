<template>
  <srm-tab-bar display="justify">
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.settleMainInfo').$D('结算主信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionParty").$D("交易方信息") }}
      </srm-flex>
      <srm-form
        show-default-detail
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_TRANSACTION_PARTY"
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionAmount").$D("交易金额信息") }}
      </srm-flex>
      <srm-form
        show-default-detail
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
        show-default-detail
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.BILL_INFO"
        :data-set="settleLineDetailDataSet"
        :columns="getBillColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.invoiceInfo").$D("开票信息") }}
      </srm-flex>
      <srm-form
        show-default-detail
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
        show-default-detail
        customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SETTLE_DATA_RULE"
        :data-set="settleConfigDataSet"
        :columns="getSettleDataRuleColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.settleRule").$D("结算单规则") }}
      </srm-flex>
      <srm-form
        show-default-detail
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
          columns={this.getTransactionAffairDetailColumns()}/>
      });
    },
    getTransactionAffairDetailColumns() {
      const columns = this.getTransactionAffairColumns();
      columns[0].fieldType = "TEXT";
      columns[0].render = null;
      columns.push({ formRow: 15, fieldCode: "trxTypeCode" },
        { formRow: 16, fieldCode: "trxTypeCodeMeaning" },
        { formRow: 17, fieldCode: "contractAndLineNum" },
        { formRow: 18, fieldCode: "poAndLineNum" },
        { formRow: 20, fieldCode: "asnAndLineNum" },
        { formRow: 21, fieldCode: "sourceParentSettleLineNum" },
        { formRow: 23, fieldCode: "ecPoNum" },
        { formRow: 24, fieldCode: "ecPoSubNum" },
        { formRow: 25, fieldCode: "deliverTime" },
        { formRow: 26, fieldCode: "deliverQuantity" },
        { formRow: 27, fieldCode: "invoiceMethodMeaning" },
        { formRow: 28, fieldCode: "afterSalesStatusMeaning" },
        { formRow: 29, fieldCode: "invoiceTypeMeaning" },
        { formRow: 30, fieldCode: "costName" },
        { formRow: 31, fieldCode: "termCode" },
        { formRow: 32, fieldCode: "settleAttach" },
        { formRow: 33, fieldCode: "pcSubjectLineNum" });
      return columns;
    },
    getTransactionAffairColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag>
            {
              this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.settleNum").$D("结算事务编号") +
              "：" + val || "-"
            }
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "elecInvoiceView" },
        { formRow: 3, fieldCode: "sourceSettleNum" },
        { formRow: 4, fieldCode: "sourceSettleLineNum" },
        { formRow: 5, fieldCode: "dataSourceMeaning" },
        { formRow: 6, fieldCode: "trxDate" },
        { formRow: 7, fieldCode: "trxYear" },
        { formRow: 7, fieldCode: "orderType" },
        { formRow: 11, fieldCode: "poLineLocation" },
        { formRow: 11, fieldCode: "releaseNum" },
        { formRow: 12, fieldCode: "purOrganizationName" },
        { formRow: 12, fieldCode: "invOrganizationName" },
        { formRow: 13, fieldCode: "inventoryName" },
        { formRow: 13, fieldCode: "createdByName" },
        { formRow: 14, fieldCode: "purchaseAgentName" },
        { formRow: 14, fieldCode: "freightFlag" },
      ];
    },
    getTransactionColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag>
            {
              this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.jsCompanyName").$D("结算公司名称") +
              "：" + val || "-"
            }
          </SrmListHeader>
        },
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
      return [
        {
          formRow: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag>
            {
              this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.itemName").$D("货物或应税劳务，服务名称") +
              "：" + val || "-"
            }
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "itemCode" },
        { formRow: 3, fieldCode: "quantity" },
        { formRow: 3, fieldCode: "unitPriceBatch" },
        { formRow: 5, fieldCode: "netPrice" },
        { formRow: 5, fieldCode: "netAmount" },
        { formRow: 7, fieldCode: "taxIncludedPrice" },
        { formRow: 7, fieldCode: "taxIncludedAmount" },
        { formRow: 9, fieldCode: "taxRate" },
        { formRow: 9, fieldCode: "taxAmount" },
        { formRow: 11, fieldCode: "currencyCode" },
        { formRow: 11, fieldCode: "uom" },
        { formRow: 13, fieldCode: "specificationsModel" },
        { formRow: 14, fieldCode: "srmItemCode" },
        { formRow: 14, fieldCode: "categoryName" },
      ];
    },
    getBillColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "billOccupiedQuantity",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.billOccupiedQuantity").$D("对账占用数量")}：{val}
          </SrmListHeader>,
        },
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
        {
          formRow: 1,
          fieldCode: "invoiceOccupiedQuantity",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceOccupiedQuantity").$D("开票占用数量")}：{val}
          </SrmListHeader>,
        },
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
        {
          formRow: 1,
          fieldCode: "paymentRemoveFlag",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.paymentRemoveFlag").$D("付款暂挂")}：
            {val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")}
          </SrmListHeader>,
        },
        { formRow: 2, fieldCode: "paymentOccupiedAmount" },
        { formRow: 3, fieldCode: "paymentCompletedAmount" },
        { formRow: 4, fieldCode: "paymentLockQuantity" },
      ];
    },
    getSettleDataRuleColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "settleConfigNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssta.purchaseSettle.model.purchaseSettlePool.settleConfigNum").$D("结算策略编码")}：{val}
          </SrmListHeader>,
        },
        { formRow: 2, fieldCode: "settleConfigName" },
        { formRow: 3, fieldCode: "settleBasePriceMeaning" },
        { formRow: 4, fieldCode: "settleModeMeaning" },
        { formRow: 5, fieldCode: "settleMatchDimensionMeaning" },
        { formRow: 6, fieldCode: "versionNumber" },
      ];
    },
    getSettleRuleColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "invoiceSettleCompanyCodeMeaning",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            {this.$T("ssta.purchaseInvoicePool.model.purchaseInvoicePool.invoiceSettleCompanyCodeMeaning").$D("开票结算公司")}：{val}
          </SrmListHeader>,
        },
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
  border-bottom #F6F6F6 solid 1px;
}

.sub-title {
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  border-bottom #F6F6F6 solid 1px;
  height 36px;
  padding-left 15px;
}
</style>
