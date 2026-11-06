<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div
        slot="center"
        class="header">
        {{ $T('hipspfm.workFlow.view.message.title.myWorkFlow').$D('我的工作流') }}
      </div>
      <div slot="right" class="right-button" @click="showPopup">
        <img class="image-black-default" src="@/assets/screen_normal@3x.png" alt >
      </div>
    </hips-nav-bar>
    <searchs
      v-model="searchVal"
      :handle-search="handleSearch"
      :placeholder="$T('hipspfm.workFlow.view.message.inputProcessName').$D('请输入流程名称查询')"/>
    <hips-tabs
      v-if="multipleLanguage.tabList.length"
      v-model="active"
      class="tab-title"
      color="var(--color-other-default-b)"
      @click="checkTab">
      <hips-tab v-for="(item,index) in multipleLanguage.tabList" :key="index" :title="item">
        <div class="content">
          <total-count
            :list-len="list.length"
            :count="totalCount"
            :info="$T('spfm.dashboard.model.supplierTodoWorkflow.task').$D('待办事项')"/>
          <div v-if="list.length" class="scrollWrap">
            <hips-scroll
              :ref="scrollArr[index]"
              :data="[list]"
              :scroll-events="scrollEvents"
              :scroll-options="scrollOption"
              @scroll="onScroll"
              @pulling-down="loadRefresh"
              @pulling-up="loadMore">
              <div v-for="(li,index) in list" :key="index" :class="li.mobileFormUrl?'card':'card cardDisable'" @click.once="toDetail(li)">
                <div>
                  <span v-if="active===2&&!li.readFlag" class="circle"/>
                  <span v-else class="block"/>
                  <span class="code">
                    {{ li.processName|CalcFontLength }}
                    <span
                      v-if="li.endTime===null&&li.suspended===false"
                      class="side green">{{ $T('hipspfm.workFlow.view.message.processing').$D('运行中') }}</span>
                    <span
                      v-else-if="li.suspended===true"
                      class="side yellow">{{ $T('hipspfm.workFlow.view.message.suspended').$D('挂起中') }}</span>
                    <span
                      v-else
                      class="side gray">{{ $T('hipspfm.workFlow.view.message.over').$D('已结束') }}</span>
                  </span>
                  <span class="status matain-name">{{ li.id }}</span>
                </div>
                <ul>
                  <li>
                    <span>{{ $T('hwfp.task.model.task.creationTime').$D('创建时间') }}:</span>
                    <span>{{ li.startTime }}</span>
                  </li>
                </ul>
                <li class="foot-li">
                  <span>{{ $T('hwfp.common.view.message.handler').$D('当前处理人') }}:</span>
                  <span>{{ li.currentApprover }}</span>
                </li>
              </div>
            </hips-scroll>
          </div>
          <!-- 空白页 -->
          <no-content
            v-else-if="list.length===0&&loading"
            :refresh="loadRefresh"
            img-src="NoOrder@3x.png"/>
        </div>
      </hips-tab>
    </hips-tabs>

    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T('hzero.common.date.creationDate').$D('创建日期') }}</span>
        </li>
        <div class="dateWrap">
          <span
            class="date-item"
            @click="choseData('date1')">{{ date1 ? date1:this.$T("hipspfm.common.message.startTime").$D("开始日期") }}</span>
          <span>~</span>
          <span
            class="date-item"
            @click="choseData('date2')">{{ date2 ? date2:this.$T("hipspfm.common.message.endTime").$D("截至日期") }}</span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
          <!-- 日期弹窗 -->
          <date-chooser v-model="datePopup" @submitDate="handleConfirm" />
        </div>
        <li v-if="active">
          <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}</span>
        </li>
        <div v-if="active" class="supplier" @click="showSupplierPop">
          <span
            v-show="!supplierValue.name"
            class="status-span">{{ $T('hipspfm.workFlow.view.message.selectOwner').$D('请选择申请人') }}</span>
          <div>
            <div v-show="supplierValue.name" class="supplier-item">{{ supplierValue.name }}</div>
          </div>
          <span v-show="supplierValue.name" @click.stop="clearSupplier">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
        <li>
          <span>{{ $T('hipspfm.workFlow.view.message.processState').$D('流程状态') }}</span>
        </li>
        <div class="order-status" @click="showOrderSatusPop">
          <span
            v-show="!orderStatusValue.length"
            class="status-span">{{ $T('hipspfm.workFlow.view.message.selectProcessState').$D('请选择流程状态') }}</span>
          <div v-show="orderStatusValue.length" class="status-item">
            <span v-for="(item,index) in orderStatusValue" :key="index" class="status">
              {{ JSON.parse(item).meaning }}
              <span class="delete" @click.stop="deleteStatus(index)">
                <img
                  style="height:12px;width:12px"
                  class="image-gray-default"
                  src="@/assets/icon_screenlist_delete_normal@3x.png"
                  alt>
              </span>
            </span>
          </div>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
          <!-- 状态弹窗 -->
          <select-order-status
            v-model="orderStatusPopup"
            :title="$T('hipspfm.workFlow.view.message.processState').$D('流程状态')"
            :status-arr="statusArr"
            :multiple="true"
            :clear-flag="clearFlag2"
            @GetOrderStatus="GetOrderStatus"/>
        </div>
        <li v-if="active == 2">
          <span>{{ $T("hipspfm.workFlow.view.message.readFlagTrue").$D("仅查询未读抄送") }}</span>
          <span>
            <srm-switch v-model="unRead" :disabled="!!orderStatusValue.length"/>
          </span>
        </li>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T('hipspfm.common.button.complete').$D('完成') }}</span>
      </div>
    </hips-popup>
    <!-- 申请人弹窗 -->
    <lov
      v-model="supplierPopup"
      code="HPFM.EMPLOYEE"
      :title="$T('hipspfm.workFlow.view.message.selectEmployee').$D('选择员工')"
      :clear-flag="clearFlag1"
      :query-params="{tenantId,lovCode:'HPFM.EMPLOYEE'}"
      @submitValue="GetSupplier"/>
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import Searchs from "@/components/Searchs";
import NoContent from "@/components/NoContent";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import SelectOrderStatus from "@/components/SelectOrderStatus";
import { NavBar, Popup, Scroll, Switch, Tab, Tabs, View } from "hips";
import { getWorkFlowListApi, getWorkFlowStatusApi, } from "../api/index";
import { isEmpty } from "../../../utils";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "spfm.dashboard", "hwfp.task", "hwfp.common", "hzero.common", "smbl.workFlow" ],
  name: "MyWorkFlowList",
  components: {
    Lov,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    SelectOrderStatus,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [View.name]: View,
    [Popup.name]: Popup,
    [Switch.name]: Switch,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll
  },
  data() {
    return {
      show: false, //筛选弹窗状态
      loading: false,
      supplierLoading: false,
      datePopup: false,
      supplierPopup: false, //供应商弹窗
      orderStatusPopup: false, //送货单状态弹窗
      supplierValue: {}, //供应商选中值
      orderStatusValue: [], //送货单状态选中值
      active: 0,
      scrollArr: [ "scrollA", "scrollB", "scrollC" ],
      unRead: true,
      searchVal: "",
      date1: "",
      date2: "",
      statusArr: [], // 状态值集
      changeDate: "",
      choseedDate: "",
      list: [],
      totalCount: 0,
      currentPage: 0, //页码
      queryParams: {
        startedAfter: null, //创建日期从
        startedBefore: null, //创建日期至
        finished: null,
        suspended: null,
        startUserName: null
      },
      clearFlag1: false, //申请人重置
      clearFlag2: false, //状态重置
      scrollEvents: [ "scroll" ], // 增加滚动事件
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      currentScroll: "scrollA",
      tenantId: window.localStorage.tenantId,
      multipleLanguage: {
        tabList: [
          this.$T("hipspfm.workFlow.view.message.initiate").$D("发起"),
          this.$T("hipspfm.workFlow.view.message.participate").$D("参与"),
          this.$T("hipspfm.workFlow.view.message.copy").$D("抄送")
        ],
        message: { noForm: this.$T("smbl.workFlow.view.form.null").$D("未配置移动端表单页面,无法办理") },
      },
      processStatusList: [], //流程状态
    };
  },
  computed:{
  },
  watch: {
    supplierPopup(nVal) {
      if (!nVal) {
        this.clearFlag1 = false;
      }
    }
  },
  mounted() {},
  async activated() {
    try {
      this.$loading.show();
      this.list = [];
      this.currentPage = 0;
      await this.fetchData();
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    showPopup() {
      this.show = !this.show;
    },
    async toDetail(item) {
      if (isEmpty(item.mobileFormUrl)) {
        this.$notification.open({
          message: this.multipleLanguage.message.noForm,
          key,
          class: "notification"
        });
        return;
      }
      let processType;
      // eslint-disable-next-line default-case
      switch (this.active) {
      case 0:
        processType = "startedBy";
        break;
      case 1:
        processType = "involved";
        break;
      case 2:
        processType = "carbonCopy";
        break;
      }
      this.$router.push({
        path: "/MyWorkDetail",
        query: {
          processType,
          processInstanceId: item.id,
        }
      });
    },
    // 退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //切换Tab
    checkTab(index) {
      this.active = index;
      this.currentPage = 0;
      this.list = [];
      this.fetchData();
      this.currentScroll = this.scrollArr[index];
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.fetchData();
    },
    //申请人弹窗显示或隐藏
    showSupplierPop() {
      this.supplierPopup = !this.supplierPopup;
    },
    //状态弹窗显示或隐藏
    showOrderSatusPop() {
      this.orderStatusPopup = !this.orderStatusPopup;
      if (this.orderStatusPopup === true && !this.statusArr.length) {
        this.getWorkFlowStatus();
      }
    },
    //确认订单状态
    GetOrderStatus(val) {
      this.orderStatusValue = val;
    },
    //确认供应商
    GetSupplier(val) {
      this.supplierValue = val.length ? val[0] : {};
    },
    //清除申请人的值
    clearSupplier() {
      this.supplierValue = "";
      this.clearFlag1 = true;
      console.log(111, this.clearFlag1);
    },
    //删除某项状态
    deleteStatus(index) {
      this.orderStatusValue.splice(index, 1);
    },
    // eslint-disable-next-line no-unused-vars
    onScroll({ x, y }) {
      if (y < 0) {
        if (y > this.tempY) {
          this.slide = false;
        } else {
          this.slide = true;
        }
        this.tempY = y;
      }
    },
    // 加载刷新数据
    async loadRefresh() {
      this.list = [];
      this.currentPage = 0;
      await this.fetchData();
    },
    // 加载更多数据
    async loadMore() {
      if (this.list.length < this.totalCount) {
        this.currentPage++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs[this.currentScroll][0].forceUpdate();
        });
      }
    },
    // 请求数据
    async fetchData() {
      this.loading = false;
      this.$loading.show();
      const params = {
        page: this.currentPage,
        size: 10,
        processDefinitionNameLike: this.searchVal //流程名称
      };
      if (this.processStatusList.length) {
        params.processStatusList = this.processStatusList;
      }
      let name = "startedBy";
      if (this.active === 1) {
        name = "involved";
        this.queryParams.readFlag = null;
      } else if (this.active === 2) {
        name = "carbonCopy";
        this.queryParams.readFlag = this.unRead ? 0 : 1;
      } else {
        name = "startedBy";
        this.queryParams.readFlag = null;
      }
      await getWorkFlowListApi({ ...params, ...this.queryParams }, name).then(
        ({ content = [], totalElements = 0 } = res) => {
          this.$loading.hide();
          this.loading = true;
          this.list = [ ...this.list, ...content ];
          this.totalCount = totalElements;
        }
      );
    },
    // 获取流程状态
    async getWorkFlowStatus() {
      this.$loading.show();
      await getWorkFlowStatusApi().then((res) => {
        this.statusArr = res;
        this.$loading.hide();
      });
    },
    //选择时间
    handleConfirm(value) {
      this[this.changeDate] = value;
      this.datePopup = false;
    },
    //选择日期
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },
    // 完成按钮搜索
    submit() {
      if (this.date1 && this.date2 && this.date1 > this.date2) {
        this.$notification.open({
          message: this.$T("hipspfm.common.validation.startIsBefore").$D(
            "开始日期不能大于截止日期"
          ),
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.list = [];
        this.currentPage = 0;
        // let statusMeaning =
        //   this.orderStatusValue.length > 0
        //     ? JSON.parse(this.orderStatusValue[0]).meaning
        //     : null;
        // console.log(13,this.orderStatusValue, statusMeaning);
        this.processStatusList = this.orderStatusValue.map((item) => JSON.parse(item).value);
        console.log(this.processStatusList, "processStatusList");
        // if (
        //   statusMeaning ===
        //   this.$T("hipspfm.workFlow.view.message.processing").$D("运行中")
        // ) {
        //   this.queryParams.finished = false;
        //   this.queryParams.suspended = null;
        // } else if (
        //   statusMeaning ===
        //   this.$T("hipspfm.workFlow.view.message.suspended").$D("挂起中")
        // ) {
        //   this.queryParams.finished = false;
        //   this.queryParams.suspended = true;
        // } else if (
        //   statusMeaning ===
        //   this.$T("hipspfm.workFlow.view.message.over").$D("已结束")
        // ) {
        //   this.queryParams.finished = true;
        //   this.queryParams.suspended = null;
        // } else {
        //   this.queryParams.finished = null;
        //   this.queryParams.suspended = null;
        // }
        this.queryParams.startedAfter = this.date1 ?
          `${this.date1} 00:00:00` :
          ""; //创建日期从
        this.queryParams.startedBefore = this.date2 ?
          `${this.date2} 23:59:59` :
          ""; //创建日期至
        this.queryParams.startUserName = this.supplierValue.employeeNum;
        this.fetchData();
        this.show = false;
      }
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.unRead = true;
      this.supplierValue = {};
      this.orderStatusValue = [];
      this.processStatusList = [];
      this.clearFlag1 = true;
      this.clearFlag2 = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;

>>> .hips-ellipsis {
  font-size: 16px;
}

>>> .hips-tab__panel {
  padding: 0;
}

>>> .hips-tab {
  color:var(--color-font-default-b);
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: 600;
}

.content {
  height: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;

  .scrollWrap {
    height: calc(100vh - 173px);

    .card {
      padding: 16px 0px 13px 20px;
      // margin-top: 8px;
      color: #666666;
      background:var(--color-bg-default);
      border-bottom: 8px solid var(--color-border-default);

      div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 9px;
        margin-bottom: 1px;
        border-bottom:1px solid var(--color-border-default);
        padding-right: 20px;
        align-items: center;

        span {
          font-family: 'PingFangSC-Medium';
          line-height: 24px;
          font-size: 16px;
          color:var(--color-font-default);
        }

        .block {
          width: 6px;
          height: 14px;
          border-radius: 1px;
          background-color: var(--color-other-default-b);
          margin-right: 8px;
        }

        .circle {
          height: 8px;
          width: 8px;
          background: var(--color-other-default);
          border-radius: 50%;
        }

        .code {
          font-weight: bold;
          position: absolute;
          left: 34px;

          .side {
            border-radius: 2px;
            margin-left: 8px;
            font-size: 10px;
            padding: 4px;
            line-height: 18px;
            width: 30px;
            height: 18px;
          }

          .green {
            background:var(--color-bg-default-c);
            color: var(--color-other-default-b);
          }

          .gray {
            background:var(--color-bg-default-b);
            color:var(--color-font-default-c);
          }

          .yellow {
            background:var(--color-bg-default-g);
            color: var(--color-other-default-c);
          }
        }

        span:nth-child(3) {
          color:var(--color-font-default-b);
          font-size: 14px;
          text-align: right;
          font-weight: bold !important;
        }
      }

      ul {
        padding-bottom: 13px;
        border-bottom:1px solid var(--color-border-default);

        li {
          padding-top: 12px;
          font-size: 14px;
          color:var(--color-font-default);
          padding-right: 20px;
          line-height: 22px;
          font-family: 'PingFangSC-Regular';

          span:nth-child(odd) {
            text-align: left;
          }

          span:nth-child(even) {
            margin-left: 12px;
            text-align: right;
          }
        }
      }

      .foot-li {
        font-family: 'PingFangSC-Medium';
        color:var(--color-font-default);
        font-size: 14px;
        font-weight: bold;
        line-height: 22px;
        padding-top: 11px;

        span:nth-child(even) {
          margin-left: 12px;
          text-align: right;
        }
      }
    }

    .cardDisable{
      background : var(--color-bg-default-b);
      ul{
        border-bottom: 1px solid var(--color-bg-default-b);
      }
      div{
        border-bottom: 1px solid var(--color-bg-default-b);
      }
    }

    .card:last-child {
      border-bottom: 0;
    }
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

.reset {
  border-top:1px solid var(--color-border-default);
}

.filterWrap {
  >>> .hips-switch__input:checked {
    background: var(--color-other-default-b);
  }

  padding: 16px 20px 32px 20px;
  font-size: 16px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // line-height: 26px;
    font-size: 18px;
    color:var(--color-font-default);
    font-weight: 700;
    margin-top: 28px;

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  .dateWrap, .supplier, .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid var(--color-border-default);
    font-size: 16px;
    color:var(--color-font-default-b);
    // line-height: 34px;
    padding: 8px 0px 7px 0px;
    font-family: PingFangSC-Regular;

    .status-span {
      line-height: 24px;
    }

    .date-item {
      width: 27vw;
      text-align: left;
      margin-top: 4px;
    }

    .supplier-item {
      width: 265px;
      color:var(--color-font-default);
    }

    .status-item {
      width: 80%;
      display: flex;
      flex-wrap: wrap;

      .status {
        margin-right: 10px;
        color: var(--color-other-default-b);
        background: #eefbfa;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        padding: 0px 5px 5px 12px;
      }

      .delete {
        display: inline-block;
        margin-left: 4px;
        height: 12px;
        width: 12px;
        color: var(--color-font-default-e);
        position: relative;
        top: 1.5px;
      }
    }
  }
}

.handlerWrap {
  display: flex;

  .clear {
    border-top:1px solid var(--color-border-default);
  }

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;

    &:nth-child(2) {
      color:var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}
.matain-name{
  max-width: 20vw;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
