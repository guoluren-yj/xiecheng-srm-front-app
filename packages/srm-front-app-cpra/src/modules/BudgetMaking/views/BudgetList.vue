<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/BudgetMaking/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sbud.budgeting.view.title.budgeting").$D("预算编制") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/BudgetMaking/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/BudgetMaking/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="search-line">
        <searchs
          v-model="searchVal"
          :handle-search="handleSearch"
          :placeholder="$T('sbud.budgeting.view.write.budget.number').$D('请输入预算编号查询')"/>
        <div v-if="!choseConfirmPopup">
          <img
            class="img-edit"
            src="@/assets/BudgetMaking/icon_Searchbar_editor_default@3x.png"
            alt
            @click="showEditPop">
          <img
            class="img-filter"
            src="@/assets/BudgetMaking/icon_Searchbar_filter_default@3x.png"
            alt
            @click="showPopup">
        </div>
        <div v-else class="cancelEdit">
          <span @click="showEditPop">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        </div>
      </div>
      <total-count :list-len="list.length" :count="totalCount" :info="$T('smbl.common.view.message.documentsInfo').$D('单据信息')" />
      <div v-if="list.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          v-if="!choseConfirmPopup"
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in list" :key="index" class="card">
            <ul @click="toDetail('update',li)">
              <li class="code">
                <span>{{ li.budgetNum }}</span>
                <span
                  v-if="li.budgetStatus==='REJECTED'"
                  style="font-weight:bold;color: #FD4B4B">{{ li.budgetStatusMeaning }}</span>
                <span
                  v-else-if="li.budgetStatus==='ABOLISHED'"
                  style="font-weight:bold;color:#82879E">{{ li.budgetStatusMeaning }}</span>
                <span v-else style="font-weight:bold;color:#354FF7">{{ li.budgetStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.model.budgeting.company").$D("公司") }}：{{ li.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.model.budgeting.budgetDesc").$D("预算说明") }}：{{ li.budgetDesc }}</span>
              </li>
              <li>
                <div class="distance">
                  <span>{{ $T("sbud.budgeting.model.budgeting.origBudgetAmount").$D("原始预算金额") }}：{{ li.origBudgetAmount }}</span>
                  <span>{{ $T("sbud.budgeting.model.budgeting.remainingBudget").$D("剩余预算") }}：{{ li.remainingBudget }}</span>
                </div>
              </li>
              <li>
                <span>{{ $T("sbud.budgeting.model.budgeting.budgetAmount").$D("审批后预算金额") }}：{{ li.budgetAmount }}</span>
              </li>
              <li>
                <span>
                  <span>{{ $T("sbud.budgeting.model.budgeting.version").$D("版本") }}：{{ li.version }}</span>
                  <span>{{ $T("sbud.budgeting.model.budgeting.validity").$D("有效期") }}：{{ li.startDate|CalcDate }}/{{ li.endDate|CalcDate }}</span>
                </span>
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
                      <span>{{ li.budgetNum }}</span>
                      <span
                        v-if="li.budgetStatus==='REJECTED'"
                        style="font-weight:bold;color: #FD4B4B">{{ li.budgetStatusMeaning }}</span>
                      <span
                        v-else-if="li.budgetStatus==='ABOLISHED'"
                        style="font-weight:bold;color:#82879E">{{ li.budgetStatusMeaning }}</span>
                      <span v-else style="font-weight:bold;color:#354FF7">{{ li.budgetStatusMeaning }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.model.budgeting.company").$D("公司") }}：{{ li.companyName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.model.budgeting.budgetDesc").$D("预算说明") }}：{{ li.budgetDesc }}</span>
                    </li>
                    <li>
                      <div class="distance">
                        <span>{{ $T("sbud.budgeting.model.budgeting.origBudgetAmount").$D("原始预算金额") }}：{{ li.origBudgetAmount }}</span>
                        <span>{{ $T("sbud.budgeting.model.budgeting.remainingBudget").$D("剩余预算") }}：{{ li.remainingBudget }}</span>
                      </div>
                    </li>
                    <li>
                      <span>{{ $T("sbud.budgeting.model.budgeting.budgetAmount").$D("审批后预算金额") }}：{{ li.budgetAmount }}</span>
                    </li>
                    <li>
                      <span>
                        <span>{{ $T("sbud.budgeting.model.budgeting.version").$D("版本") }}：{{ li.version }}</span>
                        <span>{{ $T("sbud.budgeting.model.budgeting.validity").$D("有效期") }}：{{ li.startDate|CalcDate }}/{{ li.endDate|CalcDate }}</span>
                      </span>
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
        v-else-if="list.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("sbud.budgeting.model.budgeting.validity").$D("有效期") }}</span>
        </li>
        <div class="dateWrap">
          <span
            :class="date1?'date-item date-color':'date-item'"
            @click="choseData('date1')">{{ date1 ? date1:$T('hipspfm.common.message.startTime').$D('开始日期') }}</span>
          <span/>
          <span
            :class="date2?'date-item date-color':'date-item'"
            @click="choseData('date2')">{{ date2 ? date2:$T('hipspfm.common.message.endTime').$D('截至日期') }}</span>
          <!-- 日期弹窗 -->
          <date-chooser v-model="datePop" @submitDate="handleConfirm" />
        </div>
        <!-- 快速选择日期 -->
        <date-tip :date-clear-flag="dateClearFlag" :chose-date-handler="choseDateHandler" />
        <div class="divBox">
          <li>
            <span>{{ $T("sbud.budgeting.model.budgeting.company").$D("公司") }}</span>
          </li>
          <div class="supplier" @click="showLovPop('company')">
            <span v-show="!companyValue.companyName">{{ $T("sbud.budgeting.view.choose.budgeting.company").$D("请选择公司") }}</span>
            <div>
              <div
                v-show="companyValue.companyName"
                class="supplier-item">
                {{ companyValue.companyName }}
              </div>
            </div>
            <span v-show="companyValue.companyName" @click.stop="clearValue">
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_delete_normal@3x.png"
                alt>
            </span>
            <span>
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </div>
        </div>
        <div class="divBox">
          <li>
            <span>{{ $T("sbud.budgeting.model.budgeting.budgetStatus").$D("预算状态") }}</span>
          </li>
          <div class="supplier" @click="showLovPop('status')">
            <span v-show="!statusValue.meaning">{{ $T("sbud.budgeting.view.choose.budgeting.budgetStatus").$D("请选择预算状态") }}</span>
            <div>
              <div v-show="statusValue.meaning" class="supplier-item">{{ statusValue.meaning }}</div>
            </div>
            <span v-show="statusValue.meaning" @click.stop="clearValue">
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_delete_normal@3x.png"
                alt>
            </span>
            <span>
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </div>
        </div>
        <div v-for="(item,index) in itemList" :key="index" class="divBox">
          <li>
            <span>{{ item.budgetItemName }}</span>
          </li>
          <div class="supplier" @click="showItemPop(item,index)">
            <span
              v-show="!item[item.displayField]">{{ $T("hzero.common.validation.requireSelect",[item.budgetItemName]).$D("请选择{name}") }}</span>
            <div>
              <div
                v-show="item[item.displayField]"
                class="supplier-item">
                {{ item[item.displayField] }}
              </div>
            </div>
            <span v-show="item[item.displayField]" @click.stop="clearValue(index)">
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_delete_normal@3x.png"
                alt>
            </span>
            <span>
              <img
                class="image-gray-default"
                src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png"
                alt>
            </span>
          </div>
        </div>
      </div>

      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
    <!-- 供应商弹窗 -->
    <lov
      v-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      :clear-flag="clearFlag1"
      :title="LovTitle"
      @submitValue="GetValue"/>
    <!-- 状态弹窗 -->
    <select-order-status
      v-model="statusPop"
      :title="$T('sbud.budgeting.model.budgeting.budgetStatus').$D('预算状态')"
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
          <div>
            <span @click="toCancel">{{ $T("hzero.comon.button.invalid").$D("作废") }}</span>
            <span @click="toDelete">{{ $T("smbl.common.button.delete").$D("删除") }}</span>
            <span @click="toSubmit">{{ $T("smbl.common.button.submit").$D("提交") }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 全选弹窗结束 -->
    <bottom-handler
      v-if="!choseConfirmPopup&&list.length"
      id="NoNeed"
      :btn-arr="btnArr"
      position="absolute"/>
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
import Lov from "@/components/Lov";
import DateTip from "@/components/DateTip";
import { dateFormat } from "@/utils/index";
import NoContent from "@/components/NoContent";
import Searchs from "@/components/Searchs";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import BottomHandler from "@/components/BottomHandler";
import SelectOrderStatus from "@/components/SelectOrderStatus";
import {
  cancelApi,
  deleteApi,
  submitApi,
  getItemApi,
  getStatusApi,
  getBudgetListApi
} from "../api/index";
export default {
  modules: [ "sbud.budgeting", "smbl.common", "hipspfm.common", "hzero.common", "hzero.comon" ],
  name: "BudgetList",
  components: {
    Lov,
    DateTip,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    BottomHandler,
    SelectOrderStatus,
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
      show: false, //筛选弹窗
      finishLoad: false,
      datePop: false, //日期弹窗
      checkAllFlag: false, //全选标志
      LovPop: false, //Lov弹窗
      LovTitle: "",
      LovCode: "",
      LovType: "",
      LovParams: {},
      LovItem: {},
      LovIndex: 0,
      choseConfirmPopup: false, //全选编辑弹窗
      comfirmOrderList: [], //订单选中值
      companyValue: {}, //公司选中值
      statusValue: {}, //预算状态选中值
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
      statusArr: [],
      itemList: [],
      height: "height: calc(100vh - 178px)",
      noHeadHeight: "height: calc(100vh - 134px)"
    };
  },
  computed: {
    btnArr() {
      return [
        {
          title: this.$T("sbud.budgeting.button.create.budget").$D("新建预算编制"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.toDetail("create");
          }
        }
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
        await this.getItem();
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
    //重置编辑状态
    resetChoosePop() {
      this.choseConfirmPopup = false;
      this.comfirmOrderList = [];
      this.fetchData();
    },
    //作废
    async toCancel() {
      this.$loading.show();
      const res = await cancelApi(this.comfirmOrderList);
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
    //新建
    toDetail(type, list = {}) {
      this.$router.push({
        name: "BudgetDetail",
        query: { type, list }
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
      // eslint-disable-next-line default-case
      switch (type) {
      case "company":
        this.LovTitle = this.$T("sbud.budgeting.model.budgeting.company").$D("公司");
        this.LovCode = "SPFM.USER_AUTH.COMPANY";
        this.LovPop = !this.LovPop;
        break;
      case "status":
        this.statusPop = !this.statusPop;
        break;
      case "unit":
        this.LovTitle = this.$T("sbud.budgeting.model.budgeting.unitCode").$D("预算部门");
        this.LovCode = "SBUD.UNIT";
        this.LovParams = {
          lovCode: "SBUD.UNIT",
          tenantId: window.localStorage.tenantId
        };
        this.LovPop = !this.LovPop;
        break;
      }
    },
    showItemPop(item, index) {
      const { valueField, budgetItemName, lovCode, tenantId } = item;
      this.LovItem = item;
      this.LovIndex = index;
      this.LovCode = lovCode;
      this.LovType = valueField;
      this.LovTitle = budgetItemName;
      this.LovParams = { lovCode, tenantId };
      this.LovPop = !this.LovPop;
    },
    //确认值
    GetValue(val) {
      let tempValue = {};
      if (val) {
        tempValue = this.LovType === "status" ? JSON.parse(val[0]) : val[0];
      }
      switch (this.LovType) {
      case "company":
        this.companyValue = tempValue;
        break;
      case "status":
        this.statusValue = tempValue;
        break;
      default:
        this.itemList[this.LovIndex][this.LovItem.displayField] =
            tempValue[this.LovItem.displayField];
        this.itemList[this.LovIndex][this.LovItem.valueField] =
            tempValue[this.LovItem.valueField];
      }
    },
    //清除选中的值
    clearValue(index) {
      switch (this.LovType) {
      case "company":
        this.companyValue = {};
        this.clearFlag1 = true;
        break;
      case "status":
        this.statusValue = {};
        this.clearFlag2 = true;
        break;
      default:
        this.itemList[index][this.LovItem.displayField] = null;
        this.$forceUpdate();
        this.clearFlag1 = true;
        break;
      }
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
    // 获取自定义字段
    async getItem() {
      this.itemList = await getItemApi();
    },
    // 请求数据
    async fetchData() {
      const params = {
        size: 10,
        page: this.currentPage,
        budgetNum: this.searchVal,
        startDate: this.date1 ? this.date1 + " 00:00:00" : "", //开始时间
        endDate: this.date2 ? this.date2 + " 00:00:00" : "" //结束时间
      };
      this.itemList.map((item) => {
        if (item[item.valueField]) {
          params[item.valueField] = item[item.valueField];
        }
      });
      const { value } = this.statusValue;
      if (JSON.stringify(this.statusVal) !== "{}") {
        params.budgetStatus = value;
      }
      const { companyId } = this.companyValue;
      if (JSON.stringify(this.companyVal) !== "{}") {
        params.companyId = companyId;
      }
      this.finishLoad = false;
      this.$loading.show();
      await getBudgetListApi(params).then((res) => {
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
    // 快捷选择时间
    choseDateHandler(startDate, endDate) {
      this.date1 = startDate;
      this.date2 = endDate;
      this.dateClearFlag = false;
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
      this.companyValue = {};
      this.statusValue = {};
      this.itemList.map((item) => {
        item[item.displayField] = null;
        item[item.valueField] = null;
      });
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
  color: var(--color-font-default);
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
    color: var(--color-font-default);
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
          color: var(--color-font-default);

          .distance {
            span {
              width: 158px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            span:nth-child(4) {
              width: 100%;
            }

            span:nth-child(odd) {
              margin-right: 28px;
            }
          }

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

  .divBox {
    margin-top: 24px;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;

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
