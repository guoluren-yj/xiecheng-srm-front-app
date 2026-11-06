<template>
  <hips-view>
    <hips-nav-bar :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div
        slot="center"
        class="header">
        {{ $T("hipspfm.common.view.title.myApprove").$D("我的审批") }}
      </div>
      <div slot="right" class="right-button">
        <!-- <i @click="showEditPop"><img class="image-black-default" src="@/assets/editor_normal@3x.png" alt ></i> -->
        <div class="filter-wrap" @click="showPopup" >
          <img class="image-black-default" src="@/assets/screen_normal@3x.png" alt >
          <span class="filter-txt">{{ $T("ssta.purchaseSettlePool.view.title.filter").$D("筛选") }}</span>
        </div>
      </div>
    </hips-nav-bar>
    <!-- <hips-nav-bar v-else :have-border="false">
      <div slot="left" class="left-button">
        <span @click="showEditPop">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
      </div>
    </hips-nav-bar> -->
    <div class="content">
      <searchs
        v-model="searchVal"
        :handle-search="handleSearch"
        :placeholder="$T('hipspfm.common.view.tab.displayPrNum').$D('请输入申请编号查询')"/>
      <total-count :list-len="list.length" :count="totalCount" :info="$T('hipspfm.common.title.approveInfo').$D('审批信息')" />
      <div v-if="list.length" class="scrollWrap">
        <!-- <hips-scroll
          v-if="!choseConfirmPopup"
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div
            v-for="(li,index) in list"
            :key="index"
            class="card"
            @click="toDetail(li)">
            <h3>
              <span class="code">
                <span class="block"/>
                {{ li.displayPrNum }}
              </span>
            </h3>
            <ul>
              <Customize :columns="getHeadColumns" :data-source="li" />
              <li>
                <span>{{ $T("sodr.common.model.common.requestBy").$D("申请人") }}：</span>
                <span>{{ li.prRequestedName }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll> -->
        <!-- 可选择列表 -->
        <hips-scroll
          ref="scroll" :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div class="checkWrap" style="padding-bottom: 13.333vw">
            <hips-checkbox-group v-model="comfirmOrderList" :checkbox-border="false">
              <hips-checkbox v-for="(li,index) in list" :key="index" :option="{value: li}">
                <div class="card cards">
                  <h3>
                    <span class="code">{{ li.displayPrNum }}</span>
                  </h3>
                  <ul @click.stop.prevent="toDetail(li)">
                    <customize :columns="getHeadColumns" :data-source="li" />
                    <li>
                      <span>{{ $T("sodr.common.model.common.requestBy").$D("申请人") }}：</span>
                      <span>{{ li.prRequestedName }}</span>
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
        v-else-if="list.length===0&&loading"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("sinv.common.model.common.creationDate").$D("创建日期") }}</span>
        </li>
        <div class="dateWrap">
          <span
            class="date-item"
            @click="choseData('date1')">{{ date1 ? date1:$T('hipspfm.common.message.startTime').$D('开始日期') }}</span>
          <span>~</span>
          <span
            class="date-item"
            @click="choseData('date2')">{{ date2 ? date2:$T('hipspfm.common.message.endTime').$D('截至日期') }}</span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
          <!-- 日期弹窗 -->
          <date-chooser v-model="datePopup" @submitDate="handleConfirm" />
        </div>
        <!-- 快速选择日期 -->
        <date-tip :date-clear-flag="dateClearFlag" :chose-date-handler="choseDateHandler" />
        <li>
          <span>{{ $T("small.common.model.classify").$D("品类") }}</span>
        </li>
        <div class="supplier" @click="showSupplierPop">
          <span
            v-show="!supplierValue.categoryName">{{ $T("small.common.view.message.handlerClassify").$D("请选择品类") }}</span>
          <div>
            <div
              v-show="supplierValue.categoryName"
              class="supplier-item">
              {{ supplierValue.categoryName }}
            </div>
          </div>
          <span v-show="supplierValue.categoryName" @click.stop="clearSupplier(0)">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt >
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </div>
        <li>
          <span>{{ $T("sodr.common.model.common.requestBy").$D("申请人") }}</span>
        </li>
        <div class="supplier">
          <hips-input
            v-model="prRequestedName"
            :placeholder="$T('hipspfm.common.view.message.handlerRequestBy').$D('请输入申请人')"
            type="text"/>
        </div>
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
    <!-- 供应商弹窗 -->
    <lov
      v-model="supplierPopup"
      code="SCUX.WATSONS.AUTH_CATEGORY"
      :clear-flag="clearAFlag"
      :query-params="{lovCode:'SCUX.WATSONS.AUTH_CATEGORY'}"
      @submitValue="GetSupplier"/>
    <!-- 全选弹窗 -->
    <div class="confirmWrap">
      <div class="editModal">
        <hips-checkbox v-model="checkAllFlag" :border="false" :disabled="!list.length">
          <span style="fontSize: 16px;">{{ $T("hipspfm.common.message.selectAll").$D("全选") }}</span>
        </hips-checkbox>
        <div>
          <div v-if="comfirmOrderList.length">
            <span @click.stop="handleReject">{{ $T("hipspfm.common.message.reject").$D("拒绝") }}</span>
            <span @click.stop="handleAdopt">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
          </div>
          <div v-else>
            <span
              style="background:var(--color-bg-default-f);">{{ $T("hipspfm.common.message.reject").$D("拒绝") }}</span>
            <span
              style="background:var(--color-bg-default-f)">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 全选弹窗结束 -->

    <!-- 审批意见弹窗 -->
    <opinion v-model="opinionPopup" :type="optionType" @comfirmOpinion="comfirmOpinion" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :operation-arr="operationArr" />
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
import Lov from "../../../../../src/components/Lov";
import { dateFormat } from "../../../../../src/utils";
import Searchs from "../../../../../src/components/Searchs";
import NoContent from "../../../../../src/components/NoContent";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "../../../../../src/components/DateChooser";
import DateTip from "../../../../../src/components/DateTip";
import HistoryRecord from "../../../../../src/components/NewOperationRecord";
import Opinion from "../components/Opinion";
import { adoptApi, rejectApi, getApprovalListApi, getOperatorRecordApi } from "../api";
export default {
  modules: [ "hzero.common", "hwfp.task", "hipspfm.common", "ssta.purchaseSettlePool", "sodr.common", "sinv.common", "small.common", "smpc.product", "sprm.common", "hwfm.commom", "sagm.common", "sslm.supplyAbility", "validation.message", "sinv.deliveryApproved", "hispfm.deliveryApproved" ],
  name: "DeliveryBillList",
  components: {
    Lov,
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    DateTip,
    Opinion,
    HistoryRecord,
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
      loading: false,
      supplierLoading: false,
      datePopup: false, //日期弹窗
      checkAllFlag: false, //全选标志
      supplierPopup: false, //供应商弹窗
      purchaserPopup: false, //采购员弹窗
      choseConfirmPopup: false, //全选编辑弹窗
      supplierArr: [], //供应商数据
      saveSupplierArr: [], //存放处理过后的供应商的数据
      comfirmOrderList: [], //订单选中值
      chooseParams: [],
      supplierValue: {}, //供应商选中值
      searchVal: "", //搜索订单号
      prRequestedName: "", //申请人
      date1: "", //开始日期
      date2: "", //截止日期
      choseedDate: "", //选中的时间
      changeDate: "",
      list: [],
      totalCount: 0,
      currentPage: 0, //页码
      supplierTotalCount: "",
      tenantId: window.localStorage.tenantId,
      clearAFlag: false, //重置状态传入组件里
      clearBFlag: false,
      dateClearFlag: false,
      appendData: [],
      operationPopup: false, //审批记录
      operationArr: [], //审批数据
      opinionPopup: false, //审批意见弹窗
      approvedRemark: "", //审批意见
      optionType: "", //审批意见类型
      showCalendar: false
    };
  },
  computed: {
    // 头信息
    getHeadColumns() {
      const columns = [
        {
          fieldName: this.$T("smpc.product.model.itemCategory").$D("品类"),
          fieldCode: "categoryName",
        },

        {
          fieldName: this.$T("sprm.common.model.common.feeDesc").$D("费用说明"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sprm.common.model.common.goodQuantity").$D("商品数量"),
          fieldCode: "attributeDecimal1",
        },
        {
          fieldName: this.$T("hwfm.commom.modal.previousApprover").$D("上一步审批人"),
          fieldCode: "previousApprover",
        },
        {
          fieldName: this.$T("sodr.common.model.common.creation").$D("创建时间"),
          fieldCode: "creationDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sodr.common.model.common.cost").$D("金额"),
          fieldCode: "amount",
        },
        {
          fieldName: this.$T("sagm.common.model.area").$D("区域"),
          fieldCode: "areaMeaning",
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.market").$D("市场"),
          fieldCode: "marketplaceName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.departmente").$D("部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("hzero.common.button.Operator").$D("操作记录"),
          fieldCode: "optionRecord",
          render: (val, record) => <span style="color: blue" onClick={(e) => this.showOptionRecord(e, record.prHeaderId)}>{this.$T("hzero.common.	button.details").$D("查看详情")}</span>
        }
      ];

      return columns;
    },
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
      this.list = [];
      this.comfirmOrderList = [];
      await this.fetchData();
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
    }
  },
  methods: {
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
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
    showOptionRecord(e, prHeaderId) {
      e.stopPropagation();
      e.preventDefault();
      this.$loading.show();
      getOperatorRecordApi(prHeaderId).then((res = []) => {
        this.$loading.hide();
        this.operationArr = res[0].historicTaskExtList || [];
        this.operationPopup = true;
      });
    },
    //跳转详情页
    toDetail(li) {
      const { id, prHeaderId, lotFlag } = li;

      this.$router.push({
        name: "MyApprovalDetail",
        query: { taskId: id, processInstanceId: prHeaderId, lotFlag }
      });
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
    //供应商弹窗显示或隐藏
    showSupplierPop() {
      this.supplierPopup = !this.supplierPopup;
    },
    //采购员弹窗显示或隐藏
    showPurchaserPop() {
      this.purchaserPopup = !this.purchaserPopup;
    },
    //确认供应商
    GetSupplier(val) {
      this.supplierValue = val.length ? val[0] : {};
    },
    //清除供应商or客户的值
    clearSupplier(val) {
      if (!val) {
        this.supplierValue = "";
        this.clearAFlag = true;
      }
    },
    // 通过该订单
    handleAdopt() {
      this.optionType = "adopt";
      this.showOpinionPopup();
    },
    // 拒绝该订单
    handleReject() {
      this.optionType = "reject";
      this.showOpinionPopup();
    },
    showOpinionPopup() {
      this.opinionPopup = !this.opinionPopup;
    },
    //填写审批意见后拒绝or通过
    comfirmOpinion(inputValue, type) {
      this.approvedRemark = inputValue;
      if (type === "adopt") {
        this.clickAdopt();
        this.showOpinionPopup();
      } else if (type === "reject" && !inputValue) {
        this.opinionPopup = true;
        this.$notification.open({
          message: this.$T("hwfp.task.view.message.commentNotBeNull").$D("审批意见不能为空"),
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.clickReject();
        this.showOpinionPopup();
      }
    },
    // 点击通过
    clickAdopt() {
      const that = this;

      this.$hips.dialog.confirm({
        content: this.$T("validation.message.passThisBill").$D("是否通过该单据") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          that.adoptList();
        }
      });
    },
    //确认通过
    adoptList() {
      const { approvedRemark = "审批通过" } = this;

      this.chooseParams = this.comfirmOrderList.map((item) => ({
        action: "complete",
        comment: approvedRemark,
        currentTaskId: item.id,
        formKey: item.formKey,
        processDefinitionId: item.processDefinitionId,
        processInstanceId: item.encryptProcInstId,
        processName: item.processName,
        variables: [ {
          name: "approveResult",
          value: "Approved",
        }, {
          name: "comment",
          value: approvedRemark
        } ],
      }));
      this.$loading.show();
      adoptApi(this.chooseParams).then((res) => {
        this.$loading.hide();
        // eslint-disable-next-line no-empty
        if (res && res.failed) {
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.common.view.validation.approvelSuccess"
            ).$D("审批通过成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.approvedRemark = "";
          this.checkAllFlag = false;
          this.choseConfirmPopup = false;
          this.list = [];
          this.comfirmOrderList = [];
          this.chooseParams = [];
          this.fetchData();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //点击拒绝
    clickReject() {
      const that = this;

      this.$hips.dialog.confirm({
        content:
          this.$T(
            "validation.message.refuseThisBill"
          ).$D("是否拒绝该单据") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          that.rejectList();
        }
      });
    },
    //确认拒绝
    rejectList() {
      const { approvedRemark } = this;

      this.chooseParams = this.comfirmOrderList.map((item) => ({
        action: "complete",
        comment: approvedRemark,
        currentTaskId: item.id,
        formKey: item.formKey,
        processDefinitionId: item.processDefinitionId,
        processInstanceId: item.encryptProcInstId,
        processName: item.processName,
        variables: [ {
          name: "approveResult",
          value: "Rejected",
        }, {
          name: "comment",
          value: approvedRemark
        } ],
      }));
      this.$loading.show();
      rejectApi(this.chooseParams).then((res) => {
        this.$loading.hide();
        // eslint-disable-next-line no-empty
        if (res && res.failed) {
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D(
              "审批拒绝成功"
            ),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.approvedRemark = "";
          this.checkAllFlag = false;
          this.choseConfirmPopup = false;
          this.list = [];
          this.comfirmOrderList = [];
          this.chooseParams = [];
          this.fetchData();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 加载刷新数据
    async loadRefresh() {
      this.list = [];
      this.currentPage = 0;
      this.comfirmOrderList = [];
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
        page: this.currentPage,
        size: 10,
        creationDateFrom: this.date1 ? `${this.date1} 00:00:00` : "", //创建日期从
        creationDateTo: this.date2 ? `${this.date2} 00:00:00` : "", //创建日期至
        displayPrNum: this.searchVal, //单据编号
        prRequestedName: this.prRequestedName, //申请人
        categoryList: this.supplierValue,
        categoryId: this.supplierValue.categoryId, //供应商描述
        categoryCode: this.supplierValue.categoryCode,
      };

      this.loading = false;
      this.$loading.show();
      await getApprovalListApi(params).then((res) => {
        this.$loading.hide();
        this.loading = true;
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
      this.hideDatePop();
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
    hideDatePop() {
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
      this.supplierValue = "";
      this.prRequestedName = "";
      this.clearFlag = true;
      this.dateClearFlag = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
>>> .hips-cell {
  line-height: 4.4vw !important;
}

.header {
  font-size: 18px;
  color:var(--color-font-default);
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  display: flex;
  align-items: center;
  margin-right: 20px;
  z-index:1;
  color: var(--color-font-default);

  .filter-wrap {
    display: flex;
    align-items: center;
  }
  img {
    height: 24px;
    width: 24px;

    &:nth-child(1) {
      // margin-right: 12px;
    }
  }
}

.content {
  height: 100%;
  overflow: auto;
  font-family: PingFangSC-Regular;
  font-size: 14px;

  .scrollWrap {
    height: calc(100vh - 120px);
    font-size: 14px;

    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 4vw !important;
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
      background:var(--color-bg-default);
      border-bottom:8px solid var(--color-border-default);
      line-height: 22px;

      h3 {
        display: flex;
        justify-content: space-between;
        padding: 15px 20px 11px 0px;
        border-bottom:1px solid var(--color-border-default);

        .block {
          display: inline-block;
          height: 14px;
          width: 6px;
          background: var(--color-other-default-b);
          margin-right: 8px;
        }

        .code {
          font-size: 16px;
          color:var(--color-font-default);
          font-weight: bold;
        }

        .status {
          color: var(--color-other-default);
          text-align: right;
        }
      }

      li {
        color:var(--color-font-default);
        font-family: PingFangSC-Regular;
        padding-top: 12px;

        &:nth-child(1) {
          padding-top: 13px;
        }

        &:last-child {
          margin-top: 13px;
          padding: 12px 0px;
          color:var(--color-font-default);
          font-weight: bold;
          border-top:1px solid var(--color-border-default);
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
      border-bottom: 0 !important;
    }
  }
}

.filterWrap {
  padding: 16px 20px;
  font-size: 16px;
  margin-bottom: 16px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    color:var(--color-font-default);
    font-weight: bold;
    margin-top: 28px;

    &:nth-child(1) {
      margin-top: 0;

      span {
        font-weight: bold;
      }
    }
  }

  .dateWrap, .supplier, .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid var(--color-border-default);
    font-size: 16px;
    color:var(--color-font-default-b);
    height: 34px;
    margin: 8px 0px 7px 0px;
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
      color:var(--color-font-default-b) !important;
    }

    .date-item {
      width: 27vw;
      text-align: left;
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
    color:var(--color-font-default);
    line-height: 26px;
  }

  #dateConfirm {
    width: 100%;
    height: 49px;
    text-align: center;
    line-height: 49px;
    background:var(--color-bg-default);
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0.34px;
    text-align: center;
  }
}

.handlerWrap {
  display: flex;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;

    &:nth-child(1) {
      border-top:1px solid var(--color-border-default);
    }

    &:nth-child(2) {
      color:var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}

.confirmWrap {
  line-height: 44px;
  height: calc(44px + constant(safe-area-inset-bottom));
  height: calc(44px + env(safe-area-inset-bottom));
  width: 100%;
  background-color:var(--color-font-default-d);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 666;

  .editModal {
    display: flex;
    align-items: center;
    background:var(--color-bg-default);
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
          width: 64px;
          line-height: 34px;
          background: var(--color-other-default);
          border-radius: 2px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color:var(--color-font-default-d);
          text-align: center;
        }

        span:nth-child(2) {
          background: var(--color-other-default-b);
          margin-left: 12px;
        }
      }
    }
  }
}

>>> .bscroll-indicator {
  display: none !important;
}
</style>
