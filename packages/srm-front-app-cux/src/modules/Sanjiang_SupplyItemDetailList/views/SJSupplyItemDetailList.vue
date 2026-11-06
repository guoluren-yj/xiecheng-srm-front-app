<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("").$D("供货明细查询") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="search-line">
        <Searchs
          v-model="params.itemName"
          :handle-search="handleSearch"
          :handle-input-change="handleSearch"
          :placeholder="$T('').$D('请输入商品名称查询')"/>
      </div>
      <TotalCount :list-len="itemList.length" :count="totalCount" :info="'供货信息'"/>
      <div v-if="itemList.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          ref="scroll"
          :data="[itemList]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in itemList" :key="index" class="card">
            <ul>
              <li class="code">
                <span>{{ li.itemName }}</span>
                <span style="font-weight:bold;color:#354FF7">{{ li.payFlag ? "已付款" : "未付款" }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("交付价格") }}：{{ li.deliverPrice }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("交付数量") }}：{{ li.deliverQuantity }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("供货明细单号") }}：{{ li.supplyDetailNum }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("提交时间") }}：{{ li.creationDate }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll>
      </div>
      <!-- 空白页 -->
      <NoContent
        v-else-if="itemList.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
  </hips-view>
</template>

<script>
import {
  View,
  Input,
  NavBar,
  Scroll,
} from "hips";
import NoContent from "@/components/NoContent";
import Searchs from "@/components/New/Searchs";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import {
  getSupplyDetailListApi,
} from "../api/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  name: "SJSupplyItemDetailList",
  components: {
    Searchs,
    NoContent,
    TotalCount,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      finishLoad: false,
      itemList: [], //列表数据
      totalCount: 0,
      currentPage: 0, //页码
      height: "height: calc(100vh - 114px)",
      noHeadHeight: "height: calc(100vh - 70px)",
      params: {
        page: 0,
        size: 10,
        peasantUserId: 0
      },
      tenantId: window.localStorage.getItem("tenantId"),
      userInfo: {}
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      this.userInfo = SrmUtil.getUserInfo();
      this.params.peasantUserId = this.userInfo.id;
      await this.fetchData();
      this.finishLoad = true;
      this.$forceUpdate();
      this.$loading.hide();
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 搜索框搜索
    handleSearch() {
      if (this.finishLoad) {
        this.itemList = [];
        this.currentPage = 0;
        this.fetchData();
      }
    },
    // 加载刷新数据
    async loadRefresh() {
      this.itemList = [];
      this.currentPage = 0;
      await this.fetchData();
    },
    // 加载更多数据
    async loadMore() {
      if (this.itemList.length < this.totalCount) {
        this.currentPage++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate();
        });
      }
    },
    // 请求数据
    async fetchData() {
      this.finishLoad = false;
      this.$loading.show();
      this.params.page = this.currentPage;
      await getSupplyDetailListApi(this.params).then((res) => {
        if (res && res.content) {
          this.totalCount = res.totalElements;
          this.itemList.push.apply(this.itemList, res.content);
        } else {
          this.itemList = [];
        }
      }).finally(() => {
        this.finishLoad = true;
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.tab-box {
  padding: 15px 20px;
  display: flex;

  .tab-item {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #1B1E2B
  }

  .tab-item-active {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #3473FF
  }
}
>>>.hips-search {
  width: 100% !important;
}
>>> .hips-cell {
  line-height: 4.4vw !important;
}

.left-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #1B1E2B;
  line-height: 24px;
  font-weight: bold;

  img {
    height: 12.7px;
    width: 15.3px;
    margin-right: 10.7px;
  }
}

.right-button {
  margin-right: 15px;
  z-index: 1;
  color: var(--color-font-default-f);

  span {
    display: flex;
    align-items: center;
    width: 77px;
    height: 32px;
    padding: 7px 10px;
    background: var(--color-bg-default);
    border: 1px solid var(--color-border-default);
    border-radius: 18px;

    i {
      margin: 0px 8px;
    }
  }

  img {
    height: 18px;
    width: 18px;
  }
}

.cancelEdit {
  margin-left: 13.4px;
}

.content {
  font-family: PingFangSC-Regular;
  font-size: 14px;

  .search-line {
    margin: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .img-edit {
      height: 18.8px;
      width: 18.8px;
      margin-right: 15px;
    }

    .img-filter {
      width: 18.7px;
      height: 16.8px;
    }
  }

  >>> .hips-ellipsis {
    font-size: 16px;
    color: #1B1E2B;
  }

  .scrollWrap {
    font-size: 14px;

    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 3vw !important;
      left: 20px !important;
    }

    >>> .hips-cell {
      padding: 0 !important;
    }

    .checkWrap {
      height: 100%;
      overflow: auto;
    }

    .card {
      border-bottom: 1px solid #F5F6FA;
      margin: 0 15px;

      ul {
        li {
          display: flex;
          justify-content: space-between;
          padding-top: 8px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: #1B1E2B;

          .distance {
            span:nth-child(1) {
              display: inline-block;
              width: 158px;
              margin-right: 28px;
            }
          }

          &:nth-child(2) span {
            line-height: 22px;

            &:nth-child(1) {
              width: 224px;
            }
          }

          span {
            display: inline-block;
            line-height: 20px;
          }

          &:last-child {
            margin-top: 6px;
            margin-bottom: 12px;
          }

          &:last-child span {
            display: flex;

            span {
              background: rgba(65, 70, 96, 0.1);
              border-radius: 2px;
              font-size: 10px;
              color: #414660;
              line-height: 22px;
              text-align: center;
              height: 22px;
              padding: 0px 8px;
            }

            span:nth-child(2) {
              margin-left: 8px;
            }
          }
        }

        .code {
          font-weight: bold;
          margin-top: 4px;
        }
      }
    }

    .cards {
      margin: 0;
      padding: 0px 15px;
      width: 100%;

      .code {
        padding-left: 38px;
      }
    }

    >>> .hips-group:last-child {
      border-bottom: 0 !important;
    }
  }
}


.filterWrap {
  margin: 16px 15px 0px 15px;
  padding-bottom: 16px;
  font-size: 16px;
  height: 556px;
  overflow: auto;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    margin-top: 24px;

    &:nth-child(1) {
      margin-top: 0;

      span {
        font-weight: bold;
      }
    }
  }

  .dateWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px 0px;

    span:nth-child(2) {
      height: 2px;
      width: 20px;
      display: inline-block;
      background: var(--color-bg-default-b);
    }

    .date-item {
      display: inline-block;
      width: 150px;
      height: 44px;
      text-align: left;
      background: #F5F6FA;
      border-radius: 4px;
      font-size: 14px;
      color: #82879E;
      line-height: 44px;
      text-align: center;
    }

    .date-color {
      background: rgba(53, 79, 247, 0.1);
      color: #354ff7;
    }
  }

  .supplier, .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border-default);
    font-size: 16px;
    color: var(--color-font-default-b);
    height: 56px;
    font-family: PingFangSC-Regular;

    >>> .hips-input {
      width: 100vw;
      padding: 0 !important;
      height: 6.96vw !important;
      position: static !important;

      input {
        font-size: 16px !important;
      }
    }

    >>> .hips-input__input-value input::-webkit-input-placeholder {
      color: var(--color-font-default-b) !important;
    }

    .supplier-item {
      width: 290px;
      color: var(--color-font-default);
    }

    .status-item {
      width: 80%;
      display: flex;
      flex-wrap: wrap;

      .status {
        border-radius: 18px;
        margin-right: 10px;
        color: var(--color-other-default-b);
        background: #EEFBFA;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        padding: 0px 0px 5px 12px;
      }

      .delete {
        display: inline-block;
        margin-left: 4px;
        height: 12px;
        width: 12px;
        color: var(--color-font-default-e);
      }
    }
  }
}

