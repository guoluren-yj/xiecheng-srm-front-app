<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" class="header-nav-bar" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets//BudgetAllocation/icon_Navigation_bar_left_default_w@3x.png"
          class="image-black-default">
        {{ $T("sbud.budgeting.title.budget.detail").$D("预算调拨申请详情") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets//BudgetAllocation/icon_Navbar_top_default_w@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets//BudgetAllocation/icon_Navbar_closed_default_w@3x.png"
            alt
            @click="goClose">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="top-section">
        <ul>
          <li>{{ list.adjustNum }}</li>
          <li>
            <span v-show="list.adjustStatusMeaning">{{ list.adjustStatusMeaning }}</span>
          </li>
          <li>
            <span @click="showOpPop">
              <img src="@/assets//BudgetAllocation/icon_Toolbar Top_record_default w@3x.png">
              <span>{{ $T('sbud.budgeting.model.budgeting.operationRecord').$D('操作记录') }}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="form-list" :style="showBackFlag?height:noHeadHeight">
        <ul>
          <li v-if="this.list && this.list.adjustStatus === 'APPROVAL'&& this.detailType === 'APPROVAL'">{{ $T('sbud.budgeting.view.req.dept.info').$D("申请部门信息") }}</li>
          <li v-else>{{ $T('sbud.budgeting.view.my.info').$D("我的信息") }}</li>
          <!--借调原因-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.get.reason').$D('借调原因') }}
              <em v-if="editFlag">*</em>
            </div>
            <div @click="showLovPop('reason')">
              <span v-if="list.adjustReason">{{ list.adjustReason === 'WLFBZ' ? $T('sbud.budgeting.view.item.free.not.enough').$D('物料费不足') : $T('sbud.budgeting.view.other').$D('其他') }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.reason').$D('请选择借调原因') }}</span>
              <img
                v-show="editFlag"
                class="img-right"
                src="@/assets//BudgetAllocation/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <!--说明-->
          <li v-if="list.adjustReason === 'OTHER'">
            <div>
              {{ $T('sbud.budgeting.view.description').$D('说明') }}
            </div>
            <div>
              <hips-input
                v-model="list.remark"
                :placeholder="$T('sbud.budgeting.view.please.enter.description').$D('请输入说明')"
                type="text"
                :readonly="!editFlag"/>
              <img v-if="editFlag" class="img-edit" src="@/assets//BudgetAllocation/icon_List_editor_normal@3x.png" alt >
            </div>
          </li>
          <!--申请调拨部门-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.req.allot.dept').$D('申请调拨部门') }}
              <em v-show="editFlag">*</em>
            </div>
            <div @click="showLovPop('toUnit')">
              <span v-if="list.toUnitName">{{ list.toUnitName }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.req.allot.dept').$D('请选择申请调拨部门') }}</span>
              <img
                v-show="editFlag"
                class="img-right"
                src="@/assets//BudgetAllocation/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <!--调入预算数据-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.allot.budget.data').$D('调入预算数据') }}
              <em v-show="editFlag && toBudgetNumRequired">*</em>
            </div>
            <div @click="showLovPop('toNum')">
              <span v-if="list.toBudgetNum">{{ list.toBudgetNum }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.req.allot.toBudget').$D('请选择调入预算数据') }}</span>
              <img
                v-show="editFlag"
                class="img-right"
                src="@/assets//BudgetAllocation/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <!--调入部门当前剩余预算-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.allot.dept.residue.money').$D('调入部门当前剩余预算') }}
            </div>
            <div>
              <span class="valueless">{{ list.toRemainingBudget?list.toRemainingBudget:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <!--预算有效期-->
          <li>
            <div>{{ $T('sbud.budgeting.model.sbuget.validTime').$D('预算有效期') }}</div>
            <div>
              <span>{{ list.validPeriod }}</span>
            </div>
          </li>
          <!--申请人-->
          <li>
            <div>{{ $T('sbud.budgeting.model.sbuget.req.people').$D('申请人') }}</div>
            <div>
              <span>{{ list.createdByName }}</span>
            </div>
          </li>
          <!--申请时间-->
          <li>
            <div>{{ $T('sbud.budgeting.model.sbuget.req.time').$D('申请时间') }}</div>
            <div>
              <span v-if="pageType === 'create'">{{ this.now }}</span>
              <span v-else>{{ list.creationDate ? list.creationDate : $T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
        </ul>
        <ul>
          <li v-if="this.list && this.list.adjustStatus === 'APPROVAL'&& this.detailType === 'APPROVAL'">{{ $T('sbud.budgeting.view.my.info').$D("我的信息") }}</li>
          <li v-else>{{ $T('sbud.budgeting.view.borrow.dept.info').$D("借用部门信息") }}</li>
          <!--借用部门-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.borrow.dept').$D('借用部门') }}
              <em v-show="editFlag">*</em>
            </div>
            <div @click="showLovPop('fromUnit')">
              <span v-if="list.fromUnitName">{{ list.fromUnitName }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.borrow.dept').$D('请选择借用部门') }}</span>
              <img
                v-if="editFlag"
                class="img-right"
                src="@/assets//BudgetAllocation/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <!--借用预算数据-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.borrow.budget.data').$D('借用预算数据') }}
              <em v-show="editFlag">*</em>
            </div>
            <div v-if="editFlag" @click="showLovPop('fromNum')">
              <span v-if="list.fromBudgetNum">{{ list.fromBudgetNum }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.borrow.budget.data').$D('请选择借用预算数据') }}</span>
              <img class="img-right" src="@/assets//BudgetAllocation/icon_List_right_normal@3x.png" alt >
            </div>
            <div v-else>
              <span>{{ list.fromBudgetNum?list.fromBudgetNum:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <!--预算科目-->
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.budgetAccountNum').$D('预算科目') }}</div>
            <div>
              <span>{{ list.fromBudgetAccountName?list.fromBudgetAccountName:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <!--借调金额-->
          <li>
            <div>
              {{ $T('sbud.budgeting.view.allot.money').$D('借调金额') }}
              <em v-show="editFlag">*</em>
            </div>
            <div v-if="editFlag">
              <hips-input
                v-model="list.adjustAmount"
                :placeholder="$T('sbud.budgeting.view.please.enter.allot.money').$D('请输入借调金额')"
                type="text"/>
              <img class="img-edit" src="@/assets//BudgetAllocation/icon_List_editor_normal@3x.png" alt >
            </div>
            <div v-else>
              <span>{{ list.adjustAmount ? list.adjustAmount : $T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Lov弹窗 -->
    <FinalLov
      v-if="LovCode === 'SCUX.SD.SUBD_ADJUST_BUDGET_NUM'"
      v-model="LovPop"
      code="SCUX.SD.SUBD_ADJUST_BUDGET_NUM"
      value-field="validPeriod"
      display-field="budgetAccountName"
      :query-params="LovParams"
      :title="LovTitle"
      refresh
      @submitValue="GetValue"/>
    <Lov
      v-else-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      :title="LovTitle"
      :show-value="showLovValue"
      @submitValue="GetValue"/>
    <!-- 借调原因弹窗 -->
    <SelectOrderStatus
      v-model="reasonPop"
      :title="$T('sbud.budgeting.view.get.reason').$D('借调原因')"
      :status-arr="reasonArr"
      @GetOrderStatus="GetValue"/>
    <!-- 操作记录弹窗 -->
    <OperationRecord
      v-model="opPop"
      :operation-arr="opArr"
      :load-refresh="getOpRecord"
      :loading="opLoading"/>
    <!-- 审批意见弹窗 -->
    <InfoPop v-model="ideaPop" title="审批意见" @confirmInfo="comfirmIdeaInfo"/>
    <!-- 日期弹窗-->
    <DateChooser v-model="datePop" @submitDate="handleConfirm"/>
    <!-- 底部按钮 -->
    <BottomHandler v-if="btnArr.length" id="NoNeed" :btn-arr="btnArr" position="absolute"/>
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import { View, Input, NavBar } from "hips";
import { dateFormat, isEmpty } from "@/utils/index";
import InfoPop from "@/components/InfoPop";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import DateChooser from "@/components/DateChooser";
import BottomHandler from "@/components/BottomHandler";
import OperationRecord from "@/components/OperationRecord";
import SelectOrderStatus from "@/components/SelectOrderStatus";
import {
  passApi,
  saveApi,
  submitApi,
  deleteApi,
  refuseApi,
  getReasonApi,
  getOpRecordApi,
  getBudgetListApi,
  getBudgetInfoApi,
  getBudget
} from "../api/index";
import { formatDateTime } from "hips/lib/utils";
import FinalLov from "@/components/FinalLov";

export default {
  modules: [ "smbl.common","hipspfm.common","hipspfm.supplierDelivery","sbud.budgeting" ],
  name: "BudgetAdjustDetail",
  components: {
    FinalLov,
    Lov,
    InfoPop,
    DateChooser,
    BottomHandler,
    OperationRecord,
    SelectOrderStatus,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      createList: [],
      LovPop: false,
      datePop: false,
      dateType: "",
      opPop: false,
      reasonPop: false,
      choseedDate: "", //选中的时间
      LovCode: "",
      LovTitle: "",
      LovParams: {},
      LovType: "",
      pageType: "",
      detailType: "",
      list: {},
      originString: "",
      opArr: [], //操作记录数据集合
      reasonArr: [],
      opLoading: false,
      ideaPop: false,
      height: "height: calc(100vh - 224px)",
      noHeadHeight: "height: calc(100vh - 180px)",
      now: dateFormat(new Date()),
      showLovValue: true,
      toBudgetNumRequired: false,
    };
  },
  computed: {
    btnArr() {
      if (this.list && this.list.adjustStatus) {
        if (this.list.adjustStatus === "NEW" || this.list.adjustStatus === "REJECTED" && this.detailType === "REQ") {
          return [
            {
              title: this.$T("smbl.common.button.submit").$D("提交"),
              color: "var(--color-font-default-d)",
              background:
                  this.pageType === "update" ?
                    "var(--color-other-default-b)" :
                    "var(--color-bg-default-f)",
              handler: () => {
                this.toSubmit();
              }
            }
          ];
        } else if (this.list.adjustStatus === "APPROVAL" && this.detailType === "APPROVAL") {
          return [
            {
              title: this.$T("smbl.common.button.reject").$D("拒绝"),
              color: "var(--color-font-default-d)",
              background: "var(--color-other-default)",
              handler: () => {
                this.toRefuse();
              }
            },
            {
              title: this.$T("smbl.common.button.pass").$D("通过"),
              color: "var(--color-font-default-d)",
              background: "var(--color-other-default-b)",
              handler: () => {
                this.toPass();
              }
            }
          ];
        }
        return [];

      }
      return [ {
        title: this.$T("smbl.common.button.save").$D("保存"),
        color: "var(--color-other-default-b)",
        background: "var(--color-bg-default",
        handler: () => {
          this.toSave();
        }
      } ];

    },
    editFlag() {
      return this.pageType === "create" || this.list.adjustStatus === "NEW" || this.list.adjustStatus === "REJECTED" && this.detailType === "REQ";
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      const { type, list, detailType } = this.$route.query;
      this.list = list;
      this.pageType = type;
      this.detailType = detailType;
      if (this.pageType === "create") {
        await this.getBudgetInfo();
      } else {
        getBudget(null, this.list.toUnitCode,this.list.toBudgetNum, null, "to").then((res)=>{
          if (res.content && res.content.length) {
            this.list.validPeriod = res.content[0].validPeriod;
            this.list.toRemainingBudget = res.content[0].remainingBudget;
            this.$forceUpdate();
          }
        });
      }
      await this.getReason();
      this.originString = JSON.parse(JSON.stringify(this.list));
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    beforeRouteLeave(to, from, next) {
      this.back(next);
    },
    back(next) {
      if (JSON.stringify(this.originString) !== JSON.stringify(this.list)) {
        this.$hips.dialog.confirm({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content:
              this.$T("hipspfm.supplierDelivery.view.message.saveInfoOrNot").$D(
                "是否保存已修改信息"
              ) + "?",
          okText: this.$T("hipspfm.common.button.save").$D("保存"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          onOk: () => {
            // eslint-disable-next-line consistent-this
            const _this = this;
            new Promise((resolve) => {
              _this.toSave();
              resolve();
            }).then(() => {
              next();
            });
          },
          onCancel() {
            // on cancel
            next();
          }
        });
      } else {
        next();
      }
    },
    //返回上一页
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
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
    //操作记录弹窗显示或隐藏
    showOpPop() {
      if (!this.opPop) {
        this.getOpRecord();
      }
      this.opPop = !this.opPop;
    },
    //获取借调原因
    async getReason() {
      this.reasonArr = await getReasonApi();
    },
    //获取配置信息
    async getBudgetInfo() {
      const res = await getBudgetInfoApi();
      if (res) {
        this.list.createdByName = res.createdByName;
        //this.list.toBudgetId = res.toBudgetId;
        //this.list.toBudgetNum = res.toBudgetNum;
        //this.list.toRemainingBudget = res.toRemainingBudget;
        //this.list.toBudgetAccountName = res.toBudgetAccountName;
        this.list.toUnitCode = res.toUnitCode;
        this.list.toUnitName = res.toUnitName;
      }
    },
    showLovPop(type) {
      if (this.editFlag) {
        this.LovType = type;
        switch (type) {
        case "fromUnit":
          this.LovTitle = "借用部门";
          this.LovCode = "SCUX.SD.SUBD_TRANSFER_UNIT";
          this.LovPop = !this.LovPop;
          this.LovParams = {
            toUnitCode: this.list.toUnitCode,
            type: "from",
            lovCode: "SCUX.SD.SUBD_TRANSFER_UNIT",
            tenantId: window.localStorage.tenantId
          };
          this.showLovValue = false;
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
        case "fromNum":
          this.LovTitle = "借用预算数据";
          this.LovCode = "SCUX.SD.SUBD_ADJUST_BUDGET_NUM";
          this.LovParams = {
            type: "from",
            lovCode: "SCUX.SD.SUBD_ADJUST_BUDGET_NUM",
            tenantId: window.localStorage.tenantId,
            unitCode: this.list.fromUnitCode,
            startDate: formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"),
            endDate: formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"),
          };
          this.LovPop = !this.LovPop;
          this.showLovValue = true;
          break;
        case "toNum":
          this.LovTitle = "调入预算数据";
          this.LovCode = "SCUX.SD.SUBD_ADJUST_BUDGET_NUM";
          this.LovParams = {
            type: "to",
            lovCode: "SCUX.SD.SUBD_ADJUST_BUDGET_NUM",
            tenantId: window.localStorage.tenantId,
            unitCode: this.list.toUnitCode,
            startDate: formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"),
            endDate: formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"),
          };
          this.LovPop = !this.LovPop;
          this.showLovValue = true;
          break;
        default:
          this.reasonPop = !this.reasonPop;
        }
      }
    },
    // 获取Lov确定值
    GetValue(val) {
      const { unitCode, unitName, budgetNum, budgetId, budgetAccountName, budgetAccountNum, validPeriod, remainingBudget } = val[0];
      switch (this.LovType) {
      //借用部门
      case "fromUnit":
        this.list.fromUnitCode = unitCode;
        this.list.fromUnitName = unitName;
        this.list.fromBudgetNum = null;
        this.list.fromBudgetId = null;
        this.list.fromBudgetAccountName = null;
        this.list.fromRemainingBudget = null;
        break;
        //申请调拨部门
      case "toUnit":
        this.list.toUnitCode = unitCode;
        this.list.toUnitName = unitName;
        getBudget(budgetAccountNum, unitCode, null, formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"), "to").then((res) => {
          if (res && res.totalElements) {
            this.toBudgetNumRequired = true;
          }
        });
        break;
        //借用预算数据
      case "fromNum":
        if (/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) \d{2}:\d{2}:\d{2}-[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) \d{2}:\d{2}:\d{2}$/.test(validPeriod)) {
          const startDate = validPeriod.substring(0, 10);
          const endDate = validPeriod.substring(20, 30);
          if (startDate > this.now || endDate < this.now) {
            this.$notification.open({
              message: this.$T("sbud.budgeting.message.choose.allot.enough.date.data").$D("借用预算数据只能选择当前时间生效的预算数据"),
              key,
              class: "notification"
            });
            break;
          }
          this.list.validPeriod = validPeriod;
          this.list.fromBudgetNum = budgetNum;
          this.list.fromBudgetId = budgetId;
          this.list.fromBudgetAccountName = budgetAccountName;
          this.list.fromRemainingBudget = remainingBudget;
          getBudget(budgetAccountNum, this.list.toUnitCode, null, formatDateTime(new Date(), "yyyy-MM-dd+HH:mm:ss"), "to").then((res) => {
            if (res.content) {
              if (res.content.length === 0) {
                //this.$notification.open({
                //  message: this.$T("sbud.budgeting.message.dept.date.accont.mapping.error").$D("根据部门、有效期、预算科目查询不对预算数据"),
                //  key,
                //  class: "notification"
                //});
              } else {
                const budget = res.content[0];
                this.list.toBudgetNum = budget.budgetNum;
                this.list.toBudgetId = budget.budgetId;
                this.list.toBudgetAccountName = budget.budgetAccountName;
                this.list.toRemainingBudget = budget.remainingBudget;
                this.$forceUpdate();
              }
            }
          });
        } else {
          this.$notification.open({
            message: this.$T("sbud.budgeting.message.vaild.date.error").$D("有效期格式错误"),
            class: "notification"
          });
        }
        break;
      case "toNum":
        this.list.toBudgetNum = budgetNum;
        this.list.toBudgetId = budgetId;
        this.list.toBudgetAccountName = budgetAccountName;
        this.list.toRemainingBudget = remainingBudget;
        break;
      default:
        this.list.adjustReason = JSON.parse(val[0]).value;
      }
    },
    showDatePop(type) {
      this.dateType = type;
      this.datePop = !this.datePop;
    },
    //获取操作记录
    async getOpRecord() {
      if (!this.list.budgetAdjustId) {
        return;
      }
      const res = await getOpRecordApi(this.list.budgetAdjustId);
      this.opArr = res.content;
    },
    //选择时间
    handleConfirm(value) {
      this.dateType === "start" ?
        this.list.startDate = value + " 00:00:00" :
        this.list.endDate = value + " 00:00:00";
      this.datePop = false;
    },
    //保存
    toSave() {
      const {
        adjustReason, //借调原因 *
        fromUnitName, //借用部门 *
        fromBudgetNum, //调出预算编号 *
        toUnitName, //调入预算部门 *
        toBudgetNum, //调入预算编号 *
        adjustAmount //借调金额 *
      } = this.list;
      if (
        !adjustReason ||
          !fromUnitName ||
          !fromBudgetNum ||
          !adjustAmount && Number(adjustAmount) !== 0 ||
          !toUnitName ||
          !toBudgetNum && this.toBudgetNumRequired
      ) {
        this.$notification.open({
          message: this.$T("smbl.common.message.write.require.field").$D("请填写必填项"),
          class: "notification"
        });
        return false;
      }

      if (this.list.fromRemainingBudget < this.list.adjustAmount) {
        this.$notification.open({
          message: "借调金额不能超过剩余预算金额"
        });
        return false;
      }
      this.$loading.show();
      saveApi([ this.list ]).then((res) => {
        if (res && !res.failed) {
          this.fetchData(res[0].adjustNum);
        } else {
          this.$loading.hide();
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        }
      });
    },
    //回调列表数据
    async fetchData(adjustNum) {
      const params = {
        size: 10,
        page: 0,
        adjustNum
      };
      await getBudgetListApi(params).then((res) => {
        this.$loading.hide();
        if (res && res.content) {
          this.pageType = "update";
          this.list = res.content[0];
          this.originString = JSON.parse(JSON.stringify(this.list));
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        }
      });
    },
    //删除
    toDelete() {
      if (this.pageType === "create") {
        this.goBack();
      } else {
        this.$loading.show();
        deleteApi([ this.list ]).then((res) => {
          this.$loading.hide();
          if (!(res && res.failed)) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              class: "notification"
            });
            this.goBack();
          } else {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          }
        });
      }
    },
    //提交
    toSubmit() {
      if (this.pageType === "update") {
        this.$loading.show();
        submitApi([ this.list ]).then((res) => {
          this.$loading.hide();
          if (res && !res.failed) {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              class: "notification"
            });
            this.goBack();
          } else {
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          }
        });
      }
    },
    //审批通过
    toPass() {
      this.$loading.show();
      this.list.approveRemark = "同意";
      passApi([ this.list ]).then((res) => {
        this.$loading.hide();
        if (!(res && res.failed)) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.goBack();
        } else {
          this.$notification.open({
            message: res.message,
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
      if (isEmpty(approvalRemark)) {
        this.$notification.open({
          message: "审批意见必填",
          class: "notification"
        });
        return;
      }
      const params = {
        approvalRemark,
        budgetAdjusts: [ this.list ]
      };
      this.$loading.show();
      refuseApi(params).then((res) => {
        this.$loading.hide();
        if (!(res && res.failed)) {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            class: "notification"
          });
          this.goBack();
        } else {
          this.$notification.open({
            message: res.message,
            class: "notification"
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.header-nav-bar {
  background-color: var(--color-other-default-b) !important;
}

.left-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--color-font-default-d);
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
  color: var(--color-font-default-d);

  span {
    display: flex;
    align-items: center;
    width: 77px;
    height: 32px;
    padding: 7px 10px;
    background: rgba(245, 246, 250, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
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

.content {
  .top-section {
    ul {
      background: var(--color-other-default-b) !important;
      color: var(--color-font-default-d);
      padding: 8px 15px 16px;
      font-size: 14px;

      li {
        line-height: 20px;
        margin-bottom: 4px;

        &:first-child {
          font-weight: bold;
          font-size: 16px;
        }

        &:nth-child(4) {
          padding-top: 4px;
          padding-bottom: 7px;

          span {
            display: inline-block;
            padding: 1px 4px;
            height: 20px;
            background: rgba(255, 255, 255, 0.11);
            border-radius: 2px;
            font-size: 10px;
            margin-right: 8px;
          }
        }

        &:last-child {
          width: 345px;
          height: 44px;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          text-align: center;

          img {
            height: 18px;
            width: 18px;
            vertical-align: middle;
            margin-right: 7px;
          }

          span {
            flex: 1;
          }
        }
      }
    }
  }

  .form-list {
    overflow: auto;
    width: 375px;
    background: #f5f6fa;
    border-radius: 12px 12px 0px 0px;

    ul {
      margin-top: 20px;
      background: #fff;
    }
    ul li {
      padding: 16px 15px 15px 0px;
    margin-left: 15px;
    border-bottom: 1px solid #F5F6FA;

    div:nth-child(1) {
      font-size: 12px;
      font-weight: 400;
      color: #82879e;
      line-height: 16px;

      em {
        color: #fd4b4b;
        margin-left: 4px;
      }
    }

    div:nth-child(2) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      height: 20px;
      font-size: 14px;
      color: #1b1e2b;
    }

    .valueless {
      color: #82879e;
    }

    >>> .hips-input {
      padding: 0 !important;
      height: 20px !important;
      width: 311px !important;
      position: static !important;

      input {
        font-size: 14px !important;
        color: #1b1e2b;
      }
    }

    >>> .hips-input__input-value {
      display: block !important;
    }

    >>> .hips-input__input-value input::-webkit-input-placeholder {
      color: #82879e !important;
    }

    .img-right {
      height: 12px;
      width: 7px;
    }

    .img-edit {
      width: 16px;
      height: 16px;
    }
  }
}

}
</style>
