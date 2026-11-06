<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet"
      customize-code="SMBL.CHECK_PAYABLE_INVOICE.LIST"
      :columns="getColumns"
      @itemClick="goToDetail"/>
  </div>
</template>

<script>
import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

import InfoIcon from "@/assets/icon-notification-red-bg.svg";

export default {
  modules: [
    "hipspfm.common",
    "sodr.common",
    "entity.customer",
    "entity.order",
    "sodr.confirmOrder",
    "smbl.common",
    "hipspfm.orderApproval",
    "hipspfm.orderConfirmation",
    "sfin.invoiceBill",
    "ssrc.supplyInfoChange",
    "ssrc.supplierQuotation",
    "sodr.sendOrder",
    "ssrc.common",
  ],
  name: "SupplierQuotationList",
  components: {},
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      outerRfxTitle: null, // action bar 消息卡片可能存在外部查询字段
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val, record) => {
            const { offLineFlag = 0, entryMethod, } = record || {};
            const offlineQuotation = offLineFlag === 1 || offLineFlag === "1" || entryMethod === "OFFLINE";
            const offlineSymbolVisible = offlineQuotation;
            let titleHeaderClass = "";
            if (offlineSymbolVisible) {
              titleHeaderClass = "ssrc-supplier-quotation-list-header";
            }
            return (
              <SrmListHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", }}>
                  <div class={titleHeaderClass}>{val}</div>
                  {offlineSymbolVisible ?
                    <srm-tooltip title={this.$T("ssrc.common.view.title.offlineQuotationWarningSuppliers").$D("已被采购方完成线下报价，如有疑问请联系采购员。")} placement="top">
                      <img src={InfoIcon} style={{ marginLeft: "4px", width: "16px", fontSize: "16px", transform: "translateY(1px)", }} alt="info" onClick={(e) => e.stopPropagation()} />
                    </srm-tooltip> :
                    ""}
                </div>
                <div slot="right">
                  <srm-tag size="small" bordered type="primary">
                    {record.quotationHeaderStatusMeaning}
                  </srm-tag>
                </div>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxTitle").$D(
            "询价单标题"
          ),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.companyName"
          ).$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.quotationStartDate"
          ).$D("开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.quotationEndDate"
          ).$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "prequalLineStatusMeaning",
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.pretrialApplication"
          ).$D("预审申请"),
          render: (val) =>
            <SrmListHeader>
              {val ===
                this.$T("sodr.sendOrder.model.common.submitted").$D(
                  "已提交"
                ) && <span class="orange">{val}</span>}
              {val ===
                this.$T("hipspfm.common.status.unSubmitted").$D("未提交") &&
                <span class="red">{val}</span>
              }
              {val === this.$T("hipspfm.common.status.passed").$D("已通过") &&
                <span class="green">{val}</span>
              }
              {!val &&
                <span class="gray">
                  {this.$T("hipspfm.common.currency.none").$D("无")}
                </span>
              }
            </SrmListHeader>
          ,
        },
      ];
    },
  },
  mounted() {
    this.initQueryParams();
  },
  activated() {
    if (this.outerRfxTitle) {
      this.dataSet.setQueryParameter({
        rfxTitle: this.outerRfxTitle,
      });
    }
    this.dataSet.refresh();
    this.outerRfxTitle = null;
  },
  methods: {
    initQueryParams() {
      const { rfxTitle } = this.$route?.query || {};
      this.outerRfxTitle = rfxTitle ? decodeURIComponent(rfxTitle) : null;
    },
    goToDetail(item) {
      const { data } = item;
      const {
        rfxHeaderId,
        quotationHeaderId,
        rfxNum,
        rfxTitle,
        operationMeaning,
        rfxStatus,
        supplierCompanyId,
        prequalLineStatus,
        prequalLineStatusMeaning,
        quotationHeaderStatus,
        roundFlag,
        offLineFlag = 0,
        entryMethod,
      } = data || {};
      const offlineQuotation = offLineFlag === 1 || offLineFlag === "1" || entryMethod === "OFFLINE";
      const onlyViewDetail = ![
        "BIDDING",
        "QUOTATION",
        "ROUND_QUOTATION",
        "BARGAIN_QUOTATION",
      ].includes(operationMeaning) || offlineQuotation;

      const onlyViewQueryDetail = [
        "OPEN_BID_PENDING",
        "OPENED",
        "SCORING",
        "PRE_EVALUATION_APPROVING",
        "PRE_EVALUATION_PENDING_REJECT",
        "PRETRIAL_PENDING",
        "CHECK_PENDING",
        "CHECK_APPROVING",
        "CHECK_REJECTED",
        "FINISHED"
      ].includes(quotationHeaderStatus) && quotationHeaderId;

      if (onlyViewQueryDetail) {
        this.$router.push({
          name: "SupplierQueryQuotationDetail",
          query: {
            rfxHeaderId,
            quotationHeaderId,
            rfxNum,
            rfxTitle,
            operationMeaning,
            rfxStatus,
            supplierCompanyId,
            prequalLineStatus,
            prequalLineStatusMeaning,
            quotationHeaderStatus,
          },
        });
      } else if (onlyViewDetail) {
        this.$router.push({
          name: "PrequalificationDetail",
          query: {
            rfxHeaderId,
            quotationHeaderId,
            rfxNum,
            rfxTitle,
            operationMeaning,
            rfxStatus,
            supplierCompanyId,
            prequalLineStatus,
            prequalLineStatusMeaning,
            quotationHeaderStatus,
          },
        });
      } else {
        this.$router.push({
          name: "SupplierBiddingDetail",
          query: {
            rfxHeaderId,
            quotationHeaderId,
            rfxNum,
            rfxTitle,
            operationMeaning,
            rfxStatus,
            prequalLineStatus,
            prequalLineStatusMeaning,
            roundFlag,
          },
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.red {
  color: var(--color-other-default);
}

.green {
  color: var(--color-other-default-b) !important;
}

.orange {
  color: var(--color-other-default-c) !important;
}

.gray {
  color: var(--color-font-default-e) !important;
}

.ssrc-supplier-quotation-list-header {
  max-width: 80%;
  min-width: 140px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
