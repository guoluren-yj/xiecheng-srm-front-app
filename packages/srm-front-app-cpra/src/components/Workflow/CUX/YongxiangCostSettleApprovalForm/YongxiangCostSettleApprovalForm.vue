<!--
 * @Description: 永祥-费用结算审批工作流
 * @Date: 2022-04-26 14:34:18
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
-->
<template>
  <srm-scroll-tab class="main-tab">
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.invoiceHeaderInfo').$D('发票头信息')">
      <srm-form show-default-detail :data-set="headerDs" :columns="getHeaderColumns"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.onlineInvoice').$D('网上发票')">
      <srm-list :data-set="onlineInvoiceDs" :columns="getOnlineInvoiceColumns" @itemClick="clickItem('onlineInvoice')"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.invoiceDetail').$D('发票明细')">
      <srm-list :data-set="invoiceDetailDs" :columns="getInvoiceDetailColumns" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.accountDetail').$D('核算明细')">
      <srm-list :data-set="accountDetailDs" :columns="getAccountDetailColumns" @itemClick="clickItem('accountDetail')"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="projectQuantityDs" :label="$T('scux.settlement.view.title.projectQuantitySheet').$D('工程计量单')">
      <srm-list :data-set="projectQuantityDs" :columns="getProjectQuantityColumns" @itemClick="clickItem('projectQuantity')" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="projectQuantityDs" :label="$T('scux.settlement.view.title.deductionDetail').$D('扣款明细')">
      <srm-list :data-set="deductionDetailDs" :columns="getDeductionDetailColumns" @itemClick="clickItem('deductionDetail')" />
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
        operation-meaning-field-name="statusName"
        process-remark-field-name="remake"
        operator-field-name="operator"
        process-date-field-name="operatorDate"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import SrmAttachmentTabs from "srm-mobile-ui/packages/srm-attachment-button/srm-attachment-tabs";
import headerDS from "./datasource/headerDS";
import onlineInvoiceDS from "./datasource/onlineInvoiceDS";
import invoiceDetailDS from "./datasource/invoiceDetailDS";
import accountDetailDS from "./datasource/accountDetailDS";
import projectQuantityDS from "./datasource/projectQuantityDS";
import deductionDetailDS from "./datasource/deductionDetailDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import ListItemDetail from "./components/ListItemDetail";
import { getHistoryDataApi } from "./api";
export default {
  modules: [ "scux.settlement", "scux.contractorAssessKpi", "scux.commercialTermsPre", "hzero.common", "smbl.common" ],
  name: "YongxiangCostSettleApprovalForm",
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
      onlineInvoiceDs: null,
      invoiceDetailDs: null,
      accountDetailDs: null,
      projectQuantityDs: null,
      deductionDetailDs: null,
      historyData: [],
    };
  },
  computed: {
    getHeaderColumns() {
      return this.headerDs.fields;
    },
    getOnlineInvoiceColumns() {
      const fieldCodeList = [ "itemName", "thisQuantity", "taxincludedUnitPrice", "thisInvoiceLinePrice" ];
      return this.formatColumns(fieldCodeList);
    },
    getInvoiceDetailColumns() {
      const fieldCodeList = this.invoiceDetailDs.fields.map(({ fieldCode }) => fieldCode);
      return this.formatColumns(fieldCodeList);
    },
    getAccountDetailColumns() {
      const fieldCodeList = [ "smallBusinessName", "departmentName", "taxAmountSum" ];
      return this.formatColumns(fieldCodeList);
    },
    getProjectQuantityColumns() {
      const fieldCodeList = [ "receiptNum", "examineMoney", "thisOccupyMoney", "pmsDate" ];
      return this.formatColumns(fieldCodeList);
    },
    getDeductionDetailColumns() {
      const fieldCodeList = [ "itemName", "formNum", "fieldTypeDesc", "taxIncludedLineAmount", "occurDate" ];
      return this.formatColumns(fieldCodeList);
    },
  },
  created() {
    this.initDataSet();
    this.initHistory();
  },
  methods: {
    async initDataSet() {
      const { headId, attributeVarchar12, } = this.parameters || {};
      this.headerDs = new DataSet(headerDS(headId));
      this.onlineInvoiceDs = new DataSet(onlineInvoiceDS(headId));
      this.invoiceDetailDs = new DataSet(invoiceDetailDS(headId));
      this.accountDetailDs = new DataSet(accountDetailDS(headId));
      if (attributeVarchar12 === "1") {
        // 工程合同才需要展示
        this.projectQuantityDs = new DataSet(projectQuantityDS(headId));
        this.deductionDetailDs = new DataSet(deductionDetailDS(headId));
      }
    },
    async initHistory() {
      const { headId = "99" } = this.parameters || {};
      const res = await getHistoryDataApi({ headId });
      if (res?.content) {
        this.historyData = res.content;
      }
    },
    formatColumns(fieldCodeList) {
      return fieldCodeList.map((fieldCode, index) => index ?
        { fieldCode } :
        { fieldCode, fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> }
      );
    },
    clickItem(dsName) {
      const detailTitleMap = {
        onlineInvoice: this.$T("scux.settlement.view.title.onlineInvoiceInfo").$D("网上发票信息"),
        accountDetail: this.$T("scux.settlement.view.title.accountDetailInfo").$D("核算明细信息"),
        projectQuantity: this.$T("scux.settlement.view.title.projectQuantitySheetInfo").$D("工程计量单信息"),
        deductionDetail: this.$T("scux.settlement.view.title.deductionInfo").$D("扣款信息"),
      };
      const partPorps = dsName === "accountDetail" ? { props: { takeLength: 1 } } : { };
      this.$popup({
        showBack: true,
        showHeader: true,
        title: detailTitleMap[dsName],
        content: <ListItemDetail dataSet={this[`${dsName}Ds`]} {...partPorps} />,
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
                attachmentUuid: this.headerDs.current.get("uuid"),
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