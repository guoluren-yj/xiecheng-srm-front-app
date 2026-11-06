<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/back@3x.png" class="image-black-default" >
      </div>
      <div
        slot="center"
        class="header">
        {{ $T('spfm.dashboard.model.supplierTodoWorkflow.task').$D('待办事项') }}
      </div>
      <div slot="right" class="right-button" @click="showPopup">
        <img class="image-black-default" src="@/assets/screen_normal@3x.png" alt >
      </div>
    </hips-nav-bar>
    <searchs
      v-model="searchVal"
      :handle-search="handleSearch"
      :placeholder="$T('hipspfm.workFlow.view.message.inputProcessName').$D('请输入流程名称查询')"/>
    <div class="content">
      <total-count
        :list-len="list.length"
        :count="totalCount"
        :info="$T('spfm.dashboard.model.supplierTodoWorkflow.task').$D('待办事项')"/>
      <div v-if="list.length" class="scrollWrap">
        <hips-scroll
          v-if="list.length"
          ref="scroll"
          :data="[list]"
          :scroll-events="scrollEvents"
          :scroll-options="scrollOption"
          @scroll="onScroll"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in list" :key="index" :class="li.mobileFormUrl?'card':'card cardDisable'" @click.once="toDetail(li)">
            <div>
              <span class="block"/>
              <span class="code">{{ li.processName }}</span>
              <span class="status matain-name">{{ li.processInstanceId }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T('hwfp.task.model.task.creationTime').$D('创建时间') }}:</span>
                <span>{{ li.createTime }}</span>
              </li>
            </ul>
            <li class="foot-li">
              <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}:</span>
              <span>{{ li.startUserName }}({{ li.startUserId }})</span>
            </li>
          </div>
        </hips-scroll>
      </div>
      <!-- 空白页 -->
      <no-content
        v-else-if="list.length===0&&loading"
        img-src="NoOrder@3x.png"
        :refresh="loadRefresh"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T('hipspfm.common.option.chooseDate').$D('创建日期') }}</span>
        </li>
        <div class="dateWrap">
          <span
            class="date-item"
            @click="choseData('date1')">{{ date1 ? date1:this.$T("hipspfm.common.message.startTime").$D("开始日期") }}</span>
          <span>~</span>
          <span
            class="date-item"
            @click="choseData('date2')">{{ date2 ? date2:$T("hipspfm.common.message.endTime").$D("截至日期") }}</span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
          <!-- 日期弹窗 -->
          <date-chooser v-model="datePopup" @submitDate="handleConfirm" />
        </div>
        <li>
          <span>{{ $T('hwfp.common.model.apply.owner').$D('申请人') }}</span>
        </li>
        <div class="supplier" @click="showSupplierPop">
          <span
            v-show="!supplierValue.name"
            class="status-span">{{ $T('hipspfm.workFlow.view.message.selectOwner').$D('请选择申请人') }}</span>
          <div>
            <div v-show="supplierValue.name" class="supplier-item">{{ supplierValue.name }}</div>
          </div>
          <span v-show="supplierValue.companyName" @click.stop="clearSupplier">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
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
      :clear-flag="clearFlag"
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
import { Icon, NavBar, Popup, Scroll, View } from "hips";
import { getTodoListApi } from "../api/index";
import { isEmpty } from "@/utils";

