<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" class="header-nav-bar" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/BudgetMaking/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sbud.budgeting.view.budgeting.budgetAllocation").$D("预算分配") }}
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
      <div class="form-list" :style="showBackFlag?height:noHeadHeight">
        <ul>
          <li class="header-li">
            <span>{{ $T("sbud.budgeting.view.budgeting.myBudget").$D("我的预算") }}</span>
            <i @click="showOpPop">{{ $T("sbud.budgeting.view.budgeting.history").$D("历史记录") }}</i>
          </li>
          <li class="header-item">
            {{ $T("sbud.budgeting.model.budgeting.budgetDesc").$D("预算说明") }}：{{ budgetDetail.budgetDesc }}
          </li>
          <li class="header-item">
            {{ $T("sbud.budgeting.model.budgeting.unitCode").$D("预算部门") }}：{{ budgetDetail.unitName }}
          </li>
          <li class="header-item">
            {{ $T("sbud.budgeting.model.budgeting.budgetAccountNum").$D("预算科目") }}：{{ budgetDetail.budgetAccountName }}
          </li>
          <li class="header-item">
            {{ $T("sbud.budgeting.model.budgeting.totalAmount").$D("预算总额") }}：{{ budgetDetail.origBudgetAmount }}
          </li>
          <li style="display: flex;justify-content: space-between">
            <span class="valid-date">{{ $T("sbud.budgeting.model.budgeting.validity").$D("有效期") }}：{{
              budgetDetail.startDate|CalcDate
            }}/{{ budgetDetail.endDate|CalcDate }}</span>
            <span v-if="budgetDetail.splitFlag && userId === budgetDetail.attributeBigint1"
                  class="fast-budget"
                  @click="fastBudget">{{ $T("sbud.budgeting.model.budgeting.quick_split").$D("快速分配") }}</span>
          </li>
        </ul>
        <div class="divider"/>
        <ul>
          <li class="header-li">
            <span v-if="budgetDetail.budgetStatus === 'APPROVED'">{{
              $T("sbud.budgeting.view.budgeting.budgetAllocated").$D("预算已分配")
            }}</span>
            <span v-else>{{ $T("sbud.budgeting.view.budgeting.budgetAllocation").$D("预算分配") }}</span>
            <div>
              <span style="font-size: 12px;">{{ $T("sbud.budgeting.view.budgeting.allocationRule").$D("分配规则") }}</span>
              <srm-tooltip placement="left" :title="$T('sbud.budgeting.view.budgeting.budgetTip1').$D('系统默认按照组织在职员工数量比例分配，您可手动修改')">
                <img class="remain-budget-btn" src="@/assets/BudgetMaking/icon_List_help_normal.png" alt>
              </srm-tooltip>
            </div>
          </li>
          <li v-for="item in budgetDetail.children.filter(e=> e.type === 'Y' && e.budgetStatus !== 'ABOLISHED')"
              :key="item.budgetNum"
              class="budget-item">
            <div class="department">{{ `${item.unitName}(${item.onJobCount})` }}</div>
            <div v-if="budgetDetail.budgetStatus === 'APPROVED'">
              <hips-input v-model="item.origBudgetAmount" readonly class="money" type="number"
                          style="width: 20% !important;" @input="handleInput(item)"/>
              <span class="input-label">
                <span>{{ $T("sbud.budgeting.view.budgeting.recycleAble").$D("可收回") }}：
                  <srm-tooltip placement="top" :title="item.remainingBudget">
                    {{ item.remainingBudget }}
                  </srm-tooltip>
                </span>
                <div>{{ $T("sbud.budgeting.button.budgeting.adjust").$D("调整") }}：</div>
              </span>
              <hips-input v-model="item.adjustAmount" class="money" type="number"
                          style="width: 30% !important;"
                          label-position="left"
                          :readonly="!adjustAmountEdit(item)"
                          @input="handleInput(item)">
                <span v-if="item.recycleFlag !== '1' && item.budgetStatus !== 'ABOLISHED'" slot="right"
                      class="input-label-right"
                      @click="cancelBudget(item)">{{ $T("sbud.budgeting.button.budgeting.desperate").$D("作废") }}</span>
              </hips-input>
            </div>
            <div v-else>
              <hips-input v-model="item.origBudgetAmount" class="money" type="number" @input="handleInput(item)">
                <img slot="right" class="input-right-img" src="@/assets/BudgetMaking/icon_List_editor_normal@3x.png" alt>
              </hips-input>
            </div>
          </li>
        </ul>
        <ul>
          <li class="header-li">
            <span v-if="budgetDetail.budgetStatus === 'APPROVED'">{{
              $T("sbud.budgeting.view.budgeting.notAllocate").$D("预算未分配")
            }}</span>
          </li>
          <li v-for="item in budgetDetail.children.filter(e=> e.type === 'N')" :key="item.unitCode" class="budget-item">
            <div class="department">{{ `${item.unitName}(${item.onJobCount})` }}</div>
            <div>
              <hips-input v-model="item.origBudgetAmount" type="number" class="money" @input="handleInput(item)">
                <img slot="right" class="input-right-img" src="@/assets/BudgetMaking/icon_List_editor_normal@3x.png" alt>
              </hips-input>
            </div>
          </li>
        </ul>
        <div class="remain-budget">
          <div style="display: flex;justify-content: space-between">
            <div class="remain-budget-tag">{{ $T("sbud.budgeting.view.budgeting.leftBudget").$D("剩余可分配预算") }}</div>
            <srm-tooltip placement="left" :title="$T('sbud.budgeting.view.budgeting.tip2').$D('剩余可分配预算=预算总额-已分配预算-当前部门已用预算')">
              <img class="remain-budget-btn" src="@/assets/BudgetMaking/icon_List_help_normal.png" alt>
            </srm-tooltip>
          </div>
          <div class="remain-budget-money">
            {{ remainBudget }}
          </div>
        </div>
      </div>
    </div>
    <!-- Lov弹窗 -->
    <lov
      v-if="LovPop"
      v-model="LovPop"
      :code="LovCode"
      :query-params="LovParams"
      :title="LovTitle"
      @submitValue="GetValue"/>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="opPop"
      :operation-arr="opArr"
      :load-refresh="getOpRecord"
      :loading="opLoading"/>
    <!-- 日期弹窗 -->
    <date-chooser v-model="datePop" @submitDate="handleConfirm"/>
    <bottom-handler v-if="userId === budgetDetail.attributeBigint1 || userId === budgetDetail.createdBy" id="NoNeed"
                    :btn-arr="btnArr"
                    position="absolute"/>
  </hips-view>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import Lov from "@/components/Lov";
