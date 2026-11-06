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
        <div slot="center" class="supplier-center">
          <span>{{ $T('sslm.riskMonitoring.view.message.title.selectGroup').$D("选择分组") }}</span>
        </div>
        <div slot="right" class="cancel" @click="$emit('input',false)">
          <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
        </div>
      </hips-nav-bar>
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
              v-model="checkedValue"
              :checkbox-border="false"
              :max="'Infinity'">
              <div v-for="(item,index) in listData" :key="index">
                <hips-checkbox :option="{value: item}">
                  <div class="content-info">
                    <i class="lov-content">{{ `${item.monitorGroupName}` }}</i>
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
          class="handler-btn-left"
          @click="goPre">{{ $T("sslm.riskMonitoring.view.option.lastStep").$D("上一步") }}</span>
        <span
          class="handler-btn"
          @click="submitValue">{{ $T("hzero.common.button.confirm").$D("确认") }}</span>
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
  modules: [ "sslm.riskMonitoring", "hipspfm.common", "hzero.common" ],
  name: "SelectGroupMonitor",
  components: {
    // eslint-disable-next-line vue/no-unused-components
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
      loading: false,
      listData: [], //接口的值
      TotalCount: 0, //数据总数
      checkedValue: [], //LOV选中的值
      lovSearchUrl: "", //LOV搜索地址
      scrollEvents: [ "scroll", "scroll-end" ],
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      queryParams: {
        //LOV筛选条件
        page: 0,
        size: 10,
      },
      searchFlag: true,
    };
  },
  computed: {
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
    //搜索
    handleSearch() {
      this.queryParams.page = 0;
      this.listData = [];
      this.fetchData();
    },
    //监听搜索框改变
    handleInputChange(val) {
      if (val) {
        this.handleSearch();
      }
    },
    goPre() {
      this.$emit("input", false);
      this.$emit("go-pre");
    },
    //确认选择值
    submitValue() {
      if (this.checkedValue.length) {
        const that = this;
        // eslint-disable-next-line rulesdir/no_hips
        this.$hips.dialog.confirm({
          content: this.$T("sslm.riskMonitoring.view.confirm.join").$D("加入监控将会扣除监控额度，是否确认加入？"),
          okText: this.$T("hipspfm.common.button.ok").$D("确定"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          onOk() {
            that.$emit("input", false);
            that.$emit("submitGroup", that.checkedValue.map((e) => e.monitorGroupId));
          },
          onCancel() {
            return false;
          }
        });
      } else {
        this.$notification.open({
          message: this.$T("sslm.riskMonitoring.view.message.selectGroup.explain").$D("请为您的供应商选择分组（至少选择一个）："),
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
      getMonitorGroup().then((res) => {
        this.loading = false;
        this.listData = [ ...this.listData, ...res ];
      }
      ).finally(() => {
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

  .handler-btn-left {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0;
    padding-left: 20px;
    text-align: left;
  }
}
</style>
