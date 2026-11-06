<template>
  <srm-scroll-tab customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.COLLAPSES">
    <srm-scroll-tab-item code="basic" :show-title="false" :label="$T('ssta.purchaseSettle.message.panel.baseInfos').$D('基本信息')">
      <srm-collapse-item v-model="basicCollapse" class="collapse-item" name="basic">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.message.panel.baseInfos').$D('基本信息') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            class="ssta-from-content"
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.BASIC"
            :data-set="settleHeaderDataSet"
            :columns="getBasicColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="transaction" :show-title="false" :label="$T('ssta.purchaseSettle.message.panel.transactionParty').$D('交易方信息')">
      <srm-collapse-item v-model="transactionCollapse" class="collapse-item" name="transaction">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.message.panel.transactionParty').$D('交易方信息') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.TRANSACTION_PARTY"
            :data-set="settleHeaderDataSet"
            :columns="getTransactionColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="summary" :show-title="false" :label="$T('ssta.purchaseSettle.view.title.summaryInfo').$D('汇总信息')">
      <srm-collapse-item v-model="summaryCollapse" class="collapse-item" name="summary">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.summaryInfo').$D('汇总信息') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SUMMARY_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getSummaryColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="isInvoice" code="invoice" :show-title="false"
                         :label="$T('ssta.purchaseSettle.view.title.systemInvoiceInfo').$D('开票信息（系统）')">
      <srm-collapse-item v-model="summaryCollapse" class="collapse-item" name="summary">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.systemInvoiceInfo').$D('开票信息（系统）') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SYSTEM_INVOICE_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getSystemInvoiceColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="isInvoice" code="invoicematch" :label="$T('ssta.purchaseSettle.view.title.invoiceMatchInfo').$D('发票匹配信息')"
                         :show-title="false">
      <srm-collapse-item v-model="invoicematchCollapse" class="collapse-item" name="invoicematch">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $T('ssta.purchaseSettle.view.title.invoiceMatchInfo').$D('发票匹配信息') }}</div>
          <srm-button style="font-weight: bold" plain @click="showTaxInvoice">
            {{ $T("ssta.purchaseSettle.view.title.taxInvoice").$D("税务发票") }}
          </srm-button>
        </srm-flex>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.INVOICE_MATCH_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getInvoiceMatchColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item
      v-if="optPermissionMap.HEAD_PREPAYMENT_VERIFICATION"
      code="prepayment"
      :show-title="false"
      :label="$T('ssta.purchaseSettle.view.title.prePaymentWriteOffInfo').$D('预付款核销信息')">
      <srm-collapse-item v-model="prepaymentCollapse" class="collapse-item" name="prepayment">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $T("ssta.purchaseSettle.view.title.prePaymentWriteOffInfo").$D("预付款核销信息") }}</div>
          <srm-button style="font-weight: bold" plain @click="showPrePayWriteOffRecord()">
            {{ $T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录") }}
          </srm-button>
        </srm-flex>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.PRE_PAYMENT_WRITE_OFF_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getPrePayColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item
      v-if="optPermissionMap.HEAD_PAYMENT"
      code="payment"
      :show-title="false"
      :label="$T('ssta.purchaseSettle.view.title.paymentInfo').$D('付款信息')">
      <srm-collapse-item v-model="paymentCollapse" class="collapse-item" name="payment">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息") }}</div>
          <div>
            <srm-button
              v-if="optPermissionMap.HEAD_MULDIMENSION_PAYMENT"
              style="font-weight: bold" plain @click="showMultiPaymentInfo">
              {{ $T("ssta.purchaseSettle.button.multiPaymentInfo").$D("多维度付款信息") }}
            </srm-button>
            <srm-button style="font-weight: bold;margin-left: 12px;" plain @click="showPaymentDetail">
              {{ $T("ssta.purchaseSettle.button.paymentInfo").$D("付款信息") }}
            </srm-button>
          </div>
        </srm-flex>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.PAYMENT_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getPaymentColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="line" :label="$T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D('交易明细信息')"
                         :show-title="false">
      <srm-collapse-item v-model="lineCollapse" class="collapse-item" name="line">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $T("ssta.purchaseSettle.view.message.panel.transactionDetails").$D("交易明细信息") }}</div>
          <!-- <span class="srm-icon icon-filter srm-list-icon-search" @click.stop="showLineFilter = true"/> -->
        </srm-flex>
        <srm-filter v-model="showLineFilter" :data-set="settleLineDataSet"/>
        <div slot="content">
          <srm-list
            :customize-code="isInvoice ? 'SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO' : 'SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO_PAY'"
            :data-set="settleLineDataSet"
            :scrollable="false"
            :columns="isInvoice ? getTransactionDetailColumns() : getTransactionDetailsInfoColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="cuszLine" :label="$T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D('交易明细信息')"
                         :show-title="false">
      <srm-collapse-item v-model="cuszLineCollapse" class="collapse-item" name="cuszLine">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $T("ssta.purchaseSettle.view.message.panel.transactionDetails").$D("交易明细信息") }}</div>
        </srm-flex>
        <div slot="content">
          <srm-list
            class="ssta-from-content"
            :customize-code="isInvoice ? 'SMBL.WORKFLOW.SETTLE_APPROVAL.INV_CUSZ_LINES' : 'SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_CUSZ_LINES'"
            :data-set="cuszLineDataSet"
            :scrollable="false"
            :columns="getCusTransactionDetailColumns()"
            @itemClick="showCuszLineDetail"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="mainStrategyInfo" :show-title="false" :label="$T('ssta.purchaseSettle.view.title.mainStrategyInfo').$D('主策略信息')">
      <srm-collapse-item v-model="mainStrategyInfoCollapse" class="collapse-item" name="mainStrategyInfo">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.mainStrategyInfo').$D('主策略信息') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.MAIN_STRATEGY_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getMainStrategyColumns()"
            @click.native="showMainStrategyDetail"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="otherInfo" :show-title="false" :label="$T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息')">
      <srm-collapse-item v-model="otherInfoCollapse" class="collapse-item" name="otherInfo">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.OTHER_INFO"
            :data-set="settleHeaderDataSet"
            :columns="getOtherColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="operation" :show-title="false" :label="$T('ssta.purchaseSettle.view.title.operationHistory').$D('操作记录')">
      <srm-collapse-item v-model="operationCollapse" class="collapse-item collapse-item-operation" name="operation">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.operationHistory').$D('操作记录') }}</div>
        <div slot="content">
          <history-record-tiled
            :action-data="operationRecord"
            :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
            operator-field-name="processUser"
            operation-meaning-field-name="processStatusMeaning"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item code="attachment" :show-title="false" :label="$T('ssta.purchaseSettle.view.title.attachment').$D('附件')">
      <srm-collapse-item v-model="attachmentCollapse" class="collapse-item" name="attachment">
        <div class="collapse-title">{{ $T('ssta.purchaseSettle.view.title.attachment').$D('附件') }}</div>
        <div slot="content" class="slot-content">
          <srm-form
            :data-set="settleHeaderDataSet"
            :columns="getAttachmentColumns()"/>
        </div>
      </srm-collapse-item>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>

