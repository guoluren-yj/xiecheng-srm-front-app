<template>
  <div style="height: 100vh">
    <srm-list :data-set="getDataSet"
              :customize-code="documentType === 'BID' ? 'SMBL.NEW_BID_HALL.LIST.BID' : 'SMBL.NEW_BID_HALL.LIST.RFX'"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-flex slot="filter" direction="column" align="start">
        <srm-tab-bar
          :tabs="[
            $T('ssrc.inquiryHall.button.toBeReleased').$D('待发布'),
            $T('ssrc.inquiryHall.button.onGoing').$D('进行中'),
            $T('ssrc.inquiryHall.button.finished').$D('完成'),
            $T('ssrc.inquiryHall.button.all').$D('全部')
          ]"
          display="justify"
          :active-index="Number(currentTab)"
          @indexChange="onTabIndexChange"/>
        <div v-if="currentTab === 1 || currentTab === 2" class="hall-list-second-tab">
          <srm-button :class="['first-button',{'no-active':chooseSecondTabIndex !== 0}]" size="small" type="primary"
                      @click="onSecondTabIndexChange(0)">
            {{ currentTab === 1 ? $T('ssrc.inquiryHall.model.inquiryHall.needDeal').$D('需要处理') : (documentType === 'BID' ? $T('ssrc.common.bid').$D('招标') : $T('ssrc.common.inquiryPrice').$D('询价')) + $T('smbl.common.view.message.success').$D('成功') }}
          </srm-button>
          <srm-button :class="[{'no-active':chooseSecondTabIndex !== 1}]" size="small" type="primary"
                      @click="onSecondTabIndexChange(1)">
            {{ currentTab === 1 ? $T('ssrc.inquiryHall.model.inquiryHall.needAttention').$D('需要关注') : $T('ssrc.inquiryHall.model.inquiryHall.others').$D('其他') }}
          </srm-button>
          <srm-button v-if="currentTab === 1" :class="[{'no-active':chooseSecondTabIndex !== 2}]" size="small" type="primary"
                      @click="onSecondTabIndexChange(2)">
            {{ $T('ssrc.inquiryHall.model.inquiryHall.approvaling').$D('审批中') }}
          </srm-button>
        </div>
        <srm-blank size="1px" theme="fill"/>
      </srm-flex>
    </srm-list>
    <implemente-pop v-model="implementePop" :field-source="fieldSource" :implementation-value="implementationValue" :implementation-type="implementationType"/>
  </div>
</template>

<script>
import { allDS } from "../datasource/allDS";
import { unreleasedDS } from "../datasource/unreleasedDS";
import { processingDS, attentionDS, approvingDS } from "../datasource/onGoingDS";
import { finSuccessDS, finOthersDS } from "../datasource/finishedDS";
import { DataSet } from "srm-mobile-ui";
import ImplementePop from "../components/commonPop/ImplementePop";

import IndexColumns from "../mixins/IndexColumns";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common" ],
  name: "HallList",
  components: { ImplementePop },
  mixins: [ IndexColumns ],
  props:{
    // tabIndex: {
    //   type: Number,
    //   default: 3,
    // },
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
      unreleasedDataSet: new DataSet(unreleasedDS(this.documentType)), // 待发布
      processingDataSet: new DataSet(processingDS(this.documentType)), // 需要处理
      attentionDataSet: new DataSet(attentionDS(this.documentType)), // 需要关注
      approvingDataSet: new DataSet(approvingDS(this.documentType)), // 审批中
      finSuccessDataSet: new DataSet(finSuccessDS(this.documentType)), // 招标成功
      finOthersDataSet: new DataSet(finOthersDS(this.documentType)), // 其它
      implementePop:false,
    };
  },
  computed:{
    getDataSet() {
      if (this.currentTab === 0) {
        // console.log("切换一级tab0", this.currentTab);
        return this.unreleasedDataSet;
      } else if (this.currentTab === 1) {
        // console.log("切换一级tab1", this.currentTab);
        if (this.chooseSecondTabIndex === 0) {
          // console.log("切换二级tab0", this.chooseSecondTabIndex);
          return this.processingDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
          // console.log("切换二级tab1", this.chooseSecondTabIndex);
          return this.attentionDataSet;
        } else if (this.chooseSecondTabIndex === 2) {
          // console.log("切换二级tab2", this.chooseSecondTabIndex);
          return this.approvingDataSet;
        }
      } else if (this.currentTab === 2) {
        // console.log("切换一级tab2", this.currentTab);
        if (this.chooseSecondTabIndex === 0) {
          return this.finSuccessDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
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
      this.implementePop = !this.implementePop;
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
      this.$router.push({
        name: "HallDetail",
        query: { rfxHeaderId: data.rfxHeaderId, documentType:this.documentType },
      });
      // this.$store.commit("setTenderHallList", data);
    },
    goToPricing(item) {
      const { rfxHeaderId } = item;
      this.$router.push({
        name: "NewRfxPrice",
        query: { rfxHeaderId },
      });
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
</style>

