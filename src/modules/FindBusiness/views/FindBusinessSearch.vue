
<template>
  <div id="wide-area" style="height: 100vh">
    <!-- <nav-head :title="$T('smbl.wideArea.view.message.titles').$D('寻商问品')" @goBack="goBack" /> -->

    <srm-flex class="srm-list-search-line">
      <srm-search
        ref="search"
        v-model="queryParameter"
        :field="fastQueryField"
        :placeholder="$T('smbl.wideArea.view.productName').$D('商品名称')"
        @focus="onFocus"
        @clear="onClear"
        @enter="onEnter"
        @search="onSearch"/>
      <div style="max-width: 25%">
        <em class="srm-icon icon-filter srm-list-icon-search" @click="showFilterPopup" />
      </div>
    </srm-flex>

    <div v-show="dataSet.totalCount" class="history-num">
      {{ $T("smbl.wideArea.view.supplier.count", [dataSet.totalCount]).$D("已为你找到{count}家公司") }}
    </div>

    <srm-scroll v-loading="showLoading" :scrollable="false" :refreshable="false" class="content-info" @reachBottom="loadMore">
      <div v-show="!queryParameter.keyword && historyWord.length" class="history-word">
        <div class="history-word-title">
          <span>{{ $T('smbl.wideArea.view.title.historyWord').$D('历史搜索') }}</span>
          <span class="srm-icon icon-trash" style="color: #B0AFAF" @click="clearHistoryKeyword" />
        </div>
        <div class="history-word-content">
          <span v-for="(item, index) in historyWord" :key="index" class="history-wrod-tag" @click="handlerClick(item)">{{ item }}</span>
        </div>
      </div>

      <div v-show="dataSet.data && dataSet.data.length" class="chart-wrap">
        <div id="chart" class="chart-map" />
        <div class="chart-list">
          <div v-for="item in areaSupplierInfo" :key="item.first_level_name" class="chart-list-item">
            <div class="chart-list-item-name">{{ item.first_level_name }}</div>
            <div class="chart-list-item-count">{{ item.regoin_number }}</div>
          </div>
        </div>
      </div>

      <div v-if="getData.length" class="result-list" >
        <div v-for="(item, index) in getData" :key="index" class="result-list-item" @click="goToDetail(item)">
          <customize :columns="getColumns" :data-source="item" type="list" />
        </div>
      </div>
      <!-- platform-9045 直接传多语言 key，由 NoContent 组件内部统一翻译；传译文会被组件当作 key 二次翻译，英文环境落到中文兜底 -->
      <no-content
        v-if="!showLoading && !getData.length"
        title="smbl.common.view.noDocumentInformation"
        img-src="NoOrder@3x.png"/>
    </srm-scroll>

    <srm-filter v-model="showFilterPopupFlag" :data-set="dataSet" />
    <!-- <div v-show="showKeywordResult || loading" id="search-result" v-loading="loading" class="search-result">
      <touch-feedback v-for="(item, index) in keywordResult" :key="index" active-class-name="tab-item-active">
        <div class="search-result-item noWrap" @click="handlerClick(item.item_name)" v-html="buildKeyword(item.item_name)" />
      </touch-feedback>
      <div v-show="!loading && !keywordResult.length" class="no-data">{{ $T('smbl.wideArea.view.title.noData').$D('暂无数据') }}</div>
    </div> -->
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import * as echarts from "echarts";
// eslint-disable-next-line no-unused-vars
const china = require("./china");
import { city } from "./city";
import NoContent from "srm-mobile-ui/packages/srm-list/NoContent";

import { getSupplierGoodApi, getSupplierAreaInfoApi } from "../api/index";

