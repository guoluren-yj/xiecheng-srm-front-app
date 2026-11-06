<template>
  <div style="height: 100vh">
    <srm-scroll :scrollable="false" @reachBottom="reachBottom">
      <srm-list
        :data-set="getDataSet"
        :customize-code="getCurrentUnitCode()"
        :columns="getColumns"
        @itemClick="goToDetail" >
        <srm-flex slot="filter" direction="column" align="start">
          <srm-tab-bar
            :tabs="[
              $T('ssrc.inquiryHall.model.inquiryHall.noParticipation').$D('未参与'),
              $T('ssrc.inquiryHall.button.onGoing').$D('进行中'),
              $T('hzero.common.component.excelExport.hd.m.hd.state.done').$D('已结束'),
              $T('ssrc.inquiryHall.button.all').$D('全部')
            ]"
            display="justify"
            :active-index="Number(currentTab)"
            @indexChange="onTabIndexChange"/>
          <div v-if="currentTab === 0 || currentTab === 1 || currentTab === 2" class="hall-list-second-tab">
            <srm-button :class="['first-button',{'no-active':chooseSecondTabIndex !== 0}]" size="small" type="primary"
                        @click="onSecondTabIndexChange(0)">
              <span v-if="currentTab === 0">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.inviteMe').$D('邀请我的') }}
              </span>
              <span v-if="currentTab === 1">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.needDeal').$D('需要处理') }}
              </span>
              <span v-if="currentTab === 2">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.wonBid').$D('已中标') }}
              </span>
            </srm-button>

            <srm-button :class="[{'no-active':chooseSecondTabIndex !== 1}]" size="small" type="primary" @click="onSecondTabIndexChange(1)">
              <span v-if="currentTab === 0">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.commonOpenInquiry', [bidFlag ?
                  $T("ssrc.common.bid").$D("招标") : $T("ssrc.common.inquiryPrice").$D("询价")]).$D('公开{sourceCategoryName}') }}
              </span>
              <span v-if="currentTab === 1">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.needAttention').$D('需要关注') }}
              </span>
              <span v-if="currentTab === 2">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.notWonBid').$D('未中标') }}
              </span>
            </srm-button>

            <srm-button :class="[{'no-active':chooseSecondTabIndex !== 2}]" size="small" type="primary"
                        @click="onSecondTabIndexChange(2)">
              <span v-if="currentTab === 2">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.others').$D('其它') }}
              </span>
            </srm-button>
          </div>
          <srm-blank size="1px" theme="fill"/>
        </srm-flex>
      </srm-list>
    </srm-scroll>
  </div>
</template>

<script>
import { allDS } from "../datasource/allDS";
import { inviteDS, openBiddingDS, } from "../datasource/unParticipationDS";
import { processingDS, attentionDS, } from "../datasource/onGoingDS";
import { bidded, unBidding, finOthersDS, } from "../datasource/finishedDS";
import { DataSet } from "srm-mobile-ui";

