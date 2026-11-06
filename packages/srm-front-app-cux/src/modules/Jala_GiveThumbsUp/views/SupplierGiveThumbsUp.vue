<template>
  <div style="height: 100vh">
    <div class="jala-background">
      <div style="padding: 0px 16px">
        <div class="jala-background-header">
          <span style="display: inline-block;color: #fff;">
            <span class="srm-icon icon-users icon-user-jala" />
            <span class="icon-username-jala">{{ headerData.realName }}</span>
          </span>
          <span
            class="srm-icon icon-alert-circle icon-circle-jala"
            @click="handleOpenWhattolike">{{ $T("scux.supplierGiveThumbsUp.view.title.whattolike").$D("点赞须知") }}</span>
        </div>
        <div class="jala-background-content-lssue">
          <div>
            <p>{{ $T("scux.supplierGiveThumbsUp.view.title.laveBlueCoinQuantity").$D("可投蓝币数量") }}</p>
            <p class="jala-background-content-lssue-quality">{{ headerData.laveBlueCoinQuantity }}</p>
          </div>
          <srm-button fill rect type="primary" bordered @click="handleLikeCoin">{{ $T("scux.supplierGiveThumbsUp.view.title.like.coin").$D("点赞发币") }}</srm-button>
        </div>
        <div class="jala-background-content">
          <div class="jala-background-content-title">
            <span>{{ $T("scux.supplierGiveThumbsUp.view.title.my.give.thumbs").$D("我的点赞") }}</span>
            <span @click="handleGoToRecord">{{ $T("scux.supplierGiveThumbsUp.view.title.like.record").$D("点赞记录") }}<span class="srm-icon icon-chevron-right"/></span>
          </div>
          <div class="jala-background-content-record">
            <span>
              <p>{{ $T("scux.supplierGiveThumbsUp.view.title.like.blueCoinQuantity").$D("本月已投蓝币数") }}</p>
              <p>{{ headerData.blueCoinQuantity }} {{ $T("scux.supplierGiveThumbsUp.model.blueCoinQuantity").$D("蓝币") }}</p>
            </span>
            <span>
              <p>{{ $T("scux.supplierGiveThumbsUp.view.title.like.num").$D("本月累计点赞") }}</p>
              <p>{{ headerData.num }} {{ $T("scux.supplierGiveThumbsUp.model.blue.coin").$D("次") }}</p>
            </span>
            <span>
              <!-- <p>{{ $T("scux.supplierGiveThumbsUp.view.title.like.yearNum").$D("本年累计点赞") }}</p> -->
              <!-- <p>{{ headerData.blueCoinQuantity }}</p> -->
            </span>
          </div>
        </div>
        <div class="jala-background-content">
          <div class="jala-background-content-title">
            <span>{{ $T("scux.supplierGiveThumbsUp.view.title.like.leaderboard").$D("点赞排行榜") }}</span>
            <span @click="handleGoRanking">{{ $T("scux.supplierGiveThumbsUp.view.title.view.ranking").$D("查看排行") }}<span class="srm-icon icon-chevron-right"/></span>
          </div>
          <div>
            <div class="jala-list" style="margin: 16px 0px;color: #afafaf;font-size: 14px;">
              <p class="jala-list-rank">{{ $T("scux.supplierGiveThumbsUp.model.month.current.champion").$D("本月排名") }}</p>
              <p class="jala-list-supplierName">{{ $T("scux.supplierGiveThumbsUp.view.title.like.supplierName").$D("供应商名称") }}</p>
              <p class="jala-list-coin">{{ $T("scux.supplierGiveThumbsUp.view.title.like.blueCoin").$D("蓝币数量") }}</p>
              <p class="jala-list-medal">{{ $T("scux.supplierGiveThumbsUp.view.title.like.medalNum").$D("勋章数量") }}</p>
            </div>
            <div v-if="headerData.month !== undefined && headerData.month !== null && headerData.month.length > 0">
              <div v-for="(item, index) in headerData.month" :key="index" class="jala-list jala-background-content-record jala-background-record">
                <p class="jala-list-rank">
                  <img
                    v-if="item.rank === '1'"
                    src="@/assets/medalIcons/goldMedal.png"
                    width="30%"
                    alt>
                  <img
                    v-if="item.rank === '2'"
                    src="@/assets/medalIcons/silverMedal.png"
                    width="30%"
                    alt>
                  <img
                    v-if="item.rank === '3'"
                    src="@/assets/medalIcons/bronzeMedal.png"
                    width="30%"
                    alt>
                </p>
                <srm-tooltip placement="bottom" :title="item.supplierName" class="jala-list-supplierName"><span>{{ item.supplierName }}</span></srm-tooltip>
                <p class="jala-list-coin">{{ item.blueCoin }}{{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
                <p class="jala-list-medal">{{ item.medalNum }} {{ $T("scux.supplierGiveThumbsUp.model.pieces").$D("枚") }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import descriptionbuyer from "@/assets/descriptionbuyer.jpg";
import { fetchSupplierGiveThumbsUp } from "../api/index";

export default {
  modules: [ "scux.supplierGiveThumbsUp" ],
  name: "SupplierGiveThumbsUp",
  data() {
    return {
      headerData: {
        month: [],
        year: {},
      },
    };
  },
  mounted() {
    this.handleSupplierGiveThumbsUp();
  },
  methods: {
    // 点赞须知
    handleOpenWhattolike() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "bottom",
        content: <img style="height: 100%" class="image-gray-default" src={descriptionbuyer} alt />,
      });
    },
    // 点赞数据查询
    async handleSupplierGiveThumbsUp() {
      try {
        this.$loading.show();
        const response = await fetchSupplierGiveThumbsUp();
        if (response && !response.failed) {
          this.headerData = response;
        }
      } finally {
        this.$loading.hide();
      }
    },
    // 点赞发起
    handleLikeCoin() {
      this.$router.push({
        name: "SupplierGiveThumbsLikeLaunch",
      });
    },
    // 点赞排行榜
    handleGoRanking() {
      this.$router.push({
        name: "SupplierGiveThumbsRanking",
      });
    },
    // 点赞记录
    handleGoToRecord() {
      this.$router.push({
        name: "SupplierGiveThumbsRecord",
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.jala-background {
  background-image: url('~@/assets/background_jala.jpg');
  width: 100%;
  height: 100%;
  background-position: 0px -80px;
  background-size: contain;
  background-repeat: no-repeat;
}
.jala-background-header {
    position: relative;
    height: 100px;
    line-height: 100px;
}
.icon-user-jala {
  width: 40px;
  height: 40px;
  display: inline-block;
  background-color: #fff;
  border-radius: 50%;
  color: #EF8FB4;
  font-size: 26px;
  text-align: center;
  line-height: 40px;
}
.icon-username-jala {
  padding-left: 10px;
    width: 190px;
    display: inline-block;
}
.icon-circle-jala {
  float: right;
    color: #fff;
}
/**可投蓝币数 */
.jala-background-content-lssue{
  text-align: center;
  margin-top: 33px;
  font-weight: 600;

  .srm-button-rect {
    padding: 19px 95px;
  }
}
.jala-background-content-lssue-quality{
  margin-top: 12px;
  margin-bottom: 16px;
    font-size: 30px;
    color: var(--color-primary)
}
.jala-background-content {
margin-top: 40px;
}
.jala-background-content-title {
  margin-bottom: 16px;
}
.jala-background-content-title:before{
    content: '|';
    color: var(--color-primary);
    background-color: var(--color-primary);
    font-size: 15px;
    padding-right: 1px;
    border-radius: 8px;
    margin-right: 6px
}
.jala-background-content-title :last-child {
  float: right;
  color: var(--color-primary);
}
.jala-background-content-record {
  display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 20px;
    line-height: 30px;
}
.jala-background-content-record > span :last-child{
  color: var(--color-primary);
}
.jala-background-record {
  margin-top: 10px;
  margin-bottom: 15px;
}
.jala-background-content-footer {
  color: #7e8c8d;
    margin-top: 20px;
    font-size: 14px;
    padding-left: 10px;
}
.jala-list {
  text-align: center;
  display: flex;
}
.jala-list-rank {
  width: 60px;
}
.jala-list-supplierName {
  width: 110px;
    overflow: hidden;
    margin-left: 20px;
    text-overflow: ellipsis;
    text-align: left;
    word-break: keep-all;
}
.jala-list-coin {
  width: 64px;
  margin-left: 20px;
}
.jala-list-medal {
  width: 64px;
  margin-left: 20px;
}
</style>
