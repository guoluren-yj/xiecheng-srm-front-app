<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sslm.riskMonitoring.view.message.title.fullMonitoring").$D("全量监控企业管理") }}
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
      <div class="tab-box">
        <span v-for="(tab,index) in tabArray"
              :key="index"
              :class="activeTabIndex === index ? 'tab-item-active' : 'tab-item'"
              @click="onTabChange(tab, index)">
          {{ tab.monitorGroupName }}
        </span>
      </div>
      <div class="search-line">
        <searchs
          v-model="params.companyName"
          :handle-search="handleSearch"
          :handle-input-change="handleSearch"
          :placeholder="$T('sslm.riskMonitoring.view.please.write.comany.name').$D('请输入企业名称查询')"/>
        <div style="margin: 10px;display: flex">
          <img
            class="img-edit"
            src="@/assets/4.0/icon_Searchbar_editor_default@3x.png"
            alt
            @click="showEditPop">
          <img
            class="img-filter"
            src="@/assets/4.0/icon_Searchbar_filter_default@3x.png"
            alt
            @click="showPopup">
        </div>
      </div>
      <total-count :list-len="monitorList.length" :count="totalCount" :info="$T('sslm.riskMonitoring.view.comany.info').$D('企业信息')"/>
      <div v-if="monitorList.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          v-if="!editFlag"
          ref="scroll"
          :data="[monitorList]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in monitorList" :key="index" class="card">
            <ul>
              <li class="code">
                <span>{{ li.companyNum || ' ' }}</span>
                <span class="monitor-btn" @click="monitorBtnClick(li)">{{ $T("sslm.riskMonitoring.model.riskMonitoring.dynamicRiskMonitoring").$D("风险动态监控") }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.companyName").$D("企业名称") }}：{{ li.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.unifiedSocialCode").$D("统一社会信用代码") }}：{{ li.unifiedSocialCode }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.monitorGroupName").$D("所属组别") }}：{{ li.monitorGroupName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.sourceCode").$D("是否ERP") }}：{{ li.sourceCodeMeaning }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll>
        <!-- 可选择列表 -->
        <hips-scroll v-else ref="scroll" :data="[monitorList]">
          <div class="checkWrap" style="padding-bottom: 20vw">
            <hips-checkbox-group v-model="selectedList" :checkbox-border="false">
              <hips-checkbox v-for="(li,index) in monitorList" :key="index" :option="{value: li}">
                <div class="card" style="width: 100%;">
                  <ul style="padding-left: 40px">
                    <li class="code">
                      <span>{{ li.companyNum }}</span>
                      <!--                      <span>风险动态监控</span> -->
                    </li>
                    <li>
                      <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.companyName").$D("企业名称") }}：{{ li.companyName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.unifiedSocialCode").$D("统一社会信用代码") }}：{{ li.unifiedSocialCode }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.monitorGroupName").$D("所属组别") }}：{{ li.monitorGroupName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.sourceCode").$D("是否ERP") }}：{{ li.sourceCodeMeaning }}</span>
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
      <no-content
        v-else-if="monitorList.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="showSearchPopup" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.companyNum").$D("企业编码") }}</span>
        </li>
        <div class="supplier">
          <hips-input
            v-model="params.companyNum"
            :placeholder="$T('sslm.riskMonitoring.view.write.riskMonitoring.companyNum').$D('请输入企业编码')"
            type="text"/>
        </div>

        <li>
          <span>{{ $T("sslm.riskMonitoring.model.riskMonitoring.sourceCode").$D("是否ERP") }}</span>
        </li>
        <div class="supplier" @click="showIsErpSelect = true">
          <span v-show="!params.sourceCode">{{ $T("sslm.riskMonitoring.view.choose.riskMonitoring.sourceCode").$D("请选择是否ERP") }}</span>
          <div>
            <div v-show="params.sourceCode" class="supplier-item">
              {{ params.sourceCodeMeaning }}
            </div>
          </div>
          <span v-show="params.sourceCode" @click.stop="clearSourceCode">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt>
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt>
          </span>
        </div>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
    <!-- 选择企业弹窗 -->
    <select-company-monitor v-model="showSelectCompany" refresh @submitCompany="submitCompany"/>
    <!-- 选择分组弹窗 -->
    <select-group-monitor v-model="showSelectGroup" refresh @submitGroup="submitGroup" @go-pre="goPre"/>
    <iframe-popup v-model="showIframePopup" :title="$T('sslm.riskMonitoring.title.riskMonitoring.look').$D('风险监控查看')" :src="monitorUrl"/>
    <!-- LOV弹窗 -->
    <final-lov
      v-model="showIsErpSelect"
      refresh
      code="HPFM.FLAG"
      type="select"
      :query-params="{
        tenantId
      }"
      @submitValue="setIsErp"/>
    <bottom-handler v-if="editFlag" id="btn-edit" :btn-arr="btnArrEdit"/>
    <bottom-handler v-else id="btn" :btn-arr="btnArr"/>
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  Input,
  NavBar,
  Scroll,
  Checkbox,
  CheckboxGroup
} from "hips";
// import Lov from "@/components/Lov";
// import DateTip from "@/components/DateTip";
// import SelectCompany from "@/components/SelectCompany";
// import DateChooser from "@/components/DateChooser";
// import SelectOrderStatus from "@/components/SelectOrderStatus";
import NoContent from "@/components/NoContent";
import Searchs from "@/components/New/Searchs";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import BottomHandler from "@/components/BottomHandler";
import {
  getMonitorGroupPermission,
  getMonitorListApi,
  createMonitorApi,
  cancelMonitor,
  queryMonitor,
  queryAllMonitor
} from "../api/index";
import FinalLov from "../components/FinalLov";
import SelectCompanyMonitor from "../components/SelectCompanyMonitor";
import SelectGroupMonitor from "../components/SelectGroupMonitor";
import IframePopup from "../components/IframePopup";
import { $T } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "smbl.common", "sslm.riskMonitoring", "hzero.common" ],
  name: "MonitorList",
  components: {
    IframePopup,
    SelectGroupMonitor,
    SelectCompanyMonitor,
    // SelectCompany,
    // Lov,
    // DateTip,
    // SelectOrderStatus,
    // DateChooser,
    FinalLov,
    Searchs,
    NoContent,
    TotalCount,
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  data() {
    return {
      showSearchPopup: false, //筛选弹窗
      finishLoad: false,
      datePop: false, //日期弹窗
      checkAllFlag: false, //全选标志
      LovPop: false, //Lov弹窗
      LovTitle: "",
      LovCode: "",
      LovType: "",
      LovParams: {},
      editFlag: false, //全选编辑弹窗
      monitorList: [], //列表数据
      selectedList: [],
      totalCount: 0,
      currentPage: 0, //页码
      height: "height: calc(100vh - 226px)",
      noHeadHeight: "height: calc(100vh - 182px)",
      showLovValue: true,
      params: {
        page: 0,
        size: 10
      },
      showIsErpSelect: false,
      tenantId: window.localStorage.getItem("tenantId"),
      tabArray: [ { monitorGroupName:$T("sslm.riskMonitoring.view.message.allGroup").$D("全部") } ],
      activeTabIndex: 0,
      showSelectCompany: false,
      showSelectGroup: false,
      monitorUrl: null,
      showIframePopup: false,
      createParams: {
        isPlatformEnterprise: 1,
        companyNameList: [],
        supplierDTO: [],
        resultGroup: [],
      },
      multipleLanguage: {
        backBtn: this.$T("smbl.common.button.back").$D("返回"),
        cancelBtn: this.$T("sslm.riskMonitoring.view.option.cancelMonitoring").$D("取消监控"),
        createBtn: this.$T("sslm.riskMonitoring.button.create.riskMonitoring").$D("新建监控企业"),
        viewBtn: this.$T("sslm.riskMonitoring.button.look.riskMonitoring").$D("查看风险分析"),
        cancelTip: this.$T("sslm.riskMonitoring.view.message.confirm.cancelMonitor").$D("取消后，将在次月释放监控额度，确认取消吗？"),
      }
    };
  },
  computed: {
    btnArrEdit: function () {
      return [ {
        title: this.multipleLanguage.backBtn,
        color: "var(--color-other-default-b)",
        background: "var(--color-bg-default)",
        handler: () => {
          this.editFlag = false;
        }
      },
      {
        title: this.multipleLanguage.cancelBtn,
        color: "var(--color-other-default-b)",
        background: "var(--color-bg-default)",
        handler: () => {
          if (!this.selectedList.length) {
            return;
          }
          const that = this;
          // eslint-disable-next-line rulesdir/no_hips
          this.$hips.dialog.confirm({
            content: this.multipleLanguage.cancelTip,
            okText: this.$T("hipspfm.common.button.ok").$D("确定"),
            cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
            closable: false,
            onOk() {
              that.cancelMonitor();
            },
            onCancel() {
              return false;
            }
          });
        }
      }, ];
    },
    btnArr: function () {
      return [
        {
          title: this.multipleLanguage.createBtn,
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.showSelectCompany = true;
          }
        },
        {
          title: this.multipleLanguage.viewBtn,
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.monitorBatchBtnClick();
          }
        }
      ];
    },
  },
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      this.monitorList = [];
      await this.fetchData();
      this.finishLoad = true;
      this.$forceUpdate();
      this.$loading.hide();
      getMonitorGroupPermission().then((res) => {
        if (res && res.length) {
          this.tabArray.push.apply(this.tabArray, res);
        }
      });
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      // eslint-disable-next-line no-console
      console.log(err, "error");
    }
  },
  methods: {
    monitorBtnClick(item) {
      this.$loading.show();
      queryMonitor(item.companyName).then((res) => {
        if (res && res.monitorUrl) {
          this.monitorUrl = res.monitorUrl;
          this.showIframePopup = true;
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    monitorBatchBtnClick() {
      this.$loading.show();
      queryAllMonitor().then((res) => {
        if (res && res.monitorUrl) {
          this.monitorUrl = res.monitorUrl;
          this.showIframePopup = true;
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    submitGroup(val) {
      this.createParams.resultGroup = val;
      this.$loading.show();
      createMonitorApi(this.createParams).then(() => {
        this.loadRefresh();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    submitCompany(val, index) {
      if (index) {
        this.createParams.isPlatformEnterprise = 0;
        this.createParams.companyNameList = val;
      } else {
        this.createParams.isPlatformEnterprise = 1;
        this.createParams.supplierDTO = val;
      }
      this.showSelectGroup = true;
    },
    goPre() {
      this.showSelectCompany = true;
    },
    cancelMonitor() {
      this.$loading.show();
      cancelMonitor(this.selectedList).then(() => {
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification"
        });
        this.loadRefresh();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    onTabChange(tab, index) {
      this.params.monitorGroupId = tab.monitorGroupId;
      this.loadRefresh();
      this.activeTabIndex = index;
    },
    clearSourceCode() {
      this.params.sourceCode = null;
      this.$forceUpdate();
    },
    setIsErp(val) {
      if (val && val.length) {
        this.params.sourceCode = val[0].value;
        this.params.sourceCodeMeaning = val[0].meaning;
      }
    },
    clearDate() {
      this.startDate = null;
      this.endDate = null;
    },
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
    // 显示/隐藏筛选弹窗
    showPopup() {
      this.showSearchPopup = !this.showSearchPopup;
    },
    // 显示编辑弹窗
    showEditPop() {
      this.editFlag = !this.editFlag;
    },
    // 搜索框搜索
    handleSearch() {
      if (this.finishLoad) {
        this.monitorList = [];
        this.currentPage = 0;
        this.fetchData();
      }
    },
    // 加载刷新数据
    async loadRefresh() {
      this.monitorList = [];
      this.currentPage = 0;
      await this.fetchData();
    },
    // 加载更多数据
    async loadMore() {
      if (this.monitorList.length < this.totalCount) {
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
      await getMonitorListApi(this.params).then((res) => {
        if (res && res.content) {
          this.totalCount = res.totalElements;
          this.monitorList.push.apply(this.monitorList, res.content);
        } else {
          this.monitorList = [];
          this.originList = [];
        }
      }).finally(() => {
        this.finishLoad = true;
        this.$loading.hide();
      });
    },
    //选择时间
    handleConfirm(value) {
      this.choseedDate = value;
      this.startDate = value[0];
      this.endDate = value[value.length - 1];
      this.datePop = false;
    },
    // 完成按钮搜索
    submit() {
      this.showSearchPopup = false;
      this.loadRefresh();
    },
    // 重置
    handleReset() {
      this.params = { page: 0, size: 10 };
    }
  }
};
</script>

<style lang="stylus" scoped>

.tab-box {
  padding: 15px 20px;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling:touch;

  .tab-item {
    margin-right: 15px;
    color: #1B1E2B
  }

  .tab-item-active {
    margin-right: 15px;
    color: #3473FF
  }
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

          &:nth-child(2) span {
            line-height: 22px;
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
          .monitor-btn {
            color: var(--color-other-default-b);
            border: 1px solid var(--color-other-default-b);
            border-radius: 4px;
            padding: 5px;
          }
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