import IndexColumns from "../mixins/IndexColumns";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "ssrc.supplierQuotation", "hzero.common" ],
  name: "HallList",
  components: {},
  mixins: [ IndexColumns ],
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {

    return {
      currentTab: 0,
      chooseSecondTabIndex: 0,
      implementationType:"",
      implementationValue:"",
      fieldSource:"",
      allDataSet: new DataSet(allDS(this.documentType)), // 全部
      inviteDateSet: new DataSet(inviteDS(this.documentType)), // 未参与-邀请我的
      openBiddingDateSet: new DataSet(openBiddingDS(this.documentType)), // // 未参与-公开招标
      processingDataSet: new DataSet(processingDS(this.documentType)), // 进行中- 需要处理
      attentionDataSet: new DataSet(attentionDS(this.documentType)), // 进行中 - 需要关注
      finSuccessDataSet: new DataSet(bidded(this.documentType)), // 完成- 招标成功
      finFailedDataSet: new DataSet(unBidding(this.documentType)), // 完成-未中标
      finOthersDataSet: new DataSet(finOthersDS(this.documentType)), // 完成-其它
      bidFlag: this.documentType === "BID",
    };
  },
  computed:{
    getDataSet() {
      if (this.currentTab === 0) {
        // console.log("切换一级tab0", this.currentTab);
        if (this.chooseSecondTabIndex === 0) {
          return this.inviteDateSet;
        }
        if (this.chooseSecondTabIndex === 1) {
          return this.openBiddingDateSet;
        }
      } else if (this.currentTab === 1) {
        if (this.chooseSecondTabIndex === 0) {
          return this.processingDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
          return this.attentionDataSet;
        }
      } else if (this.currentTab === 2) {
        if (this.chooseSecondTabIndex === 0) {
          return this.finSuccessDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
          return this.finFailedDataSet;
        } else if (this.chooseSecondTabIndex === 2) {
          return this.finOthersDataSet;
        }
      } else if (this.currentTab === 3) {
        // console.log("切换一级tab3", this.currentTab);
        return this.allDataSet;
      }
      return null;
    },
    //获取列表字段
    getColumns() {
      if (this.documentType === "RFX") {
        return this.getRfxColumns();
      } else if (this.documentType === "BID") {
        return this.getBidColumns();
      }
      return null;
    },
  },
  activated() {
    this.getDataSet.refresh();
  },
  methods: {
    reachBottom() {
      if (!this.getDataSet) {
        return;
      }
      this.getDataSet.loadMore();
      this.$loading.hide();
    },
    // 执行情况
    toImplementation(item) {
      switch (item.rfxStatus) {
      /**
       * 未开始：NOT_START
       */
      case "NOT_START":
        // this.implementationType = "FORM";
        // this.fieldSource = "prequalLines";
        // this.implementationValue = item.prequalLines;
        this.implementationType = "FORM";
        this.fieldSource = "headerQuotationDetailsNotStart";
        this.implementationValue = item.headerQuotationDetails;
        break;
      /**
       * 审批中:
       * 发布审批中：RELEASE_APPROVING
       * 核价审批中/定标审批中：CHECK_APPROVING
       * 候选人审批中：PRE_EVALUATION_APPROVING
       */
      case "RELEASE_APPROVING":
      case "CHECK_APPROVING":
      case "PRE_EVALUATION_APPROVING":
        this.implementationType = "PROCESS";
        this.fieldSource = "headerWorkFlows";
        this.implementationValue = item.headerWorkFlows;
        break;
      /**
       * 拒绝:
       * 发布审批拒绝：RELEASE_REJECTED
       * 核价审批拒绝/定标审批拒绝：CHECK_REJECTED
       * 候选人审批拒绝：PRE_EVALUATION_PENDING_REJECT
       */
      case "RELEASE_REJECTED":
      case "CHECK_REJECTED":
      case "PRE_EVALUATION_PENDING_REJECT":
        this.implementationType = "TEXT";
        this.fieldSource = "approvalMessage";
        this.implementationValue = item.approvalMessage;
        break;
      /**
       * 资格预审中：IN_PREQUAL
       * 待预审审批：PENDING_PREQUAL
       */
      case "IN_PREQUAL":
      case "PENDING_PREQUAL":
        this.implementationType = "FORM";
        this.fieldSource = "prequalLines";
        this.implementationValue = item.prequalLines;
        break;
      /**
       * 报价中/投标中：IN_QUOTATION
       * 报价响应不足/投标响应不足：LACK_QUOTED
       * 待开标：OPEN_BID_PENDING
       * 已开标：OPENED
       * 多轮报价：ROUND_QUOTATION
       * 待初审：PRETRIAL_PENDING
       * 核价中：CHECKING
       * 待核价/待定标：CHECK_PENDING
       */
      case "IN_QUOTATION":
      case "LACK_QUOTED":
      case "OPEN_BID_PENDING":
      case "OPENED":
      case "ROUND_QUOTATION":
      case "PRETRIAL_PENDING":
      case "CHECKING":
      case "CHECK_PENDING":
        this.implementationType = "FORM";
        this.fieldSource = "headerQuotationDetails";
        this.implementationValue = item.headerQuotationDetails;
        break;
      /**
       * 评分中：SCORING
       */
      case "SCORING":
        if (item.progresses !== null) {
          this.implementationType = "PROCESS";
          this.fieldSource = "progresses";
          this.implementationValue = item.progresses;
        } else {
          this.implementationType = "FORM";
          this.fieldSource = "evaluateExperts";
          this.implementationValue = item.evaluateExperts;
        }
        break;
      /**
       * 暂停：PAUSED
       */
      case "PAUSED":
        this.implementationType = "TEXT";
        this.fieldSource = "paused";
        this.implementationValue = this.$T("ssrc.inquiryHall.model.inquiryHall.pause").$D("暂停中");
        break;
      /**
       * 完成：FINISHED
       */
      case "FINISHED":
        this.implementationType = "FORM";
        this.fieldSource = "suggestedSuppliers";
        this.implementationValue = item.suggestedSuppliers;
        break;
      default:
        this.implementationType = "";
        this.fieldSource = "";
        this.implementationValue = "";
        break;
      }
    },
    // 一级tab切换
    onTabIndexChange(index) {
      this.chooseSecondTabIndex = 0;
      this.currentTab = index;
      this.getDataSet.refresh();
    },
    // 二级tab切换
    onSecondTabIndexChange(index) {
      this.chooseSecondTabIndex = index;
      this.getDataSet.refresh();
    },
    goToDetail(item) {
      const { data } = item;
      const { supplierCompanyId = '', rfxHeaderId = '', quotationHeaderId = '', rfxStatus = '', rfxNum = '', rfxTitle = '', operationMeaning = '', prequalLineStatus = '', prequalLineStatusMeaning = '', quotationHeaderStatus = '', } = data || {};
      if (!supplierCompanyId || !rfxHeaderId) {
        return;
      }

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
      ].includes(rfxStatus) && quotationHeaderId;

      if(onlyViewQueryDetail){
        this.$router.push({
          name: "NewSupplierQueryBiddingDetail",
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
      }else{
        this.$router.push({
          name: "NewSupplierBiddingDetail",
          query: { rfxHeaderId, supplierCompanyId, documentType: this.documentType },
        });
      }

      
      // this.$store.commit("setTenderHallList", data);
    },
    // 获取当前组编码
    getCurrentUnitCode() {
      let currentCode = "";
      const sourceCategory = this.documentType || "BID";

      if (this.currentTab === 0) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = `SSLM.BIDDING_TABLE_${sourceCategory}.UNRELEASED`;
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = `SSLM.BIDDING_TABLE_${sourceCategory}.OPENED`;
        }
      } else if (this.currentTab === 1) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = "SSLM.BIDDING_TABLE_BID.HANDLE";
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = "SSLM.BIDDING_TABLE_BID.ATTENTION";
        }
      } else if (this.currentTab === 2) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = "SSLM.BIDDING_TABLE_BID.SUGGEST";
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = "SSLM.BIDDING_TABLE_BID.SUGGEST_FAILED";
        }
        if (this.chooseSecondTabIndex === 2) {
          currentCode = "SSLM.BIDDING_TABLE_BID.OTHERS";
        }
      } else if (this.currentTab === 3) {
        currentCode = "SSLM.BIDDING_TABLE_BID.ALL";
      }

      return currentCode;
    },
  },
};
</script>
<style lang="stylus" scoped>

.hall-list-second-tab {
  width 375px;
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

.ssrc-supplier-new-supplier-bidding-list-header {
  max-width: 80%;
  min-width: 140px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

