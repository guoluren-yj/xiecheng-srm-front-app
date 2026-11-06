<template>
  <div id="wide-area" style="height: 100vh">
    <nav-head :title="$T('smbl.wideArea.view.message.title').$D('广域寻源')" @goBack="goBack" />
    <srm-list :data-set="getDateSet"
              :columns="getColumns"
              @itemClick="goToDetail">
      <srm-flex slot="filter" class="srm-list-search-line">
        <srm-search
          v-model="queryParameter"
          :field="fastQueryField"
          :placeholder="$T('smbl.wideArea.view.productName').$D('商品名称')"
          @focus="onFocus"
          @clear="onClear"
          @search="onSearch"/>
        <div style="max-width: 25%">
          <em class="srm-icon icon-filter srm-list-icon-search" @click="showFilterPopup" />
        </div>
      </srm-flex>
    </srm-list>
    <srm-filter v-model="showFilterPopupFlag" :data-set="getDateSet" />
    <div v-show="showKeywordResult || loading" id="search-result" v-loading="loading" class="search-result">
      <touch-feedback v-for="(item, index) in keywordResult" :key="index" active-class-name="tab-item-active">
        <div class="search-result-item noWrap" @click="handlerClick(item.sp_name_search)" v-text="item.sp_name_search" />
      </touch-feedback>
      <div v-show="!loading && !keywordResult.length" class="no-data">{{ $T('smbl.wideArea.view.title.noData').$D('暂无数据') }}</div>
    </div>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";

import { getSupplierGoodApi, getBatchDataApi } from "../api/index";

export default {
  modules: [ "smbl.wideArea", "smbl.common" ],
  name: "WideAreaSourceList",
  components: {
  },
  data() {
    return {
      loading: false,
      showFilterPopupFlag: false,
      keywordResult: [],
      showKeywordResult: false,
      dataSet: new DataSet(indexDS(this, {})),
      batchData: {},
      searchFlag: true,
      fastQueryField: {
        fieldCode: "keyword",
        fieldType: "TEXT",
      },
      queryParameter: {
        // eslint-disable-next-line rulesdir/check_modules
        customerName: "上海甄云信息技术有限公司",
        keyword: "",
      },
    };
  },
  computed: {
    getDateSet() {
      return this.dataSet;
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.xsfmc}</span>
          </SrmListHeader>
        },
        {
          formRow: 1,
          fieldName: this.$T("smbl.wideArea.modal.operatingIndexScore").$D("经营指数评分"),
          fieldCode: "final_score",
        },
        {
          formRow: 1,
          fieldName: this.$T("smbl.wideArea.modal.scoreStar").$D("评分星级"),
          fieldCode: "final_score",
          render: (text) => {
            const sum = parseFloat(text || 0);
            const count = sum <= 550 ? 1 : sum <= 650 && sum > 550 ? 2 : 3;
            return <srm-score achieved-score={count} style-type="star" number={count}/>;
          }
        },
        {
          formRow: 2,
          fieldName: this.$T("smbl.wideArea.modal.localArea").$D("所在地区"),
          fieldCode: "province_code",
          render: (val) => this.handleGetArea(val)
        },
        {
          formRow: 2,
          fieldName: this.$T("smbl.wideArea.modal.registeredCapitalWithUnit").$D("注册资本"),
          fieldCode: "regist_capi",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.creationDate").$D("成立日期"),
          fieldCode: "start_date",
        },
      ];
    },
  },
  mounted () {
    this.getBatchData();
    document.getElementById("wide-area").addEventListener("click", this.handler, false);
  },
  destroyed() {
    document.getElementById("wide-area").removeEventListener("click", this.handler);
  },
  methods: {
    goToDetail(item = {}) {
      const {
        data: {
          xsfnsrsbh: taxNo,
          xsfmc: corpName
        }
      } = item;
      this.$router.push({
        name: "WideAreaSourceDetail",
        query: { taxNo, corpName }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    // 点击搜索结果
    handlerClick(item) {
      const reg = new RegExp("<span style=\"color:red\">|</span>", "g");
      const text = item.replace(reg, "");
      this.searchFlag = false;
      this.queryParameter.keyword = text;
      this.dataSet.addBodyParameter("searchName", text);
      this.dataSet.refresh();
      this.showKeywordResult = false;
    },
    // 显示筛选
    showFilterPopup() {
      this.showFilterPopupFlag = !this.showFilterPopupFlag;
    },
    // 输入框清空事件
    onClear() {
      this.dataSet.addBodyParameter("searchName", "");
      this.dataSet.refresh();
    },
    // 输入框聚焦
    onFocus() {
      this.searchFlag = true;
    },
    // 输入框搜索
    onSearch() {
      if (this.queryParameter.keyword && this.searchFlag) {
        this.getSupplierGood();
      } else {
        this.keywordResult = [];
      }
    },
    handler(e) {
      const dom = document.getElementById("search-result");
      if (!dom.contains(e.target)) {
        this.showKeywordResult = false;
      }
    },
    // 获取供因商数据
    getSupplierGood() {
      const params = {
        limit: 13,
        ...this.queryParameter,
      };
      this.loading = true;
      getSupplierGoodApi(params).then((res) => {
        const { data = [] } = res;
        this.keywordResult = Object.freeze(data);
        this.showKeywordResult = true;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取下拉数据
    getBatchData() {
      getBatchDataApi().then((result) => {
        this.batchData = result || {};
        this.dataSet = new DataSet(indexDS(this, result));
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
  },
};
</script>

<style lang="stylus" scoped>

@import "~srm-mobile-ui/src/style/var.styl"

.srm-list-icon-search {
  font-size: 24px;
  margin-left: 16px;
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

</style>
