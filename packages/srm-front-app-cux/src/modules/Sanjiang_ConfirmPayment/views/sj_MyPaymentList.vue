<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("smbl.receiptConfirm.view.receiptConfirm").$D("货款确认") }}
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
          v-model="searchVal"
          class="search-view"
          :handle-search="handleSearch"
          :placeholder="$T('smbl.receiptConfirm.view.searchPlaceholder').$D('请输入商品查询')"/>
        <div v-if="!choseConfirmPopup" class="button-back">
          <img
            class="img-edit"
            src="@/assets/4.0/icon_Searchbar_editor_default@3x.png"
            alt
            @click="showEditPop">
        </div>
        <div v-else class="cancelEdit">
          <span class="cancel-button" @click="showEditPop">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        </div>
      </div>
      <div class="tab-content">
        <div v-for="(tabItem, index) in tabTitles" :key="index" class="tab">
          <div class="tab-title"
               :class="{ 'tab-title-selected' : index === selectedTabIndex }"
               @click="clickTabTitleAt(index)">
            {{ tabItem }}
          </div>
          <div v-if="index === selectedTabIndex" class="tab-line"/>
        </div>
      </div>
      <TotalCount
        :list-len="list.length"
        :count="totalCount"
        :item="$T('smbl.receiptConfirm.view.countUnit').$D('条')"
        :info="$T('smbl.receiptConfirm.view.itemName').$D('付款信息')"/>
      <div v-if="list.length" class="scrollWrap">
        <hips-scroll
          v-if="!choseConfirmPopup" ref="scroll" :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div
            v-for="(li,index) in list"
            :key="index"
            class="card">
            <h3>
              <span class="code">
                <span class="block"/>
                {{ li.itemName }}
              </span>
              <span class="status"
                    :class="{'status-gray': li.status === 'CONFIRMED' || li.status === 'RECEIVED'}">
                {{ li.statusMeaning }}
              </span>
            </h3>
            <ul>
              <li>
                <span>{{ $T("smbl.receiptConfirm.model.commission").$D("代办") }}：</span>
                <span>{{ li.agencyUserName }}</span>
              </li>
              <li>
                <span>{{ $T("smbl.receiptConfirm.model.deliveredPrice").$D("交付价格") }}：</span>
                <span>{{ li.deliverPrice.toFixed(2) }}</span>
              </li>
              <li>
                <span>{{ $T("smbl.receiptConfirm.model.quantityDelivered").$D("交付数量") }}：</span>
                <span>{{ li.deliverQuantity }}</span>
              </li>
              <li>
                <span>{{ $T("smbl.receiptConfirm.model.createDate").$D("创建时间") }}：</span>
                <span>{{ li.creationDate }}</span>
              </li>
              <li v-if="isComfirmDateShow">
                <span>{{ $T("smbl.receiptConfirm.model.confirmDate").$D("确认时间") }}：</span>
                <span>{{ li.confirmTime }}</span>
              </li>
              <li>
                <span>{{ $T("smbl.receiptConfirm.model.totalMoney").$D("总金额") }}：{{ li.deliverAmount.toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll>
        <!-- 可选择列表 -->
        <hips-scroll v-if="choseConfirmPopup" ref="scroll" :data="[list]">
          <div class="checkWrap" style="padding-bottom: 13.333vw">
            <hips-checkbox-group v-model="comfirmOrderList" :checkbox-border="false">
              <hips-checkbox v-for="(li,index) in list" :key="index" :option="{value: li}">
                <div class="card cards">
                  <h3>
                    <span class="code">
                      <span class="block"/>
                      {{ li.itemName }}
                    </span>
                  </h3>
                  <ul>
                    <li>
                      <span>{{ $T("smbl.receiptConfirm.model.commission").$D("代办") }}：</span>
                      <span>{{ li.agencyUserName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("smbl.receiptConfirm.model.deliveredPrice").$D("交付价格") }}：</span>
                      <span>{{ li.deliverPrice.toFixed(2) }}</span>
                    </li>
                    <li>
                      <span>{{ $T("smbl.receiptConfirm.model.quantityDelivered").$D("交付数量") }}：</span>
                      <span>{{ li.deliverQuantity }}</span>
                    </li>
                    <li>
                      <span>{{ $T("smbl.receiptConfirm.model.createDate").$D("创建时间") }}：</span>
                      <span>{{ li.creationDate }}</span>
                    </li>
                    <li v-if="isComfirmDateShow">
                      <span>{{ $T("smbl.receiptConfirm.model.confirmDate").$D("确认时间") }}：</span>
                      <span>{{ li.confirmTime }}</span>
                    </li>
                    <li>
                      <span>{{ $T("smbl.receiptConfirm.model.totalMoney").$D("总金额") }}：{{ li.deliverAmount.toFixed(2) }}</span>
                    </li>
                  </ul>
                </div>
              </hips-checkbox>
            </hips-checkbox-group>
          </div>
        </hips-scroll>
        <!-- 可选择列表结束 -->
      </div>
      <!-- 空白页 -->
      <NoContent
        v-else-if="list.length===0&&!loading"
        :title="$T('smbl.receiptConfirm.view.noReceipt').$D('暂无单据信息')"
        :refresh="loadRefresh"
        :refresh-tilte="$T('hipspfm.common.message.clickRefresh').$D('点击刷新')"
        img-src="NoOrder@3x.png"
        class="empty-view"/>
    </div>
    <!-- 全选弹窗 -->
    <div v-show="choseConfirmPopup" class="confirmWrap">
      <div class="editModal">
        <hips-checkbox v-model="checkAllFlag" :border="false" :disabled="!list.length">
          <span style="fontSize: 16px;">{{ $T('hipspfm.common.message.selectAll').$D('全选') }}</span>
        </hips-checkbox>
        <div>
          <div v-if="this.comfirmOrderList.length">
            <span
              @click.stop="confirmPaymentList">{{ $T('hipspfm.common.button.confirm').$D('确认') }}</span>
          </div>
          <div v-else>
            <span
              style="background:var(--color-bg-default-f);">{{ $T('hipspfm.common.button.confirm').$D('确认') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 全选弹窗结束 -->
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  NavBar,
  Scroll,
  Checkbox,
  CheckboxGroup
} from "hips";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import { getMyPaymentList, confirmPaymentsApi } from "../api/index";
export default {
  modules: [ "smbl.receiptConfirm","hipspfm.common" ],
  name: "OrderConfirmationList",
  components: {
    Searchs,
    NoContent,
    TotalCount,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  data() {
    return {
      loading: false,
      checkAllFlag: false, //全选标志
      choseConfirmPopup: false, //全选编辑弹窗
      comfirmOrderList: [], //选中列表
      searchVal: "",
      list: [],
      totalCount: 0,
      currentPage: 0, //页码
      tabTitles: [ "待收款", "已收款" ],
      selectedTabIndex: 0, // 选中的tab
    };
  },
  computed: {
    isComfirmDateShow() {
      return this.selectedTabIndex === 1;
    }
  },
  watch: {
    checkAllFlag(value) {
      if (value) {
        this.comfirmOrderList = [ ...this.list ];
      } else if (this.comfirmOrderList.length === this.list.length && !value) {
        this.comfirmOrderList = [];
      }
    },
    comfirmOrderList(value) {
      if (value.length === this.list.length && value.length) {
        this.checkAllFlag = true;
      } else {
        this.checkAllFlag = false;
      }
    }
  },
  async activated() {
    try {
      this.$loading.show();
      // 刷新tabTitle
      this.tabTitles = [
        this.$T("smbl.receiptConfirm.view.waitReceive").$D("待收款"),
        this.$T("smbl.receiptConfirm.view.received").$D("已收款")
      ];
      // 清理缓存数据
      this.list = [];
      this.currentPage = 0;
      await this.getPaymentConfirmationList();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 显示编辑弹窗
    showEditPop() {
      if (this.selectedTabIndex === 1) {
        this.$notification.open({
          message: "当前页面无需确认！",
          description: "",
          key,
          class: "notification"
        });
        return;
      }
      this.choseConfirmPopup = !this.choseConfirmPopup;
      if (!this.choseConfirmPopup) {
        this.checkAllFlag = false;
        this.comfirmOrderList = [];
      }
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.getPaymentConfirmationList();
    },
    //监听输入改变
    handleInputChange() {
      if (!this.searchVal.length) {
        this.getPaymentConfirmationList();
      }
    },
    // 确认收款
    confirmPaymentList() {
      // 请求接口
      confirmPaymentsApi(this.comfirmOrderList).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            key,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: "货款确认成功",
            description: "",
            key,
            class: "notification"
          });
          this.checkAllFlag = false;
          this.choseConfirmPopup = false;
          this.comfirmOrderList = [];
          this.list = [];
          this.currentPage = 0;
          this.getPaymentConfirmationList();
        }
      });
    },
    // 加载刷新数据
    async loadRefresh() {
      this.list = [];
      this.currentPage = 0;
      await this.getPaymentConfirmationList();
    },
    // 加载更多数据
    async loadMore() {
      if (this.list.length < this.totalCount) {
        this.currentPage++;
        await this.getPaymentConfirmationList();
      } else {
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate();
        });
      }
    },
    // 请求数据
    async getPaymentConfirmationList() {
      const params = {
        size: 10,
        page: this.currentPage,
        supplierTenantId: window.localStorage.supplierTenantId,
        itemName: this.searchVal,
        status: this.selectedTabIndex === 1 ? "RECEIVED" : "WAIT_RECEIVED"
      };

      this.loading = true;
      this.$loading.show();
      await getMyPaymentList(params).then(
        ({ content = [], totalElements } = {}) => {
          this.$loading.hide();
          this.loading = false;
          this.list = [ ...this.list, ...content ];
          this.totalCount = totalElements;
        });
    },
    clickTabTitleAt(index) {
      if (this.selectedTabIndex === index) {
        // 点击已选择不处理
        return;
      }
      if (this.choseConfirmPopup) {
        // 正在编辑/选择
        this.showEditPop();
      }
      this.selectedTabIndex = index;
      this.list = [];
      this.currentPage = 0;
      this.getPaymentConfirmationList();
    }
  }
};
</script>

