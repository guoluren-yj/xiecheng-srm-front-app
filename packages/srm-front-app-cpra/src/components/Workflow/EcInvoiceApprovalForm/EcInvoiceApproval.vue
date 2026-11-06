<template>
  <srm-scroll-tab class="main-tab">
    <srm-scroll-tab-item :label="$T('sfin.payableInvoice.view.message.title.detail.payableInvoice').$D('应付发票头信息')">
      <srm-form show-default-detail :data-set="headerDs" :columns="getHeaderFields"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('sfin.payableInvoice.view.message.title.centralizedBillForm').$D('开票信息')">
      <srm-form show-default-detail :data-set="headerDs" :columns="getInvoiceInfoFields"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('sfin.payableInvoice.view.message.title.invoice.tab.row').$D('发票行')">
      <srm-list :data-set="lineDs" :columns="getLineColumns" @itemClick="clickItem('lineDs', $T('sfin.payableInvoice.view.message.title.invoice.tab.row').$D('发票行'))"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('sfin.payableInvoice.view.taxInvoiceRow').$D('税务发票行')">
      <srm-list :data-set="taxLineDs" :columns="getTaxLineColumns" @itemClick="clickItem('taxLineDs', $T('sfin.payableInvoice.view.taxInvoiceRow').$D('税务发票行'))"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('hzero.common.view.button.operationRecord').$D('操作记录')">
      <history-record-tiled
        :action-data="historyData"
        operation-meaning-field-name="processStatusMeaning"
        process-remark-field-name="processRemark"
        operator-field-name="processUser"
        process-date-field-name="processDate"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import headerDS from "./datasource/headerDS";
import lineDS from "./datasource/lineDS";
import taxLineDS from "./datasource/taxLineDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ListItemDetail from "./components/ListItemDetail";
import { getHistoryDataApi } from "./api";
export default {
  modules: [ "entity.item", "sfin.payableInvoice", "sfin.invoiceBill", "hzero.common", "sfin.inputInvoice" ],
  name: "EcInvoiceApproval",
  components: { HistoryRecordTiled },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      headerDs: null,
      lineDs: null,
      taxLineDs: null,
      historyData: [],
    };
  },
  computed: {
    getHeaderFields() {
      return [ {
        fieldCode: "invoiceNum",
      }, {
        fieldCode: "supplierCompanyName",
      }, {
        fieldCode: "companyName",
      }, {
        fieldCode: "purchaseAgentName",
      }, {
        fieldCode: "drawerSupplierName",
      }, {
        fieldCode: "taxIncludedAmountSystem",
      }, {
        fieldCode: "taxIncludedAmount",
      }, {
        fieldCode: "currencyCode",
      }, {
        fieldCode: "taxAmountSystem",
      }, {
        fieldCode: "taxAmount",
      }, {
        fieldCode: "freight",
      }, {
        fieldCode: "taxTypeMeaning",
      }, {
        fieldCode: "expectInvoiceDate",
      }, {
        fieldCode: "remark",
      } ];
    },
    getInvoiceInfoFields() {
      return [ {
        fieldCode: "taxRegistrationAddress",
      }, {
        fieldCode: "taxRegistrationNumber",
      }, {
        fieldCode: "depositBank",
      }, {
        fieldCode: "bankAccountNum",
      }, {
        fieldCode: "companyName",
      }, {
        fieldCode: "taxRegistrationPhone",
      }, {
        fieldCode: "contactName",
      }, {
        fieldCode: "mobile",
      }, {
        fieldCode: "regionName",
      }, {
        fieldCode: "address",
      } ];
    },
    getLineColumns() {
      return [ {
        fieldCode: "itemCode",
      }, {
        fieldCode: "itemName",
      }, {
        fieldCode: "netPriceMeaning",
      }, {
        fieldCode: "netAmountMeaning",
      }, {
        fieldCode: "taxRate",
      }, {
        fieldCode: "taxIncludedPriceMeaning",
      }, {
        fieldCode: "taxAmountMeaning",
      } ];
    },
    getTaxLineColumns() {
      return [ {
        fieldCode: "invoiceNumber",
      }, {
        fieldCode: "totalAmount",
      }, {
        fieldCode: "taxAmount",
      }, {
        fieldCode: "taxIncludedAmount",
      }, {
        fieldCode: "noDepositInvoiceTypeMeaning",
      } ];
    }
  },
  created() {
    this.initDS();
  },
  methods: {
    async initDS() {
      const { invoiceHeaderId } = this.parameters || {};
      if (invoiceHeaderId) {
        this.headerDs = new DataSet(headerDS(invoiceHeaderId));
        this.lineDs = new DataSet(lineDS(invoiceHeaderId));
        this.taxLineDs = new DataSet(taxLineDS(invoiceHeaderId));
        const res = await getHistoryDataApi(invoiceHeaderId);
        if (res?.content) {
          this.historyData = res.content;
        }
      }
    },
    clickItem(ds, title) {
      this.$popup({
        showBack: true,
        showHeader: true,
        title,
        content: <ListItemDetail dataSet={this[ds]} />,
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
.detail-popup-content {
  .detail-popup-top {
    min-height: 0;
    border-bottom: 8px solid var(--background-color-empty-second);
    /deep/ .customize {
       font-weight: 600 !important;
    }
  }
}
</style>