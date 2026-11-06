<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets//BudgetAllocation/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sbud.budgeting.title.budget.allot").$D("预算调拨") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets//BudgetAllocation/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets//BudgetAllocation/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="search-line">
        <Searchs
          v-model="searchVal"
          :handle-search="handleSearch"
          :placeholder="$T('sbud.budgeting.view.please.enter.budget.number.search').$D('请输入预算调拨单号查询')"/>
        <div v-if="!choseConfirmPopup">
          <img
            class="img-edit"
            src="@/assets//BudgetAllocation/icon_Searchbar_editor_default@3x.png"
            alt
            @click="showEditPop">
          <img
            class="img-filter"
            src="@/assets//BudgetAllocation/icon_Searchbar_filter_default@3x.png"
            alt
            @click="showPopup">
        </div>
        <div v-else class="cancelEdit">
          <span @click="showEditPop">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        </div>
      </div>
      <hips-tabs
        v-if="tabList.length"
        v-model="active"
        class="tab-title"
        color="var(--color-other-default-b)"
        @click="checkTab">
        <hips-tab v-for="(item,index) in tabList" :key="index" :title="item"/>
      </hips-tabs>
      <TotalCount :list-len="list.length" :count="totalCount" :info="'单据信息'" />
      <div v-if="list.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          v-if="!choseConfirmPopup"
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in list" :key="index" class="card">
            <ul @click.stop="toDetail('update',li)">
              <li class="code">
                <span>{{ li.adjustNum }}</span>
                <span>{{ li.adjustStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.view.get.reason").$D("借调原因") }}：{{ li.adjustReason==='WLFBZ'?$T("sbud.budgeting.view.item.free.not.enough").$D("物料费不足"):$T("sbud.budgeting.view.other").$D("其他") }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.view.req.allot.dept").$D("申请调拨部门") }}：{{ li.toUnitName }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.view.allot.money").$D("借调金额") }}：{{ Number(li.adjustAmount).toFixed(2) }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.view.borrow.dept").$D("借用部门") }}：{{ li.fromUnitName }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.model.budgeting.budgetAccountNum").$D("预算科目") }}：{{ li.fromBudgetAccountName }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.model.submit.date").$D("提交时间") }}：{{ li.creationDate }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll>
        <!-- 可选择列表 -->
        <hips-scroll v-if="choseConfirmPopup" ref="scroll" :data="[list]">
          <div class="checkWrap" style="padding-bottom: 20vw">
            <hips-checkbox-group v-model="comfirmOrderList" :checkbox-border="false">
              <hips-checkbox v-for="(li,index) in list" :key="index" :option="{value: li}">
                <div class="card cards">
                  <ul>
                    <li class="code">
                      <span>{{ li.adjustNum }}</span>
                      <span>{{ li.adjustStatusMeaning }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.view.get.reason").$D("借调原因") }}：{{ li.adjustReason==='WLFBZ'?$T("sbud.budgeting.view.item.free.not.enough").$D("物料费不足"):$T("sbud.budgeting.view.other").$D("其他") }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.view.req.allot.dept").$D("申请调拨部门") }}：{{ li.toUnitName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.view.allot.money").$D("借调金额") }}：{{ li.adjustAmount }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.view.borrow.dept").$D("借用部门") }}：{{ li.fromUnitName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.model.budgeting.budgetAccountNum").$D("预算科目") }}：{{ li.fromBudgetAccountName }}</span>
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
        v-else-if="list.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("sbud.budgeting.model.submit.date").$D("提交时间") }}</span>
        </li>
        <div class="dateWrap">
          <span
            :class="date1?'date-item date-color':'date-item'"
            @click="choseData('date1')">{{ date1 ? date1:$T('hipspfm.common.message.startTime').$D('开始日期') }}</span>
          <span/>
          <span
            :class="date2?'date-item date-color':'date-item'"
            @click="choseData('date2')">{{ date2 ? date2:$T('hipspfm.common.message.endTime').$D('截至日期') }}</span>
          <!-- 日期弹窗-->
          <DateChooser v-model="datePop" @submitDate="handleConfirm" />
        </div>
        <li>
          <span>{{ $T("sbud.budgeting.view.req.allot.dept").$D("申请调拨部门") }}</span>
        </li>
        <div class="supplier" @click="showLovPop('toUnit')">
          <span v-show="!toUnitValue.unitName">{{ $T("sbud.budgeting.view.choose.req.allot.dept").$D("请选择申请调拨部门") }}</span>
          <div>
            <div v-show="toUnitValue.unitName" class="supplier-item">{{ toUnitValue.unitName }}</div>
          </div>
          <span v-show="toUnitValue.unitName" @click.stop="clearValue('toUnit')">
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
        <li>
          <span>{{ $T("sbud.budgeting.view.borrow.dept").$D("借用部门") }}</span>
        </li>
        <div class="supplier" @click="showLovPop('fromUnit')">
          <span v-show="!fromUnitValue.unitName">{{ $T("sbud.budgeting.view.choose.borrow.dept").$D("请选择借用部门") }}</span>
          <div>
            <div v-show="fromUnitValue.unitName" class="supplier-item">{{ fromUnitValue.unitName }}</div>
          </div>
          <span v-show="fromUnitValue.unitName" @click.stop="clearValue('fromUnit')">
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
        <li>
          <span>{{ $T("hzero.common.status").$D("状态") }}</span>
        </li>
        <div class="supplier" @click="showLovPop('status')">
          <span v-show="!statusValue.meaning">{{ $T("sbud.budgeting.view.choose.status").$D("请选择状态") }}</span>
          <div>
            <div v-show="statusValue.meaning" class="supplier-item">{{ statusValue.meaning }}</div>
          </div>
          <span v-show="statusValue.meaning" @click.stop="clearValue('status')">
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/BudgetAllocation/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
    <!-- 供应商弹窗 -->
    <Lov
      v-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      :clear-flag="clearFlag1"
      :title="LovTitle"
      :show-value="showLovValue"
      @submitValue="GetValue"/>
    <!-- 状态弹窗 -->
    <SelectOrderStatus
      v-model="statusPop"
      :title="$T('hzero.common.status').$D('状态')"
      :status-arr="statusArr"
      :clear-flag="clearFlag2"
      @GetOrderStatus="GetValue"/>
    <!-- 全选弹窗 -->
    <div v-show="choseConfirmPopup" class="confirmWrap">
      <div class="editModal">
        <hips-checkbox v-model="checkAllFlag" :border="false" :disabled="!list.length">
          <span style="fontSize: 16px;">{{ $T("hipspfm.common.message.selectAll").$D("全选") }}</span>
        </hips-checkbox>
        <div>
          <div v-if="active===0">
            <span @click="toDelete">{{ $T("smbl.common.button.delete").$D("删除") }}</span>
            <span @click="toSubmit">{{ $T("smbl.common.button.submit").$D("提交") }}</span>
          </div>
          <div v-else>
            <span @click="toRefuse">{{ $T("smbl.common.button.reject").$D("拒绝") }}</span>
            <span @click="toPass">{{ $T("smbl.common.button.approve").$D("通过") }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 全选弹窗结束 -->
    <!-- 审批意见弹窗 -->
    <InfoPop v-model="ideaPop" title="审批意见" @confirmInfo="comfirmIdeaInfo" />
    <BottomHandler
      v-if="!choseConfirmPopup&&active===0"
      id="NoNeed"
      :btn-arr="btnArr"
      position="absolute"/>
  </hips-view>
</template>

<script>
import {
  Tab,
  Tabs,
  View,
  Popup,
  Input,
  NavBar,
  Scroll,
  Checkbox,
  CheckboxGroup
} from "hips";
import Lov from "@/components/Lov";
import { dateFormat } from "@/utils/index";
import InfoPop from "@/components/InfoPop";
import NoContent from "@/components/NoContent";
import Searchs from "@/components/Searchs";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import BottomHandler from "@/components/BottomHandler";
import SelectOrderStatus from "@/components/SelectOrderStatus";
import {
  passApi,
  refuseApi,
  deleteApi,
  submitApi,
  getStatusApi,
  getBudgetListApi
} from "../api/index";
export default {
  modules: [ "sbud.budgeting","smbl.common","hipspfm.common","hzero.common" ],
  name: "BudgetAdjustList",
  components: {
    Lov,
    InfoPop,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    BottomHandler,
    SelectOrderStatus,
    [Tab.name]: Tab,
    [View.name]: View,
    [Tabs.name]: Tabs,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  data() {
    return {
      active: 0,
      show: false, //筛选弹窗
      finishLoad: false,
      datePop: false, //日期弹窗
      checkAllFlag: false, //全选标志
      LovPop: false, //Lov弹窗
      LovTitle: "",
      LovCode: "",
      LovType: "",
      LovParams: {},
      choseConfirmPopup: false, //全选编辑弹窗
      comfirmOrderList: [], //订单选中值
      statusValue: {}, //预算状态选中值
      toUnitValue: {}, //申请调拨部门选中值
      fromUnitValue: {}, //申请调拨部门选中值
      searchVal: "", //搜索订单号
      date1: "", //开始日期
      date2: "", //截止日期
      choseedDate: "", //选中的时间
      changeDate: "",
      list: [], //列表数据
      totalCount: 0,
      currentPage: 0, //页码
      clearFlag1: false, //重置状态传入Lov
      clearFlag2: false, //重置状态传入状态选择
      dateClearFlag: false,
      statusPop: false,
      ideaPop: false,
      statusArr: [],
      height: "height: calc(100vh - 222px)",
      noHeadHeight: "height: calc(100vh - 178px)",
      queryParams: {},
      showLovValue: true,
    };
  },
  computed: {
    btnArr() {
      return [
        {
          title: this.$T("sbud.budgeting.button.start.budget.borrow").$D("发起预算借款"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.toDetail("create");
          }
        }
      ];
    },
    tabList() {
      return [
        this.$T("smbl.common.view.me.start").$D("我发起"),
        this.$T("smbl.common.view.wait.approve").$D("待审批"),
        this.$T("smbl.common.view.already.approved").$D("已审批")
      ];
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
  activated() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      try {
        this.$loading.show();
        this.list = [];
        await this.fetchData();
        await this.getStatus();
        this.finishLoad = true;
        this.$loading.hide();
      } catch (err) {
        this.finishLoad = true;
        this.$loading.hide();
        console.log(err, "error");
      }
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
      this.show = !this.show;
    },
    // 显示编辑弹窗
    showEditPop() {
      this.choseConfirmPopup = !this.choseConfirmPopup;
      if (!this.choseConfirmPopup) {
        this.checkAllFlag = false;
        this.comfirmOrderList = [];
      }
    },
    //切换tab
    checkTab(index) {
      this.active = index;
      this.currentPage = 0;
      this.list = [];
      this.searchVal = "";
      this.fetchData();
    },
    //重置编辑状态
    resetChoosePop() {
      this.choseConfirmPopup = false;
      this.comfirmOrderList = [];
      this.fetchData();
    },
    //删除
    async toDelete() {
      const res = await deleteApi(this.comfirmOrderList);
      if (!(res && res.failed)) {
        this.$loading.hide();
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
          key,
          class: "notification"
        });
        this.resetChoosePop();
      } else {
        this.$loading.hide();
      }
    },
    //提交
    async toSubmit() {
      const res = await submitApi(this.comfirmOrderList);
      if (!(res && res.failed)) {
        this.$loading.hide();
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
          key,
          class: "notification"
        });
        this.resetChoosePop();
      } else {
        this.$loading.hide();
      }
    },
    //审批通过
    toPass() {
      this.$loading.show();
      passApi(this.comfirmOrderList).then((res) => {
        this.$loading.hide();
        if (!(res && res.failed)) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            key,
            class: "notification"
          });
          this.goBack();
        } else {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification"
          });
        }
      });
    },
    //审批拒绝
    toRefuse() {
      this.ideaPop = !this.ideaPop;
    },
    //确认审批意见
    comfirmIdeaInfo(approvalRemark) {
      const params = {
        approvalRemark,
        budgetAdjusts: this.comfirmOrderList
      };
      this.$loading.show();
      refuseApi(params).then((res) => {
        this.$loading.hide();
        if (!(res && res.failed)) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            key,
            class: "notification"
          });
          this.goBack();
        } else {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification"
          });
        }
      });
    },
    //新建
    toDetail(type, list = {}) {
      let detailType = this.active === 0 ? "REQ" : "APPROVAL";
      this.$router.push({
        name: "BudgetAdjustDetail",
        query: { type, detailType, list }
      });
      this.choseConfirmPopup = false;
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.fetchData();
    },
    //监听输入改变
    handleInputChange() {
      if (!this.searchVal.length) {
        this.fetchData();
      }
    },
    //Lov弹窗显示或隐藏
    showLovPop(type) {
      this.LovTitle = "";
      this.LovParams = {};
      this.LovType = type;
      switch (type) {
      case "fromUnit":
        this.LovTitle = "借用部门";
        this.LovCode = "SCUX.SD.SUBD_TRANSFER_UNIT";
        this.LovParams = {
          type: "from",
          lovCode: "SCUX.SD.SUBD_TRANSFER_UNIT",
          tenantId: window.localStorage.tenantId
        };
        this.LovPop = !this.LovPop;
        this.showLovValue = false;
        break;
      case "status":
        this.statusPop = !this.statusPop;
        break;
      case "toUnit":
        this.LovTitle = "申请调拨部门";
        this.LovCode = "SCUX.SD.SUBD_TRANSFER_UNIT";
        this.LovParams = {
          type: "to",
          lovCode: "SCUX.SD.SUBD_TRANSFER_UNIT",
          tenantId: window.localStorage.tenantId
        };
        this.LovPop = !this.LovPop;
        this.showLovValue = false;
        break;
      }
    },
    //确认值
    GetValue(val) {
      let tempValue = {};
      if (val) {
        tempValue = this.LovType === "status" ? JSON.parse(val[0]) : val[0];
      }
      switch (this.LovType) {
      case "toUnit":
        this.toUnitValue = tempValue;
        break;
      case "status":
        this.statusValue = tempValue;
        break;
      case "fromUnit":
        this.fromUnitValue = tempValue;
        break;
      }
    },
    //清除选中的值
    clearValue(type) {
      switch (type) {
      case "toUnit":
        this.toUnitValue = {};
        this.clearFlag1 = true;
        break;
      case "status":
        this.statusValue = {};
        this.clearFlag2 = true;
        break;
      case "fromUnit":
        this.fromUnitValue = {};
        this.clearFlag1 = true;
        break;
      }
      this.queryParams = {};
    },
    //获取预算状态
    async getStatus() {
      this.statusArr = await getStatusApi();
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
      const params = {
        size: 10,
        page: this.currentPage,
        adjustNum: this.searchVal
      };
      if (this.active === 1) {
        params.source = "approve";
      }
      if (this.active === 2) {
        params.source = "approved";
      }
      this.finishLoad = false;
      this.$loading.show();
      await getBudgetListApi({ ...params, ...this.queryParams }).then((res) => {
        this.$loading.hide();
        this.finishLoad = true;
        if (res && res.content) {
          this.list = [ ...this.list, ...res.content ];
          this.totalCount = res.totalElements;
        } else {
          this.list = [];
        }
      });
    },
    //选择时间
    handleConfirm(value) {
      this.choseedDate = value;
      this[this.changeDate] = this.choseedDate;
      this.datePop = false;
    },
    handleSelectSingle(e) {
      this.choseedDate = dateFormat(e);
    },
    //选择日期
    choseData(type) {
      this.changeDate = type;
      this.datePop = true;
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
        console.log(222, this.toUnitValue);
        if (JSON.stringify(this.toUnitValue) !== "{}") {
          this.queryParams.toUnitCode = this.toUnitValue.unitCode;
        }
        if (JSON.stringify(this.fromUnitValue) !== "{}") {
          this.queryParams.fromUnitCode = this.fromUnitValue.unitCode;
        }
        if (JSON.stringify(this.statusVal) !== "{}") {
          this.queryParams.adjustStatus = this.statusValue.value;
        }
        this.queryParams.startDate = this.date1 ?
          this.date1 + " 00:00:00" :
          "", //开始时间
        this.queryParams.endDate = this.date2 ?
          this.date2 + " 00:00:00" :
          ""; //结束时间
        this.fetchData();
        this.show = false;
        this.list = [];
        this.currentPage = 0;
      }
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.clearFlag1 = false;
      this.clearFlag2 = false;
      this.statusValue = {};
      this.toUnitValue = {};
      this.fromUnitValue = {};
      this.queryParams = {};
      this.dateClearFlag = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
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
    margin: 4px 0px;
    display: flex;
    align-items: center;

    .img-edit {
      height: 18.8px;
      width: 18.8px;
      margin-right: 22.6px;
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
          padding-top: 12px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: #1B1E2B;

          &:nth-child(2) span {
            line-height: 22px;

            &:nth-child(1) {
              width: 224px;
            }
          }

          span {
            display: inline-block;
            line-height: 20px;
          }

          &:last-child span {
            background: rgba(65, 70, 96, 0.1);
            border-radius: 2px;
            font-size: 10px;
            color: #414660;
            line-height: 22px;
            text-align: center;
            height: 22px;
            padding: 0px 8px;
            margin-bottom: 12px;
          }
        }

        .code {
          font-weight: bold;
          margin-top: 4px;
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

.datePop {
  .header {
    font-size: 18px;
    color: var(--color-font-default);
    line-height: 26px;
  }

  #dateConfirm {
    width: 100%;
    height: 49px;
    text-align: center;
    line-height: 49px;
    background: var(--color-bg-default);
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0.34px;
    text-align: center;
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
            color: #FD4B4B;
            border: 1px solid #FD4B4B;
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
