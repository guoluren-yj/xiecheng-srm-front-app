<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div
        slot="center"
        class="header">
        {{ $T("hipspfm.invoiceInspection.view.message.invoiceDetail").$D("发票详情") }}
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="formWarp">
        <li>
          <div class="left">
            <span style="color: var(--color-other-default)">*</span>
            <span>{{ $T("sfin.inputInvoice.model.invoiceCode").$D("发票代码") }}：</span>
          </div>
          <div class="right">
            <hips-input
              v-model="invoiceCode"
              :placeholder="$T('sfin.invoiceVerification.verify.TenOrTwelveLengthOnly').$D('长度只能为10或12位数字')"
              type="number"
              min-length="10"
              max-length="12"
              :error-msg-min-length="$T('sfin.invoiceVerification.verify.TenOrTwelveLengthOnly').$D('长度只能为10或12位数字')"
              :error-msg-max-length="$T('sfin.invoiceVerification.verify.TenOrTwelveLengthOnly').$D('长度只能为10或12位数字')"
              label-position="left"
              :disabled="!editable">
              <div v-show="editable" slot="right">
                <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
        <li>
          <div class="left">
            <span style="color: var(--color-other-default)">*</span>
            <span>{{ $T("sfin.inputInvoice.model.invoiceNumber").$D("发票号码") }}：</span>
          </div>
          <div class="right">
            <hips-input
              v-model="invoiceNumber"
              :placeholder="$T('sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits').$D('长度只能为8位数字')"
              type="number"
              label-position="left"
              max-length="8"
              min-length="8"
              :error-msg-min-length="$T('sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits').$D('长度只能为8位数字')"
              :error-msg-max-length="$T('sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits').$D('长度只能为8位数字')"
              :disabled="!editable">
              <div v-show="editable" slot="right">
                <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
        <li>
          <div class="left">
            <span style="color: var(--color-other-default)">*</span>
            <span>{{ $T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期") }}：</span>
          </div>
          <div class="right">
            <span
              v-if="!billingDate.length"
              @click="showDatepop">{{ $T("hipspfm.invoiceInspection.view.message.selectBillingDate").$D("请选择开票日期") }}</span>
            <span v-else class="diffColor">{{ billingDate }}</span>
          </div>
          <div v-show="editable">
            <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_list_date_normals@3x.png" alt >
          </div>
        </li>
        <li @click="showBuyerPop">
          <div class="left">
            <span style="color: var(--color-other-default)">*</span>
            <span>{{ $T("sfin.inputInvoice.model.purchaser").$D("购买方") }}：</span>
          </div>
          <div class="right">
            <span
              v-if="!companyName.length">{{ $T("hipspfm.invoiceInspection.view.message.selectPurchaser").$D("请选择购买方") }}</span>
            <span v-else style="font-weight: bold;color:var(--color-font-default);">{{ companyName }}</span>
          </div>
          <div>
            <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_editor@3x.png" alt >
          </div>
        </li>
        <li>
          <div class="left">
            <span>{{ $T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额") }}：</span>
          </div>
          <div class="right">
            <hips-input
              v-model="totalAmount"
              :placeholder="$T('hipspfm.invoiceInspection.view.message.handlerTotalPrice').$D('请输入不含税金额')"
              type="number"
              label-position="left"
              :disabled="!editable">
              <div v-show="editable" slot="right">
                <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
        <li>
          <div class="left">
            <span>{{ $T("sfin.invoiceInspection.model.validateCode").$D("校验码") }}：</span>
          </div>
          <div class="right">
            <hips-input 
              type="text"
              v-model="checkCode"
              :placeholder="$T('sfin.inputInvoice.model.checkCodeWarning').$D('多位时请输入后6位即可')"
              label-position="left"
              :disabled="!editable">
              <div v-show="editable" slot="right">
                <img class="image-gray-default" src="@/assets/InvoiceInspection/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
      </div>
    </div>
    <div class="supplier-confirm confirm">
      <span
        v-if="invoiceCode&&invoiceNumber&&billingDate&&companyName"
        @click="checkInvoice">{{ $T("hipspfm.common.button.inspection").$D("查验") }}</span>
      <span v-else style="color: var(--color-font-default-e)">{{ $T("hipspfm.common.button.inspection").$D("查验") }}</span>
    </div>
    <!-- 日期弹窗 -->
    <date-chooser
      v-model="showDate"
      :title="$T('hipspfm.invoiceInspection.view.message.selectBillingDate').$D('请选择开票日期')"
      @submitDate="handleConfirm"/>
    <!-- 公司弹窗 -->
    <lov
      v-model="buyerPopup"
      code="SFIN.USER_AUTH.COMPANY"
      :title="$T('sfin.inputInvoice.model.purchaser').$D('购买方')"
      :query-params="buyerParams"
      @submitValue="GetBuyer"/>
  </hips-view>
</template>

<script>
import Lov from "@/components/Lov";
import { View, NavBar, Popup, Input } from "hips";
import DateChooser from "@/components/DateChooser";
import { getBuyerApi, saveInvoiceApi, checkInvoiceApi } from "../api/index";
export default {
  modules: [ "hipspfm.invoiceInspection", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceBill", "sfin.invoiceInspection", "hipspfm.common" ],
  name: "EditableDetail",
  components: {
    Lov,
    DateChooser,
    [View.name]: View,
    [Popup.name]: Popup,
    [Input.name]: Input,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      showDate: false,
      buyerPopup: false,
      supplierLoading: false,
      buyerArr: [],
      changeDate: "",
      choseedDate: "",
      buyerValue: "",
      companyName: "",
      companyId: "",
      invoiceCode: "",
      invoiceNumber: "",
      billingDate: "",
      totalAmount: "",
      checkCode: "",
      editable: true,
      buyerParams: {
        page: 0,
        size: 10,
        enabledFlag: 1,
        // companyName: "",
        tenantId: window.localStorage.tenantId
      }
    };
  },
  mounted() {
    this.getBuyer();
    let prefix = this.$route.query;
    let detail = this.$route.query.result;
    let dataArr = detail.split(",");
    this.editable = prefix.editable;
    this.invoiceCode = dataArr[2];
    this.invoiceNumber = dataArr[3];
    this.totalAmount = dataArr[4];

    let year = dataArr[5].slice(0, 4) + "-";
    let month = dataArr[5].slice(4, 6) + "-";
    let day = dataArr[5].slice(6, 8);
    this.billingDate = `${year}${month}${day}`;

    let checkCodeArr = JSON.stringify(dataArr[6]);
    let checkCodeLen = checkCodeArr.length;
    this.checkCode =
      checkCodeArr && checkCodeArr.substring(checkCodeLen - 7, checkCodeLen - 1);
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    //日期弹窗显示或隐藏
    showDatepop() {
      this.showDate = !this.showDate;
    },
    //公司弹窗显示或隐藏
    showBuyerPop() {
      this.buyerPopup = !this.buyerPopup;
    },
    // 获取购买方
    getBuyer() {
      this.supplierLoading = true;
      getBuyerApi(this.buyerParams).then((res) => {
        this.supplierLoading = false;
        this.buyerArr = [ ...this.buyerArr, ...res.content ];
        this.supplierTotalCount = res.totalElements;
      });
    },
    //确认购买方
    GetBuyer(val) {
      if (val.length) {
        this.buyerValue = val[0];
        this.companyName = this.buyerValue.companyName;
        this.companyId = this.buyerValue.companyId;
      }
    },
    //搜索购买方
    searchBuyer(searchValue) {
      this.buyerArr = [];
      this.buyerParams.companyName = searchValue;
      this.buyerParams.page = 0;
      this.getBuyer();
    },
    //购买方数据上拉加载
    async getSupplierMore(refDom) {
      if (this.buyerArr.length < this.supplierTotalCount) {
        this.buyerParams.page++;
        await this.getBuyer();
      } else {
        this.$nextTick(() => {
          refDom.forceUpdate();
        });
      }
    },
    //购买方数据下拉刷新
    async getSupplierRefresh() {
      this.buyerArr = [];
      this.buyerParams.page = 0;
      await this.getBuyer();
    },
    //确认时间并选择
    handleConfirm(value) {
      this.billingDate = value;
      this.showDatepop();
    },
    // 保存并查验发票
    checkInvoice() {
      const params = [
        {
          invoiceCode: this.invoiceCode,
          invoiceNumber: this.invoiceNumber,
          billingDate: this.billingDate ? this.billingDate + " 00:00:00" : "",
          companyId: this.companyId,
          totalAmount: this.totalAmount,
          checkCode: this.checkCode
        }
      ];
      if (!this.editable) {
        params[0].inputTypeCodeMeaning = this.$T(
          "hipspfm.invoiceInspection.view.message.scanIEntry"
        ).$D("扫描录入");
        params[0].inputTypeCode = "SCAN";
      }
      //保存
      saveInvoiceApi(params).then((resA) => {
        if (resA.failed) {
          this.$notification.open({
            message: resA.message,
            key: "save",
            class: "notification",
            duration: 3
          });
        } else {
          //查验
          checkInvoiceApi(resA).then((resB) => {
            if (resB.failed) {
              this.$notification.open({
                message: resB.message,
                key: "check",
                class: "notification",
                duration: 3
              });
              this.$router.push({ name: "InvoiceExceptionList" });
            } else {
              this.$notification.open({
                message: resB.message,
                key: "check",
                class: "notification",
                duration: 3
              });
              resB[0] && resB[0].validateStatusCode === "CHECK_SUCCESS" ?
                this.$router.push({ name: "InvoiceSuccessList" }) :
                this.$router.push({ name: "InvoiceExceptionList" });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.right-button {
  margin-right: 20px;
}

.header {
  font-size: 18px;
  line-height: 26px;
  color:var(--color-font-default);
  font-weight: bold;
}

.title {
  font-size: 18px;
  line-height: 26px;
}

.content {
  .message {
    font-size: 12px;
    text-align: center;

    .failed {
      background:var(--color-bg-default-e);
      color: var(--color-other-default);
      height: 30px;
      line-height: 30px;
    }

    .success {
      background:var(--color-bg-default-c);
      color: var(--color-other-default-b);
      height: 30px;
      line-height: 30px;
    }
  }

  .formWarp {
    li {
      display: flex;
      align-items: center;
      padding: 20px 20px 11px 0px;
      margin-left: 20px;
      font-size: 14px;
      border-bottom:1px solid var(--color-border-default);

      &:nth-child(5), &:nth-child(6) {
        .right {
          >>> .hips-input__input-value input {
            font-weight: normal;
          }
        }
      }

      .left {
        color: var(--color-font-default);
        width: 96px;

        span {
          line-height: 22px;
        }
      }

      .right {
        font-size: 14px;
        flex: 1;

        .diffColor {
          color:var(--color-font-default-b);
          opacity: 0.6;
          font-weight: bold;
        }

        >>> .hips-input {
          padding: 0 !important;
          width: 63.333vw !important;
          height: 22px;
          line-height: 22px;
          color:var(--color-font-default);
        }

        >>> .hips-input__input-value input {
          font-size: 14px;
          background:var(--color-bg-default);
          height: 22px;
          line-height: 22px;
          font-weight: bold;
          color: #1;
        }

        >>> .hips-input__input-value input:disabled, >>> .hips-input__input-value input[disabled] {
          -webkit-text-fill-color:var(--color-font-default-b);
          color:var(--color-font-default-b);
          -webkit-opacity: 1;
          opacity: 1;
        }

        >>> .hips-input__input-value input::-webkit-input-placeholder {
          font-weight: normal;
        }
      }

      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 12px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
  }
}

.confirm {
  font-weight: bold;
}
</style>
