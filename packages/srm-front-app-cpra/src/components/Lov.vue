<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup
    v-model="value"
    style="height:90%;width:100%;overflow: hidden;"
    position="bottom"
    class="top-boder-radius"
    :overlay-on-click-close="false"
    @click-overlay="closePop">
    <div class="supplier-container">
      <hips-nav-bar v-if="searchFlag" slot="header" :have-border="false" class="supplier-header">
        <transition slot="center" name="bounce">
          <div v-if="slide" class="supplier-center">{{ lovTitle }}</div>
        </transition>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/Receive/icon_screenlist_delete_normal@3x.png" alt >
        </div>
      </hips-nav-bar>
      <div v-show="!slide&&searchFlag" ref="hiddenTitle" class="hidden-title">
        <div ref="lovTitle" class="sub-title">{{ lovTitle?lovTitle:title }}</div>
      </div>
      <!-- 搜索组件 -->
      <div class="supplier-search">
        <div v-show="searchFlag" @click="startSearch">
          <searchs
            v-model="lovParams.searchValue"
            icon-positon="left"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+queryFieldsName[1]+$T('hipspfm.common.message.search').$D('查询')"/>
        </div>
        <div v-show="!searchFlag">
          <searchs
            ref="search"
            v-model="lovParams.searchValue"
            icon-positon="left"
            :right-button="rightButton"
            :handle-search="handleSearch"
            :handle-right-click="handleRightClick"
            :handle-input-change="handleInputChange"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+queryFieldsName[1]+$T('hipspfm.common.message.search').$D('查询')"/>
        </div>
      </div>
      <!-- 列表 -->
      <div class="scroll-wrap">
        <hips-scroll
          v-if="listData.length"
          ref="lovScroll"
          :data="[listData]"
          :scroll-events="scrollEvents"
          :scroll-options="loadMoreFlag?scrollOption:{}"
          @scroll="onScroll"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div class="supplier-list">
            <hips-checkbox-group
              v-model="checkedValue"
              :checkbox-border="false"
              :max="multiple?'Infinity':1">
              <div v-for="(item,index) in listData" :key="index">
                <hips-checkbox :option="{value: item}">
                  <div class="content-info">
                    <i class="lov-content">{{ item[queryFields[1]]|CalcFontLength }}</i>
                    <span
                      v-if="showValue && item[queryFields[0]]"
                      class="supplier-code">({{ item[queryFields[0]] }})</span>
                  </div>
                </hips-checkbox>
                <div class="content-line"/>
              </div>
            </hips-checkbox-group>
          </div>
        </hips-scroll>
        <!-- 空白页 -->
        <no-content
          v-else-if="!listData.length&&!loading"
          :title="'hipspfm.common.message.noScreenResults'"
          img-src="NoResult@3x.png"/>
      </div>

      <!-- 底部确认 -->
      <div class="foot-bottom-btn">
        <span
          class="msg-info">{{ multiple ? $T("hipspfm.common.validation.multiple").$D("该选择为多选") : $T("hipspfm.common.validation.single").$D("该选择为单选") }}</span>
        <span
          class="handler-btn"
          @click="submitValue">{{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}</span>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Scroll, Popup, Checkbox, CheckboxGroup } from "hips";
