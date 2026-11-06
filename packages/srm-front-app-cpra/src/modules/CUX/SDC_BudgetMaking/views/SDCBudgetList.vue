<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/BudgetMaking/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("").$D("预算编制") }}
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
        <div class="date-box">
          <span
            :class="startDate?'date-item date-color':'date-item'"
            @click="choseData('startDate')">{{ startDate ? startDate + '~' + (endDate?endDate:'') : $T('hipspfm.common.message.validTime').$D('预算有效期查询（有效期从-至）') }}
          </span>
          <img v-if="startDate" class="image-gray-default" src="@/assets/BudgetMaking/Navigation bar_delete_normal@3x.png" alt @click="clearDate" >
          <img v-else class="image-gray-default" src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png" alt >
        </div>
        <div style="margin: 18px">
          <img
            class="img-filter"
            src="@/assets/BudgetMaking/icon_Searchbar_filter_default@3x.png"
            alt
            @click="showPopup">
        </div>
      </div>
      <TotalCount :list-len="list.length" :count="totalCount" :info="'单据信息'" />
      <div v-if="list.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          v-if="!choseConfirmPopup"
          ref="scroll"
          :data="[originList]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in list" :key="index" class="card">
            <ul @click="toDetail(li)">
              <li class="code">
                <span>{{ li.budgetDesc }}</span>
                <span
                  v-if="li.budgetStatus==='REJECTED'"
                  style="font-weight:bold;color: #FD4B4B">{{ li.budgetStatusMeaning }}</span>
                <span
                  v-else-if="li.budgetStatus==='ABOLISHED'"
                  style="font-weight:bold;color:#82879E">{{ li.budgetStatusMeaning }}</span>
                <span v-else style="font-weight:bold;color:#354FF7">{{ li.budgetStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("预算单号") }}：{{ li.budgetNum }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("公司") }}：{{ li.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("预算部门") }}：{{ li.unitName }}</span>
              </li>
              <li>
                <span>{{ $T("").$D("预算科目") }}：{{ li.budgetAccountName }}</span>
              </li>
              <li>
                <span class="distance">
                  <span>{{ $T("").$D("原始预算") }}：{{ Number(li.origBudgetAmount).toFixed(2) }}</span>
                  <span>{{ $T("").$D("剩余预算") }}：{{ Number(li.remainingBudget).toFixed(2) }}</span>
                </span>
              </li>
              <li>
                <span class="valid-date">{{ $T("").$D("有效期") }}：{{ li.startDate|CalcDate }}/{{ li.endDate|CalcDate }}</span>
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
                      <span>{{ $T("").$D("公司") }}：{{ li.companyName }}</span>
                    </li>
                    <li>
                      <span>{{ $T("").$D("预算说明") }}：{{ li.budgetDesc }}</span>
                    </li>
                    <li>
                      <span>{{ $T("").$D("预算部门") }}：{{ li.unitName }}</span>
                    </li>
                    <li>
                      <span class="distance">
                        <span>{{ $T("").$D("原始预算") }}：{{ li.origBudgetAmount }}</span>
                        <span>{{ $T("").$D("剩余预算") }}：{{ li.remainingBudget }}</span>
                      </span>
                    </li>
                    <li>
                      <span>{{ $T("").$D("审批后预算") }}：{{ li.budgetAmount }}</span>
                    </li>
                    <li>
                      <span>
                        <span>{{ $T("").$D("版本") }}：{{ li.version }}</span>
                        <span>{{ $T("").$D("有效期") }}：{{ li.startDate|CalcDate }}至{{ li.endDate|CalcDate }}</span>
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
      <NoContent
        v-else-if="list.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("").$D("预算部门") }}</span>
        </li>
        <div class="supplier" @click="showLovPop('unit')">
          <span v-show="!unitValue.unitName">{{ $T("").$D("请选择预算部门") }}</span>
          <div>
            <div v-show="unitValue.unitName" class="supplier-item">{{ unitValue.unitName }}</div>
          </div>
          <span v-show="unitValue.unitName" @click.stop="clearValue">
            <img class="image-gray-default" src="@/assets/BudgetMaking/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>

        <li>
          <span>{{ $T("").$D("预算科目") }}</span>
        </li>
        <div class="supplier" @click="showLovPop('budgetSubject')">
          <span v-show="!budgetSubjectValue.budgetAccountName">{{ $T("").$D("请选择预算科目") }}</span>
          <div>
            <div v-show="budgetSubjectValue.budgetAccountName" class="supplier-item">{{ budgetSubjectValue.budgetAccountName }}</div>
          </div>
          <span v-show="budgetSubjectValue.budgetAccountName" @click.stop="clearValue">
            <img class="image-gray-default" src="@/assets/BudgetMaking/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/BudgetMaking/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>

        <li>
          <span>{{ $T("").$D("预算说明") }}</span>
        </li>
        <div class="supplier">
          <hips-input
            v-model="budgetDesc"
            :placeholder="$T('').$D('请输入预算说明')"
            type="text"/>
        </div>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
    <!-- 日期弹窗-->
    <!-- <DateChooser v-model="datePop" select-type="start-end" @submitDate="handleConfirm" /> -->
    <DateChooser v-model="datePop" select-type="start-end" @submitDate="handleConfirm" />
    <!-- LOV弹窗 -->
    <Lov
      v-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      :clear-flag="clearFlag1"
      :title="LovTitle"
      :show-value="showLovValue"
      @submitValue="GetValue"/>
  </hips-view>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
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
  getStatusApi,
  getBudgetListApi
} from "../api/index";
export default {
  modules: [ "hipspfm.common" ],
  name: "SDCBudgetList",
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
      choseConfirmPopup: false, //全选编辑弹窗
      comfirmOrderList: [], //订单选中值
      companyValue: {}, //公司选中值
      statusValue: {}, //预算状态选中值
      unitValue: {}, //预算部门选中值
      budgetSubjectValue: {}, //预算部门选中值
      searchVal: "", //搜索订单号
      startDate: null, //开始日期
      endDate: null, //截止日期
      choseedDate: "", //选中的时间
      changeDate: "",
      list: [], //列表数据
      totalCount: 0,
      currentPage: 0, //页码
      clearFlag1: false, //重置状态传入Lov
      clearFlag2: false, //重置状态传入状态选择
      dateClearFlag: false,
      statusArr: [],
      height: "height: calc(100vh - 136px)",
      noHeadHeight: "height: calc(100vh - 92px)",
      budgetDesc: null,
      showDetailPopup: false,
      budgetDetail: {},
      originList: [],
      showLovValue: true,
    };
  },
  computed: {
    btnArr() {
      return [
        {
          title: this.$T("").$D("新建预算编制"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.toDetail();
          }
        }
      ];
    }
  },
  watch: {
    endDate() {
      this.handleSearch();
    },
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
  mounted() {
    this.startDate = dateFormat(new Date(), "yyyy-MM-dd");
    this.endDate = null;
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
        this.finishLoad = true;
        this.$forceUpdate();
        this.$loading.hide();
      } catch (err) {
        this.finishLoad = true;
        this.$loading.hide();
        console.log(err, "error");
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
          message: this.$T("").$D("操作成功"),
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
          message: this.$T("").$D("操作成功"),
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
          message: this.$T("").$D("操作成功"),
          key,
          class: "notification"
        });
        this.resetChoosePop();
      } else {
        this.$loading.hide();
      }
    },
    //新建
    toDetail(list = {}) {
      this.$router.push({
        name: "SDCBudgetDetail",
        query: { budgetNum: list.budgetNum }
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
      case "company":
        this.LovTitle = "公司";
        this.LovCode = "SPFM.USER_AUTHORITY_COMPANY";
        this.LovPop = !this.LovPop;
        this.showLovValue = false;
        break;
      case "unit":
        this.LovTitle = "预算部门";
        this.LovCode = "SCUX.SD_SBUD_UNIT";
        this.LovParams = {
          lovCode: "SCUX.SD_SBUD_UNIT",
          tenantId: window.localStorage.tenantId
        };
        this.LovPop = !this.LovPop;
        this.showLovValue = false;
        break;
      case "budgetSubject":
        this.LovTitle = "预算科目";
        this.LovCode = "SCUX.SD.BUDGET_ACCOUNT";
        this.LovParams = {
          lovCode: "SCUX.SD.BUDGET_ACCOUNT",
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
      case "company":
        this.companyValue = tempValue;
        break;
      case "status":
        this.statusValue = tempValue;
        break;
      case "unit":
        this.unitValue = tempValue;
        break;
      case "budgetSubject":
        this.budgetSubjectValue = tempValue;
        break;
      }
    },
    //清除选中的值
    clearValue() {
      switch (this.LovType) {
      case "company":
        this.companyValue = {};
        this.clearFlag1 = true;
        break;
      case "status":
        this.statusValue = {};
        this.clearFlag2 = true;
        break;
      case "unit":
        this.unitValue = {};
        this.clearFlag1 = true;
        break;
      case "budgetSubject":
        this.budgetSubjectValue = {};
        this.clearFlag1 = true;
        break;
      }
    },
    // 加载刷新数据
    async loadRefresh() {
      this.originList = [];
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
        startDate: this.startDate, //开始时间
        endDate: this.endDate, //结束时间
        unitCode: this.unitValue.unitCode,
        budgetDesc: this.budgetDesc,
        budgetAccountNum: this.budgetSubjectValue.budgetAccountNum,
        abolished: 0
      };
      this.finishLoad = false;
      this.$loading.show();
      await getBudgetListApi(params).then((res) => {
        const user = SrmUtil.getUserInfo();
        this.finishLoad = true;
        if (res && res.content) {
          this.totalCount = res.totalElements;
          res.content.forEach((e)=>{
            this.originList.push(e);
            if (e.createdBy === user.id || e.attributeBigint1 === user.id) {
              if (e.origBudgetAmount) {
                this.list.push(e);
              }
            }
          });
        } else {
          this.list = [];
          this.originList = [];
        }
      }).finally(()=>{
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
    // 快捷选择时间
    choseDateHandler(startDate, endDate) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.dateClearFlag = false;
    },
    //选择日期
    choseData(type) {
      this.changeDate = type;
      this.datePop = true;
    },
    // 完成按钮搜索
    submit() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
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
      this.startDate = null;
      this.endDate = null;
      this.clearFlag1 = false;
      this.clearFlag2 = false;
      this.companyValue = {};
      this.statusValue = {};
      this.unitValue = {};
      this.dateClearFlag = true;
      this.budgetSubjectValue = {};
      this.budgetDesc = null;
    }
  }
};
</script>

<style lang="stylus" scoped>
.valid-date {
  height: 22px;
  background: rgba(53,79,247,0.1);
  border-radius: 2px;
  text-align: left;
  color: #354ff7;
  line-height: 18px;
  font-size: 10px;
  padding: 2px 8px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
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
          padding-top: 8px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: #1B1E2B;

          .distance {
            span:nth-child(1) {
              display: inline-block;
              width: 158px;
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

.date-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  background: #f5f6fa;
  border-radius: 4px;

  img {
    margin-right: 14px;
    width: 16px;
    height: 16px;
  }

  .date-item {
    width: 100%;
    text-align: center;
    display: block;
    height: 20px;
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    color: #82879e;
    line-height: 20px;
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
