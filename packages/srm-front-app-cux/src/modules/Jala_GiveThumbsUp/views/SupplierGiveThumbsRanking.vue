<template>
  <div style="height: 100%">
    <img src="@/assets/ranking.png" width="100%" alt >
    <div style="padding: 0px 20px">
      <srm-tab-bar :tabs="tabsJustify" display="justify" @indexChange="onIndexChange"/>
      <srm-search
        v-show="tabsKey === 0"
        v-model="queryParams"
        :field="monthQueryField"
        :single-query-fields="true"
        @search="handleSearch"
        @clear="handleSearch"/>
      <srm-search
        v-show="tabsKey === 1"
        v-model="queryParams"
        :field="yearQueryField"
        :single-query-fields="true"
        @search="handleSearch"
        @clear="handleSearch"/>
      <srm-search
        v-show="tabsKey === 2"
        v-model="queryParams"
        :field="innQueryField"
        :single-query-fields="true"
        @search="handleSearch"
        @clear="handleSearch"/>
      <srm-search
        v-show="tabsKey === 3"
        v-model="queryParams"
        :field="praiseQueryField"
        :single-query-fields="true"
        @search="handleSearch"
        @clear="handleSearch"/>
    </div>
    <div class="jala-list" style="padding: 0px 20px;margin: 10px 0px;color: #afafaf;font-size: 14px;">
      <p class="jala-list-rank">{{ $T("scux.supplierGiveThumbsUp.model.rank").$D("排名") }}</p>
      <p class="jala-list-supplierName">{{ $T("scux.supplierGiveThumbsUp.model.supplierName").$D("供应商名称") }}</p>
      <p class="jala-list-coin">{{ $T("scux.supplierGiveThumbsUp.model.blueCoin").$D("蓝币数") }}</p>
      <p class="jala-list-medal">{{ $T("scux.supplierGiveThumbsUp.model.medalNum").$D("勋章") }}</p>
    </div>
    <div style="height: calc(100% - 223px);overflow-y: auto">
      <div class="detail-wrap create-receive-detail-scroll-el " >
        <srm-list
          v-if="tabsKey === 0"
          class="jala-list-seach"
          :data-set="monthlyRankingDs"
          :columns="getRankingColumns"/>
        <srm-list
          v-if="tabsKey === 1"
          class="jala-list-seach"
          :data-set="yearRankingDs"
          :columns="getRankingColumns"/>
        <srm-list
          v-if="tabsKey === 2"
          class="jala-list-seach"
          :data-set="innovationDs"
          :columns="getRankingColumns"/>
        <srm-list
          v-if="tabsKey === 3"
          class="jala-list-seach"
          :data-set="praiseDs"
          :columns="getRankingColumns"/>
      </div>
    </div>
  </div>
</template>

<script>
import { DataSet, $T, SrmTooltip } from "srm-mobile-ui";
import debounce from "lodash/debounce";
import { monthlyRanking, yearRanking, innovation, praise, queryFieldsAll } from "../datasource/index";
import ChooseValueMedal from "./ChooseValueMedal";
import goldMedal from "@/assets/medalIcons/goldMedal.png";
import silverMedal from "@/assets/medalIcons/silverMedal.png";
import bronzeMedal from "@/assets/medalIcons/bronzeMedal.png";

