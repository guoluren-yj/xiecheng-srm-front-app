<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
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
                <img class="image-gray-default" src="@/assets/CreateInvoice/icon_editor@3x.png" alt >
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
                <img class="image-gray-default" src="@/assets/CreateInvoice/icon_editor@3x.png" alt >
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
            <img class="image-gray-default" src="@/assets/CreateInvoice/icon_list_date_normals@3x.png" alt >
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
                <img class="image-gray-default" src="@/assets/CreateInvoice/icon_editor@3x.png" alt >
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
                <img class="image-gray-default" src="@/assets/CreateInvoice/icon_editor@3x.png" alt >
              </div>
            </hips-input>
          </div>
        </li>
      </div>
    </div>
    <div class="supplier-confirm confirm">
      <span
        v-if="invoiceCode&&invoiceNumber&&billingDate"
        @click="checkInvoice">{{ $T("hipspfm.common.button.save").$D("保存") }}</span>
      <span v-else style="color: var(--color-font-default-e)">{{ $T("hipspfm.common.button.save").$D("保存") }}</span>
    </div>
    <!-- 日期弹窗 -->
    <date-chooser
      v-model="showDate"
      :title="$T('hipspfm.invoiceInspection.view.message.selectBillingDate').$D('请选择开票日期')"
      @submitDate="handleConfirm"/>
  </hips-view>
</template>

<script>
import { View, NavBar, Popup, Input } from "hips";
import DateChooser from "@/components/DateChooser";
import {
  taxInvoiceLinesSaveApi,
  saveInvoiceApi,
  checkInvoiceApi,
  getOrderHeaderApi
} from "../api/index";
export default {
  modules: [ "hipspfm.invoiceInspection", "hipspfm.common", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceBill", "sfin.invoiceInspection" ],
  name: "EditableDetailB",
  components: {
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
        companyName: "",
        tenantId: window.localStorage.tenantId
      },
      invoiceHeaderId: "",
    };
  },
  mounted() {
    let prefix = this.$route.query;
    let detail = this.$route.query.result;
    let dataArr = detail.split(",");
    this.editable = prefix.editable;
    this.invoiceHeaderId = prefix.invoiceHeaderId;
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
    //日期弹窗显示或隐藏
    showDatepop() {
      this.showDate = !this.showDate;
    },
    //确认时间并选择
    handleConfirm(value) {
      this.billingDate = value;
      this.showDatepop();
    },
    // 保存并查验发票
    checkInvoice() {
      let params = [
        {
          invoiceCode: this.invoiceCode,
          invoiceNumber: this.invoiceNumber,
          billingDate: this.billingDate ? this.billingDate + " 00:00:00" : "",
          totalAmount: Number(this.totalAmount),
          checkCode: this.checkCode,
          invoiceHeaderId: this.invoiceHeaderId,
          tenantId: Number(window.localStorage.getItem("tenantId"))
        }
      ];
      if (!this.editable) {
        params[0].inputTypeCodeMeaning = this.$T(
          "hipspfm.invoiceInspection.view.message.scanIEntry"
        ).$D("扫描录入");
        params[0].inputTypeCode = "SCAN";
      }

      this.$loading.show({
        text: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
          "保存中"
        )
      });
      taxInvoiceLinesSaveApi(this.invoiceHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.common.message.operationFailed").$D(
              "操作失败"
            ),
            content: res.message,
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
            onOk() {}
          });
        } else {
          this.$hips.toast({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            duration: 1500
          });
          const _this = this;
          setTimeout(() => {
            _this.$router.back();
          }, 1000);
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

      &:nth-child(4), &:nth-child(5) {
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
