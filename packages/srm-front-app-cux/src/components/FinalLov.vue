<template>
  <hips-popup
    v-model="value"
    style="height:90%;width:100%;overflow: hidden;"
    position="bottom"
    class="top-boder-radius"
    :overlay-on-click-close="false"
    @click-overlay="closePop">
    <div class="supplier-container">
      <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
        <transition slot="center" name="bounce">
          <div v-if="slide" class="supplier-center">{{ lovTitle }}</div>
        </transition>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
        </div>
      </hips-nav-bar>
      <div v-show="!slide" ref="hiddenTitle" class="hidden-title">
        <div ref="lovTitle" class="sub-title">{{ lovTitle }}</div>
      </div>
      <!-- 搜索组件 -->
      <div v-if="queryField && queryFieldName" class="supplier-search">
        <div v-if="searchFlag" @click="startSearch">
          <searchs
            v-model="lovParams.searchValue"
            icon-positon="left"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+ this.queryFieldName +$T('hipspfm.common.message.search').$D('查询')"/>
        </div>
        <div v-else>
          <searchs
            ref="search"
            v-model="lovParams.searchValue"
            icon-positon="left"
            :right-button="rightButton"
            :handle-search="handleSearch"
            :handle-right-click="handleRightClick"
            :handle-input-change="handleInputChange"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入') + this.queryFieldName + $T('hipspfm.common.message.search').$D('查询')"/>
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
                    <i class="lov-content">{{ `${item[mDisplayField]}(${item[mValueField]})` }}</i>
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
  modules: ["hipspfm.common","smbl.common"],
  name: "FinalLov",
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
    type: {
      type: String,
      default: "lov"
    },
    displayField: {
      type: String,
      default: null
    },
    valueField: {
      type: String,
      default: null
    },
    queryField: {
      type: String,
      default: null
    },
    queryParams: {
      type: Object,
      default: () => ({})
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
    // 是否需要刷新
    refresh: {
      type: Boolean,
      default: false
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
      scrollEvents: [ "scroll", "scroll-end" ],
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      queryFieldName: null,
      lovParams: {
        //LOV筛选条件
        page: 0,
        size: 10,
        searchValue: ""
      },
      lovInfo: {},
      mDisplayField: null,
      mValueField: null,
      searchFlag: true
    };
  },
  computed: {
    rightButton() {
      return {
        text: this.$T("hipspfm.common.button.cancle").$D("取消"),
        color:"var(--color-font-default-b)"
      };
    },
  },
  watch: {
    clearFlag(nVal) {
      if (nVal) {
        this.checkedValue = [];
      }
    },
    value(val) {
      if (val) {
        this.init();
      }
    }
  },
  mounted() {
    if (this.value) {
      this.init();
    }
  },
  methods: {
    async init() {
      if (this.type === "lov") {
        this.$loading.show();
        this.lovInfo = await this.getLovInfo();
        this.$loading.hide();
        this.lovTitle = this.title || this.lovInfo.title;
        this.lovSearchUrl = this.lovInfo.queryUrl.replace(
          /\{organizationId\}/g,
          window.localStorage.tenantId
        );
        const queryFields = this.lovInfo.queryFields.filter((e) => e.field === this.queryField);
        if (queryFields.length > 0) {
          this.queryFieldName = queryFields[0].label;
        }
        this.mDisplayField = this.displayField || this.lovInfo.displayField;
        this.mValueField = this.valueField || this.lovInfo.valueField;
        console.log(this.mValueField);
        console.log(this.mDisplayField);
      } else {
        this.lovSearchUrl = `/hpfm/v1/lovs/data?lovCode=${this.code}`;
        this.mDisplayField = "meaning";
        this.mValueField = "value";
        this.lovTitle = this.title || this.$T("smbl.common.tab.pleaseSelect").$D("请选择");
      }
      this.loadRefresh();
    },
    // 获取Lov配置信息
    getLovInfo() {
      const url = `hpfm/v1/${window.localStorage.organizationId}/lov-view/info?viewCode=${this.code}`;
      return http.get(url);
    },
    // 获取Lov数据信息
    getLovList({ page, size = 10, searchValue }) {
      const joinSymbol = this.lovSearchUrl.includes("?") ? "&" : "?";
      let url = `${this.lovSearchUrl}${joinSymbol}page=${page}&size=${size}&${queryStr(this.queryParams)}`;
      if (this.queryField) {
        url += `&${this.queryField}=${searchValue}`;
      }
      return http.get(url);
    },
    //搜索
    handleSearch() {
      this.lovParams.page = 0;
      this.listData = [];
      this.fetchData();
    },
    //监听搜索框改变
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
        (res = {}) => {
          let content = [], totalElements = 0;
          if (res.totalElements) {
            content = res.content;
            totalElements = res.totalElements;
          } else if (res.length) {
            content = res;
            totalElements = res.length;
          }
          this.loading = false;
          this.listData = [ ...this.listData, ...content ];
          this.TotalCount = totalElements;
        }
      ).finally(() => {
        this.$loading.hide();
      });
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
    onScroll({ y }) {
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
      color:var(--color-font-default);
      font-weight: bold;
      height: 44px;
      padding: 10px 0 9px 0;
    }

    .cancel {
      color:var(--color-font-default-b);
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
        color:var(--color-font-default);
      }

      .supplier-code {
        font-size: 16px;
        color:var(--color-font-default-b);
        margin-left: 5px;
      }

      .content-line {
        height: 1px;
        overflow: hidden;
        background:var(--color-bg-default-b);
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
      color:var(--color-font-default);
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
