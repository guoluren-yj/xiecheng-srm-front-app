import { SrmButton, SrmFlex, } from "srm-mobile-ui";
import { isEmpty, } from "lodash";
// import uuid from "uuid";

import InfoIcon from "@/assets/icon-notification-red-bg.svg";

import { commonRfxStatusColor } from "../components/commonRfxStatusColor";

export default {
  data() {
    return {};
  },
  computed: {
  },
  methods: {
    showStatusMeaning(item, onlyRenderTextFlag = false) {
      const {
        displayQuotationStatusMeaning,
        displayQuotationStatus,
        currentQuotationRound,
      } = item || {};

      let currentStatusMeaning = displayQuotationStatusMeaning;

      const roundQuotationFlag = currentQuotationRound > 1 && [ "NOT_START", "NOT_QUOTED", "QUOTED", ].includes(displayQuotationStatus);
      if (roundQuotationFlag) {
        currentStatusMeaning = this.$T("ssrc.common.theNumberRoundOfQuotationOrBidding", [ currentQuotationRound, displayQuotationStatusMeaning ]).$D("第{round}轮{type}");
      }

      if (onlyRenderTextFlag) {
        return currentStatusMeaning;
      }

      return commonRfxStatusColor(displayQuotationStatus, currentStatusMeaning);
    },
    //基本信息
    getRfxColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            const { currentTab } = this || {};
            const { rfxTitle, offLineFlag = 0, entryMethod, } = item || {};
            const offlineQuotation = offLineFlag === 1 || offLineFlag === "1" || entryMethod === "OFFLINE";
            const showOfflineQuotationTab = currentTab === 1; // 进行中tab
            const offlineSymbolVisible = offlineQuotation && showOfflineQuotationTab;
            let titleHeaderClass = "ssrc-rfx-supplier-apply-list-title";
            if (offlineSymbolVisible) {
              titleHeaderClass = "ssrc-rfx-supplier-apply-list-title ssrc-rfx-supplier-apply-list-header";
            }
            return (
              <SrmListHeader>
                <div style={{ display: "flex", alignItems: "center", width: "100%", }}>
                  <div class={titleHeaderClass}>{rfxTitle}</div>
                  {offlineSymbolVisible ?
                    <srm-tooltip title={this.$T("ssrc.common.view.title.offlineQuotationWarningSuppliers").$D("已被采购方完成线下报价，如有疑问请联系采购员。")} placement="top">
                      <img src={InfoIcon} style={{ marginLeft: "4px", width: "16px", fontSize: "16px", transform: "translateY(1px)", }} alt="info" onClick={(e) => e.stopPropagation()} />
                    </srm-tooltip> :
                    ""}
                </div>
                <span slot="right" class="ssrc-apply-list-columns-status-wrap ssrc-apply-list-columns-status" onClick={(e) => e.stopPropagation()}>
                  {/* {this.showStatusMeaning(item)} */}
                  <srm-tooltip title={this.showStatusMeaning(item, 1)} placement="top">
                    {this.showStatusMeaning(item)}
                  </srm-tooltip>
                </span>
              </SrmListHeader>
            );
          },
        },
        {
          formRow: 100,
          fieldName: this.documentType === "BID" ? this.$T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : this.$T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          fieldCode: "rfxNum",
          fieldType: "TEXT",
        },
        {
          formRow: 200,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.companyName").$D("客户"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          formRow: 300,
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          formRow: 400,
          fieldName: this.documentType === "BID" ? this.$T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "latestQuotationEndDate",
        },
        // {
        //   fieldName: this.$T("ssrc.queryRfq.model.queryRfq.creater").$D("创建人"),
        //   fieldCode: "createByName",
        // },
        {
          formRow: 1000,
          fieldCode: "customBottom",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              mainOperations,
            } = item || {};
            const buttons = [];
            if (!isEmpty(mainOperations)) {
              mainOperations.forEach((operationItem) => {
                const { operation, operationMeaning = "", } = operationItem || {};
                if (operation === "PARTICIPATE") {
                  buttons.push(
                    <SrmButton fill rect onClick={ () => this.onBeforeParticipate(item) } style="margin-left: 4px;">
                      { operationMeaning }
                    </SrmButton>
                  );
                }
                if (operation === "QUOTATION" || operation === "ESTIMATED") {
                  buttons.push(
                    <SrmButton fill rect onClick={ () => this.onQuotationDirect(item, "QUOTATION") } style="margin-left: 4px;">
                      { operationMeaning }
                    </SrmButton>
                  );
                }
                if (operation === "QUOTATION_VIEW") {
                  buttons.push(
                    <SrmButton style="margin-left: 4px;" fill rect onClick={ () => this.onQuotationQueryDirect(item) }>
                      { operationMeaning }
                    </SrmButton>
                  );
                }
                if (operation === "BIDDING_HALL" || operation === "BIDDING_PROCESS_VIEW") {
                  const disabledBiddingHall = this.disabledToBiddingHall(item);
                  if (disabledBiddingHall) {
                    return;
                  }
                  buttons.push(
                    <SrmButton disabled={false} style="margin-left: 4px;" fill rect onClick={ () => this.biddingHallOperation(item) }>
                      { operationMeaning }
                      {disabledBiddingHall ?
                        <srm-tooltip title={this.$T("ssrc.common.view.title.offlineQuotationWarningSuppliers").$D("已被采购方完成线下报价，如有疑问请联系采购员。")} placement="top">
                          <img src={InfoIcon} style={{ marginLeft: "4px", width: "16px", fontSize: "16px", transform: "translateY(1px)", }} alt="info" onClick={(e) => e.stopPropagation()} />
                        </srm-tooltip> :
                        ""}
                    </SrmButton>
                  );
                }
              });
            }
            if (isEmpty(buttons)) {
              return "";
            }
            return (
              <SrmFlex justify="end" align="end" style="height: 45px; border-top: 1px solid #F6F6F6; margin-top: 8px;" >
                {buttons}
                {/* {participateFlag ? <SrmButton fill rect onClick={ () => this.onBeforeParticipate(item) }>
                  { operationMeaning }
                </SrmButton> : ""}
                {quotationFlag ? <SrmButton fill rect onClick={ () => this.onQuotationDirect(item, "QUOTATION") }>
                  { buttonMeaning }
                </SrmButton> : ""}
                {quotationQueryFlag ? <SrmButton style="margin-left: 4px;" fill rect onClick={ () => this.onQuotationQueryDirect(item) }>
                  { quotationQueryMeaning }
                </SrmButton> : ""} */}
              </SrmFlex>
            );
          }
        }
      ];
    },
  }
};
