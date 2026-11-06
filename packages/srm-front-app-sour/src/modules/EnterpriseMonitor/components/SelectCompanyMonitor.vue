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
      <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
        <div slot="left" class="supplier-center">
          <span :class="activeTab === 0 ? 'tab-item-active' : 'tab-item'" @click="activeTab = 0">{{
            $T('sslm.riskMonitoring.model.riskMonitoring.platformBusiness').$D("已合作平台企业")
          }}</span>
          <span :class="activeTab === 1 ? 'tab-item-active' : 'tab-item'" @click="activeTab = 1">{{
            $T('sslm.riskMonitoring.model.riskMonitoring.notPlatformBusiness').$D("非平台企业")
          }}</span>
        </div>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
        </div>
      </hips-nav-bar>
      <!-- 搜索组件 -->
      <div v-if="activeTab === 0" class="supplier-search">
        <div v-if="searchFlag" @click="startSearch">
          <searchs
            v-model="queryParams.companyName"
            icon-positon="left"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入')+ queryFieldName +$T('hipspfm.common.message.search').$D('查询')"/>
        </div>
        <div v-else>
          <searchs
            ref="search"
            v-model="queryParams.companyName"
            icon-positon="left"
            :right-button="rightButton"
            :handle-search="handleSearch"
            :handle-right-click="handleRightClick"
            :handle-input-change="handleInputChange"
            :placeholder="$T('hipspfm.common.message.pleaseEnter').$D('请输入') + queryFieldName + $T('hipspfm.common.message.search').$D('查询')"/>
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
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div class="supplier-list">
            <hips-checkbox-group
              v-if="activeTab === 0"
              v-model="checkedValue"
              :checkbox-border="false"
              :max="'Infinity'">
              <div v-for="(item,index) in listData" :key="index">
                <hips-checkbox :option="{value: item}">
                  <div class="content-info">
                    <i class="lov-content">{{ `${item[mDisplayField]}(${item[mValueField]})` }}</i>
                  </div>
                </hips-checkbox>
                <div class="content-line"/>
              </div>
            </hips-checkbox-group>
            <div v-for="(item,index) in noPlatformCompany" v-else :key="index">
              <div class="content-info">
                <hips-input
                  v-model="item.companyName"
                  :placeholder="$T('sslm.riskMonitoring.view.write.companyName').$D('请输入企业名称')"
                  type="text">
                  <div slot="right" class="right-delete" @click="removeCompany(index)">
                    <img src="@/assets/icon_editor_deleted_focused@3x.png" alt>
                  </div>
                </hips-input>
              </div>
              <div class="content-line"/>
            </div>
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
          v-if="activeTab"
          class="msg-info"
          @click="handleAdd">{{ $T('sslm.riskMonitoring.button.add').$D("新增") }}</span>
        <span
          class="handler-btn"
          @click="submitValue">{{ $T('sslm.riskMonitoring.view.option.nextStep').$D("下一步") }}</span>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Scroll, Popup, Checkbox, CheckboxGroup, Input } from "hips";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
// eslint-disable-next-line no-unused-vars
import { getMonitorSupplier, getMonitorGroup, validPartnerCompanyNameIsExists } from "../api";

export default {
  modules: [ "sslm.riskMonitoring", "hipspfm.common" ],
  name: "SelectCompanyMonitor",
  components: {
    Searchs,
    NoContent,
    [Input.name]: Input,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  props: {
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
      lovTitle: this.$T("sslm.riskMonitoring.view.message.title.selectSupplier").$D("选择企业"),
      loading: false,
      listData: [], //接口的值
      TotalCount: 0, //数据总数
      checkedValue: [], //LOV选中的值
      lovSearchUrl: "", //LOV搜索地址
      scrollEvents: [ "scroll", "scroll-end" ],
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      queryFieldName: this.$T("sslm.riskMonitoring.model.company").$D("公司名称"),
      queryParams: {
        //LOV筛选条件
        page: 0,
        size: 10,
      },
      mDisplayField: "companyName",
      mValueField: "companyNum",
      searchFlag: true,
      activeTab: 0,
      noPlatformCompany: []
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
    value(val) {
      if (!val) {
        this.checkedValue = [];
      }
    }
  },
  mounted() {
    this.loadRefresh();
  },
  methods: {
    removeCompany(index) {
      this.noPlatformCompany.splice(index, 1);
    },
    handleAdd() {
      this.noPlatformCompany.push({});
    },
    //搜索
    handleSearch() {
      if (!this.loading) {
        this.queryParams.page = 0;
        this.listData = [];
        this.fetchData();
      }
    },
    //监听搜索框改变
    handleInputChange() {
      if (!this.loading) {
        this.checkedValue = [];
        this.handleSearch();
      }
    },
    //确认选择值
    submitValue() {
      if (this.activeTab === 0) {
        if (this.checkedValue.length) {
          this.$emit("input", false);
          this.$emit("submitCompany", this.checkedValue.map((e) => e.companyId), this.activeTab);
        } else {
          this.$notification.open({
            message: this.$T("sslm.riskMonitoring.message.choose.least.one.siteCompany").$D("请至少选择一个平台企业"),
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
        }
      } else if (this.noPlatformCompany.length) {
        const companyNameList = [];
        this.noPlatformCompany.forEach((e) => {
          companyNameList.push(e.companyName);
        });
        this.$loading.show();
        validPartnerCompanyNameIsExists(companyNameList).then(() => {
          this.$emit("input", false);
          this.$emit("submitCompany", companyNameList, this.activeTab);
        }).finally(() => {
          this.$loading.hide();
        });
      } else {
        this.$notification.open({
          message: this.$T("sslm.riskMonitoring.message.choose.least.one.unSiteCompany").$D("请至少新增一个非平台企业"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification"
        });
      }
    },
    // 获取Lov数据
    fetchData() {
      this.loading = true;
      this.$loading.show();
      getMonitorSupplier(this.queryParams).then(
        (res = {}) => {
          let content = [], totalElements = 0;
          if (res.totalElements) {
            content = res.content;
            totalElements = res.totalElements;
          } else if (res.length) {
            content = res;
            totalElements = res.length;
          }
          this.listData = [ ...this.listData, ...content ];
          this.TotalCount = totalElements;
        }
      ).finally(() => {
        this.loading = false;
        this.$loading.hide();
      });
    },
    // LOV下拉刷新
    async loadRefresh() {
      if (this.activeTab === 1) {
        return;
      }
      this.listData = [];
      this.queryParams.page = 0;
      await this.fetchData();
      this.slide = false;
    },
    //LOV上拉加载
    async loadMore() {
      if (this.listData.length < this.TotalCount) {
        this.queryParams.page++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.lovScroll.forceUpdate();
        });
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
      this.queryParams.companyName = null;
      this.loadRefresh();
    }
  }
};
</script>

<style lang="stylus" scoped>

.right-delete {
  display: flex;
  align-items: center;

  img {
    width: 30px;
    height: 30px;
  }
}

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
      padding: 10px 0 9px 15px;

      span {
        margin-right: 20px;
      }
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
        width: 100%;
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
        margin-left: 20px;
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
    color: var(--color-other-default-b);
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

.tab-item {
  color #82879e;
}

.tab-item-active {
  color #3473FF;
}
</style>
