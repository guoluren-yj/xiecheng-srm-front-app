<template>
  <div style="height: 100vh">
    <nav-head
      :title="$T('ssrc.common.view.message.expertScoring').$D('专家评分')"/>
    <srm-list
      :data-set="currentTabIndex === 0 ? currentDataSet : historyDataSet"
      :columns="getColumns"
      :customize-code="getCustomizeCode"
      @itemClick="onItemClick">
      <div slot="filter" class="tab-box">
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 0 }"
          @click="selectTabAtIndex(0)">{{
            $T("ssrc.expertScoring.view.message.tab.ongoingScore").$D("进行中")
          }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 1 }"
          @click="selectTabAtIndex(1)">{{
            $T("ssrc.expertScoring.view.message.tab.historyScore").$D("历史")
          }}</span>
      </div>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import CompleteMethod from "../../../modules/CUX_PART/Method/CompleteMethod";
import EvaluateScoreColumns from "../mixins/EvaluateScoreColumns";
import HistoryScoreColumns from "../mixins/HistoryScoreColumns";
import evaluateScoreIndexDS from "../datasource/evaluateScoreIndexDS";
import historyScoreIndexDS from "../datasource/historyScoreIndexDS";
import { fetchBidConfig } from "../api";
export default {
  modules: [ "sinv.receipWorkbench", "ssrc.expertScoring", "hipspfm.common", "ssrc.common", "hipspfm.expertScoring", "ssrc.inquiryHall" ],
  name: "ExpertRatingList",
  extends: CompleteMethod,
  mixins: [ EvaluateScoreColumns, HistoryScoreColumns ],
  data() {
    return {
      currentDataSet: {},
      historyDataSet: {},
      currentTabIndex: 0,
      getColumns: [],
      getCustomizeCode: "",
      operate: "scoreManagement",
      multipleLanguage: {
        rateScore: this.$T("ssrc.expertScoring.view.message.button.score").$D(
          "评分"
        ),
      },
    };
  },
  beforeMount() {
    fetchBidConfig({ tenant: this.getTenantNum() }).then((res = []) => {
      this.isBid = Number(res[0]?.newBid);
      this.isOldBid = Number(res[0]?.oldBid);
      this.currentDataSet = new DataSet(
        evaluateScoreIndexDS({ isBid: this.isBid, isOldBid: this.isOldBid })
      );
      this.historyDataSet = new DataSet(
        historyScoreIndexDS({ isBid: this.isBid, isOldBid: this.isOldBid })
      );
      if (this.over$getRouteParams && typeof this.over$getRouteParams === "function") {
        this.over$getRouteParams();
      }
      this.currentDataSet.refresh();
      this.getCustomizeCode = "SMBL.EXPERT_RATING.EVALUATE_SCORE_LIST";
      this.getColumns = this.getEvaluateScoreColumns(this.isBid);
      this.currentDataSet.events.afterQuery = (ds, dataList) => {
        this.operationRender(dataList);
      };
    });
  },
  activated() {
    this.currentDataSet.refresh();
  },
  methods: {
    getTenantNum() {
      return window.localStorage.getItem("tenantNum");
    },
    onItemClick(item) {
      if (this.currentTabIndex === 0) {
        return;
      }
       // 历史评分 && scoreIndicAssignCount为0时不显示查看评分按钮
      if(this.currentTabIndex === 1 && item?.data?.scoreIndicAssignCount === 0) {
        return;
      }
      let path;
      if (this.operate === "scoreManagement") {
        path = "/ExpertManageDetail";
      } else {
        path = "/ExpertRatingDetail";
      }
      this.$store.commit("ExpertRating/setExpertRatingList", item.data);
      this.$store.commit("ExpertRating/setExpertRatingOperates", this.operate);
      this.$router.push({ path });
    },
    toDetail(operate, li) {
      let path;
      if (operate === "scoreManagement") {
        if (li?.sourceStatus === "SCORING") {
          path = "/ExpertManageDetails";
        } else {
          path = "/ExpertManageDetail";
        }
      } else {
        path = "/ExpertRatingDetail";
      }
      this.$store.commit("ExpertRating/setExpertRatingList", li);
      this.$store.commit("ExpertRating/setExpertRatingOperates", operate);
      this.$router.push({ path });
    },
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 1) {
        this.getCustomizeCode = "SMBL.EXPERT_RATING.HISTORY_SCORE_LIST";
        this.operate = "history";
        this.historyDataSet.refresh();
        this.getColumns = this.getHistoryScoreColumns(this.isBid);
      } else {
        this.getCustomizeCode = "SMBL.EXPERT_RATING.EVALUATE_SCORE_LIST";
        this.operate = "scoreManagement";
        this.currentDataSet.refresh();
        this.getColumns = this.getEvaluateScoreColumns(this.isBid);
      }
      this.dataSet.events.afterQuery = (ds, dataList) => {
        this.operationRender(dataList);
      };
    },
    // 操作按钮逻辑
    operationRender(list) {
      list.map((item) => {
        const {
          currentSequenceNum,
          expertSequenceNum,
          sourceFrom,
          evaluateLeaderFlag,
          sourceStatus,
          scoredStatus,
          initialReview,
          reviewScoredStatus,
          indicAssignCount,
          scoreIndicAssignCount,
        } = item;
        let operates = [];
        // 评分及查看评分
        const isStatus = [ "NEW", "RESCORING" ].includes(scoredStatus);
        const isSourceStatus = [
          "NOT_START",
          "ROUND_QUOTATION",
          "RFX_INITIAL_REVIEW_PENDING",
          "INITIAL_REVIEW_SCORING",
        ].includes(sourceStatus);
        const isMatch =
          reviewScoredStatus === "NEW" &&
          initialReview === "NEED" &&
          [ "INITIAL_REVIEW_SCORING", "RFX_INITIAL_REVIEW_PENDING" ].includes(
            sourceStatus
          ) &&
          Number(indicAssignCount) === 0;
        let tempB = {};

        if (isStatus) {
          if (
            !isSourceStatus &&
            !isMatch &&
            currentSequenceNum === expertSequenceNum
          ) {
            if(scoreIndicAssignCount === 0) {
              tempB = {};
            } else {           // 没有值或者大于0都是显示评分按钮
              tempB = {
                value: "score",
                meaning: this.multipleLanguage.rateScore,
              };
            }
            // eslint-disable-next-line no-empty
          } else if (currentSequenceNum < expertSequenceNum) {
          } else if (currentSequenceNum > expertSequenceNum) {
                    // 为0时不显示评分按钮
            if(scoreIndicAssignCount === 0) {
              tempB = {};
            }else {
              tempB = {
              value: "checkScore",
              meaning: this.$T(
                "ssrc.expertScoring.view.message.button.checkScore"
              ).$D("查看评分"),
            };
            }
          }
        } else if (currentSequenceNum === expertSequenceNum) {
            // 为0时不显示评分按钮
          if(scoreIndicAssignCount === 0) {
            tempB = {};
          } else {
            tempB = {
            value: "checkScore",
            meaning: this.$T(
              "ssrc.expertScoring.view.message.button.checkScore"
            ).$D("查看评分"),
          };
          }
          // eslint-disable-next-line no-empty
        } else if (currentSequenceNum < expertSequenceNum) {
        } else if (currentSequenceNum > expertSequenceNum) {
            // 为0时不显示评分按钮
          if(scoreIndicAssignCount === 0) {
            tempB = {};
          } else {
            tempB = {
              value: "checkScore",
              meaning: this.$T(
                "ssrc.expertScoring.view.message.button.checkScore"
              ).$D("查看评分"),
            };
          }
        }
        if (JSON.stringify(tempB) !== "{}") {
          operates.push(tempB);
        }
        // 评分管理
        if (
          sourceFrom === "RFX" ||
          sourceFrom === "BID" ||
          sourceFrom === "RFP" ||
          sourceFrom === "RFI"
        ) {
          if (evaluateLeaderFlag) {
            // eslint-disable-next-line default-case
            switch (sourceStatus) {
            case "RFX_EVALUATION_PENDING":
            case "SCORING":
            case "ROUND_QUOTATION":
              // case "INITIAL_REVIEW_SCORING":
              // eslint-disable-next-line no-fallthrough
            case "PRE_EVALUATION_PENDING_REJECT":
            case "PRE_EVALUATION_PENDING":
            case "NOT_START": // 成交候选人页面
              // eslint-disable-next-line no-case-declarations
              let a = {
                value: "scoreManagement",
                meaning: this.$T(
                  "hipspfm.expertScoring.view.message.expertManage"
                ).$D("评分管理"),
              };

              operates.push(a);
              break;
            }
          }
        }
        item.operates = operates;
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.tab-box {
  display: flex;
  flex-direction: row;
  padding: 15px 20px;

  .tab-item {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
  }

  .tab-item-active {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
    font-weight: bold;
  }
}

.statusA {
  color: var(--color-other-default-c) !important;
}

.statusB {
  color: var(--color-other-default) !important;
}

.statusC {
  color: var(--color-font-default-e) !important;
}

ul {
  width: 100%;

  li {
    padding-top: 12px;
    font-size: 14px;
    color: var(--color-font-default);
    padding-right: 20px;
    line-height: 22px;
    font-family: 'PingFangSC-Regular';
    display: flex;

    span {
      text-align: left;
      flex: none;
    }
  }
}

.footer-li {
  border-top: 1px solid var(--color-border-default);
  font-family: PingFangSC-Medium;
  margin-left: 20px;
  color: var(--color-font-default);
  font-size: 3.733vw;
  font-weight: 700;
  line-height: 5.867vw;
  padding-top: 2.933vw;
}

.operate {
  margin-left: 0px;
  display: flex;
  justify-content: center;
  color: var(--color-other-default-b);
}

.foot-li {
  border-top: 1px solid var(--color-border-default);
  font-family: 'PingFangSC-Medium';
  color: var(--color-other-default-b);
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
  display: flex;
  align-items: center;

  span {
    flex: 1;
    text-align: center;
    padding: 2.933vw 0 3.2vw;
  }

  span:nth-child(even) {
    border-left: 1px solid var(--color-border-default);
  }
}
</style>