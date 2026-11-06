<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" class="header-nav-bar" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/BudgetMaking/icon_Navigation_bar_left_default_w@3x.png"
          class="image-black-default">
        {{ $T("sbud.budgeting.title.budget.detail").$D("预算编制详情") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/BudgetMaking/icon_Navbar_top_default_w@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/BudgetMaking/icon_Navbar_closed_default_w@3x.png"
            alt
            @click="goClose">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content" :style="showBackFlag?height:noHeadHeight">
      <div class="top-section">
        <ul>
          <li>{{ list.budgetNum?list.budgetNum:$T('sbud.budgeting.view.budget.number.none').$D('暂无预算编号') }}</li>
          <li>{{ $T('sbud.budgeting.view.already.occupy.budget').$D('已占用预算') }}：{{ list.occupiedAmount?list.occupiedAmount: $T("sbud.budgeting.view.none").$D('无') }}</li>
          <li>{{ $T('sbud.budgeting.view.already.destory.budget').$D('已核销预算') }}：{{ list.appliedAmount?list.appliedAmount:$T('sbud.budgeting.view.none').$D('无') }}</li>
          <li>
            <span v-show="list.budgetStatusMeaning">{{ list.budgetStatusMeaning }}</span>
            <span>{{ list.remainingBudget?$T("sbud.budgeting.view.residue.budget").$D('剩余预算')+'：'+list.remainingBudget:$T("sbud.budgeting.view.residue.budget.none").$D('暂无剩余预算') }}</span>
            <span>{{ list.version?$T("sbud.budgeting.model.budgeting.version").$D('版本')+'：'+list.version:$T("sbud.budgeting.view.budgeting.version.none").$D('暂无版本') }}</span>
          </li>
          <li>
            <span v-if="pageType==='update'" @click="showOpPop">
              <img src="@/assets/BudgetMaking/icon_Toolbar Top_record_default w@3x.png" >
              <span>{{ $T('sbud.budgeting.model.budgeting.operationRecord').$D('操作记录') }}</span>
            </span>
            <span @click="toDelete">
              <img src="@/assets/BudgetMaking/icon_Toolbar Top_delete_default w@3x.png" >
              <span>{{ $T('sbud.budgeting.view.delete.budget').$D('删除预算') }}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="form-list">
        <ul>
          <li>
            <div>
              {{ $T('sbud.budgeting.model.budgeting.budgetDesc').$D('预算说明') }}
              <em>*</em>
            </div>
            <div v-if="editFlag">
              <hips-input
                v-model="list.budgetDesc"
                :placeholder="$T('sbud.budgeting.view.please.write.budgeting.budgetDesc').$D('请输入预算说明')"
                type="text"/>
              <img
                v-show="editFlag"
                class="img-edit"
                src="@/assets/BudgetMaking/icon_List_editor_normal@3x.png"
                alt>
            </div>
            <div v-else>
              <span>{{ list.budgetDesc }}</span>
            </div>
          </li>
          <li>
            <div>
              {{ $T('sbud.budgeting.model.budgeting.company').$D('公司') }}
              <em>*</em>
            </div>
            <div @click="showLovPop('company')">
              <span v-if="list.companyName">{{ list.companyName }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.company').$D('请选择公司') }}</span>
              <img
                v-show="editFlag"
                class="img-right"
                src="@/assets/BudgetMaking/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <li v-for="(item,index) in itemList" :key="index">
            <div>
              {{ item.budgetItemName }}
              <em v-if="item.requiredFlag">*</em>
            </div>
            <div @click="showItemPop(item,index)">
              <span v-if="list[item.displayField]">{{ list[item.displayField] }}</span>
              <span v-else class="valueless">{{ $T('hzero.c7nProUI.Lov.choose').$D('请选择') }}{{ item.budgetItemName }}</span>
              <img
                v-if="item.requiredFlag"
                class="img-right"
                src="@/assets/BudgetMaking/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <li>
            <div>
              {{ $T('sbud.budgeting.model.budgeting.origBudgetAmount').$D('原始预算金额') }}
              <em>*</em>
            </div>
            <div v-if="editFlag">
              <hips-input
                v-model="list.origBudgetAmount"
                :placeholder="$T('sbud.budgeting.view.write.budgeting.origBudgetAmount').$D('请输入原始预算金额')"
                type="number"/>
              <img
                v-show="editFlag"
                class="img-edit"
                src="@/assets/BudgetMaking/icon_List_editor_normal@3x.png"
                alt>
            </div>
            <div v-else>
              <span>{{ list.origBudgetAmount }}</span>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.adjustAmount').$D('调整金额') }}</div>
            <div v-if="adjustAmountFlag">
              <hips-input
                v-model="list.adjustAmount"
                :placeholder="$T('sbud.budgeting.view.write.budgeting.adjustAmount').$D('请输入调整金额')"
                type="text"/>
              <img class="img-edit" src="@/assets/BudgetMaking/icon_List_editor_normal@3x.png" alt >
            </div>
            <div v-else>
              <span>{{ list.adjustAmount?list.adjustAmount:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.budgetAmount').$D('审批后预算金额') }}</div>
            <div>
              <span>{{ list.budgetAmount?list.budgetAmount:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <li>
            <div>
              {{ $T('sbud.budgeting.model.budgeting.currency').$D('币种') }}
              <em>*</em>
            </div>
            <div @click="showLovPop('currency')">
              <span v-if="list.currencyCodeMeaning">{{ list.currencyCodeMeaning }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.choose.budgeting.currency').$D('请选择币种') }}</span>
              <img
                v-show="editFlag"
                class="img-right"
                src="@/assets/BudgetMaking/icon_List_right_normal@3x.png"
                alt>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.view.validTime.from').$D('有效期从') }}</div>
            <div @click="showDatePop('start')">
              <span v-if="list.startDate">{{ list.startDate|CalcDate }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.can.choose.validTime.from').$D('可选择有效期从') }}</span>
              <img
                v-show="dateEditFlag"
                class="img-edit"
                src="@/assets/BudgetMaking/icon_List_date_normal@3x.png"
                alt>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.view.validTime.to').$D('有效期至') }}</div>
            <div @click="showDatePop('end')">
              <span v-if="list.endDate">{{ list.endDate|CalcDate }}</span>
              <span v-else class="valueless">{{ $T('sbud.budgeting.view.can.choose.validTime.to').$D('可选择有效期至') }}</span>
              <img
                v-show="dateEditFlag"
                class="img-edit"
                src="@/assets/BudgetMaking/icon_List_date_normal@3x.png"
                alt>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.createdByName').$D('创建人') }}</div>
            <div>
              <span>{{ list.createdByName?list.createdByName:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.creationDate').$D('创建日期') }}</div>
            <div>
              <span>{{ list.creationDate?list.creationDate:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
          <li>
            <div>{{ $T('sbud.budgeting.model.budgeting.approvedDate').$D('审批日期') }}</div>
            <div>
              <span>{{ list.approvedDate?list.approvedDate:$T('sbud.budgeting.view.none').$D('无') }}</span>
            </div>
          </li>
        </ul>
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
    <date-chooser v-model="datePop" @submitDate="handleConfirm" />
    <bottom-handler id="NoNeed" :btn-arr="btnArr" position="absolute" />
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import { View, Input, NavBar } from "hips";
import { dateFormat } from "@/utils/index";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import DateChooser from "@/components/DateChooser";
import BottomHandler from "@/components/BottomHandler";
import OperationRecord from "@/components/OperationRecord";
import {
  saveApi,
  submitApi,
  deleteApi,
  getItemApi,
  getOpRecordApi,
  getBudgetListApi
} from "../api/index";
export default {
  modules: [ "smbl.common", "hipspfm.common", "hipspfm.supplierDelivery", "sbud.budgeting", "hzero.c7nProUI" ],
  name: "BudgetDetail",
  components: {
    Lov,
    DateChooser,
    OperationRecord,
    BottomHandler,
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
      choseedDate: "", //选中的时间
      LovCode: "",
      LovTitle: "",
      LovParams: {},
      LovType: "",
      pageType: "",
      list: {},
      itemList: [],
      itemIndex: 0,
      budgetItem: {},
      originString: "",
      opArr: [], //操作记录数据集合
      opLoading: false,
      height: "height: calc(100vh - 109px)",
      noHeadHeight: "height: calc(100vh - 65px)"
    };
  },
  computed: {
    btnArr() {
      return [
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default",
          handler: () => {
            this.toSave();
          }
        },
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
    },
    //是否可编辑状态
    editFlag() {
      return (
        this.list.budgetStatus === "NEW" ||
        this.list.budgetStatus === "REJECTED" ||
        this.pageType === "create"
      );
    },
    //已审批或已修改状态可编辑调整金额
    adjustAmountFlag() {
      return (
        this.list.budgetStatus === "APPROVED" ||
        this.list.budgetStatus === "ALREADY_EDITED"
      );
    },
    //有效日期是否可编辑
    dateEditFlag() {
      return (
        this.list.budgetStatus === "NEW" ||
        this.list.budgetStatus === "REJECTED" ||
        this.list.budgetStatus === "APPROVED" ||
        this.pageType === "create"
      );
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      const { type, list } = this.$route.query;
      this.pageType = type;
      this.list = list;
      this.originString = JSON.parse(JSON.stringify(list));
      await this.getItem();
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
      if (JSON.stringify(this.originString) != JSON.stringify(this.list)) {
        this.$hips.dialog.confirm({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content:
            this.$T("hipspfm.supplierDelivery.view.message.saveInfoOrNot").$D(
              "是否保存已修改信息"
            ) + "?",
          okText: this.$T("hipspfm.common.button.save").$D("保存"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          onOk: (tx) => {
            const _this = this;
            new Promise((resolve, reject) => {
              _this.toSave();
              resolve();
            }).then((res) => {
              next();
            });
          },
          onCancel(tx) {
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
    async getItem() {
      this.itemList = await getItemApi();
    },
    //操作记录弹窗显示或隐藏
    showOpPop() {
      if (!this.opPop) {
        this.getOpRecord();
      }
      this.opPop = !this.opPop;
    },
    showItemPop(item, index) {
      this.budgetItem = item;
      this.itemIndex = index;
      const { valueField, budgetItemName, lovCode, tenantId } = item;
      this.LovType = valueField;
      this.LovTitle = budgetItemName;
      this.LovCode = lovCode;
      this.LovParams = { lovCode, tenantId };
      this.LovPop = !this.LovPop;
    },
    showLovPop(type) {
      if (this.editFlag) {
        this.LovType = type;
        // eslint-disable-next-line default-case
        switch (type) {
        case "company":
          this.LovTitle = this.$T("sbud.budgeting.model.budgeting.company").$D("公司");
          this.LovCode = "SPFM.USER_AUTH.COMPANY";
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
        }
        this.LovPop = !this.LovPop;
      }
    },
    // 获取Lov确定值
    GetValue(val) {
      switch (this.LovType) {
      //公司
      case "company":
        const { companyName, companyNum, companyId } = val[0];
        this.list.companyName = companyName;
        this.list.companyNum = companyNum;
        this.list.companyId = companyId;
        break;
      case "currency":
        const { currencyName, currencyCode } = val[0];
        this.list.currencyCode = currencyCode;
        this.list.currencyCodeMeaning = currencyName;
        break;
      default:
        this.list[this.budgetItem.budgetItemCode] =
            val[0][this.budgetItem.budgetItemCode];
        this.list[this.budgetItem.displayField] =
            val[0][this.budgetItem.displayField];
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
      this.opArr = await getOpRecordApi(this.list.budgetId);
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
        companyId, //公司*
        budgetDesc, //预算说明*
        origBudgetAmount, //原始预算金额*
        currencyCode, //币种*
        startDate, //有效期从
        endDate //有效期至
      } = this.list;
      if (
        !companyId ||
        !origBudgetAmount && Number(origBudgetAmount) !== 0 ||
        !budgetDesc ||
        !currencyCode
      ) {
        this.$notification.open({
          message: this.$T("smbl.common.message.write.require.field").$D("请填写必填项"),
          key,
          class: "notification"
        });
        return false;
      }
      let passFlag = true;
      this.itemList.map((item) => {
        if (
          item.requiredFlag &&
          typeof this.list[item.displayField] === "undefined" &&
          !this.list[item.displayField]
        ) {
          this.$notification.open({
            message: this.$T("smbl.common.message.write.require.field").$D("请填写必填项"),
            key,
            class: "notification"
          });
          passFlag = false;
        }
      });
      if (passFlag && JSON.stringify(this.originString) != JSON.stringify(this.list)) {
        const params =
          this.pageType === "create" ?
            {
              ...this.list,
              budgetStatus: "NEW",
              _status: "create"
            } :
            {
              ...this.list,
              _status: "update"
            };
        this.$loading.show();
        saveApi([ params ]).then((res) => {
          if (res && res.failed) {
            this.$loading.hide();
            this.$notification.open({
              message: res.message,
              key,
              class: "notification"
            });
          } else {
            this.fetchData(res[0].budgetNum);
          }
        });
      }
    },
    //回调列表数据
    async fetchData(budgetNum) {
      const params = {
        size: 10,
        page: 0,
        budgetNum
      };
      await getBudgetListApi(params).then((res) => {
        this.$loading.hide();
        if (res && res.content) {
          this.pageType = "update";
          this.list = res.content[0];
          this.originString = JSON.parse(JSON.stringify(this.list));
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            key,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: res.message,
            key,
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
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              key,
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              key,
              class: "notification"
            });
            this.goBack();
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
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              key,
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
              key,
              class: "notification"
            });
            this.goBack();
          }
        });
      }
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
  overflow: auto;

  .top-section {
    ul {
      background: var(--color-other-default-b) !important;
      color: var(--color-font-default-d);
      padding: 8px 15px 12px;
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
            font-weight: bold;
            border-radius: 2px;
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
    width: 375px;
    background: #ffffff;
    border-radius: 12px 12px 0px 0px;

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
</style>