.handlerWrap {
  display: flex;
  padding: 20px 15px;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 44px;
    border-radius: 4px;
    text-align: center;

    &:nth-child(1) {
      margin-right: 25px;
      color: var(--color-font-default-b);
      background: var(--color-bg-default-b);
    }

    &:nth-child(2) {
      color: var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}

.confirmWrap {
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  width: 100%;
  background-color: var(--color-font-default-d);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 666;

  .editModal {
    display: flex;
    align-items: center;
    background: var(--color-bg-default);
    box-shadow: 0 -1px 2px 0 rgba(27, 30, 43, 0.1);

    >>> .hips-group {
      flex: 1;
      padding-left: 5.2px;
    }

    div {
      justify-content: space-between;

      &:nth-child(2) {
        text-align: right;
        padding-right: 20px;

        span {
          display: inline-block;
          line-height: 36px;
          height: 36px;
          width: 64px;
          border-radius: 4px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          background: var(--color-bg-default);
          text-align: center;
          margin-right: 16px;

          &:nth-child(1) {
            color: var(--color-font-default-b);
            border: 1px solid var(--color-font-default-b);
          }

          &:nth-child(2) {
            color: var(--color-font-default-g);
            border: 1px solid var(--color-border-default-b);
          }

          &:last-child {
            background: var(--color-other-default-b);
            color: var(--color-font-default-d);
            border: 1px solid var(--color-other-default-b);
            margin-right: 0px;
          }
        }
      }
    }
  }
}

>>> .bscroll-indicator {
  display: none !important;
}
</style>
