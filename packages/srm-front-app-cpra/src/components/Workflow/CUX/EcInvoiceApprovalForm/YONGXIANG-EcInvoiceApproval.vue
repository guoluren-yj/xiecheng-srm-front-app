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
    <srm-scroll-tab-item :label="$T('sfin.payableInvoice.view.message.title.invoice.tab.accounting').$D('核算明细')">
      <srm-list :data-set="accountLineDs" :columns="getAccountLineColumns" @itemClick="clickItem('accountLineDs', $T('sfin.payableInvoice.view.message.title.invoice.tab.accounting').$D('核算明细'))"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('hzero.common.view.title.attachment').$D('附件')">
      <div class="attachment-section" @click="showAttachmentList">
        <span class="srm-icon icon-other" />
        <span class="attachment-section-text">
          {{ $T("smbl.common.view.button.checkAttachmentList").$D("查看附件列表") }}
        </span>
        <span class="srm-icon icon-chevron-right" />
      </div>
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
import SrmAttachmentTabs from "srm-mobile-ui/packages/srm-attachment-button/srm-attachment-tabs";
import headerDS from "./datasource/headerDS";
import lineDS from "./datasource/lineDS";
import taxLineDS from "./datasource/taxLineDS";
import accountLineDS from "./datasource/accountLineDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ListItemDetail from "./components/ListItemDetail";
import { getHistoryDataApi } from "./api";
export default {
  modules: [ "entity.item", "sfin.payableInvoice", "sfin.invoiceBill", "hzero.common", "sfin.inputInvoice", "scux.contractorAssessKpi", "smbl.common", "scux.commercialTermsPre", "ssta.purchaseSettle" ],
  name: "YONGXIANGEcInvoiceApproval",
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
      accountLineDs: null,
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
    },
    getAccountLineColumns() {
      return [ {
        fieldCode: "smallBusinessName"
      }, {
        fieldCode: "companyName"
      }, {
        fieldCode: "departmentName"
      }, {
        fieldCode: "projectName"
      }, {
        fieldCode: "amount"
      }, {
        fieldCode: "taxRate"
      }, {
        fieldCode: "taxAmount"
      }, {
        fieldCode: "taxAmountSum"
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
        this.accountLineDs = new DataSet(accountLineDS(invoiceHeaderId));
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
    },
    showAttachmentList() {
      this.$popup({
        showBack: true,
        showHeader: true,
        title: this.$T("scux.commercialTermsPre.view.button.upload").$D("查看附件"),
        content:
          <SrmAttachmentTabs
            attachments={[
              {
                readonly: true,
                uploadButton: "none",
                attachmentUuid: this.headerDs.current && this.headerDs.current.get("attachmentUuid"),
              }
            ]}
          />
        ,
      });
    },
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
.attachment-section {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  .icon-other {
    font-size: 28px;
    color: var(--color-other-default-c);
  }
  .attachment-section-text {
    flex-grow: 1;
  }
  .icon-chevron-right {
    font-size: 16px;
  }
}
</style>