<style lang="stylus" scoped>
  $color-blue = #6699FF;

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
    }
  }

  .tab-content {
    width: 100%;
    height: 44px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .tab {
      font-size: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .tab-title {
      line-height: 42px;
      font-size: 16px;
      color: var(--color-font-default-b);
    }
    .tab-title-selected {
      font-weight: bold;
      color: #1B1E2B;
    }
    .tab-line {
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: var(--color-other-default-b);
    }
  }

  >>> .hips-cell {
    line-height: 4.4vw !important;
  }

  .header {
    font-size: 18px;
    color: var(--color-font-default);
    line-height: 26px;
    font-weight: bold;
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
  >>> .hips-view__content {
    width: 100%;
    height: 100%;
  }

  .content {
    width: 100%;
    height: calc(100% - 44px);
    overflow: auto;
    font-family: PingFangSC-Regular;
    font-size: 14px;

    .search-line {
      width: 100%;
      margin: 4px 0px;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;

      .img-edit {
        height: 18.8px;
        width: 18.8px;
        margin-right: 20px;
      }

      .search-view {
        width: calc(100% - 40px);
        flex-shrink: 1;
      }

      >>> .hips-search {
        width: 100%;
      }

      .button-back {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
      }
      .cancel-button {
        display: block;
        width: 40px;
        text-align: left;
      }
    }

    .scrollWrap {
      height: calc(100% - 120px);
      font-size: 14px;

      >>> .hips-checkbox__checked {
        position: absolute !important;
        top: 14px !important;
        left: 20px !important;
      }

      >>> .hips-cell {
        padding: 0 !important;
      }

      .checkWrap {
        height: 100%;
        overflow: auto;

        .card {
          border-bottom: 0;
        }
      }

      .card {
        padding-left: 20px;
        background: var(--color-bg-default);
        border-bottom: 8px solid var(--color-border-default);
        line-height: 22px;

        h3 {
          display: flex;
          justify-content: space-between;
          padding: 15px 20px 11px 0px;
          border-bottom: 1px solid var(--color-border-default);

          .block {
            display: inline-block;
            height: 14px;
            width: 6px;
            background: var(--color-other-default-b);
            margin-right: 8px;
          }

          .code {
            font-size: 16px;
            color: var(--color-font-default);
            font-weight: bold;
          }

          .urgent {
            border-radius: 2px;
            margin-left: 8px;
            font-size: 10px;
            padding: 1px 10px;
            line-height: 18px;
            width: 30px;
            height: 18px;
            color: var(--color-other-default);
            background: var(--color-bg-default-e);
          }

          .status {
            text-align: right;
            font-weight: 700;
            color: var(--color-other-default-b);
            flex-shrink: 0;
          }

          .status-gray {
            color: var(--color-font-default-b);
          }

          .yellow {
            color: var(--color-other-default-c);
          }

          .green {
            color: var(--color-other-default-b);
          }

          .red {
            color: var(--color-other-default);
          }
        }

        li {
          color: var(--color-font-default);
          font-family: PingFangSC-Regular;
          padding-top: 12px;

          &:nth-child(1) {
            padding-top: 13px;
          }

          &:last-child {
            display: flex;
            justify-content: space-between;
            margin-top: 13px;
            padding: 12px 20px 12px 0px;
            color: var(--color-font-default);
            font-weight: bold;
            border-top: 1px solid var(--color-border-default);

            span:nth-child(even) {
              text-align: right;
              font-size: 10px;
              color:var(--color-font-default-g);
              line-height: 18px;
              background: rgba(253, 75, 75, 0.1);
              border-radius: 2px;
              padding: 2px 8px;
              font-weight: normal;
            }
          }
        }
      }

      .cards {
        margin: 0;
        padding-left: 20px;
        width: 100%;

        h3 {
          padding-left: 32px;
        }
      }

      >>> .hips-group {
        border-bottom: 8px solid var(--color-border-default) !important;
      }

      >>> .hips-group:last-child {
        // border-bottom: 0 !important;
      }
    }
    .empty-view {
      height: calc(100% - 120px);
    }

    .noContent {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 120px);

      div {
        img {
          width: 300px;
          height: 300px;
        }

        p {
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: var(--color-font-default-e);
          letter-spacing: 0;
        }
      }
    }
  }

  .confirmWrap {
    line-height: 44px;
    height: calc(44px + constant(safe-area-inset-bottom));
    height: calc(44px + env(safe-area-inset-bottom));
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
      font-weight: bold;
      box-shadow: 0 -1px 2px 0 rgba(27, 30, 43, 0.1);

      >>> .hips-group {
        padding-left: 5.2px;
      }

      div {
        flex: 1;
        justify-content: space-between;

        &:nth-child(2) {
          text-align: right;
          padding-right: 20px;

          span {
            display: inline-block;
            // width: 64px;
            line-height: 34px;
            background: var(--color-other-default-b);
            border-radius: 2px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: var(--color-font-default-d);
            text-align: center;
            padding: 0 6px;
          }
        }
      }
    }
  }

  >>> .bscroll-indicator {
    display: none !important;
  }
</style>