import { View, Input, NavBar, Popup } from "hips";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import DateChooser from "@/components/DateChooser";
import BottomHandler from "@/components/BottomHandler";
import OperationRecord from "@/components/OperationRecord";
import {
  getOpRecordApi,
  cancelApi,
  deleteApi,
  saveApi,
  getBudgetListApi,
  confirmApi,
  splitApi,
  getChildUnit,
  recycleBudget
} from "../api/index";

export default {
  modules: [ "sbud.budgeting", "hzero.common" ],
  name: "SDCBudgetDetail",
  components: {
    Lov,
    DateChooser,
    OperationRecord,
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
  },
  data() {
    return {
      createList: [],
      LovPop: false,
      datePop: false,
      dateType: "",
      opPop: false,
      choseedDate: "", //选中的时间
      LovCode: "",
      LovTitle: "",
      LovParams: {},
      LovType: "",
      pageType: "",
      list: {},
      originString: "",
      opArr: [], //操作记录数据集合
      opLoading: false,
      height: "height: calc(100vh - 44px)",
      noHeadHeight: "height: calc(100vh)",
      showTip: false,
      budgetDetail: {
        children: []
      },
      userId: 0
    };
  },
  computed: {
    btnArr() {
      return [
        {
          title: this.$T("sbud.budgeting.model.budgeting.confirm").$D("确认"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            if ([ "NEW", "SUBMITTED", "ALREADY_EDITED" ].includes(this.budgetDetail.budgetStatus)) {
              this.saveAndConfirm();
            } else {
              this.save();
            }
          }
        }
      ];
    },
    remainBudget() {
      let total = 0;

      if (this.budgetDetail.children) {
        this.budgetDetail.children.forEach((e) => {
          total += e.budgetStatus === "ABOLISHED" ? Number(e.occupiedAmount) : Number(e.origBudgetAmount);
        });
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.budgetDetail.remainBudget = Number(this.budgetDetail.origBudgetAmount) - Number(this.budgetDetail.orderOccupiedAmount) - total;
      return this.budgetDetail.remainBudget || 0;
    }
  },
  watch: {},
  mounted() {
    this.budgetDetail.budgetNum = this.$route.query.budgetNum;
    this.init();
    const user = SrmUtil.getUserInfo();

    this.userId = user.id || 0;
  },
  methods: {
    handleInput(item) {
      item.dirty = true;
    },
    adjustAmountEdit(item) {
      return item.editFlag && (item.budgetStatus === "APPROVED" || item.budgetStatus === "ALREADY_EDITED");
    },
    fastBudget() {
      this.$loading.show();
      splitApi(this.budgetDetail).finally(() => {
        this.$loading.hide();
        this.init();
      });
    },
    convertToTree(list) {
      const result = list.filter((e) => e.budgetNum === this.budgetDetail.budgetNum)[0];
      const budgetId = result.budgetId;

      result.children = [];
      list.forEach((item) => {
        if (budgetId === item.parentBudgetId) {
          item.originRemain = item.remainingBudget;
          item.type = "Y";
          item.onJobCount = 0;
          result.children.push(item);
        }
      });
      return result;
    },
    async init() {
      this.$loading.show();
      await getBudgetListApi({ budgetNum: this.budgetDetail.budgetNum }).then((res) => {
        if (res.content) {
          this.budgetDetail = this.convertToTree(res.content);
        }
      });
      getChildUnit(this.budgetDetail.unitCode).then((res) => {
        if (this.budgetDetail.children) {
          res.forEach((e) => {
            const item = this.budgetDetail.children.filter((i) => i.unitCode === e.unitCode && i.budgetStatus !== "ABOLISHED");

            if (item.length > 0) {
              item[0].type = "Y";
              item[0].onJobCount = e.onJobCount;
            } else {
              const itemTemp = {
                type: "N",
                onJobCount: e.onJobCount,
                unitCode: e.unitCode,
                unitName: e.unitName,
                origBudgetAmount: 0,
                budgetDesc: this.budgetDetail.budgetDesc,
                companyId: this.budgetDetail.companyId,
                currencyCode: this.budgetDetail.currencyCode,
                startDate: this.budgetDetail.startDate,
                endDate: this.budgetDetail.endDate,
                budgetAccountNum: this.budgetDetail.budgetAccountNum,
                attributeBigint1: e.assignBy,
                parentBudgetId: this.budgetDetail.budgetId
              };

              if (itemTemp.onJobCount) {
                this.budgetDetail.children.push(itemTemp);
              }
            }
          });
          this.$forceUpdate();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    showTipPop() {
      this.showTip = true;
      console.log("tip");
    },
    beforeRouteLeave(to, from, next) {
      this.back(next);
    },
    back(next) {
      next();
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
    showLovPop(type) {
      if (this.editFlag) {
        this.LovType = type;
        switch (type) {
        case "company":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.company").$D("公司");
          this.LovCode = "SPFM.USER_AUTH.COMPANY";
          break;
        case "unit":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.unitCode").$D("预算部门");
          this.LovCode = "SBUD.UNIT";
          this.LovParams = {
            lovCode: "SBUD.UNIT",
            tenantId: window.localStorage.tenantId
          };
          break;
        case "account":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.budgetAccountNum").$D("预算科目");
          this.LovCode = "SMDM.BUDGET_ACCOUNT";
          this.LovParams = {
            lovCode: "SMDM.BUDGET_ACCOUNT",
            tenantId: window.localStorage.tenantId
          };
          break;
        case "cost":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.costCentor").$D("成本中心");
          this.LovCode = "SPRM.COST_CENTER";
          this.LovParams = {
            lovCode: "SPRM.COST_CENTER",
            tenantId: window.localStorage.tenantId
          };
          break;
        case "currency":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.currency").$D("币种");
          this.LovCode = "SMDM.CURRENCY";
          this.LovParams = {
            enabledFlag: 1,
            lovCode: "SMDM.CURRENCY",
            tenantId: window.localStorage.tenantId
          };
          break;
        default:
          break;
        }
        this.LovPop = !this.LovPop;
      }
    },
    // 获取Lov确定值
    GetValue(val) {
      switch (this.LovType) {
      //公司
      case "company":
        // eslint-disable-next-line no-case-declarations
        const { companyName, companyNum, companyId } = val[0];

        this.list.companyName = companyName;
        this.list.companyNum = companyNum;
        this.list.companyId = companyId;
        break;
        //预算部门
      case "unit":
        // eslint-disable-next-line no-case-declarations
        const { unitName, unitCode } = val[0];

        this.list.unitName = unitName;
        this.list.unitCode = unitCode;
        break;
        //预算科目
      case "account":
        // eslint-disable-next-line no-case-declarations
        const { budgetAccountName, budgetAccountNum } = val[0];

        this.list.budgetAccountName = budgetAccountName;
        this.list.budgetAccountNum = budgetAccountNum;
        break;
        //成本中心
      case "cost":
        // eslint-disable-next-line no-case-declarations
        const { costName, costCode } = val[0];

        this.list.costName = costName;
        this.list.costCode = costCode;
        break;
      case "currency":
        // eslint-disable-next-line no-case-declarations
        const { currencyName, currencyCode } = val[0];

        this.list.currencyCode = currencyCode;
        this.list.currencyCodeMeaning = currencyName;
        break;
      default:
        break;
      }
    },
    showDatePop(type) {
      if (this.dateEditFlag) {
        this.dateType = type;
        this.datePop = !this.datePop;
      }
    },
    //获取操作记录
    async getOpRecord() {
      this.opArr = await getOpRecordApi(this.budgetDetail.budgetId);
    },
    //选择时间
    handleConfirm(value) {
      this.dateType === "start" ?
        this.budgetDetail.startDate = value + " 00:00:00" :
        this.budgetDetail.endDate = value + " 00:00:00";
      this.datePop = false;
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
              message: this.$T("hzero.common.notification.success").$D("操作成功"),
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
      }
    },
    //提交
    async saveAndConfirm() {
      if (!this.checkSave()) {
        return;
      }
      this.$loading.show();
      await saveApi(this.budgetDetail.children.filter((e) => e.dirty));
      if (this.userId !== this.budgetDetail.attributeBigint1 && this.userId !== this.budgetDetail.createdBy) {
        this.$loading.hide();
        return;
      }
      confirmApi(this.budgetDetail).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("sbud.budgeting.message.budgeting.confirmSuccess").$D("确认成功"),
            description: "",
            class: "notification",
            duration: 3
          });
          this.goBack();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    checkSave() {
      if (this.remainBudget < 0) {
        this.$notification.open({
          message: this.$T("sbud.budgeting.message.budgeting.noBudget").$D("没有剩余可分配预算"),
          description: "",
          class: "notification",
          duration: 3
        });
        return false;
      }
      return true;
    },
    //提交
    save() {
      if (!this.checkSave()) {
        return;
      }
      this.$loading.show();
      saveApi(this.budgetDetail.children.filter((e) => e.origBudgetAmount && e.dirty)).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification",
            duration: 3
          });
        } else {
          this.$notification.open({
            message: this.$T("hzero.common.notification.success.save").$D("保存成功"),
            class: "notification",
            duration: 3
          });
        }
        this.init();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    cancelBudget(item) {
      this.$loading.show();
      cancelApi([ item ]).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("hzero.common.notification.success").$D("操作成功"),
            class: "notification"
          });
        }
        this.init();
      }).finally(() => {
        this.$loading.hide();
      });
    },
    rollback(item) {
      // if(item.remainingBudget > item.originRemain || item.remainingBudget <= 0) {
      //   this.$hips.toast({
      //     message: this.$T("").$D("回收金额超过了可回收金额"),
      //     duration: 2000
      //   });
      //   return;
      // }
      // item.origBudgetAmount = item.origBudgetAmount - item.remainingBudget;
      // item.remainingBudget = item.originRemain - item.remainingBudget;
      this.$loading.show();
      recycleBudget(item.budgetId).then(() => {
        this.init();
      }).finally(() => {
        this.$loading.hide();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.input-label-right {
  width: 40px;
  height: 24px;
  border: 1px solid #354ff7;
  border-radius: 3px;
  font-size: 12px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: center;
  color: #354ff7;
  line-height: 20px;
}

.fast-budget {
  width: 72px;
  height: 30px;
  border: 1px solid #354ff7;
  border-radius: 4px;
  font-size: 12px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: center;
  color: #354ff7;
  line-height: 26px;
}

.tip-header {
  font-size: 16px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: center;
  color: #1b1e2b;
  line-height: 24px;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
}

.input-label {
  width: 50%;
  margin-top 6px;
  display inline-flex;
  justify-content space-between;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height 35px;
  }

  div {
    min-width: 42px;
    text-align right;
  }
}

>>> .hips-input {
  height: 16px;
  background: transparent !important;
  padding: 0;
}

.input-right-img {
  width: 16px;
  height: 16px;
}

.budget-item {
  height: 76px;
  border-bottom: 1px solid #f5f6fa;

  .department {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #82879e;
    line-height: 16px;
  }

  .money {
    margin: 8px 0 0 0;
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    text-align: left;
    color: #1b1e2b;
    line-height: 20px;
  }
}

.divider {
  width: 100%;
  height: 8px;
  background: #f5f6fa;
}

.remain-budget {
  margin: 16px 15px 0 15px;
  min-height: 78px;
  background: rgba(53, 79, 247, 0.11);
  border-radius: 4px;
  margin-bottom: 60px;
}

.remain-budget-tag {
  margin: 12px;
  font-size: 12px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: left;
  color: #1b1e2b;
  line-height: 16px;
}

.remain-budget-btn {
  display: inline-block;
  margin: 12px;
  height: 16px;
  width: 16px;
}

.remain-budget-money {
  font-size: 24px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: left;
  color: #354ff7;
  line-height: 26px;
  margin: 0 12px;
}

.valid-date {
  height: 22px;
  background: rgba(53, 79, 247, 0.1);
  border-radius: 2px;
  text-align: left;
  color: #354ff7;
  line-height: 18px;
  font-size: 10px;
  padding: 2px 8px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
}

.header-li {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 14px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    text-align: left;
    color: #1b1e2b;
    line-height: 20px;
  }

  i {
    font-size: 12px;
    font-family: Alibaba, Alibaba-PuHuiTi;
    font-weight: PuHuiTi;
    text-align: left;
    color: #354ff7;
    line-height: 16px;
  }
}

.header-item {
  font-size: 14px;
  font-family: Alibaba, Alibaba-PuHuiTi;
  font-weight: PuHuiTi;
  text-align: left;
  color: #1b1e2b;
  line-height: 22px;
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
    background: #ffffff;
    border-radius: 12px 12px 0px 0px;

    ul {
      li {
        padding: 6px 5px;
        margin-left: 15px;

        div:nth-child(1) {
          font-size: 12px;
          font-weight: 400;
          color: #82879e;
          line-height: 16px;

          em {
            color: var(--color-font-default-g);
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
}
</style>
