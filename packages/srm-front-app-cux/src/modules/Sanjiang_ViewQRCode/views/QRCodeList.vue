<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false" class="detail-navbar">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img
          class="image-black-default"
          src="@/assets/4.0/icon_bar_back_Darknormal.png">
        {{ $T("smbl.common.view.title.viewQRCode").$D("查看二维码") }}
      </div>
      <div v-if="showBackFlag" slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_up_Darkdefault@3x.png"
            alt
            @click="goTop()">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_closed_Darkdefault@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="search-line">
        <Searchs
          v-model="searchVal"
          :handle-search="handleSearch"
          :placeholder="$T('smbl.common.view.write.searchBrQRTitle').$D('请输入二维码标题查询')"/>
      </div>
      <div v-if="list.length" class="scrollWrap">
        <hips-scroll
          ref="scroll"
          :data="list"
          :scroll-options="{pullUpLoad: false, scrollbar: false, pullUpLoad: false}">
          <div v-for="(item, index) in list" :key="index" class="card" @click="checkQRCode(item)">
            <div class="card-title">{{ item.name }}</div>
            <div class="card-arrow">
              <img
                src="@/assets/4.0/icon_List_right_default@3x.png"
                alt>
            </div>
          </div>
        </hips-scroll>
      </div>
    </div>
  </hips-view>
</template>

<script>
import Searchs from "@/components/SearchsV4";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { Icon, View, Popup, Input, NavBar, Scroll } from "hips";

export default {
  modules: [ "smbl.common" ],
  name: "QRCodeList",
  components: {
    Searchs,
    [View.name]: View,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      searchVal: "",
      searchList: undefined,
      multipleLanguage: {
        originList: [
          {
            name: this.$T("smbl.common.view.button.registerQRCode").$D("农户注册码"),
            spell: "nonghuzhucema",
            navigateUrl: "/pages/sj_register/sj_Register",
            innerFlag: 1
          },
          {
            name: this.$T("smbl.common.view.button.receiptQRCode").$D("农户收款码"),
            spell: "nonghushoukuanma",
            navigateUrl: "/Sanjiang_ConfirmPayment/#/sj_MyPaymentList",
            innerFlag: 0
          }
        ],
      }
    };
  },
  computed: {
    list() {
      if (this.searchList === undefined) {
        // 未搜索
        return this.multipleLanguage.originList;
      }
      return this.searchList;

    }
  },
  methods: {
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
    handleSearch() {
      let val = this.searchVal.trim();
      if (val.length === 0) {
        this.searchList = undefined;
        return;
      }
      this.searchList = this.multipleLanguage.originList.filter((item) => {
        return item.name.includes(this.searchVal) || item.spell.includes(this.searchVal);
      });
    },
    checkQRCode(item) {
      this.$router.push({
        name: "ViewQRCode",
        query: {
          url: item.navigateUrl,
          title: item.name,
          innerFlag: item.innerFlag
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-navbar {
  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;

    img {
      height: 12.7px;
      width: 15.3px;
      margin-right: 10.7px;
      margin-top: 4px;
    }
  }

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: bold;
    margin-left: 13px;
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 7px 15px;
      background: var(--color-bg-default);
      border: 1px solid var(--color-border-default);
      border-radius: 18px;

      i {
        margin: 0px 8px;
        position: relative;
        top: -1px;
      }
    }

    img {
      height: 20px;
      width: 20px;
    }
  }
}

.content {
  height: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;

  >>> .hips-search {
      width: 100%;
  }
  .scrollWrap {
    height: calc(100vh - 88px);

    .card {
      color: var(--color-font-default);
      background:var(--color-bg-default);
      border-bottom: 4px solid var(--color-border-default);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .card-title {
          color: var(--color-font-default);
          font-size: 16px;
          line-height: 54px;
          margin-left: 15px;
      }
      .card-arrow {
          margin-right: 15px;
          img {
              width: 24px;
              height: 24px;
          }
      }
    }
  }
}
</style>