import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import settleHeaderDS from "./datasource/settleHeaderDS";
import settleLineDS from "./datasource/settleLineDS";
import taxInvoiceDS from "./datasource/taxInvoiceDS";
import settleApplyLineDS from "./datasource/settleApplyLineDS";
import multiplePaymentInfoDS from "./datasource/multiplePaymentInfoDS";
import { cuszLineDS, cuszLineListDS } from "./datasource/cuszLineDS";
import { getOperationRecord, getTaxInvoiceOperationRecord } from "./api";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import SettleLineDetail from "./components/SettleLineDetail";
import { previewPdf } from "../../../../utils";

export default {
  name: "SettleSubmitApproval",
  components: { HistoryRecordTiled },
  modules: [ "ssta.purchaseSettle", "smbl.common", "ssta.purchaseInvoicePool", "ssta.purchaseSettlePool", "ssta.invoiceSheet", "sfin.purchaseBillConfirm", "ssta.supplySettlePool", "hzero.common", "ssta.sbuxPayLineDetail", "ssta.common", "ssta.ec.bill.line", "ssta.ec", "sodr.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      settleHeaderDataSet: new DataSet(settleHeaderDS(this.parameters.documentType || this.$route?.query?.documentType)),
      settleLineDataSet: new DataSet(settleLineDS(this.parameters.documentType || this.$route?.query?.documentType)),
      taxInvoiceDataSet: new DataSet(taxInvoiceDS()),
      settleApplyLineDataSet: new DataSet(settleApplyLineDS()),
      settleApplyLineDataSetPurchaser: new DataSet(settleApplyLineDS(true)),
      cuszLineDataSet: new DataSet(cuszLineDS(this.parameters.documentType || this.$route?.query?.documentType, this.parameters.settleHeaderId || this.$route?.query?.settleHeaderId)),
      multiplePaymentInfoDataSet: null,
      operationRecord: [],
      taxInvoiceOperationRecord: [],
      showLineFilter: false,
      cuszLineListDs: null,
      /**
       * HEAD_MULDIMENSION_PAYMENT  头-多维度付款
       * HEAD_PREPAYMENT_VERIFICATION  头-预付款核销信息
       * HEAD_PAYMENT  头-付款信息
       * LINE_PREPAYMENT_VERIFICATION  行-预付款核销
       * LINE_PAYMENT  行-付款信息
       */
      optPermissionMap: {
        HEAD_MULDIMENSION_PAYMENT: true,
        HEAD_PREPAYMENT_VERIFICATION: true,
        HEAD_PAYMENT: true,
        LINE_PREPAYMENT_VERIFICATION: true,
        LINE_PAYMENT: true,
      },
      prePaymentCheckLevel: {},
      prePaymentCheckPoint: {},
      basicCollapse: true,
      transactionCollapse: true,
      summaryCollapse: true,
      invoiceCollapse: true,
      invoicematchCollapse: true,
      prepaymentCollapse: true,
      paymentCollapse: true,
      lineCollapse: true,
      cuszLineCollapse: true,
      mainStrategyInfoCollapse: true,
      otherInfoCollapse: true,
      operationCollapse: true,
      attachmentCollapse: true,
    };
  },
  computed: {
    isInvoice() {
      return (this.parameters.documentType || this.$route?.query?.documentType) === "INVOICE";
    }
  },
  beforeMount() {
    const settleHeaderId = this.parameters.settleHeaderId || this.$route?.query?.settleHeaderId;
    this.settleHeaderDataSet.addQueryParameter("settleHeaderId", settleHeaderId);
    const afterQuery = this.settleHeaderDataSet.events.afterQuery;
    this.settleHeaderDataSet.events.afterQuery = (ds, data) => {
      this.optPermissionList = data && data[0] && data[0].optPermissionList || [];
      this.optPermissionList = this.optPermissionList.filter((e) => e.permissionType === "HIDE");
      const hidePermission = this.optPermissionList[0] || {};
      const operationType = hidePermission.operationType;
      if (operationType) {
        const operationTypes = operationType.split(",");
        Object.keys(this.optPermissionMap).forEach((key) => {
          if (operationTypes.includes(key)) {
            this.$set(this.optPermissionMap, key, false);
          }
        });
      }
      this.multiplePaymentInfoDataSet = new DataSet(multiplePaymentInfoDS({
        value: data[0].paymentDimension,
        meaning: data[0].paymentDimensionMeaning
      }));
      this.multiplePaymentInfoDataSet.addPathParameter("settleHeaderId", settleHeaderId);
      this.multiplePaymentInfoDataSet.addQueryParameter("settleHeaderId", settleHeaderId);
      afterQuery(ds, data);
    };
    this.settleHeaderDataSet.refresh();
    this.settleLineDataSet.addPathParameter("settleHeaderId", settleHeaderId);
    this.taxInvoiceDataSet.addPathParameter("settleHeaderId", settleHeaderId);
    this.fetchOperationRecord();
    SrmUtil.getValueSetBatch({
      prePaymentCheckLevel: "SSTA.PREPAYMENT_CHECK_LEVEL",
      prePaymentCheckPoint: "SSTA.PREPAYMENT_CHECK_PIONT"
    }, this);
  },
  methods: {
    beforeApprove() {
      return this.settleHeaderDataSet.updateRecords([ this.settleHeaderDataSet.current ]);
    },
    fetchOperationRecord() {
      const settleHeaderId = this.parameters.settleHeaderId || this.$route?.query?.settleHeaderId;
      getOperationRecord(settleHeaderId).then((res) => {
        this.operationRecord = res && res.content || [];
      });
    },
    showMultiPaymentInfo() {
      const columns = [
        { fieldCode: "documentNum", fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> },
        { fieldCode: "invoicedTaxIncludedAmount", },
        { fieldCode: "remainingPaymentAmount", },
        { fieldCode: "paymentAmount", },
        { fieldCode: "applyAmount", },
        {
          fieldCode: "bottom",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex justify="end">
            <SrmButton
              fill
              onClick={() => this.showPrePayWriteOffRecord({ purchaserFlag: true, documentNum: item.documentNum })}>
              {this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录")}
            </SrmButton>
          </SrmFlex>
        },
      ];
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <div style="height: 100%">
          <SrmList
            customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.MULTI_PAYMENT_INFO"
            dataSet={this.multiplePaymentInfoDataSet}
            columns={columns}
          />
        </div>
      });
    },
    showPaymentDetail() {
      const columns = [
        { fieldCode: "bankName", },
        { fieldCode: "bankBranchName", },
        { fieldCode: "bankAccountName", },
        { fieldCode: "paymentTypeName", },
        { fieldCode: "paymentTermName", },
        { fieldCode: "bankAccountNum", },
        { fieldCode: "expectPaymentDate", },
        { fieldCode: "paymentDiscountAmount", }
      ];
      this.$popup({
        title: this.$T("ssta.purchaseSettle.button.paymentInfo").$D("付款信息"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "70vh",
        rounded: true,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.PAYMENT_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleHeaderDataSet}
          columns={columns}
        />
      });
    },
    showPrePayWriteOffRecord(opts = {}) {
      const { settleLineId, purchaserFlag, documentNum } = opts;
      const settleHeaderId = this.parameters.settleHeaderId || this.$route?.query?.settleHeaderId;
      const columns = [
        { fieldCode: "prepaymentTitle", fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> },
        { fieldCode: "prepaymentRemainingAmount", },
        { fieldCode: "applyAmount", },
        { fieldCode: "prepaymentAmount", },
        { fieldCode: "prepaymentTypeMeaning", },
        { fieldCode: "associateNum", },
        { fieldCode: "prepaymentCreatedBy", },
        { fieldCode: "prepaymentCreationDate", },
      ];
      if (settleLineId) {
        this.settleApplyLineDataSet.addPathParameter("settleHeaderLineId", `${settleHeaderId}/${settleLineId}`);
      } else {
        this.settleApplyLineDataSet.addPathParameter("settleHeaderLineId", settleHeaderId);
      }
      if (purchaserFlag) {
        this.settleApplyLineDataSetPurchaser.addQueryParameter("settleHeaderId", settleHeaderId);
        this.settleApplyLineDataSetPurchaser.addQueryParameter("paymentDimension", this.multiplePaymentInfoDataSet.queryParameter.paymentDimension);
        this.settleApplyLineDataSetPurchaser.addQueryParameter("documentNum", documentNum);
      }
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmList
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.PRE_PAY_WRITE_OFF_RECORD"
          dataSet={purchaserFlag ? this.settleApplyLineDataSetPurchaser : this.settleApplyLineDataSet}
          columns={columns}
        />
      });
    },
    showSettleLineDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleLineDataSet}
          columns={this.getLineDetailColumns()}
        />
      });
    },
    showCuszLineDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode={this.isInvoice ? "SMBL.WORKFLOW.SETTLE_APPROVAL.INV_CUSZ_LINES" : "SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_CUSZ_LINES"}
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.cuszLineDataSet}
          columns={this.getCusTransactionDetailColumns()}
        />
      });
    },
    showTaxInvoice() {
      this.$popup({
        title: this.$T("ssta.purchaseSettle.view.title.taxInvoice").$D("税务发票"),
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmList
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.TAX_INVOICE"
          dataSet={this.taxInvoiceDataSet}
          columns={this.getTaxInvoiceColumns()}
          onItemClick={() => {
            this.$popup({
              showHeader: false,
              showClose: true,
              position: "right",
              showBack: false,
              content: <SrmForm
                customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.TAX_INVOICE_DETAIL"
                style={{ padding: "0 15px" }}
                customizeType="detail"
                dataSet={this.taxInvoiceDataSet}
                columns={this.getTaxInvoiceDetailColumns()}
              />
            });
          }}
        />
      });
    },
    showCusList(record) {
      const { attributeVarchar10, attributeVarchar11 } = record;
      const precision = this.settleHeaderDataSet?.current && this.settleHeaderDataSet.current.get("amountPrecision") || 2;
      this.cuszLineListDs = new DataSet(cuszLineListDS(attributeVarchar10, precision));
      this.$popup({
        title: this.$T("ssta.sbuxPayLineDetail.button.generalPayApplyDetail").$D("一般付款申请明细"),
        showHeader: false,
        // showClose: true,
        position: "right",
        showBack: false,
        content: <SrmList
          dataSet={this.cuszLineListDs}
          columns={this.getCusLineColumns(attributeVarchar11)}
          onItemClick={() => {
            this.showCusDetail(attributeVarchar11);
          }}
        />
      });
      this.cuszLineListDs.query();
    },
    showCusDetail(attributeVarchar11) {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm dataSet={this.cuszLineListDs} customizeType="detail" columns={this.getCusLineDetailColumns(attributeVarchar11)} />,
      });
    },
    getCusLineDetailColumns(attributeVarchar11) {
      return [
        {
          formRow: 10,
          fieldCode: "paymentApplyLineNo",
          fieldType: "EMPTY",
          render: () => {
            attributeVarchar11;
          }
        },
        { formRow: 20, fieldCode: "numAndLine", },
        { formRow: 30, fieldCode: "lineNum", },
        { formRow: 40, fieldCode: "itemCode", },
        { formRow: 50, fieldCode: "itemName", },
        { formRow: 60, fieldCode: "dataSource", },
        { formRow: 70, fieldCode: "uomName", },
        { formRow: 80, fieldCode: "quantity", },
        { formRow: 90, fieldCode: "costCode", },
        { formRow: 100, fieldCode: "costName", },
        { formRow: 110, fieldCode: "attributeVarchar8", },
        { formRow: 120, fieldCode: "attributeVarchar8Meaning", },
        { formRow: 130, fieldCode: "attributeVarchar15", },
        { formRow: 140, fieldCode: "taskCode", },
        { formRow: 150, fieldCode: "taxIncludedAmount", },
        { formRow: 160, fieldCode: "poAndNum", },
        { formRow: 170, fieldCode: "attributeVarchar18", },
        { formRow: 180, fieldCode: "pcNum", },
      ];
    },
    getCusLineColumns(paymentApplyLineNo) {
      return [
        {
          formRow: 10,
          fieldCode: "paymentApplyLineNo",
          fieldType: "EMPTY",
          render: () => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.sbuxPayLineDetail.model.sbuxPayLineDetail.paymentApplyLineNo").$D("付款申请单行号") + `：${paymentApplyLineNo}`}
          </SrmListHeader>
        },
        { formRow: 20, fieldCode: "numAndLine", },
        { formRow: 30, fieldCode: "lineNum", },
        { formRow: 40, fieldCode: "itemCode", },
        { formRow: 40, fieldCode: "itemName", },
        { formRow: 50, fieldCode: "dataSource", },
        { formRow: 60, fieldCode: "uomName", },
        { formRow: 60, fieldCode: "quantity", },
        { formRow: 70, fieldCode: "costCode", },
        { formRow: 80, fieldCode: "costName", },
        { formRow: 90, fieldCode: "taxIncludedAmount", },
      ];
    },
    getTaxInvoiceColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "invoiceCode",
          fieldType: "EMPTY",
          render: (val, item) => {
            const statusColorMap = {
              UNCHECK: "info",
              FAILED: "danger",
              SUCCESS: "primary"
            };
            return <SrmListHeader showOpenTag={true}>
              {this.$T("ssta.purchaseSettle.model.supplySettle.invoiceCode").$D("发票代码") + `：${val}`}
              <SrmButton style={{ fontWeight: "bold" }} type={statusColorMap[item.validateStatus] || "primary"} plain
                slot="right">
                {item.validateStatusMeaning}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        { formRow: 2, fieldCode: "invoiceNumber", },
        { formRow: 3, fieldCode: "taxAmount", },
        { formRow: 3, fieldCode: "invoicingDate", },
        { formRow: 4, fieldCode: "taxIncludedAmount", },
        { formRow: 4, fieldCode: "netAmount", },
        { formRow: 5, fieldCode: "invoiceSpeciesMeaning", },
        {
          formRow: 6,
          fieldCode: "deductFlag",
          render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
        },
        { formRow: 6, fieldCode: "checkCode", },
        {
          formRow: 7,
          fieldName: this.$T("ssta.purchaseSettle.view.title.operationHistory").$D("操作记录"),
          fieldCode: "taxInvoiceHeaderId",
          render: (val) => <SrmButton plain onClick={() => this.showTaxInvoiceOperationRecord(val)}>
            {this.$T("ssta.purchaseSettle.view.title.seeOperationHistory").$D("查看记录")}
          </SrmButton>
        },
        {
          formRow: 7,
          fieldCode: "ocrFileUrl",
          render: (val) => val &&
            <SrmButton plain onClick={() => this.previewFile(val)}>
              {this.$T("ssta.purchaseSettle.view.title.seeOcrFile").$D("查看文件")}
            </SrmButton>
        },
        { formRow: 8, fieldCode: "supplierCompanyName", },
        { formRow: 9, fieldCode: "companyName", },
      ];
    },
    getTaxInvoiceDetailColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "taxInvoiceHeaderId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <SrmButton fill onClick={() => this.showTaxInvoiceOperationRecord(val)}>
              {this.$T("ssta.purchaseSettle.view.title.operationHistory").$D("操作记录")}
            </SrmButton>
            {
              item.ocrFileUrl &&
                <SrmButton
                  style={{ marginLeft: "12px" }}
                  onClick={() => {
                    this.$previewImage([ SrmUtil.buildImgUrl(item.ocrFileUrl, "private-bucket") ]);
                  }}
                  bordered>{this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.ocrFile").$D("OCR文件")}</SrmButton>
            }
            {
              item.invoiceUrl &&
                <SrmButton
                  style={{ marginLeft: "12px" }}
                  onClick={() => {
                    this.$previewFile({ preUrl: SrmUtil.buildImgUrl(item.invoiceUrl, "private-bucket") });
                  }}
                  bordered>{this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceUrl").$D("电子发票地址")}</SrmButton>
            }
          </SrmFlex>
        },
        { formRow: 1, fieldCode: "invoiceCode", },
        { formRow: 2, fieldCode: "invoiceNumber", },
        { formRow: 3, fieldCode: "taxAmount", },
        { formRow: 3.5, fieldCode: "invoicingDate", },
        { formRow: 4, fieldCode: "taxIncludedAmount", },
        { formRow: 4, fieldCode: "netAmount", },
        { formRow: 5, fieldCode: "invoiceSpeciesMeaning", },
        {
          formRow: 6,
          fieldCode: "deductFlag",
          render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
        },
        { formRow: 6, fieldCode: "checkCode", },
        { formRow: 7, fieldCode: "supplierCompanyName", },
        { formRow: 8, fieldCode: "companyName", },
        { formRow: 9, fieldCode: "supUnifiedSocialCode", },
        { formRow: 10, fieldCode: "purUnifiedSocialCode", },
        { formRow: 11, fieldCode: "validateMessage", },
        { formRow: 12, fieldCode: "validateStatusMeaning", },
        { formRow: 13, fieldCode: "taxInvoiceStatusMeaning", },
        { formRow: 14, fieldCode: "invoiceUrl", },
      ];
    },
    //交易明细信息
    getLineDetailColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "settleId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            {
              this.optPermissionMap.LINE_PREPAYMENT_VERIFICATION &&
                <SrmButton
                  style={{ marginRight: "12px" }}
                  onClick={() => {
                    this.showPrePayWriteOffRecord({ settleLineId: item.settleLineId });
                  }}
                  fill>{this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录")}</SrmButton>
            }
            {
              <SrmButton
                onClick={() => {
                  this.$popup({
                    showHeader: false,
                    showClose: true,
                    position: "right",
                    showBack: false,
                    content: <SettleLineDetail
                      settleId={val} settleConfigNum={item.settleConfigNum}
                      showLinePayment={this.optPermissionMap.LINE_PAYMENT}/>
                  });
                }}
                bordered>{this.$T("smbl.common.view.seeDetail").$D("查看详情")}</SrmButton>
            }
          </SrmFlex>
        },
        { formRow: 1, fieldCode: "settleNum", },
        { formRow: 2, fieldCode: "sourceSettleNumAndLineNum", },
        { formRow: 3, fieldCode: "itemCode", },
        { formRow: 4, fieldCode: "itemName", },
        { formRow: 5, fieldCode: "quantity", visible: this.isInvoice },
        { formRow: 5, fieldCode: "unitPriceBatch", visible: this.isInvoice },
        { formRow: 7, fieldCode: "netPrice", visible: this.isInvoice },
        { formRow: 8, fieldCode: "netAmount", visible: this.isInvoice },
        { formRow: 8, fieldCode: "taxCode", visible: this.isInvoice },
        { formRow: 9, fieldCode: "taxRate", visible: this.isInvoice },
        { formRow: 9, fieldCode: "taxAmount", visible: this.isInvoice },
        { formRow: 10, fieldCode: "taxIncludedPrice", visible: this.isInvoice },
        { formRow: 12, fieldCode: "taxIncludedAmount", visible: this.isInvoice },
        { formRow: 13, fieldCode: "settleMatchDimensionMeaning", visible: this.isInvoice },
        { formRow: 14, fieldCode: "settleBasePriceMeaning", visible: this.isInvoice },
        { formRow: 15, fieldCode: "enableQuantity", visible: this.isInvoice },
        { formRow: 16, fieldCode: "orignPrice", visible: this.isInvoice },
        { formRow: 17, fieldCode: "enableAmount", visible: this.isInvoice },
        { formRow: 18, fieldCode: "invoicedAmount", },
        { formRow: 19, fieldCode: "paidAmount", },
        { formRow: 20, fieldCode: "remainingPaymentAmount", visible: this.isInvoice },
        { formRow: 21, fieldCode: "adjustNetAmount", visible: this.isInvoice },
        { formRow: 22, fieldCode: "adjustTaxAmount", visible: this.isInvoice },
        { formRow: 23, fieldCode: "sourceSettleHeaderNum", visible: !this.isInvoice },
        { formRow: 24, fieldCode: "paymentAmount", },
        { formRow: 25, fieldCode: "applyAmount", },
        { formRow: 26, fieldCode: "uom", visible: !this.isInvoice },
      ];
    },
    // 交易明细信息-付款单
    getTransactionDetailsInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 20, fieldCode: "sourceSettleNumAndLineNum", },
        { formRow: 30, fieldCode: "itemCode", },
        { formRow: 40, fieldCode: "itemName", },
        { formRow: 50, fieldCode: "sourceSettleHeaderNum", },
        { formRow: 60, fieldCode: "paymentAmount", },
        { formRow: 60, fieldCode: "applyAmount", },
        { formRow: 70, fieldCode: "invoicedAmount", },
        { formRow: 70, fieldCode: "paidAmount", },
        { formRow: 80, fieldCode: "uom", },
      ];
    },
    previewFile(fileUrl) {
      const fA = fileUrl.split(".");
      const fileExt = fA && fA[fA.length - 1];
      if (fileExt.toLowerCase() === "pdf") {
        previewPdf.call(this, fileUrl);
      } else {
        this.$previewImage([ SrmUtil.buildImgUrl(fileUrl, SrmUtil.getDefaultBucketName()) ]);
      }
    },
    showTaxInvoiceOperationRecord(val) {
      getTaxInvoiceOperationRecord(val).then((res) => {
        res && res.content && res.content.forEach((e) => {
          this.taxInvoiceOperationRecord.push(e);
        });
      });
      this.$popup({
        title: this.$T("ssta.purchaseSettle.view.title.operationHistory").$D("操作记录"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "70vh",
        rounded: true,
        content: <HistoryRecordTiled
          remarkLabel={this.$T("smbl.common.view.title.operationRemark").$D("操作说明")}
          operatorFieldName="processUser"
          actionData={this.taxInvoiceOperationRecord}/>,
      });
    },
    //基本信息
    getBasicColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {val}
            <SrmButton style={{ fontWeight: "bold" }} plain slot="right">{item.settleStatusMeaning}</SrmButton>
          </SrmListHeader>
        },
        { formRow: 3, fieldCode: "documentTypeMeaning", },
        { formRow: 3, fieldCode: "taxRate", visible: this.isInvoice },
        { formRow: 5, fieldCode: "paymentTermName", visible: this.isInvoice },
        { formRow: 6, fieldCode: "createdUserName", },
        { formRow: 6, fieldCode: "creationDate", },
        { formRow: 8, fieldCode: "campMeaning", },
        { formRow: 9, fieldCode: "paymentAmount", },
        { formRow: 10, fieldCode: "applyAmount", },
      ];
    },
    //交易方信息
    getTransactionColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "currencyCode",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "companyNum", },
        { formRow: 3, fieldCode: "companyName", },
        { formRow: 4, fieldCode: "supplierCompanyNum", },
        { formRow: 5, fieldCode: "supplierCompanyName", },
        { formRow: 6, fieldCode: "sourceSupplierCompanyName", },
        { formRow: 7, fieldCode: "ouName", },
      ];
    },
    //汇总信息
    getSummaryColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "settleNetAmount",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {
              this.$T("ssta.purchaseSettle.model.purchaseSettle.settleNetAmount").$D("结算不含税总金额") +
                `：${SrmUtil.getNumberLocalized(val, item.amountPrecision)}`
            }
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "settleTaxAmount", },
        { formRow: 2, fieldCode: "settleTaxIncludedAmount", },
        { formRow: 3, fieldCode: "invoicedNetAmount", },
        { formRow: 4, fieldCode: "invoicedTaxAmount", },
        { formRow: 4, fieldCode: "invoicedTaxIncludedAmount", },
        { formRow: 5, fieldCode: "paidAmount", },
        { formRow: 5, fieldCode: "remainingPaymentAmount", },
      ];
    },
    getPrePayColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "applyAmount",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.applyAmount").$D("预付款核销总金额") + `：${SrmUtil.getNumberLocalized(val, item.amountPrecision)}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "prepaymentSpliteRuleMeaning", },
      ];
    },
    getPaymentColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "paymentAmount",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.paymentAmount").$D("付款总金额") + `：${SrmUtil.getNumberLocalized(val, item.amountPrecision)}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "paymentSpliteRuleMeaning", },
      ];
    },
    //开票信息(系统)
    getSystemInvoiceColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "netAmount",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={true}>
            {
              this.$T("ssta.purchaseSettle.model.purchaseSettle.netAmount").$D("开票不含税总金额") +
                `：${SrmUtil.getNumberLocalized(val, item.amountPrecision)}`
            }
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "taxAmount", },
        { formRow: 3, fieldCode: "taxIncludedAmount", },
      ];
    },
    //发票匹配信息
    getInvoiceMatchColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "invoiceNetAmount",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.invoiceNetAmount").$D("发票不含税总金额") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "invoiceTaxAmount", },
        { formRow: 2, fieldCode: "invoiceTaxIncludedAmount", },
        { formRow: 3, fieldCode: "invoiceDifferenceAmount", },
        { formRow: 4, fieldCode: "invoiceSpliteRule", },
      ];
    },
    //交易明细信息
    getTransactionDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.settleTransactionNum").$D("结算事务编号") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 20, fieldCode: "sourceSettleNumAndLineNum", },
        { formRow: 30, fieldCode: "itemCode", },
        { formRow: 40, fieldCode: "itemName", },
        { formRow: 50, fieldCode: "quantity", },
        { formRow: 50, fieldCode: "unitPriceBatch", },
        { formRow: 70, fieldCode: "netPrice", },
        { formRow: 80, fieldCode: "netAmount", },
        { formRow: 80, fieldCode: "taxCode", visible: this.isInvoice },
        { formRow: 90, fieldCode: "taxRate", },
        { formRow: 90, fieldCode: "taxAmount", },
        { formRow: 100, fieldCode: "taxIncludedPrice", },
        { formRow: 110, fieldCode: "taxIncludedAmount", },
      ];
    },
    getCusTransactionDetailColumns() {
      const precision = this.settleHeaderDataSet?.current && this.settleHeaderDataSet.current.get("amountPrecision") || 2;
      const isOverseas = this.settleHeaderDataSet?.current && this.settleHeaderDataSet.current.get("attributeVarchar25") === "1";
      if (this.isInvoice) {
        return [
          { formRow: 10, fieldCode: "attributeVarchar6", visible: isOverseas, },
          { formRow: 20, fieldCode: "attributeDecimal5", visible: isOverseas, precision, },
          { formRow: 30, fieldCode: "attributeDecimal6", visible: isOverseas, precision, },
          { formRow: 40, fieldCode: "attributeDecimal7", visible: isOverseas, },
          { formRow: 50, fieldCode: "attributeDecimal8", visible: isOverseas },
          { formRow: 60, fieldCode: "attributeVarchar28", visible: !isOverseas },
          { formRow: 70, fieldCode: "attributeDecimal1", visible: !isOverseas, precision,
            fieldName: $T("ssta.common.model.common.invoiceAmount").$D("开票金额"),
          },
          { formRow: 80, fieldCode: "attributeDecimal2", visible: !isOverseas, precision,
            fieldName: $T("ssta.ec.bill.line.model.ec.netAmount").$D("不含税金额"),
          },
          { formRow: 90, fieldCode: "attributeDecimal3", visible: !isOverseas,
            fieldName: $T("ssta.ec.bill.line.model.ec.taxRate").$D("税率"),
          },
          { formRow: 100, fieldCode: "attributeDecimal4", visible: !isOverseas, precision,
            fieldName: $T("ssta.common.model.common.taxAamount").$D("税额"),
          },
          { formRow: 110, fieldCode: "attributeVarchar1", visible: !isOverseas,
            fieldName: $T("ssta.common.model.common.taxpayerNum").$D("纳税人编号"),
          },
          { formRow: 120, fieldCode: "attributeVarchar2", visible: !isOverseas,
            fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.address").$D("地址"),
          },
          { formRow: 130, fieldCode: "attributeVarchar3", visible: !isOverseas,
            fieldName: $T("hzero.common.SecretField.phone").$D("电话"),
          },
          { formRow: 140, fieldCode: "attributeVarchar4", visible: !isOverseas,
            fieldName: $T("ssta.common.model.common.bankOfDeposit").$D("开户行"),
          },
          { formRow: 150, fieldCode: "attributeVarchar5", visible: !isOverseas,
            fieldName: $T("ssta.common.model.common.bankOfNum").$D("账号"),
          },
        ];
      }
      return [
        { formRow: 10, fieldCode: "attributeVarchar11", },
        { formRow: 20, fieldCode: "attributeVarchar1",
          render: (_val, record) => <div style="color: var(--color-success);" onClick={ (e) => {
            e.stopPropagation();
            this.showCusList(record);
          }}>
            {_val}
          </div>,
        },
        { formRow: 30, fieldCode: "attributeDecimal1", precision, },
        { formRow: 40, fieldCode: "attributeDecimal2", precision, },
        { formRow: 50, fieldCode: "attributeDecimal4", precision },
        { formRow: 60, fieldCode: "attributeDecimal3", precision },
        { formRow: 70, fieldCode: "attributeVarchar3", },
      ];
    },
    //主策略信息
    getMainStrategyColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "settleConfigNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.mainSettleStrategyNum").$D("主结算策略编码") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "settleConfigName", },
        { formRow: 3, fieldCode: "configVersionNumber", },
        { formRow: 4, fieldCode: "confirmCollaborativeModeMeaning", },
        { formRow: 5, fieldCode: "cancelCollaborativeModeMeaning", },
        { formRow: 6, fieldCode: "confirmApproveMethodMeaning", },
        { formRow: 7, fieldCode: "cancelApproveMethodMeaning", },
        { formRow: 8, fieldCode: "invoiceMatchMeaning", },
        { formRow: 9, fieldCode: "invoiceToleranceRangeLower", visible: this.isInvoice },
        { formRow: 10, fieldCode: "taxAmountTolLower", visible: this.isInvoice },
        { formRow: 11, fieldCode: "taxAmountAdjustTolLower", visible: this.isInvoice },
        { formRow: 12, fieldCode: "amountAdjustTolLower", visible: this.isInvoice },
      ];
    },
    //主策略信息详情
    showMainStrategyDetail() {
      const columns = this.getMainStrategyColumns();
      columns[0].fieldType = "TEXT";
      columns[0].render = null;
      columns.push(
        { fieldCode: "amountValidateLevelMeaning", visible: this.isInvoice },
        {
          fieldCode: "amountValidateAction",
          visible: this.isInvoice,
          render: (val) => val &&
            <SrmTagGroup tags={val.split(",").map((e) => this.prePaymentCheckPoint[e])} type="info"/>
        },
        { fieldCode: "amountAdjustFlag", visible: this.isInvoice },
        { fieldCode: "amountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "taxAmountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "amountAdjustModeMeaning", visible: this.isInvoice },
        { fieldCode: "amountAdjustRuleMeaning", visible: this.isInvoice },
        { fieldCode: "defaultPaymentDimensionMeaning", },
        { fieldCode: "defaultPaymentSpliteRuleMeaning", },
        { fieldCode: "defaultPrepaymentSpliteRuleMeaning", },
        { fieldCode: "lineLimitQuantity", },
        { fieldCode: "prepaymentDimensionMeaning", },
        { fieldCode: "prepaymentCheckLevel", render: (val) => val && this.prePaymentCheckLevel[val] },
        {
          fieldCode: "prepaymentCheckPoint",
          render: (val) => val &&
            <SrmTagGroup tags={val.split(",").map((e) => this.prePaymentCheckPoint[e])} type="info"/>
        },
        { fieldCode: "initSettleConfigNum", },
        { fieldCode: "initConfigVersionNumber", },
      );
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.MAIN_STRATEGY_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleHeaderDataSet}
          columns={columns}
        />
      });
    },
    //其他信息
    getOtherColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "sourceSettleNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.sourceSettleNum").$D("结算事务来源编号") + `：${val}`}
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "purOrganizationName", },
        { formRow: 3, fieldCode: "termCode", },
        { formRow: 4, fieldCode: "remark", },
        { formRow: 5, fieldCode: "canceledReason", },
        { formRow: 6, fieldCode: "approvedRemark", },
        { formRow: 7, fieldCode: "accountingDate", },
      ];
    },
    //操作记录
    getOperationRecordColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "currencyCode",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader showOpenTag={true}>
            {this.$T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种") + `：${val}`}
          </SrmListHeader>
        },
      ];
    },
    //附件
    getAttachmentColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "attachmentUuid",
          fieldType: "EMPTY",
          render: (val) => <SrmFlex
            class="attachment" justify="between"
            nativeOnClick={() => this.$showFileList({ attachmentUuid: val })}>
            <SrmFlex>
              <span class="srm-icon icon-other"/>
              {this.$T("ssta.purchaseSettle.model.purchaseSettle.seeAttachment").$D("查看附件列表")}
            </SrmFlex>
            <span class="srm-icon icon-chevron-right"/>
          </SrmFlex>
        },
      ];
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";

.attachment {
  height 28px;
  font-size 14px;
  color: #333333;
  line-height: 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 16px;
  }

  .icon-chevron-right {
    font-size 16px;
  }
}

>>> .srm-form {
  padding: 16px 15px;
  min-height: 60px;
  margin: 0;
}

>>> .srm-list-item-card-head-left {
  max-width 100% !important;
}

>>> .srm-history-record-content {
  min-height: auto;
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
  .ssta-from-content {
    width: 100vw;
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
</style>