export default {
  modules: [ "scux.supplierGiveThumbsUp", "hzero.common" ],
  name: "SupplierGiveThumbsRanking",
  data() {
    return {
      tabsKey: 0,
      tabsJustify: [ $T("scux.supplierGiveThumbsUp.title.monthlyRanking").$D("月度排名"), $T("scux.supplierGiveThumbsUp.title.yearRanking").$D("年度排名"), $T("scux.supplierGiveThumbsUp.title.innovation").$D("创新榜"), $T("scux.supplierGiveThumbsUp.title.praise").$D("好评榜") ],
      monthlyRankingDs: new DataSet(monthlyRanking()),
      yearRankingDs: new DataSet(yearRanking()),
      innovationDs: new DataSet(innovation()),
      praiseDs: new DataSet(praise()),
      queryParams: {},
      monthQueryField: queryFieldsAll().monthlyRanking,
      yearQueryField: queryFieldsAll().yearRanking,
      innQueryField: queryFieldsAll().innovation,
      praiseQueryField: queryFieldsAll().praise,
    };
  },
  computed: {
    getRankingColumns() {
      return [ {
        fieldCode: "rank",
        formRow: 1,
        render: (val, record) => {
          const { rank, supplierName, blueCoin, medalNum } = record;
          return (
            <div class="jala-list">
              <p class="jala-list-rank">
                {rank === 1 ?
                  <img
                    src={goldMedal}
                    width="35%"
                    alt={$T("scux.supplierGiveThumbsUp.view.title.gold").$D("金牌")}
                  /> : rank === 2 ?
                    <img
                      src={silverMedal}
                      width="35%"
                      alt={$T("scux.supplierGiveThumbsUp.view.title.silver").$D("银牌")}
                    /> : rank === 3 ?
                      <img
                        src={bronzeMedal}
                        width="35%"
                        alt={$T("scux.supplierGiveThumbsUp.view.title.bronze").$D("通牌")}
                      /> : val}
              </p>
              <SrmTooltip placement="bottom" title={supplierName} class="jala-list-supplierName"><span>{supplierName}</span></SrmTooltip>
              <p class="jala-list-coin" style="color: var(--color-primary)" onClick={() => this.handleGoToRecord(record)}>{blueCoin}</p>
              <p class="jala-list-medal" style="color: var(--color-primary)" onClick={() => this.handleSelectCoin(record)}>{medalNum}</p>
            </div>
          );
        },
      }, ];
    }
  },
  mounted() {
    this.onIndexChange(this.tabsKey);
    // 主动触发输入框聚焦
  },
  methods: {
    // 页签切换查询数据
    onIndexChange(index) {
      this.tabsKey = index;
      this.queryParams = {};
      if (index === 1) {
        this.yearRankingDs.refresh();
      } else if (index === 2) {
        this.innovationDs.refresh();
      } else if (index === 3) {
        this.praiseDs.refresh();
      } else {
        this.monthlyRankingDs.refresh();
      }
    },
    /* eslint-disable */
    handleSearch: debounce(function() {
     if (this.tabsKey === 1) {
        this.yearRankingDs.setQueryParameter({...this.queryParams});
        this.yearRankingDs.refresh();
      } else if (this.tabsKey === 2) {
        this.innovationDs.setQueryParameter({...this.queryParams});
        this.innovationDs.refresh();
      } else if (this.tabsKey === 3) {
        this.praiseDs.setQueryParameter({...this.queryParams});
        this.praiseDs.refresh();
      } else {
        this.monthlyRankingDs.setQueryParameter({...this.queryParams});
        this.monthlyRankingDs.refresh();
      }
    }, 300),
    // 点赞记录
    handleGoToRecord(record) {
      this.$router.push({
        name: "SupplierGiveThumbsRecord",
        query: { supplierId: record.supplierId },
      });
    },
    closePopupParent() {
      this.likeLanuchPopup.closePopup();
    },
    // 选择勋章
    handleSelectCoin(record) {
      this.likeLanuchPopup = this.$popup({
        showHeader: false,
        showClose: true,
        position: "bottom",
        content: <ChooseValueMedal closePopupParent={this.closePopupParent} supplierId={record.supplierId} />,
      });
    }
  },
};
</script>

<style scoped lang="stylus" >
.jala-list-seach {
  >>>.srm-list-search-line {
    height: auto;
    position: absolute;
    top: -43px;
    left: 70px;
  }
  >>>.srm-field-left-label {
    display: none;
  }
}
.jala-list {
  text-align: center;
  display: flex;
}
.jala-list-rank {
  width: 44px;
}
.jala-list-supplierName {
    width: 129px;
    overflow: hidden;
    margin-left: 20px;
    text-overflow: ellipsis;
    text-align: left;
}
.jala-list-coin {
  width: 44px;
  margin-left: 40px;
}
.jala-list-medal {
  width: 44px;
  margin-left: 21px;
}
</style>