import { http } from "srm-mobile-ui";
import { queryStr } from "@/utils";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
export default {
  modules: [ "hipspfm.common" ],
  name: "Lov",
  components: {
    Searchs,
    NoContent,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  props: {
    code: {
      type: String,
      default: ""
    },
    clearFlag: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    //是否开启多选
    multiple: {
      type: Boolean,
      default: false
    },
    //是否开启上拉加载/下拉刷新
    loadMoreFlag: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: () => ({})
    },
    //LOV搜索查找字段
    queryField: {
      type: Array,
      default: () => []
    },
    // 是否反转名称和编码顺序
    reverse: {
      type: Boolean,
      default: false
    },
    // 是否需要刷新
    refresh: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      lovTitle: "",
      loading: false,
      listData: [], //LOV接口的值
      TotalCount: 0, //数据总数
      checkedValue: [], //LOV选中的值
      lovSearchUrl: "", //LOV搜索地址
      queryFields:[],
      queryFieldsName: [], //LOV搜索查找字段名
      scrollEvents: [ "scroll", "scroll-end" ],
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      searchFlag: true,
      lovParams: {
        //LOV筛选条件
        page: 0,
        size: 10,
        searchValue: ""
      }
    };
  },
  computed: {
    rightButton() {
      return {
        text: this.$T("hipspfm.common.button.cancle").$D("取消"),
        color: "var(--color-font-default-b)"
      };
    },
  },
  watch: {
    clearFlag(nVal) {
      if (nVal) {
        this.checkedValue = [];
      }
    },
    queryField(val) {
      this.queryFields = this.queryField;
    },
    value(val) {
      if (this.refresh) {
        this.loadRefresh();
      }
    }
  },
  async mounted() {
    console.log("mounted");
    const lovInfo = await this.getLovInfo();
    if (this.reverse) {
      lovInfo.queryFields = lovInfo.queryFields.reverse();
    }
    this.lovTitle = this.$T(this.title).$D(this.title) || lovInfo.title;
    this.lovSearchUrl = lovInfo.queryUrl.replace(
      /\{organizationId\}/g,
      window.localStorage.organizationId
    );
    if (this.queryFields.length == 0) {
      let a = lovInfo.queryFields.map((item) => item.field);
      this.queryFields = lovInfo.queryFields.map((item) => item.field);
      this.queryFieldsName = lovInfo.queryFields.map((item) => item.label);
    } else {
      // 存在queryFields，则取queryFields对应的label名称去搜索
      this.queryFieldsName = []; // 防止张数据
      lovInfo.queryFields.map((item) => {
        if (this.queryFields.includes(item.field)) {
          this.queryFieldsName.push(item.label);
        }
      });
    }
    this.fetchData();
  },
  activated() {
    if (this.refresh) {
      this.loadRefresh();
    }
  },
  methods: {
    // 获取Lov配置信息
    getLovInfo() {
      const url = `hpfm/v1/${window.localStorage.organizationId}/lov-view/info?viewCode=${this.code}`;
      return http.get(url);
    },
    // 获取Lov数据信息
    getLovList({ page, size, searchValue }) {
      const joinSymbol = this.lovSearchUrl.includes("?") ? "&" : "?";
      const url = `${this.lovSearchUrl}${joinSymbol}page=${page}&size=10&${
        this.queryFields[1]
      }=${searchValue}&${queryStr(this.queryParams)}`;
      return http.get(url);
    },
    //搜索供应商
    handleSearch() {
      this.lovParams.page = 0;
      this.listData = [];
      this.fetchDataB();
    },
    //监听供应商改变
    handleInputChange(val) {
      if (this.lovParams.searchValue.length && val) {
        this.handleSearch();
      }
    },
    //确认选择值
    submitValue() {
      this.$emit("input", false);
      this.$emit("submitValue", this.checkedValue);
    },
    // 获取Lov数据
    fetchData() {
      this.loading = true;
      this.$loading.show();
      this.getLovList(this.lovParams).then(
        ({ content = [], totalElements = 0 } = {}) => {
          this.loading = false;
          this.listData = [ ...this.listData, ...content ];
          this.TotalCount = totalElements;
        }
      ).finally(() => {
        this.$loading.hide();
      });
    },
    fetchDataB() {
      this.loading = true;
      this.$loading.show();
      this.getLovList(this.lovParams).then(
        ({ content = [], totalElements = 0 } = {}) => {
          this.loading = false;
          this.$loading.hide();
          this.listData = content;
          this.TotalCount = totalElements;
        }
      );
    },
    // LOV下拉刷新
    async loadRefresh() {
      this.listData = [];
      this.lovParams.page = 0;
      await this.fetchData();
      this.slide = false;
    },
    //LOV上拉加载
    async loadMore() {
      if (this.listData.length < this.TotalCount) {
        this.lovParams.page++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.lovScroll.forceUpdate();
        });
      }
    },
    onScroll({ x, y }) {
      if (y < 0) {
        this.$refs.lovTitle.style.top = 100 / 667 * y + "vh";
      } else {
        this.$refs.lovTitle.style.top = "0vh";
      }
      this.$refs.hiddenTitle.style.height = 100 / 667 * (38 + y) + "vh";
      if (38 + y <= 0) {
        this.slide = true;
      } else {
        this.slide = false;
      }
    },
    closePop() {
      this.$emit("input", false);
    },
    startSearch() {
      this.searchFlag = false;
      this.listData = [];
      setTimeout(() => {
        this.$refs.search.$el.querySelector("input").focus();
      });
    },
    handleRightClick() {
      this.searchFlag = true;
      this.lovParams.searchValue = "";
      this.loadRefresh();
    }
  }
};
</script>

<style lang="stylus" scoped>
.supplier-container {
  position: relative;
  height: 100%;

  .supplier-header {
    height: 48px;

    .supplier-center {
      font-size: 18px;
      line-height: 26px;
      color: var(--color-font-default);
      font-weight: bold;
      height: 44px;
      padding: 10px 0 9px 0;
    }

    .cancel {
      color: var(--color-font-default-b);
      margin-right: 22.8px;
    }
  }

  .supplier-search {
    margin-top: 6px;
  }

  >>> .hips-group {
    width: 395px !important;
  }

  .scroll-wrap {
    // padding-bottom: 50px;
    height: calc(100% - 26vw);

    .supplier-list {
      margin-top: 8px;
      font-size: 0px;

      .content-info {
        width: 90%;
        // border-bottom:1px solid var(--color-border-default);
        // padding-bottom: 13px;
      }

      .lov-content {
        font-size: 16px;
        color: var(--color-font-default);
      }

      .supplier-code {
        font-size: 16px;
        color: var(--color-font-default-b);
        margin-left: 5px;
      }

      .content-line {
        height: 1px;
        overflow: hidden;
        background: var(--color-bg-default-b);
        margin-left: 53px;
      }
    }
  }

  >>> .hips-cell {
    padding: 10px 20px;
    height: 53px;
  }

  .hips-checkbox__checked--active + .content-info {
    .lov-content, .supplier-code {
      color: var(--color-other-default-b) !important;
    }
  }

  .content-info {
  }

  .hidden-title {
    overflow-y: hidden;
    max-height: 40px;

    .sub-title {
      position: relative;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 20px;
      font-weight: bold;
      font-size: 24px;
      color: var(--color-font-default);
      margin-bottom: 8px;
    }
  }

  .msg-info {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: var(--color-font-default-e);
    letter-spacing: 0;
    line-height: 24px;
    border-right: none;
    padding-left: 20px;
    text-align: left;
    height: auto;
  }

  .handler-btn {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0;
    padding-right: 20px;
    text-align: right;
  }
}
</style>
