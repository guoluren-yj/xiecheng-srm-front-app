<template>
  <srm-tab-bar>
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.settleMainInfo').$D('结算主信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionParty").$D("交易方信息") }}
      </srm-flex>
      <srm-form
        show-default-detail
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.message.panel.transactionAmount").$D("交易金额信息") }}
      </srm-flex>
      <srm-form
        show-default-detail
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionAmountColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.transactionAffair").$D("交易事务信息") }}
      </srm-flex>
      <srm-form
        :data-set="settleLineDetailDataSet"
        :columns="getTransactionAffairColumns()"
        @click.native="showAffairDetail"/>
    </srm-tab-item>
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.settleRunInfo').$D('结算执行信息')">
      <srm-flex class="sub-title" justify="between">
        <span>{{ $T("ssta.purchaseSettle.view.title.billInfo").$D("对账信息") }}</span>
        <div class="ssta-settle-run-info-tab">
          <srm-button :class="`first-button ${!billFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('bill')">
            {{ $T('ssta.purchaseSettlePool.button.inalDisplay').$D('最终展示') }}
          </srm-button>
          <srm-button :class="`${billFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('bill')">
            {{ $T('ssta.purchaseSettlePool.button.displayRecord').$D('展示记录') }}
          </srm-button>
        </div>
      </srm-flex>
      <amount-card :occupied-data="occupiedMap.bill" :completed-data="completedMap.bill" />
      <srm-list
        style="height:auto"
        :scrollable="false"
        :data-set="billRecordDs"
        :columns="getBillRecordListColumns"
        @itemClick="() => onClickItem('bill')"/>
      <srm-flex class="sub-title" justify="between">
        <span>  {{ $T("ssta.purchaseSettle.view.title.invoiceInfo").$D("开票信息") }}</span>
        <div class="ssta-settle-run-info-tab">
          <srm-button :class="`first-button ${!invoiceFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('invoice')">
            {{ $T('ssta.purchaseSettlePool.button.inalDisplay').$D('最终展示') }}
          </srm-button>
          <srm-button :class="`${invoiceFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('invoice')">
            {{ $T('ssta.purchaseSettlePool.button.displayRecord').$D('展示记录') }}
          </srm-button>
        </div>
      </srm-flex>
      <amount-card :occupied-data="occupiedMap.invoice" :completed-data="completedMap.invoice" />
      <srm-list
        style="height:auto"
        :scrollable="false"
        :data-set="invoiceRecordDs"
        :columns="getInvoiceRecordListColumns"
        @itemClick="() => onClickItem('invoice')"/>
      <srm-flex class="sub-title" justify="between">
        <span>{{ $T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息") }}</span>
        <div class="ssta-settle-run-info-tab">
          <srm-button :class="`first-button ${!paymentFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('payment')">
            {{ $T('ssta.purchaseSettlePool.button.inalDisplay').$D('最终展示') }}
          </srm-button>
          <srm-button :class="`${paymentFinalFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeFinalTab('payment')">
            {{ $T('ssta.purchaseSettlePool.button.displayRecord').$D('展示记录') }}
          </srm-button>
        </div>
      </srm-flex>
      <amount-card :occupied-data="occupiedMap.payment" :completed-data="completedMap.payment" />
      <srm-list
        style="height:auto"
        :scrollable="false"
        :data-set="paymentRecordDs"
        :columns="getPaymentRecordListColumns"
        @itemClick="() => onClickItem('payment')"/>
    </srm-tab-item>
    <srm-tab-item :label="$T('ssta.purchaseSettle.view.title.strategy').$D('结算策略信息')">
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.settleDataRule").$D("结算数据规则") }}
      </srm-flex>
      <srm-form
        show-default-detail
        :data-set="settleConfigDataSet"
        :columns="getSettleDataRuleColumns()"/>
      <srm-flex class="sub-title">
        {{ $T("ssta.purchaseSettle.view.title.settleRule").$D("结算单规则") }}
      </srm-flex>
      <srm-form
        show-default-detail
        :data-set="settleConfigDataSet"
        :columns="getSettleRuleColumns()"/>
    </srm-tab-item>
  </srm-tab-bar>
</template>
<script>

import { DataSet } from "srm-mobile-ui";
import AmountCard from "./AmountCard";
import StatusTag from "@/components/StatusTag";
import { isObject, isArray, isString, take } from "lodash";
import { billRecordDS, invoiceRecordDS, paymentRecordDS, settleConfigDS, settleLineDetailDS } from "../datasource/purchaseSettleDetailDS";
const statusColorMap = {
  OCCUPIED: "error",
  CANCELED: "info",
  COMPLETED: "success",
};
export default {
  modules: [ "ssta.purchaseInvoicePool", "ssta.purchaseSettle", "smbl.common", "ssta.purchaseSettlePool", "ssta.common", "hzero.common" ],
  name: "SettleLineDetail",
  components: { AmountCard },
  props: {
    topRecord: Object,
    supplierFlag: {
      type: Boolean,
      default: false,
    },
    redirectPage: Function,
  },
  data() {
    const { settleId } = this.topRecord;
    return {
      billFinalFlag: 1,
      invoiceFinalFlag: 1,
      paymentFinalFlag: 1,
      settleLineDetail: {},
      occupiedMap: {},
      completedMap: {},
      settleLineDetailDataSet: new DataSet(settleLineDetailDS()),
      settleConfigDataSet: new DataSet(settleConfigDS()),
      billRecordDs: new DataSet(billRecordDS(settleId, 1)),
      invoiceRecordDs: new DataSet(invoiceRecordDS(settleId, 1)),
      paymentRecordDs: new DataSet(paymentRecordDS(settleId, 1)),
    };
  },
  computed: {
    getBillRecordListColumns() {
      const fieldsList = [
        {
          fieldCode: "documentNumAndLine",
          fieldType: "EMPTY",
          render:  (value, record) =>
            <SrmListHeader>
              <span>{value}</span>
              <StatusTag slot="right" text={record.recordStatusMeaning} color={statusColorMap[record.recordStatus]} />
            </SrmListHeader>,
        },
        "taxIncludedPrice",
        "taxIncludedAmount",
        [
          "quantity",
          {
            fieldCode: "operation",
            fieldType: "TEXT",
            fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
            render: (_, record) =>
              record.autoGenerateFlag === 0 &&
              record.recordStatus !== "LOCK" &&
              <SrmButton plain onClick={() => this.handleToDetail("bill", record)}>
                {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
              </SrmButton>
            ,
          },
        ],
        [ "taxRate", "taxAmount" ],
        "creationDate"
      ];
      return this.formatListColumns(fieldsList, { endRow: Infinity });
    },
    getBillRecordDetailColumns() {
      const fieldsList = [
        ...this.billRecordDs.fields,
        {
          fieldCode: "operation",
          fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
          render: (_, record) =>
            record.autoGenerateFlag === 0 &&
            record.recordStatus !== "LOCK" &&
            <SrmButton plain onClick={() => this.handleToDetail("bill", record)}>
              {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
            </SrmButton>
          ,
        },
      ];
      return this.formatDetailColumns(fieldsList);
    },
    getInvoiceRecordListColumns() {
      const fieldsList = [
        {
          fieldCode: "documentNumAndLine",
          fieldType: "EMPTY",
          render:  (value, record) =>
            <SrmListHeader>
              <span>{value}</span>
              <StatusTag slot="right" text={record.recordStatusMeaning} color={statusColorMap[record.recordStatus]} />
            </SrmListHeader>,
        },
        "taxIncludedPrice",
        "taxIncludedAmount",
        [
          "quantity",
          {
            fieldCode: "operation",
            fieldType: "TEXT",
            fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
            render: (_, record) =>
              record.autoGenerateFlag === 0 &&
              record.recordStatus !== "LOCK" &&
              record.settleType &&
              <SrmButton plain onClick={() => this.handleToDetail("invoice", record)}>
                {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
              </SrmButton>
            ,
          },
        ],
        [ "taxRate", "taxAmount" ],
        "creationDate"
      ];
      return this.formatListColumns(fieldsList, { endRow: Infinity });
    },
    getInvoiceRecordDetailColumns() {
      const fieldsList = [
        ...this.invoiceRecordDs.fields,
        {
          fieldCode: "operation",
          fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
          render: (_, record) =>
            record.autoGenerateFlag === 0 &&
            record.recordStatus !== "LOCK" &&
            record.settleType &&
            <SrmButton plain onClick={() => this.handleToDetail("invoice", record)}>
              {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
            </SrmButton>
          ,
        },
      ];
      return this.formatDetailColumns(fieldsList);
    },
    getPaymentRecordListColumns() {
      const fieldsList = [
        {
          fieldCode: "documentNumAndLine",
          fieldType: "EMPTY",
          render:  (value, record) =>
            <SrmListHeader>
              <span>{value}</span>
              <StatusTag slot="right" text={record.recordStatusMeaning} color={statusColorMap[record.recordStatus]} />
            </SrmListHeader>,
        },
        "paymentAmount",
        "paymentTypeMeaning",
        [
          "createdUserName",
          {
            fieldCode: "operation",
            fieldType: "TEXT",
            fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
            render: (_, record) =>
              record.recordStatus !== "LOCK" &&
              record.settleType &&
              <SrmButton plain onClick={() => this.handleToDetail("payment", record)}>
                {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
              </SrmButton>
            ,
          },
        ],
        "creationDate"
      ];
      return this.formatListColumns(fieldsList, { endRow: Infinity });
    },
    getPaymentRecordDetailColumns() {
      const fieldsList = [
        ...this.paymentRecordDs.fields,
        {
          fieldCode: "operation",
          fieldName: this.$T("ssta.purchaseSettlePool.model.purchaseSettlePool.operation").$D("操作"),
          render: (_, record) =>
            record.recordStatus !== "LOCK" &&
            record.settleType &&
            <SrmButton plain onClick={() => this.handleToDetail("payment", record)}>
              {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
            </SrmButton>
          ,
        },
      ];
      return this.formatDetailColumns(fieldsList);
    },
  },
  created() {
    const { settleId, settleConfigNum } = this.topRecord;
    this.settleLineDetailDataSet.addPathParameter("settleId", settleId);
    this.settleLineDetailDataSet.refresh().then(() => {
      const settleLineDetail = this.settleLineDetailDataSet.current.toData();
      this.settleLineDetail = settleLineDetail;
      const { uom, currencyCode, settleMatchDimension } = this.topRecord;
      const commonProps = { uom, currencyCode, settleMatchDimension };
      this.occupiedMap = {
        bill: {
          ...commonProps,
          amount: settleLineDetail.billOccupiedAmount,
          quantity: settleLineDetail.billOccupiedQuantity,
          netAmount: settleLineDetail.billOccupiedNetAmount,
          taxAmount: settleLineDetail.billOccupiedTaxAmount,
        },
        invoice: {
          ...commonProps,
          amount: settleLineDetail.invoiceOccupiedAmount,
          quantity: settleLineDetail.invoiceOccupiedQuantity,
          netAmount: settleLineDetail.invoiceOccupiedNetAmount,
          taxAmount: settleLineDetail.invoiceOccupiedTaxAmount,
        },
        payment: {
          ...commonProps,
          simpleFlag: true,
          onlyAmount: true,
          amount: settleLineDetail.paymentOccupiedAmount,
        },
      };
      this.completedMap = {
        bill: {
          ...commonProps,
          amount: settleLineDetail.billOccupiedAmount,
          quantity: settleLineDetail.billCompletedQuantity,
          netAmount: settleLineDetail.billCompletedNetAmount,
          taxAmount: settleLineDetail.billCompletedTaxAmount,
        },
        invoice: {
          ...commonProps,
          amount: settleLineDetail.billOccupiedAmount,
          quantity: settleLineDetail.invoiceCompletedQuantity,
          netAmount: settleLineDetail.invoiceCompletedNetAmount,
          taxAmount: settleLineDetail.invoiceCompletedTaxAmount,
        },
        payment: {
          ...commonProps,
          simpleFlag: true,
          onlyAmount: true,
          amount: settleLineDetail.paymentCompletedAmount,
        },
      };
    });
    this.settleConfigDataSet.addPathParameter("settleConfigNum", settleConfigNum);
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
    },
    changeFinalTab(type) {
      const finalFlag = `${type}FinalFlag`;
      const recordDs = `${type}RecordDs`;
      this[finalFlag] = this[finalFlag] ? 0 : 1;
      this[recordDs].addQueryParameter("finalFlag", this[finalFlag]);
      this[recordDs].refresh();
    },
    onClickItem(type) {
      let dataSet, getColumnsFunc;
      switch (type) {
      case "bill":
        dataSet = this.billRecordDs;
        getColumnsFunc = this.getBillRecordDetailColumns;
        break;
      case "invoice":
        dataSet = this.invoiceRecordDs;
        getColumnsFunc = this.getInvoiceRecordDetailColumns;
        break;
      case "payment":
        dataSet = this.paymentRecordDs;
        getColumnsFunc = this.getPaymentRecordDetailColumns;
        break;
      default:
      }
      this.$popup({
        position:"right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={dataSet}
            columns={getColumnsFunc}
          />
        ,
      });
    },
    handleToDetail(type, record) {
      const { supplierFlag, redirectPage } = this;
      const { documentId } = record;
      if (type === "bill") {
        const routeName = supplierFlag ? "StatementReviewBySupplierDetail" : "StatementReviewDetail";
        redirectPage({
          name: routeName,
          query: { id: documentId, type: "ALL" },
        });
      } else {
        const { settleType } = record;
        const routeName = supplierFlag ? "SupplySettleDetail" : "PurchaseSettleDetail";
        redirectPage({
          name: routeName,
          query: { settleHeaderId: documentId, type: "ALL", settleType },
        });
      }
    },
    formatListColumns(fieldsList, options = {}) {
      const { endRow = 7, showLabelTop = true } = options;
      const filterList = fieldsList.filter((item) => item);
      return take(filterList, endRow).reduce((total, item, formRow) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem, formCol) => {
            if (isObject(childItem)) {
              currentList.push({ formRow, formCol, ...childItem });
            } else if (isString(childItem)) {
              currentList.push({ formRow, formCol, fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push({ formRow, ...item });
        } else if (isString(item)) {
          if (formRow === 0) {
            currentList.push({
              formRow,
              fieldCode: item,
              fieldType: "EMPTY",
              render: (value, _, field) => {
                const content = showLabelTop ?
                  `${field.fieldName} ：${value}` :
                  value;
                return <SrmListHeader>{content}</SrmListHeader>;
              },
            });
          } else {
            currentList.push({ formRow, fieldCode: item });
          }
        }
        return total.concat(currentList);
      }, []);
    },
    formatDetailColumns(fieldsList) {
      const filterList = fieldsList.filter((item) => item);
      return filterList.reduce((total, item) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem) => {
            if (isObject(childItem)) {
              currentList.push(item);
            } else if (isString(childItem)) {
              currentList.push({ fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push(item);
        } else if (isString(item)) {
          currentList.push({ fieldCode: item });
        }
        return total.concat(currentList);
      }, []);
    },
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
.ssta-settle-run-info-tab {
  height 40px;

  .first-button {
    margin-top 8px;
    margin-left 15px;
    margin-right 8px;
  }

  .second-button {
    margin-top 8px;

  }

  .no-active {
    background white;
    color #333333;
  }
}
</style>
