
<template>
  <div id="wide-area" style="height: 100vh">
    <!-- <nav-head :title="$T('smbl.wideArea.view.message.titles').$D('寻商问品')" @goBack="goBack" /> -->
    <div v-show="showHotProduct" class="wide-area-home">
      <div style="padding: 4px 15px;">
        <srm-search :placeholder="$T('smbl.wideArea.view.productName').$D('商品名称')" @focus="onFocus"/>
      </div>
      <!-- 热搜品类 -->
      <div class="top-list">
        <div class="top-list-title">{{ $T('smbl.wideArea.view.title.hotCategory').$D('热搜品类') }}</div>
        <srm-scroll :scrollable="false" :refreshable="false" :can-load-more="false" class="top-list-content">
          <div v-for="(item, index) in topData" :key="index" class="top-item" @click="handlerHotClick(item.itemName)">
            <div class="top-item-left">
              <div :class="['top-item-left-num', ['first', 'second', 'third'][index]]">{{ index+1 }}</div>
            </div>
            <div class="top-item-right">
              <div class="top-item-right-head">
                <div class="top-item-right-head-tit">{{ item.itemName }}</div>
                <span class="top-item-right-head-count">{{ $T("smbl.wideArea.view.suplier.count", [ item.totalSupplier ]).$D("共{name}家企业") }} </span>
              </div>
              <div class="top-item-right-bottom">
                <div v-for="(city, ind) in item.suppliers" :key="ind" class="top-item-city">{{ city.province }}<span style="margin-left: 4px">{{ city.num }}</span></div>
              </div>
            </div>
          </div>
        </srm-scroll>
      </div>
    </div>
  </div>
</template>

<script>

import * as dd from "dingtalk-jsapi";
import { SrmUtil } from "srm-mobile-ui";
import { getTopListApi, getBatchDataApi, getUserInfoApi } from "../api/index";

export default {
  modules: [ "smbl.wideArea", "smbl.common" ],
  name: "FindBusinessList",
  components: {
  },
  data() {
    return {
      loading: false,
      topData: [], //top10数据
      showHotProduct: true, // 是否显示热搜品类
    };
  },
  created() {
    this.getTopList();
    this.dingDingAuth();
    this.dingdingMonitor();
    // this.getBatchData();
  },
  methods: {
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    onFocus() {
      this.goSearch();
    },
    goSearch(itemName) {
      this.$router.push({
        name: "FindBusinessSearch",
        query: { itemName }
      });
    },
    // 点击热门品类
    handlerHotClick(text) {
      this.goSearch(text);
    },
    // 获取top10数据
    getTopList() {
      getTopListApi().then((res = []) => {
        this.topData = Object.freeze(res);
      });
    },
    // 获取下拉数据
    getBatchData() {
      getBatchDataApi().then((result) => {
        const batchData = result || {};
        this.$store.commit("FindBusiness/setBatchData", batchData);
      });
    },
    // 钉钉监控代码
    dingdingMonitor() {
      let isDingtalk = navigator && /DingTalk/.test(navigator.userAgent);
      let isProductEnv = SrmUtil.getEnvironment() === "PROD";
      console.log("check env", SrmUtil.getEnvironment());
      if (isProductEnv && isDingtalk) {
        console.log("enter env");
        !(function (c, i, e, b) {
          let h = i.createElement("script");
          let f = i.getElementsByTagName("script")[0];
          h.type = "text/javascript";
          h.crossorigin = true;
          h.onload = function () {
            // eslint-disable-next-line new-cap
            c[b] || (c[b] = new c.wpkReporter({ bid: "dta_2_110458" }));
            c[b].installAll();
          };
          f.parentNode.insertBefore(h, f);
          h.src = e;
        })(window, document, "https://g.alicdn.com/woodpeckerx/jssdk??wpkReporter.js", "__wpk");
      }
    },
    // 钉钉免登
    dingDingAuth() {
      let isDingtalk = navigator && /DingTalk/.test(navigator.userAgent);
      if (!isDingtalk) {
        return;
      }
      const title = this.$T("smbl.wideArea.view.message.titles").$D("供应商寻源");
      dd.ready(function() {
        // 设置标题
        dd.biz.navigation.setTitle({ title });

        let corpId = localStorage.getItem("corpId");

        // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
        dd.runtime.permission.requestAuthCode({
          corpId,
          onSuccess: function(result) {
            const code = result.code; //传给后端
            getUserInfoApi(code, corpId).then((res) => {
              console.log(res);
            });
          },
          onFail : function(err) {
            // eslint-disable-next-line no-alert
            console.log("dd error: " + JSON.stringify(err));
          }
        });
      });
    }
  },
};
</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

.top-list {
  .top-list-title {
    font-size: 14px;
    color: #333333;
    line-height: 44px;
    font-weight: 600;
    padding: 0 15px;
    border-bottom: 8px solid #F1F2F5;
  }
  .top-list-content {
    padding: 0 8px;
  }
  .top-item {
    padding: 16px 0;
    border-bottom: 1px solid #F6F6F6;
    display: flex;
    .top-item-left {
      .top-item-left-num {
        color: #AFAFAF;
        background: #F0F2F5;
        border-radius: 2px;
        font-size: 12px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        font-weight: 500;
        margin-left: 7px;
        &.first {
          background: #FFEFED;
          color: #F36331;
        }
        &.second {
          background: #FFFAF0;
          color: #FFC043;
        }
        &.third {
          background: #E6F2ED;
          color: #05944F;
        }
      }
    }
    .top-item-right {
      margin-left: 12px;
      .top-item-right-head {
        display: flex;
        align-items: center;
        .top-item-right-head-tit {
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          font-weight: 600;
        }
        .top-item-right-head-count {
          font-size: 12px;
          color: #AFAFAF;
          line-height: 16px;
          margin-left: 12px;
        }
      }
      .top-item-right-bottom {
        display: flex;
        margin-top: 12px;
        .top-item-city {
          font-size: 13px;
          color: #333333;
          line-height: 20px;
          margin-right: 12px;
        }
      }
    }
  }
}

</style>