export default {
  modules: [ "smbl.wideArea", "smbl.common" ],
  name: "FindBusinessSearch",
  components: {
    NoContent
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (from.path === "/FindBusinessList") {
        const itemName = vm.$route.query.itemName;
        if (itemName) {
          vm.resetData();
          vm.handlerClick(itemName);
        } else {
          vm.resetData();
          vm.queryParameter.keyword = "";
          setTimeout(() => {
            vm.$refs.search.focus();
          }, 500);
        }
      }
    });
  },
  data() {
    return {
      loading: false,
      showLoading: false,
      showFilterPopupFlag: false,
      keywordResult: [],
      showKeywordResult: false,
      dataSet: new DataSet(indexDS(this)),
      batchData: {},
      areaSupplierInfo: [], //地图供应商信息
      searchFlag: true,
      fastQueryField: {
        fieldCode: "keyword",
        fieldType: "TEXT",
      },
      queryParameter: {
        keyword: "",
      },
      historyWord: JSON.parse(localStorage.getItem("findBusiness-historyWord")) || [], //历史记录
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.companyName}</span>
          </SrmListHeader>
        },
        {
          formRow: 2,
          fieldName: this.$T("smbl.wideArea.modal.localArea").$D("所在地区"),
          fieldCode: "first_level_name",
        },
        {
          formRow: 2,
          fieldName: this.$T("smbl.wideArea.modal.registeredCapitalWithUnit").$D("注册资本"),
          fieldCode: "registeredCapital",
          render: (val) => val ? val + this.$T("smbl.wideArea.model.ten.thousand").$D("万") : "-"
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.creationDate").$D("成立日期"),
          fieldCode: "buildDate",
        },
      ];
    },
    // 处理buildKeywordResult
    buildKeyword() {
      return (value) => {
        const keyword = this.queryParameter.keyword;
        const reg = new RegExp(keyword, "g");
        return value.replace(reg, `<span style="color: #276EF1">${keyword}</span>`);
      };
    },
    // 获取数据
    getData() {
      return this.dataSet.data || [];
    }
  },
  mounted () {
    // document.getElementById("wide-area").addEventListener("click", this.handler, false);
  },
  destroyed() {
    // document.getElementById("wide-area").removeEventListener("click", this.handler);
  },
  methods: {
    goToDetail(item = {}) {
      this.$router.push({
        name: "FindBusinessDetail",
        query: { companyId: item["osph_supplier_company_id"], companyArea: item["first_level_name"] }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    // 加载更多
    loadMore() {
      const result = this.dataSet.loadMore();
      result.catch(() => {});
    },
    // 点击搜索结果
    handlerClick(text) {
      if (!text) {
        return;
      }
      this.searchFlag = false;
      this.queryParameter.keyword = text;
      this.dataSet.addQueryParameter("itemName", text);
      this.dataSet.addQueryFieldParameter("industryCategoryName", "itemName", text);
      this.dataSet.refresh();
      this.showKeywordResult = false;
      this.updateHistoryWord(text);
    },
    // 更新搜索记录缓存
    updateHistoryWord(keyword) {
      try {
        if (!keyword) {
          return;
        }
        let historyWord = JSON.parse(localStorage.getItem("findBusiness-historyWord")) || [];
        if (historyWord.length > 6) {
          historyWord.pop();
        }
        historyWord.unshift(keyword);
        historyWord = [ ...new Set(historyWord) ];
        localStorage.setItem("findBusiness-historyWord", JSON.stringify(historyWord));
        this.historyWord = historyWord;
      } catch {
        console.log("err");
      }
    },
    // 清空搜索记录
    clearHistoryKeyword() {
      this.$dialog({
        content: this.$T("smbl.wideArea.view.clear.tips").$D("确认要清空历史记录吗？"),
        onOk: () => {
          localStorage.setItem("findBusiness-historyWord", JSON.stringify([]));
          this.historyWord = [];
        },
        onCancel: () => {}
      });
    },
    // 显示筛选
    showFilterPopup() {
      this.showFilterPopupFlag = !this.showFilterPopupFlag;
    },
    // 重置数据
    resetData() {
      this.dataSet.setQueryParameter({});
      this.dataSet.reset();
    },
    // 输入框清空事件
    onClear() {
      this.dataSet.addQueryParameter("itemName", "");
      this.dataSet.reset();
    },
    // 输入框聚焦
    onFocus() {
      this.searchFlag = true;
    },
    // 输入框回车
    onEnter() {
      this.handlerClick(this.queryParameter.keyword);
    },
    // 输入框搜索
    onSearch() {
      this.dataSet.addQueryParameter("itemName", this.queryParameter.keyword);
      // if (this.queryParameter.keyword && this.searchFlag) {
      //   this.getSupplierGood();
      // } else {
      //   this.keywordResult = [];
      // }
    },
    // 关闭下拉框
    handler(e) {
      const dom = document.getElementById("search-result");
      if (!dom.contains(e.target)) {
        this.showKeywordResult = false;
      }
    },
    // 获取供应商数据
    getSupplierGood() {
      const params = {
        itemName: this.queryParameter.keyword
      };
      this.loading = true;
      getSupplierGoodApi(params).then((res) => {
        const { content = [] } = res;
        this.keywordResult = Object.freeze(content || []);
        this.showKeywordResult = true;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取地图分布信息
    getSupplierAreaInfo(itemName, registeredCapital, industryCategoryName) {
      const params = {
        itemName,
        industryCategoryName,
        province: "",
        registeredCapital,
      };
      if (this.dataSet.currentPage > 0) {
        this.showLoading = false; // 加载分页数据时无需重复加载地图信息
        return;
      }
      getSupplierAreaInfoApi(params).then((res) => {
        let content = res.content || [];
        content = content.filter((v) => v.first_level_name !== "");
        content.sort((a, b) => b.regoin_number - a.regoin_number);
        this.areaSupplierInfo = Object.freeze(content);
        const max = content[0] ? content[0].regoin_number : 50;
        this.printChart(content, max);
      }).finally(() => {
        this.showLoading = false;
      });
    },
    // 根据地区编码获取地区名称
    handleGetArea(areaCode = "") {
      const { areaCodeList = [] } = this.batchData;
      let areaName = "";
      areaCodeList.forEach((item) => {
        if (item.value === areaCode) {
          areaName = item.meaning;
        }
      });
      return areaName;
    },
    // 绘制地图
    printChart(areaInfo = [], max = 50, min = 0) {
      const mapCityInfo = areaInfo.reduce((pre, cur) => {
        const key = cur["first_level_name"].slice(0, -1);
        const value = cur["regoin_number"];
        return { ...pre, [key]: value };
      }, {});

      // 全国省份列表
      let dataMap = JSON.parse(JSON.stringify(city));
      dataMap = dataMap.map((v) => ({ ...v, value: mapCityInfo[v.name] || 0 }));

      // 绘制图表，准备数据
      let option = {
        title: {
          text: `\n   ${this.$T("smbl.wideArea.view.title.area").$D("地区分布")}`,
          textStyle: {
            color: "#333",
            fontWight: 600,
            fontSize: 14,
          }
        },
        tooltip: {
          formatter: function (params) {
            let info = `<p style="font-size:18px">${params.name}: ${params.value} </p>`;
            return info;
          },
          backgroundColor: "#ff7f50", //提示标签背景颜色
          textStyle: { color: "#fff" } //提示标签字体颜色
        },
        dataRange: {
          min,
          max,
          color: [ "rgba(39,110,241,1)", "rgba(228,235,249,1)" ],
          text: [ this.$T("smbl.wideArea.view.title.high").$D("高"), this.$T("smbl.wideArea.view.title.low").$D("低"), ],
          splitNumber: 0,
          calculable: false,
          itemWidth: 6,
          itemHeight: 60,
          show: true,
          left: 15,
        },
        series: [
          {
            name: "CHINA",
            type: "map",
            mapType: "china",
            selectedMode: "single",
            left: 20, //地图距离左边距
            right: 20, //地图距离右边距
            top: 10,
            bottom: 10,
            label: {
              normal: {
                show: false, //显示省份标签
                textStyle:{
                  fontSize: "8px",
                  color: "#333333",
                } //省份标签字体颜色
              },
              emphasis: {
                show: true, //对应的鼠标悬浮效果
                // textStyle:{color:"#800080"}
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0.5, //区域边框宽度
                borderColor: "#666666", //区域边框颜色
                areaColor:"#F1F2F5", //区域颜色
              },
              emphasis: {
                borderWidth: 0.5,
                borderColor: "#4b0082",
                areaColor: "#ffdead", //选中的颜色
              }
            },
            data: dataMap
          }
        ]
      };
      //初始化echarts实例
      // eslint-disable-next-line no-undef
      let myChart = echarts.init(document.getElementById("chart"));
      //使用制定的配置项和数据显示图表
      myChart.setOption(option);

    }
  },
};
</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

.srm-list-icon-search {
  font-size: 24px;
  margin-left: 16px;
}

.srm-list-search-line {
  padding: 4px 15px;
}

.history-num {
  padding: 8px 20px;
  background: #EFF3FE;
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
}

.search-result {
  position: absolute;
  left: 0
  top: 50px;
  width: 100%;
  background: #fff;
  min-height: 55px;
  max-height: 250px;
  overflow: auto;
  box-shadow: 0px 2px 6px 4px rgba(0,0,0,0.06);
  .search-result-item {
    margin-left: 15px;
    padding: 16px 15px 16px 0;
    border-bottom: 1px solid #F6F6F6;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }

  >>> .srm-loading {
    top: 0 !important;
  }

}

.tab-item-active {
  color $srm-theme-color-primary;
  background $srm-theme-color-primary-fill;
}

.no-data {
  width: 100%;
  height: 55px;
  line-height: 55px;
  text-align: center;
}

.content-info {
  // background: #F0F2F5;
}

.result-list {
    padding-bottom: 50px;
  .result-list-item {
    padding: 12px 15px 16px 15px;
    border-top: 8px solid #F0F2F5;
    // margin-top: 8px;
  }
}

.history-word {
  padding: 16px 15px;
  .history-word-title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
  }
  .history-word-content {
    padding-top: 4px;
    .history-wrod-tag {
      background: #F6F6F6;
      border: 1px solid #F6F6F6;
      border-radius: 2px;
      padding: 4px;
      font-size: 10px;
      color: #757575;
      line-height: 12px;
      font-weight: 500;
      margin-top: 8px;
      margin-right: 8px;
      display: inline-block;
    }
  }
}

.chart-wrap {
  width: 100vw;
  .chart-map {
    width: 100vw;
    height: 260px;
  }
  .chart-list {
    // display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 15px;
    white-space: nowrap;
    overflow: auto;
    .chart-list-item {
      display: inline-block;
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
      }
      .chart-list-item-name {
        font-size: 10px;
        color: #333333;
        text-align: center;
        line-height: 12px;
      }
      .chart-list-item-count {
        margin-top: 2px;
        font-size: 16px;
        color: #333333;
        text-align: center;
        line-height: 22px;
        font-weight: 600;
      }
    }
  }
}

</style>