export default {
  modules: [ "smbl.workFlow", "hipspfm.common", "spfm.dashboard", "hipspfm.workFlow", "hwfp.task", "hwfp.common" ],
  name: "MyTodoList",
  components: {
    Lov,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    [View.name]: View,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll
  },
  data() {
    return {
      show: false,
      loading: false,
      supplierLoading: false,
      datePopup: false,
      supplierPopup: false, //供应商弹窗
      orderStatusPopup: false, //送货单状态弹窗
      supplierValue: {}, //供应商选中值
      orderStatusValue: [], //送货单状态选中值
      supplierArr: [], //供应商数据
      searchVal: "",
      date1: "",
      date2: "",
      changeDate: "",
      choseedDate: "",
      list: [],
      totalCount: 0,
      currentPage: 0, //页码
      supplierTotalCount: "",
      supplierParams: {
        page: 0,
        size: 10,
        companyName: "",
        companyNum: "",
        organizationId: window.localStorage.organizationId || ""
      },
      queryParams: {
        createdBefore: null, //创建日期从
        createdAfter: null, //创建日期到
        minimumPriority: null,
        maximumPriority: null
      },
      clearFlag: false, //申请人重置
      scrollEvents: [ "scroll" ], // 增加滚动事件
      tempY: 0, // 上一次的滚动Y值
      slide: false,
      tenantId: window.localStorage.tenantId,
      multipleLanguage: {
        noForm: this.$T("smbl.workFlow.view.form.null").$D("未配置移动端表单页面,无法办理"),
        dataTip: this.$T("hipspfm.common.validation.startIsBefore").$D("开始日期不能大于截止日期"),
      }
    };
  },
  watch: {
    supplierPopup(nVal) {
      if (!nVal) {
        this.clearFlag1 = false;
      }
    }
  },
  async activated() {
    console.log(this.showBackFlag);
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
  mounted() {
  },
  methods: {
    showPopup() {
      this.show = !this.show;
    },
    async toDetail(item) {
      if (isEmpty(item.mobileFormUrl)) {
        this.$notification.open({
          message: this.multipleLanguage.noForm,
          key,
          class: "notification"
        });
        return;
      }
      const taskId = item.id;
      const processInstanceId = item.processInstanceId;

      this.$router.push({
        path: "/MyTodoDetail",
        query: {
          processInstanceId,
          taskId,
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
    //确认供应商
    GetSupplier(val) {
      this.supplierValue = val.length ? val[0] : {};
    },
    //清除供应商的值
    clearSupplier() {
      this.supplierValue = "";
      this.clearFlag = true;
    },
    onScroll({ y }) {
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
          this.$refs.scroll.forceUpdate();
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
        processDefinitionNameLike: this.searchVal ? this.searchVal : null //流程名称
      };

      await getTodoListApi({ ...params, ...this.queryParams }).then((res) => {
        this.$loading.hide();
        this.loading = true;
        this.list = [ ...this.list, ...res.content ];
        this.totalCount = res.totalElements;
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
          message: this.multipleLanguage.dateTip,
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.list = [];
        this.currentPage = 0;
        this.queryParams.createdAfter = this.date1 ?
          `${this.date1} 00:00:00` :
          ""; //创建日期从
        this.queryParams.createdBefore = this.date2 ?
          `${this.date2} 23:59:59` :
          ""; //创建日期到
        this.queryParams.startedUserId = this.supplierValue.employeeNum || null; //申请人号码
        this.fetchData();
        this.show = false;
      }
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.supplierValue = {};
      this.clearFlag = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;

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
  color: var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: 600;
}

.content {
  height: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;

  // .info {
  // line-height: 32px;
  // font-size: 12px;
  // color: var(--color-font-default);
  // text-align: center;
  // background: #F2FCFC;
  // p {
  // color: var(--color-other-default-b) !important;
  // }
  // }
  .scrollWrap {
    height: calc(100vh - 120px);

    .card {
      padding: 16px 0px 13px 20px;
      // margin-top: 8px;
      color: #666666;
      background: var(--color-bg-default);
      border-bottom: 8px solid var(--color-border-default);

      div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 9px;
        margin-bottom: 1px;
        border-bottom: 1px solid var(--color-border-default);
        padding-right: 20px;
        align-items: center;

        // line-height: 26px;
        span {
          font-family: 'PingFangSC-Medium';
          line-height: 24px;
          font-size: 16px;
          color: var(--color-font-default);
        }

        .block {
          width: 6px;
          height: 14px;
          border-radius: 1px;
          background-color: var(--color-other-default-b);
          margin-right: 8px;
        }

        .code {
          font-weight: bold;
          position: absolute;
          left: 34px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 65%;
        }

        span:nth-child(3) {
          color: var(--color-font-default-b);
          font-size: 14px;
          text-align: right;
          font-weight: bold !important;
        }
      }

      ul {
        padding-bottom: 13px;
        border-bottom: 1px solid var(--color-border-default);

        li {
          padding-top: 12px;
          font-size: 14px;
          color: var(--color-font-default);
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
        color: var(--color-font-default);
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
}

.reset {
  border-top: 1px solid var(--color-border-default);
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
    color: var(--color-font-default);
    font-weight: 700;
    margin-top: 28px;

    &:nth-child(1) {
      margin-top: 0;
    }
  }

  .dateWrap, .supplier, .sonhuodan {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border-default);
    font-size: 16px;
    color: var(--color-font-default-b);
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
      color: var(--color-font-default);
    }

    .status-item {
      width: 80%;
      display: flex;
      flex-wrap: wrap;

      .status {
        margin-right: 10px;
        color: var(--color-font-default-e);
        background: #EEFBFA;
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
    border-top: 1px solid var(--color-border-default);
  }

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: var(--color-font-default-b);
    line-height: 56px;
    text-align: center;

    &:nth-child(2) {
      color: var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}
.matain-name{
  max-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
